import apiClient from '@/lib/api-client';
import { successToastStyle } from '@/lib/toast-styles';
import type {
  MilestoneFilters,
  MilestoneResponse,
  MilestonesResponse,
} from '@/lib/types/milestone';
import type { AddMilestonePayload } from '@/lib/validations/milestone';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// API functions
const fetchMilestonesApi = async (
  filters: MilestoneFilters = {}
): Promise<MilestonesResponse> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, value.toString());
    }
  });
  const { data } = await apiClient.get(`/church/milestones?${params.toString()}`);
  return data;
};

const fetchMilestoneApi = async (id: string): Promise<MilestoneResponse> => {
  const { data } = await apiClient.get(`/church/milestones/${id}`);
  return data;
};

const createMilestoneApi = async (payload: AddMilestonePayload) => {
  const { data } = await apiClient.post('/church/milestones', payload);
  return data;
};

const updateMilestoneApi = async ({
  id,
  ...payload
}: { id: string } & Partial<AddMilestonePayload>) => {
  const { data } = await apiClient.put(`/church/milestones/${id}`, payload);
  return data;
};

const deleteMilestoneApi = async (id: string) => {
  const { data } = await apiClient.delete(`/church/milestones/${id}`);
  return data;
};

const toggleMilestoneStatusApi = async (id: string) => {
  const { data } = await apiClient.post(`/church/milestones/${id}/toggle-status`);
  return data;
};

// Query Keys
const milestoneKeys = {
  all: ['milestones'] as const,
  lists: () => [...milestoneKeys.all, 'list'] as const,
  list: (filters: MilestoneFilters) =>
    [...milestoneKeys.lists(), filters] as const,
  details: () => [...milestoneKeys.all, 'detail'] as const,
  detail: (id: string) => [...milestoneKeys.details(), id] as const,
} as const;

// Custom Hooks
export function useMilestones(filters: MilestoneFilters = {}) {
  return useQuery({
    queryKey: milestoneKeys.list(filters),
    queryFn: () => fetchMilestonesApi(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMilestone(id: string) {
  return useQuery({
    queryKey: milestoneKeys.detail(id),
    queryFn: () => fetchMilestoneApi(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMilestoneApi,
    onSuccess: () => {
      // Invalidate and refetch milestones list
      queryClient.invalidateQueries({ queryKey: milestoneKeys.lists() });
      toast.success('Milestone created successfully!', {
        style: successToastStyle,
      });
    },
  });
}

export function useUpdateMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMilestoneApi,
    onSuccess: (data, variables) => {
      // Update the specific milestone in cache
      queryClient.setQueryData(
        milestoneKeys.detail(variables.id),
        (oldData: any) => {
          if (oldData) {
            return {
              ...oldData,
              data: {
                ...oldData.data,
                milestone: data.data,
              },
            };
          }
          return oldData;
        }
      );
      // Invalidate milestones list to refetch
      queryClient.invalidateQueries({ queryKey: milestoneKeys.lists() });
      toast.success('Milestone updated successfully!', {
        style: successToastStyle,
      });
    },
  });
}

export function useDeleteMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMilestoneApi,
    onSuccess: (_data, milestoneId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: milestoneKeys.detail(milestoneId),
      });
      // Invalidate milestones list to refetch
      queryClient.invalidateQueries({ queryKey: milestoneKeys.lists() });
      toast.success('Milestone deleted successfully!', {
        style: successToastStyle,
      });
    },
  });
}

export function useToggleMilestoneStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleMilestoneStatusApi,
    onSuccess: (data, milestoneId) => {
      // Update the specific milestone in cache
      queryClient.setQueryData(
        milestoneKeys.detail(milestoneId),
        (oldData: any) => {
          if (oldData) {
            return {
              ...oldData,
              data: {
                ...oldData.data,
                milestone: data.data,
              },
            };
          }
          return oldData;
        }
      );
      // Invalidate milestones list to refetch
      queryClient.invalidateQueries({ queryKey: milestoneKeys.lists() });
      toast.success('Milestone status updated!', {
        style: successToastStyle,
      });
    },
  });
}

// Additional utility hooks
export function useActiveMilestones(
  filters: Omit<MilestoneFilters, 'isActive'> = {}
) {
  return useMilestones({ ...filters, isActive: true });
}

export function useMilestonesByCategory(
  category: string,
  filters: Omit<MilestoneFilters, 'category'> = {}
) {
  return useMilestones({ ...filters, category });
}

export function useMilestonesByLevel(
  level: string,
  filters: Omit<MilestoneFilters, 'level'> = {}
) {
  return useMilestones({ ...filters, level });
}
