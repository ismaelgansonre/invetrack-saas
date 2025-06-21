export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billing_cycle: 'monthly' | 'yearly';
  max_products: number;
  max_suppliers: number;
  max_members: number;
  features: SubscriptionFeatures;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionFeatures {
  basic_tracking: boolean;
  email_support: boolean;
  phone_support?: boolean;
  dedicated_support?: boolean;
  reports: boolean;
  export: boolean;
  api_access?: boolean;
  custom_integrations?: boolean;
}

export interface OrganizationSubscription {
  id: string;
  organization_id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  current_period_start: string;
  current_period_end: string;
  trial_end?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPayment {
  id: string;
  subscription_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method?: string;
  stripe_payment_intent_id?: string;
  created_at: string;
}

export interface SubscriptionLimits {
  max_products: number;
  max_suppliers: number;
  max_members: number;
  current_products: number;
  current_suppliers: number;
  current_members: number;
  plan_name: string;
  plan_price: number;
}

export interface SubscriptionUsage {
  products: {
    current: number;
    max: number;
    percentage: number;
  };
  suppliers: {
    current: number;
    max: number;
    percentage: number;
  };
  members: {
    current: number;
    max: number;
    percentage: number;
  };
}

// Plans prédéfinis
export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    max_products: 5,
    max_suppliers: 2,
    max_members: 1,
    features: {
      basic_tracking: true,
      email_support: false,
      reports: false,
    },
  },
  STARTER: {
    name: 'Starter',
    price: 25,
    max_products: 25,
    max_suppliers: 10,
    max_members: 3,
    features: {
      basic_tracking: true,
      email_support: true,
      reports: true,
      export: true,
    },
  },
  PROFESSIONAL: {
    name: 'Professional',
    price: 75,
    max_products: 100,
    max_suppliers: 25,
    max_members: 10,
    features: {
      basic_tracking: true,
      email_support: true,
      phone_support: true,
      reports: true,
      export: true,
      api_access: true,
    },
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 199,
    max_products: -1, // Illimité
    max_suppliers: -1, // Illimité
    max_members: -1, // Illimité
    features: {
      basic_tracking: true,
      email_support: true,
      phone_support: true,
      dedicated_support: true,
      reports: true,
      export: true,
      api_access: true,
      custom_integrations: true,
    },
  },
} as const;

export type PlanName = keyof typeof SUBSCRIPTION_PLANS; 