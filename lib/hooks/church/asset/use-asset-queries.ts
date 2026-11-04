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
  const { data } = await apiClient.get(
    `/church/assets?page=${page}&search=${search}`
  );
  return data;
};

export const useFetchAssets = (page = 1, search = '') => {
  return useQuery({
    queryKey: ['assets', page, search],
    queryFn: () => fetchAssets(page, search),
  });
};

const deleteAsset = async (id: string | number) => {
  const { data } = await apiClient.delete(`/church/assets/${id}`);
  return data;
};

export const useDeleteAsset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      toast.success('Asset deleted successfully.', {
        style: successToastStyle,
      });
    },
  });
};

const updateAsset = async ({
  id,
  payload,
}: {
  id: string | number;
  payload: Partial<AddAssetPayload>;
}) => {
  const { data } = await apiClient.put(`/church/assets/${id}`, payload);
  return data;
};

export const useUpdateAsset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      toast.success('Asset updated successfully.', {
        style: successToastStyle,
      });
    },
  });
};
