import { useAuth } from '@/lib/use-auth';

export function useActiveOrganization() {
  const { user, isLoading, error } = useAuth();
  return {
    activeOrganization: { id: user?.churchId },
    isPending: isLoading,
    error,
    organizationId: user?.churchId ?? '',
    organizationName: (user as any)?.churchName || 'Church Organization',
  };
}
