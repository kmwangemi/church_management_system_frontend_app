'use client';

import { useLogout } from '@/lib/hooks/auth/use-auth-queries';
import { useAuthStore } from '@/lib/store/use-auth-store';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const logoutMutation = useLogout();

  return {
    user,
    isLoading: !hasHydrated,
    isAuthenticated: !!user && !!token,
    isError: false,
    error: null as Error | null,
    logout: () => {
      useAuthStore.getState().logout();
      logoutMutation.mutate();
    },
    checkAuthStatus: () => { }, // Kept for backwards compatibility if needed
  };
}
