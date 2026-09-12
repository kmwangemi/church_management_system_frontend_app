import { authService } from '@/lib/api/auth';
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
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
      router.push('/auth/member');
    },
  });
};

export const useLogoutAll = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.logoutAll,
    onSuccess: () => {
      queryClient.clear();
      router.push('/auth/member');
    },
  });
};
