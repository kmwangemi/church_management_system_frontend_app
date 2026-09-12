import apiClient from '@/lib/api-client';
import { successToastStyle } from '@/lib/toast-styles';
import type {
  DepartmentAddResponse,
  DepartmentListResponse,
} from '@/lib/types/department';
import type { AddPledgePayload } from '@/lib/validations/pledge';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const registerPledge = async (
  payload: AddPledgePayload
): Promise<DepartmentAddResponse> => {
  const { data } = await apiClient.post('/church/pledges', payload);
  return data;
};

export const useRegisterPledge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerPledge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pledges'] });
      toast.success('Pledge has been created successfully.', {
        style: successToastStyle,
      });
    },
  });
};

const fetchPledges = async (
  page = 1,
  search = ''
): Promise<DepartmentListResponse> => {
  const { data } = await apiClient.get(
    `/church/pledges?page=${page}&search=${search}`
  );
  return data;
};

export const useFetchPledges = (page = 1, search = '') => {
  return useQuery({
    queryKey: ['pledges', page, search],
    queryFn: () => fetchPledges(page, search),
  });
};
