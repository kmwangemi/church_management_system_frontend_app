import { useAuth } from '@/lib/use-auth';

export function useActiveOrganization() {
  const { user, isLoading, error } = useAuth();
  
  return {
    activeOrganization: { id: user?.churchId },
    isPending: isLoading,
    error,
    organizationId: user?.churchId ?? '',
    organizationName: 'Church Organization', // Defaulting to a placeholder for now since user.churchId doesn't carry the name
  };
}
