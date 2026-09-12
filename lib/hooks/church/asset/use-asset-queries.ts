import apiClient from '@/lib/api-client';
import { successToastStyle } from '@/lib/toast-styles';
import type {
  DepartmentAddResponse,
  DepartmentListResponse,
} from '@/lib/types/department';
import type { AddAssetPayload } from '@/lib/validations/asset';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const registerAsset = async (
  payload: AddAssetPayload
): Promise<DepartmentAddResponse> => {
  const { data } = await apiClient.post('/church/assets', payload);
  return data;
};

export const useRegisterAsset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      toast.success('Asset has been created successfully.', {
        style: successToastStyle,
      });
    },
  });
};

const fetchAssets = async (
  page = 1,
  search = ''
): Promise<DepartmentListResponse> => {
  const { data } = await apiClient.get(`/church/assets?page=${page}&search=${search}`);
  return data;
};

export const useFetchAssets = (page = 1, search = '') => {
  return useQuery({
    queryKey: ['assets', page, search],
    queryFn: () => fetchAssets(page, search),
  });
};
