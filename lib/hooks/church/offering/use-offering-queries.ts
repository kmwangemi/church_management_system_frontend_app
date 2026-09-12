import apiClient from '@/lib/api-client';
import { successToastStyle } from '@/lib/toast-styles';
import type {
  DepartmentAddResponse,
  DepartmentListResponse,
} from '@/lib/types/department';
import type { AddOfferingPayload } from '@/lib/validations/offering';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const registerOffering = async (
  payload: AddOfferingPayload
): Promise<DepartmentAddResponse> => {
  const { data } = await apiClient.post('/church/offerings', payload);
  return data;
};

export const useRegisterOffering = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerOffering,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offerings'] });
      toast.success('Offering has been created successfully.', {
        style: successToastStyle,
      });
    },
  });
};

const fetchOfferings = async (
  page = 1,
  search = ''
): Promise<DepartmentListResponse> => {
  const { data } = await apiClient.get(
    `/church/offerings?page=${page}&search=${search}`
  );
  return data;
};

export const useFetchOfferings = (page = 1, search = '') => {
  return useQuery({
    queryKey: ['offerings', page, search],
    queryFn: () => fetchOfferings(page, search),
  });
};
