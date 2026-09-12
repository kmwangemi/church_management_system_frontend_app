import apiClient from '@/lib/api-client';
import { successToastStyle } from '@/lib/toast-styles';
import type {
  Activity,
  ActivityAddResponse,
  ActivityListResponse,
} from '@/lib/types/activity';
import type { AddActivityPayload } from '@/lib/validations/activity';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

/* ========== CREATE ACTIVITY FOR BRANCH ========== */
const createBranchActivity = async ({
  branchId,
  payload,
}: {
  branchId: string;
  payload: AddActivityPayload;
}): Promise<ActivityAddResponse> => {
  const { data } = await apiClient.post(
    `/church/branches/${branchId}/activities`,
    payload
  );
  return data;
};

export const useCreateBranchActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBranchActivity,
    onSuccess: (_data, variables) => {
      // Invalidate both branch-specific and general queries
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({
        queryKey: ['branch-activities', variables.branchId],
      });
      queryClient.invalidateQueries({ queryKey: ['activity-stats'] });
      toast.success('Activity has been created successfully.', {
        style: successToastStyle,
      });
    },
  });
};

/* ========== FETCH BRANCH ACTIVITIES ========== */
interface FetchBranchActivitiesParams {
  branchId: string;
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

const fetchBranchActivities = async ({
  branchId,
  page = 1,
  limit = 10,
  search = '',
  type,
  status,
  dateFrom,
  dateTo,
}: FetchBranchActivitiesParams): Promise<ActivityListResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) params.append('search', search);
  if (type) params.append('type', type);
  if (status) params.append('status', status);
  if (dateFrom) params.append('dateFrom', dateFrom);
  if (dateTo) params.append('dateTo', dateTo);
  const { data } = await apiClient.get(
    `/church/branches/${branchId}/activities?${params.toString()}`
  );
  return data;
};

export const useFetchBranchActivities = (
  params: FetchBranchActivitiesParams
) => {
  return useQuery({
    queryKey: ['branch-activities', params.branchId, params],
    queryFn: () => fetchBranchActivities(params),
    enabled: !!params.branchId, // only fetch if branchId is provided
  });
};

/* ========== FETCH ALL ACTIVITIES (BACKWARD COMPATIBILITY) ========== */
interface FetchAllActivitiesParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
  branchId?: string;
  dateFrom?: string;
  dateTo?: string;
}

const fetchAllActivities = async ({
  page = 1,
  limit = 10,
  search = '',
  type,
  status,
  branchId,
  dateFrom,
  dateTo,
}: FetchAllActivitiesParams): Promise<ActivityListResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) params.append('search', search);
  if (type) params.append('type', type);
  if (status) params.append('status', status);
  if (branchId) params.append('branchId', branchId);
  if (dateFrom) params.append('dateFrom', dateFrom);
  if (dateTo) params.append('dateTo', dateTo);

  const { data } = await apiClient.get(
    `/church/activities?${params.toString()}`
  );
  return data;
};

export const useFetchActivities = (params: FetchAllActivitiesParams = {}) => {
  return useQuery({
    queryKey: ['activities', params],
    queryFn: () => fetchAllActivities(params),
  });
};

/* ========== FETCH ACTIVITY BY ID FROM BRANCH ========== */
const fetchBranchActivityById = async ({
  branchId,
  activityId,
}: {
  branchId: string;
  activityId: string;
}): Promise<{ activity: Activity; branch: any }> => {
  const { data } = await apiClient.get(
    `/church/branches/${branchId}/activities/${activityId}`
  );
  return data;
};

export const useFetchBranchActivityById = ({
  branchId,
  activityId,
}: {
  branchId: string;
  activityId: string;
}) => {
  return useQuery({
    queryKey: ['branch-activity', branchId, activityId],
    queryFn: () => fetchBranchActivityById({ branchId, activityId }),
    enabled: !!branchId && !!activityId, // only fetch if both IDs are provided
  });
};

/* ========== FETCH ACTIVITY BY ID (BACKWARD COMPATIBILITY) ========== */
const fetchActivityById = async (activityId: string): Promise<Activity> => {
  const {
    data: { activity },
  } = await apiClient.get(`/church/activities/${activityId}`);
  return activity;
};

export const useFetchActivityById = (activityId: string) => {
  return useQuery({
    queryKey: ['activity', activityId],
    queryFn: () => fetchActivityById(activityId),
    enabled: !!activityId, // only fetch if id is provided
  });
};

