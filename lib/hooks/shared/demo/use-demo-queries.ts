import apiClient from '@/lib/api-client';
import { successToastStyle } from '@/lib/toast-styles';
import type { ChurchRegistrationResponse } from '@/lib/types';
import type { RequestDemoPayload } from '@/lib/validations/demo';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const requestDemo = async (
  payload: RequestDemoPayload
): Promise<ChurchRegistrationResponse> => {
  const { data } = await apiClient.post('/demo', payload);
  return data;
};

export const useRequestDemo = () => {
  return useMutation({
    mutationFn: requestDemo,
    onSuccess: () => {
      toast.success('Demo request has been submitted successfully.', {
        style: successToastStyle,
      });
    },
  });
};
