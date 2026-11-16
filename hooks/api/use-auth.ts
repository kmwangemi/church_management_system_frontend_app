import { authService } from '@/lib/api/auth';
import { getLoginRoute } from '@/lib/auth-redirect';
import { useAuthStore } from '@/lib/store/use-auth-store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useLogin = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      const role = data?.user?.role || data?.user?.globalRole;
      if (role === 'SUPER_ADMIN') {
        router.push('/superadmin');
      } else if (role === 'MEMBER') {
        router.push('/member');
      } else {
        router.push('/church');
      }
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const user = useAuthStore.getState().user;
      const target = getLoginRoute(
        user?.role || user?.globalRole,
        typeof window !== 'undefined' ? window.location.pathname : undefined
      );
      await authService.logout();
      return target;
    },
    onSuccess: (target) => {
      queryClient.clear();
      router.push(target);
    },
  });
};

export const useLogoutAll = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const user = useAuthStore.getState().user;
      const target = getLoginRoute(
        user?.role || user?.globalRole,
        typeof window !== 'undefined' ? window.location.pathname : undefined
      );
      await authService.logoutAll();
      return target;
    },
    onSuccess: (target) => {
      queryClient.clear();
      router.push(target);
    },
  });
};
