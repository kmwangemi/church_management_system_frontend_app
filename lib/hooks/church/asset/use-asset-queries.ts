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
      queryClient.invalidateQueries({ queryKey: ['asset-stats'] });
      toast.success('Asset has been created successfully.', {
        style: successToastStyle,
      });
    },
  });
};

const fetchAssets = async (
  page = 1,
  search = '',
  type = '',
  condition = '',
  status = ''
): Promise<DepartmentListResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    ...(search && { search }),
    ...(type && type !== 'all' && { type }),
    ...(condition && condition !== 'all' && { condition }),
    ...(status && status !== 'all' && { status }),
  });
  const { data } = await apiClient.get(`/church/assets?${params}`);
  return data;
};

export const useFetchAssets = (
  page = 1,
  search = '',
  type = '',
  condition = '',
  status = ''
) => {
  return useQuery({
    queryKey: ['assets', page, search, type, condition, status],
    queryFn: () => fetchAssets(page, search, type, condition, status),
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
      queryClient.invalidateQueries({ queryKey: ['asset-stats'] });
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
  payload: Record<string, any>;
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
      queryClient.invalidateQueries({ queryKey: ['asset-stats'] });
      toast.success('Asset updated successfully.', {
        style: successToastStyle,
      });
    },
  });
};

// Asset Stats Hook
export interface AssetStatsData {
  total: number;
  totalValue: number;
  vehicles: number;
  properties: number;
  equipment: number;
  maintenance: number;
}

const fetchAssetStats = async (): Promise<{
  status: string;
  stats: AssetStatsData;
  data: AssetStatsData;
}> => {
  const { data } = await apiClient.get('/church/assets/stats');
  return data;
};

export const useFetchAssetStats = () => {
  return useQuery({
    queryKey: ['asset-stats'],
    queryFn: fetchAssetStats,
  });
};

// Bulk Import Assets Hook
const importAssets = async (assets: Array<Record<string, any>>) => {
  const { data } = await apiClient.post('/church/assets/import', { assets });
  return data;
};

export const useImportAssets = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: importAssets,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['asset-stats'] });
      toast.success(res?.message || 'Assets imported successfully.', {
        style: successToastStyle,
      });
    },
  });
};

// Asset Maintenance Hooks
export interface AssetMaintenanceRecord {
  id: string;
  _id: string;
  assetId: string;
  assetName: string;
  date: string;
  cost: number;
  description: string;
  type: string;
  performedBy: string;
  status: string;
  createdAt?: string;
}

const fetchAssetMaintenance = async (
  assetId: string
): Promise<{
  status: string;
  records: AssetMaintenanceRecord[];
  totalCost: number;
  data: {
    records: AssetMaintenanceRecord[];
    total: number;
    totalCost: number;
  };
}> => {
  const { data } = await apiClient.get(`/church/assets/${assetId}/maintenance`);
  return data;
};

export const useFetchAssetMaintenance = (assetId?: string | null) => {
  return useQuery({
    queryKey: ['asset-maintenance', assetId],
    queryFn: () => fetchAssetMaintenance(assetId as string),
    enabled: Boolean(assetId),
  });
};

const createAssetMaintenance = async ({
  assetId,
  payload,
}: {
  assetId: string;
  payload: {
    date?: string;
    cost?: number | string;
    description: string;
    type?: string;
    performedBy?: string;
    status?: string;
    nextMaintenanceDate?: string;
    setAssetStatus?: string;
  };
}) => {
  const { data } = await apiClient.post(
    `/church/assets/${assetId}/maintenance`,
    payload
  );
  return data;
};

export const useCreateAssetMaintenance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAssetMaintenance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['asset-stats'] });
      queryClient.invalidateQueries({ queryKey: ['asset-maintenance'] });
      toast.success('Maintenance record saved successfully.', {
        style: successToastStyle,
      });
    },
  });
};

const deleteAssetMaintenance = async ({
  assetId,
  recordId,
}: {
  assetId: string;
  recordId: string;
}) => {
  const { data } = await apiClient.delete(
    `/church/assets/${assetId}/maintenance/${recordId}`
  );
  return data;
};

export const useDeleteAssetMaintenance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAssetMaintenance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset-maintenance'] });
      toast.success('Maintenance record deleted.', {
        style: successToastStyle,
      });
    },
  });
};
