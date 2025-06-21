import { useAuthStore } from '@/stores/authStore';
import type { Database } from '@/lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export const useProfile = () => {
  const { profile, setProfile } = useAuthStore();

  return {
    profile: profile as Profile | null,
    setProfile: setProfile as (profile: Profile | null) => void,
  };
}; 