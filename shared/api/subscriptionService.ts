import { supabase } from './supabase';
import type { 
  SubscriptionPlan, 
  OrganizationSubscription, 
  SubscriptionPayment,
  SubscriptionLimits,
  SubscriptionUsage 
} from '../types/subscription.types';

/**
 * Récupérer tous les plans d'abonnement disponibles
 */
export const fetchSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true });

    if (error) {
      console.error('Error fetching subscription plans:', error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchSubscriptionPlans:', error);
    throw error;
  }
};

/**
 * Récupérer l'abonnement actuel d'une organisation
 */
export const fetchOrganizationSubscription = async (
  organizationId: string
): Promise<OrganizationSubscription | null> => {
  try {
    const { data, error } = await supabase
      .from('organization_subscriptions')
      .select(`
        *,
        subscription_plans (*)
      `)
      .eq('organization_id', organizationId)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching organization subscription:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error in fetchOrganizationSubscription:', error);
    throw error;
  }
};

/**
 * Créer un nouvel abonnement
 */
export const createSubscription = async (
  organizationId: string,
  planId: string,
  trialDays: number = 14
): Promise<OrganizationSubscription> => {
  try {
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + trialDays);

    const currentPeriodStart = new Date();
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

    const { data, error } = await supabase
      .from('organization_subscriptions')
      .insert({
        organization_id: organizationId,
        plan_id: planId,
        status: 'trial',
        current_period_start: currentPeriodStart.toISOString(),
        current_period_end: currentPeriodEnd.toISOString(),
        trial_end: trialEnd.toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating subscription:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error in createSubscription:', error);
    throw error;
  }
};

/**
 * Mettre à jour un abonnement
 */
export const updateSubscription = async (
  subscriptionId: string,
  updates: Partial<OrganizationSubscription>
): Promise<OrganizationSubscription> => {
  try {
    const { data, error } = await supabase
      .from('organization_subscriptions')
      .update(updates)
      .eq('id', subscriptionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating subscription:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error in updateSubscription:', error);
    throw error;
  }
};

/**
 * Annuler un abonnement
 */
export const cancelSubscription = async (
  subscriptionId: string
): Promise<OrganizationSubscription> => {
  try {
    const { data, error } = await supabase
      .from('organization_subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
      })
      .eq('id', subscriptionId)
      .select()
      .single();

    if (error) {
      console.error('Error cancelling subscription:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error in cancelSubscription:', error);
    throw error;
  }
};

/**
 * Récupérer les limites d'abonnement d'une organisation
 */
export const fetchSubscriptionLimits = async (
  organizationId: string
): Promise<SubscriptionLimits> => {
  try {
    const { data, error } = await supabase
      .rpc('get_subscription_limits', {
        p_organization_id: organizationId,
      });

    if (error) {
      console.error('Error fetching subscription limits:', error);
      throw new Error(error.message);
    }

    return data[0] || {
      max_products: 5,
      max_suppliers: 2,
      max_members: 1,
      current_products: 0,
      current_suppliers: 0,
      current_members: 0,
      plan_name: 'Free',
      plan_price: 0,
    };
  } catch (error) {
    console.error('Error in fetchSubscriptionLimits:', error);
    throw error;
  }
};

/**
 * Vérifier si une action est autorisée selon les limites d'abonnement
 */
export const checkSubscriptionLimit = async (
  organizationId: string,
  resourceType: 'products' | 'suppliers' | 'members',
  currentCount?: number
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('check_subscription_limits', {
        p_organization_id: organizationId,
        p_resource_type: resourceType,
        p_current_count: currentCount || 0,
      });

    if (error) {
      console.error('Error checking subscription limit:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error in checkSubscriptionLimit:', error);
    throw error;
  }
};

/**
 * Calculer l'utilisation des ressources
 */
export const calculateUsage = (limits: SubscriptionLimits): SubscriptionUsage => {
  const calculatePercentage = (current: number, max: number): number => {
    if (max === -1) return 0; // Illimité
    return Math.round((current / max) * 100);
  };

  return {
    products: {
      current: limits.current_products,
      max: limits.max_products,
      percentage: calculatePercentage(limits.current_products, limits.max_products),
    },
    suppliers: {
      current: limits.current_suppliers,
      max: limits.max_suppliers,
      percentage: calculatePercentage(limits.current_suppliers, limits.max_suppliers),
    },
    members: {
      current: limits.current_members,
      max: limits.max_members,
      percentage: calculatePercentage(limits.current_members, limits.max_members),
    },
  };
};

/**
 * Créer un paiement
 */
export const createPayment = async (
  subscriptionId: string,
  amount: number,
  currency: string = 'USD',
  stripePaymentIntentId?: string
): Promise<SubscriptionPayment> => {
  try {
    const { data, error } = await supabase
      .from('subscription_payments')
      .insert({
        subscription_id: subscriptionId,
        amount,
        currency,
        status: 'pending',
        stripe_payment_intent_id: stripePaymentIntentId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating payment:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error in createPayment:', error);
    throw error;
  }
};

/**
 * Mettre à jour le statut d'un paiement
 */
export const updatePaymentStatus = async (
  paymentId: string,
  status: 'pending' | 'completed' | 'failed' | 'refunded'
): Promise<SubscriptionPayment> => {
  try {
    const { data, error } = await supabase
      .from('subscription_payments')
      .update({ status })
      .eq('id', paymentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating payment status:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error in updatePaymentStatus:', error);
    throw error;
  }
}; 