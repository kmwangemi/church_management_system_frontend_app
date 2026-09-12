import apiClient from '@/lib/api-client';
import { successToastStyle } from '@/lib/toast-styles';
import type {
  ServiceSchedule,
  ServiceScheduleAddResponse,
  ServiceScheduleListResponse,
} from '@/lib/types/service-schedule';
import type { AddServiceSchedulePayload } from '@/lib/validations/service-schedule';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

/* ========== CREATE SERVICE SCHEDULE FOR BRANCH ========== */
const createBranchServiceSchedule = async ({
  branchId,
  payload,
}: {
  branchId: string;
  payload: AddServiceSchedulePayload;
}): Promise<ServiceScheduleAddResponse> => {
  const { data } = await apiClient.post(
    `/church/branches/${branchId}/service-schedules`,
    payload
  );
  return data;
};

export const useCreateBranchServiceSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBranchServiceSchedule,
    onSuccess: (_data, variables) => {
      // Invalidate both branch-specific and general queries
      queryClient.invalidateQueries({ queryKey: ['service-schedules'] });
      queryClient.invalidateQueries({
        queryKey: ['branch-service-schedules', variables.branchId],
      });
      queryClient.invalidateQueries({ queryKey: ['service-schedule-stats'] });
      toast.success('Service schedule has been created successfully.', {
        style: successToastStyle,
      });
    },
  });
};

/* ========== FETCH BRANCH SERVICE SCHEDULES ========== */
interface FetchBranchServiceSchedulesParams {
  branchId: string;
  page?: number;
  limit?: number;
  search?: string;
  day?: string;
  type?: string;
  status?: 'active' | 'inactive' | 'all';
}

const fetchBranchServiceSchedules = async ({
  branchId,
  page = 1,
  limit = 10,
  search = '',
  day,
  type,
  status,
}: FetchBranchServiceSchedulesParams): Promise<ServiceScheduleListResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) params.append('search', search);
  if (day) params.append('day', day);
  if (type) params.append('type', type);
  if (status) params.append('status', status);
  const { data } = await apiClient.get(
    `/church/branches/${branchId}/service-schedules?${params.toString()}`
  );
  return data;
};

export const useFetchBranchServiceSchedules = (
  params: FetchBranchServiceSchedulesParams
) => {
  return useQuery({
    queryKey: ['branch-service-schedules', params.branchId, params],
    queryFn: () => fetchBranchServiceSchedules(params),
    enabled: !!params.branchId, // only fetch if branchId is provided
  });
};

/* ========== FETCH ALL SERVICE SCHEDULES (BACKWARD COMPATIBILITY) ========== */
interface FetchAllServiceSchedulesParams {
  page?: number;
  limit?: number;
  search?: string;
  day?: string;
  type?: string;
  branchId?: string;
  status?: 'active' | 'inactive';
}

const fetchAllServiceSchedules = async ({
  page = 1,
  limit = 10,
  search = '',
  day,
  type,
  branchId,
  status,
}: FetchAllServiceSchedulesParams): Promise<ServiceScheduleListResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) params.append('search', search);
  if (day) params.append('day', day);
  if (type) params.append('type', type);
  if (branchId) params.append('branchId', branchId);
  if (status) params.append('status', status);
  const { data } = await apiClient.get(
    `/church/service-schedules?${params.toString()}`
  );
  return data;
};

export const useFetchServiceSchedules = (
  params: FetchAllServiceSchedulesParams = {}
) => {
  return useQuery({
    queryKey: ['service-schedules', params],
    queryFn: () => fetchAllServiceSchedules(params),
  });
};

/* ========== FETCH SERVICE SCHEDULE BY ID FROM BRANCH ========== */
const fetchBranchServiceScheduleById = async ({
  branchId,
  scheduleId,
}: {
  branchId: string;
  scheduleId: string;
}): Promise<{ schedule: ServiceSchedule; branch: any }> => {
  const { data } = await apiClient.get(
    `/church/branches/${branchId}/service-schedules/${scheduleId}`
  );
  return data;
};

export const useFetchBranchServiceScheduleById = ({
  branchId,
  scheduleId,
}: {
  branchId: string;
  scheduleId: string;
}) => {
  return useQuery({
    queryKey: ['branch-service-schedule', branchId, scheduleId],
    queryFn: () => fetchBranchServiceScheduleById({ branchId, scheduleId }),
    enabled: !!branchId && !!scheduleId, // only fetch if both IDs are provided
  });
};

/* ========== FETCH SERVICE SCHEDULE BY ID (BACKWARD COMPATIBILITY) ========== */
const fetchServiceScheduleById = async (
  scheduleId: string
): Promise<ServiceSchedule> => {
  const {
    data: { schedule },
  } = await apiClient.get(`/church/service-schedules/${scheduleId}`);
  return schedule;
};

export const useFetchServiceScheduleById = (scheduleId: string) => {
  return useQuery({
    queryKey: ['service-schedule', scheduleId],
    queryFn: () => fetchServiceScheduleById(scheduleId),
    enabled: !!scheduleId, // only fetch if id is provided
  });
};

