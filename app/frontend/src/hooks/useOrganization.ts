import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useOrganizationStore } from '@/stores/organizationStore';
import { useRouter } from 'next/navigation';

export const useOrganization = () => {
  const router = useRouter();
  const { user, profile, isAuthenticated, loading: authLoading } = useAuthStore();
  const { 
    currentOrganization, 
    userOrganizations, 
    loading: orgLoading,
    getUserOrganizations,
    fetchOrganization 
  } = useOrganizationStore();

  useEffect(() => {
    if (user && !orgLoading) {
      getUserOrganizations(user.id);
    }
  }, [user, getUserOrganizations, orgLoading]);

  useEffect(() => {
    if (profile?.organization_id && !currentOrganization) {
      fetchOrganization(profile.organization_id);
    }
  }, [profile?.organization_id, currentOrganization, fetchOrganization]);

  const requireOrganization = () => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return false;
    }

    if (!authLoading && isAuthenticated && !profile?.organization_id) {
      router.push('/organization-select');
      return false;
    }

    return true;
  };

  const switchToOrganization = async (organizationId: string) => {
    try {
      await useOrganizationStore.getState().switchOrganization(organizationId);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error switching organization:', error);
    }
  };

  return {
    currentOrganization,
    userOrganizations,
    loading: authLoading || orgLoading,
    requireOrganization,
    switchToOrganization,
    hasMultipleOrganizations: userOrganizations.length > 1,
    isOrganizationSelected: !!profile?.organization_id
  };
}; 