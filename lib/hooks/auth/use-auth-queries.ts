import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api-client';
import { getLoginRoute } from '@/lib/auth-redirect';
import { useAuthStore } from '@/lib/store/use-auth-store';

// -------------
// Types
// -------------

export interface AuthUser {
  sub: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl: string;
  churchId: string;
  branchId: string;
  role: string;
  fullName: string;
  name?: string;
  image?: string;
  churchName?: string;
  globalRole?: string;
}

export interface VerifyResponse {
  user: AuthUser;
}

// -------------
// Check auth status
// -------------

const checkAuthStatus = async (): Promise<VerifyResponse | null> => {
  try {
    const { data } = await apiClient.get('/auth/verify');
    if (data?.user) {
      useAuthStore.getState().setUser(data.user as any);
    }
    return data;
  } catch (error) {
    return null;
  }
};

export const useAuthStatus = () => {
  return useQuery({
    queryKey: ['authStatus'],
    queryFn: checkAuthStatus,
    retry: false, // Don't retry auth checks
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Always refetch on mount
    refetchOnReconnect: true,
  });
};

// -------------
// Logout
// -------------

const logoutRequest = async (): Promise<string> => {
  const state = useAuthStore.getState();
  const refreshToken = state.refreshToken;
  const target = getLoginRoute(
    state.user?.role || state.user?.globalRole,
    typeof window !== 'undefined' ? window.location.pathname : undefined
  );
  try {
    await apiClient.post('/auth/logout', { refresh_token: refreshToken });
  } finally {
    useAuthStore.getState().logout();
  }
  return target;
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: (target) => {
      queryClient.clear(); // Clear all queries
      router.push(target);
    },
    onError: (error) => {
      // biome-ignore lint/suspicious/noConsole: ignore
      console.error('Logout failed:', error);
      // Still redirect on error as the intent is to logout
      const target = getLoginRoute(
        undefined,
        typeof window !== 'undefined' ? window.location.pathname : undefined
      );
      queryClient.clear();
      router.push(target);
    },
  });
};