/* ========== UPDATE SERVICE SCHEDULE BY ID IN BRANCH ========== */
const updateBranchServiceScheduleById = async ({
  branchId,
  scheduleId,
  payload,
}: {
  branchId: string;
  scheduleId: string;
  payload: Partial<AddServiceSchedulePayload>;
}): Promise<{ schedule: ServiceSchedule; branch: any; message: string }> => {
  const { data } = await apiClient.put(
    `/church/branches/${branchId}/service-schedules/${scheduleId}`,
    payload
  );
  return data;
};

export const useUpdateBranchServiceScheduleById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBranchServiceScheduleById,
    onSuccess: (_data, variables) => {
      // Invalidate multiple query patterns
      queryClient.invalidateQueries({ queryKey: ['service-schedules'] });
      queryClient.invalidateQueries({
        queryKey: ['branch-service-schedules', variables.branchId],
      });
      queryClient.invalidateQueries({
        queryKey: [
          'branch-service-schedule',
          variables.branchId,
          variables.scheduleId,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ['service-schedule', variables.scheduleId],
      });
      queryClient.invalidateQueries({ queryKey: ['service-schedule-stats'] });
      toast.success('Service schedule has been updated successfully.', {
        style: successToastStyle,
      });
    },
  });
};

/* ========== UPDATE SERVICE SCHEDULE BY ID (BACKWARD COMPATIBILITY) ========== */
const updateServiceScheduleById = async ({
  scheduleId,
  payload,
}: {
  scheduleId: string;
  payload: Partial<AddServiceSchedulePayload>;
}): Promise<{ schedule: ServiceSchedule; message: string }> => {
  const { data } = await apiClient.put(
    `/church/service-schedules/${scheduleId}`,
    payload
  );
  return data;
};

export const useUpdateServiceScheduleById = (scheduleId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateServiceScheduleById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-schedules'] });
      queryClient.invalidateQueries({
        queryKey: ['service-schedule', scheduleId],
      });
      queryClient.invalidateQueries({ queryKey: ['service-schedule-stats'] });
      toast.success('Service schedule has been updated successfully.', {
        style: successToastStyle,
      });
    },
  });
};

/* ========== DELETE SERVICE SCHEDULE BY ID FROM BRANCH ========== */
const deleteBranchServiceScheduleById = async ({
  branchId,
  scheduleId,
  options,
}: {
  branchId: string;
  scheduleId: string;
  options?: { force?: boolean };
}): Promise<{ message: string; schedule?: ServiceSchedule; branch?: any }> => {
  const params = new URLSearchParams();
  if (options?.force) params.append('force', 'true');
  const url = params.toString()
    ? `/church/branches/${branchId}/service-schedules/${scheduleId}?${params.toString()}`
    : `/church/branches/${branchId}/service-schedules/${scheduleId}`;
  const { data } = await apiClient.delete(url);
  return data;
};

export const useDeleteBranchServiceScheduleById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBranchServiceScheduleById,
    onSuccess: (_data, variables) => {
      // Invalidate multiple query patterns
      queryClient.invalidateQueries({ queryKey: ['service-schedules'] });
      queryClient.invalidateQueries({
        queryKey: ['branch-service-schedules', variables.branchId],
      });
      queryClient.invalidateQueries({
        queryKey: [
          'branch-service-schedule',
          variables.branchId,
          variables.scheduleId,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ['service-schedule', variables.scheduleId],
      });
      queryClient.invalidateQueries({ queryKey: ['service-schedule-stats'] });
      const message = variables.options?.force
        ? 'Service schedule has been permanently deleted.'
        : 'Service schedule has been deactivated successfully.';
      toast.success(message, {
        style: successToastStyle,
      });
    },
  });
};

/* ========== DELETE SERVICE SCHEDULE BY ID (BACKWARD COMPATIBILITY) ========== */
const deleteServiceScheduleById = async (
  scheduleId: string,
  options?: { force?: boolean }
): Promise<{ message: string; schedule?: ServiceSchedule }> => {
  const params = new URLSearchParams();
  if (options?.force) params.append('force', 'true');
  const url = params.toString()
    ? `/church/service-schedules/${scheduleId}?${params.toString()}`
    : `/church/service-schedules/${scheduleId}`;
  const { data } = await apiClient.delete(url);
  return data;
};

export const useDeleteServiceScheduleById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      scheduleId,
      options,
    }: {
      scheduleId: string;
      options?: { force?: boolean };
    }) => deleteServiceScheduleById(scheduleId, options),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['service-schedules'] });
      queryClient.invalidateQueries({ queryKey: ['service-schedule-stats'] });
      const message = variables.options?.force
        ? 'Service schedule has been permanently deleted.'
        : 'Service schedule has been deactivated successfully.';
      toast.success(message, {
        style: successToastStyle,
      });
    },
  });
};
