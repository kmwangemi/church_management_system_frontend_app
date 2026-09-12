import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import type { ResetPasswordPayload } from '@/lib/validations/auth';

export function useResetPassword() {
  return useMutation({
    mutationFn: async (payload: ResetPasswordPayload) => {
      const { data } = await apiClient.post(
        '/auth/reset-password',
        payload,
        {}
      );
      return data;
    },
  });
}
