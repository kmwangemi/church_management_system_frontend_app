import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '@/lib/api-client';
import { successToastStyle } from '@/lib/toast-styles';
import type { ChurchRegistrationResponse } from '@/lib/types';
// import type { ChurchRegistrationPayload } from '@/lib/validations/auth';

const registerChurch = async (
  payload: any
): Promise<ChurchRegistrationResponse> => {
  const { data } = await apiClient.post('/auth/register', payload);
  return data;
};

export const useRegisterChurch = () => {
  return useMutation({
    mutationFn: registerChurch,
    onSuccess: () => {
      toast.success('Church has been created successfully.', {
        style: successToastStyle,
      });
    },
  });
};