/* ========== UPDATE ACTIVITY BY ID IN BRANCH ========== */
const updateBranchActivityById = async ({
  branchId,
  activityId,
  payload,
}: {
  branchId: string;
  activityId: string;
  payload: Partial<AddActivityPayload>;
}): Promise<{ activity: Activity; branch: any; message: string }> => {
  const { data } = await apiClient.put(
    `/church/branches/${branchId}/activities/${activityId}`,
    payload
  );
  return data;
};

export const useUpdateBranchActivityById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBranchActivityById,
    onSuccess: (_data, variables) => {
      // Invalidate multiple query patterns
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({
        queryKey: ['branch-activities', variables.branchId],
      });
      queryClient.invalidateQueries({
        queryKey: ['branch-activity', variables.branchId, variables.activityId],
      });
      queryClient.invalidateQueries({
        queryKey: ['activity', variables.activityId],
      });
      queryClient.invalidateQueries({ queryKey: ['activity-stats'] });
      toast.success('Activity has been updated successfully.', {
        style: successToastStyle,
      });
    },
  });
};

/* ========== UPDATE ACTIVITY BY ID (BACKWARD COMPATIBILITY) ========== */
const updateActivityById = async ({
  activityId,
  payload,
}: {
  activityId: string;
  payload: Partial<AddActivityPayload>;
}): Promise<{ activity: Activity; message: string }> => {
  const { data } = await apiClient.put(
    `/church/activities/${activityId}`,
    payload
  );
  return data;
};

export const useUpdateActivityById = (activityId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateActivityById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['activity', activityId] });
      queryClient.invalidateQueries({ queryKey: ['activity-stats'] });
      toast.success('Activity has been updated successfully.', {
        style: successToastStyle,
      });
    },
  });
};

/* ========== DELETE ACTIVITY BY ID FROM BRANCH ========== */
const deleteBranchActivityById = async ({
  branchId,
  activityId,
  options,
}: {
  branchId: string;
  activityId: string;
  options?: { force?: boolean; cancel?: boolean };
}): Promise<{ message: string; activity?: Activity; branch?: any }> => {
  const params = new URLSearchParams();
  if (options?.force) params.append('force', 'true');
  if (options?.cancel) params.append('cancel', 'true');

  const url = params.toString()
    ? `/church/branches/${branchId}/activities/${activityId}?${params.toString()}`
    : `/church/branches/${branchId}/activities/${activityId}`;

  const { data } = await apiClient.delete(url);
  return data;
};

export const useDeleteBranchActivityById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBranchActivityById,
    onSuccess: (_data, variables) => {
      // Invalidate multiple query patterns
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({
        queryKey: ['branch-activities', variables.branchId],
      });
      queryClient.invalidateQueries({
        queryKey: ['branch-activity', variables.branchId, variables.activityId],
      });
      queryClient.invalidateQueries({
        queryKey: ['activity', variables.activityId],
      });
      queryClient.invalidateQueries({ queryKey: ['activity-stats'] });

      const message = variables.options?.cancel
        ? 'Activity has been cancelled successfully.'
        : variables.options?.force
          ? 'Activity has been permanently deleted.'
          : 'Activity has been deleted successfully.';
      toast.success(message, {
        style: successToastStyle,
      });
    },
  });
};

/* ========== DELETE ACTIVITY BY ID (BACKWARD COMPATIBILITY) ========== */
const deleteActivityById = async (
  activityId: string,
  options?: { force?: boolean; cancel?: boolean }
): Promise<{ message: string }> => {
  const params = new URLSearchParams();
  if (options?.force) params.append('force', 'true');
  if (options?.cancel) params.append('cancel', 'true');
  const url = params.toString()
    ? `/church/activities/${activityId}?${params.toString()}`
    : `/church/activities/${activityId}`;
  const { data } = await apiClient.delete(url);
  return data;
};

export const useDeleteActivityById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      activityId,
      options,
    }: {
      activityId: string;
      options?: { force?: boolean; cancel?: boolean };
    }) => deleteActivityById(activityId, options),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['activity-stats'] });
      const message = variables.options?.cancel
        ? 'Activity has been cancelled successfully.'
        : 'Activity has been deleted successfully.';
      toast.success(message, {
        style: successToastStyle,
      });
    },
  });
};
