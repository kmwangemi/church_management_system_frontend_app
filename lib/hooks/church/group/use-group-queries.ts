import type { AddGroupActivityPayload } from '@/components/forms/add-group-activity-form';
import type { AddGroupGoalPayload } from '@/components/forms/add-group-goal-form';
import type { AddGroupMemberPayload } from '@/components/forms/add-group-member-form';
import apiClient from '@/lib/api-client';
import { successToastStyle } from '@/lib/toast-styles';
import type {
  AttendanceSummaryResponse,
  Group,
  GroupActivitiesResponse,
  GroupAddResponse,
  GroupGoalsResponse,
  GroupListResponse,
  GroupMembersResponse,
} from '@/lib/types/small-group';
import type { AddGroupPayload } from '@/lib/validations/small-group';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const registerGroup = async (
  payload: AddGroupPayload
): Promise<GroupAddResponse> => {
  const { data } = await apiClient.post('/church/groups', payload);
  return data;
};

export const useRegisterGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success('Group has been created successfully.', {
        style: successToastStyle,
      });
    },
  });
};

const fetchGroups = async (
  page = 1,
  search = ''
): Promise<GroupListResponse> => {
  const { data } = await apiClient.get(
    `/church/groups?page=${page}&search=${search}`
  );
  return data;
};

export const useFetchGroups = (page = 1, search = '') => {
  return useQuery({
    queryKey: ['groups', page, search],
    queryFn: () => fetchGroups(page, search),
  });
};

/* ========== FETCH GROUP BY ID ========== */
const fetchGroupById = async (groupId: string): Promise<Group> => {
  const {
    data: { group },
  } = await apiClient.get(`/church/groups/${groupId}`);
  return group;
};

export const useFetchGroupById = (groupId: string) => {
  return useQuery({
    queryKey: ['group', groupId],
    queryFn: () => fetchGroupById(groupId),
    enabled: !!groupId, // only fetch if id is provided
  });
};

/* ========== UPDATE GROUP BY ID ========== */
const updateGroupById = async ({
  groupId,
  payload,
}: {
  groupId: string;
  payload: Partial<AddGroupPayload>;
}): Promise<Group> => {
  const { data } = await apiClient.put(`/church/groups/${groupId}`, payload);
  return data;
};

export const useUpdateGroupById = (groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateGroupById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      toast.success('Group has been updated successfully.', {
        style: successToastStyle,
      });
    },
  });
};

/* ========== DELETE GROUP BY ID ========== */
const deleteGroupById = async ({
  groupId,
  options,
}: {
  groupId: string;
  options?: { force?: boolean; cancel?: boolean };
}): Promise<{ message: string }> => {
  const params = new URLSearchParams();
  if (options?.force) params.append('force', 'true');
  if (options?.cancel) params.append('cancel', 'true');
  const url = params.toString()
    ? `/church/groups/${groupId}?${params.toString()}`
    : `/church/groups/${groupId}`;
  const { data } = await apiClient.delete(url);
  return data;
};

export const useDeleteGroupById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGroupById,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      const message = variables.options?.cancel
        ? 'Group has been cancelled successfully.'
        : variables.options?.force
          ? 'Group has been permanently deleted.'
          : 'Group has been deleted successfully.';
      toast.success(message, {
        style: successToastStyle,
      });
    },
  });
};

/* ========== ADD GROUP GOAL ========== */
const addGroupGoal = async ({
  groupId,
  payload,
}: {
  groupId: string;
  payload: AddGroupGoalPayload;
}): Promise<any> => {
  const { data } = await apiClient.post(
    `/church/groups/${groupId}/goals`,
    payload
  );
  return data;
};

export const useAddGroupGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addGroupGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-goals'] });
      toast.success('Group goal has been added successfully.', {
        style: successToastStyle,
      });
    },
  });
};

/* ========== FETCH GROUP GOALS ========== */
interface FetchGroupGoalsParams {
  groupId: string;
  page?: number;
  limit?: number;
  search?: string;
  priority?: string;
  category?: string;
  status?: string;
  assigneeId?: string;
}

const fetchGroupGoals = async ({
  groupId,
  page = 1,
  limit = 20,
  search = '',
  priority,
  category,
  status,
  assigneeId,
}: FetchGroupGoalsParams): Promise<GroupGoalsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) params.append('search', search);
  if (priority) params.append('priority', priority);
  if (category) params.append('category', category);
  if (status) params.append('status', status);
  if (assigneeId) params.append('assigneeId', assigneeId);
  const { data } = await apiClient.get(
    `/church/groups/${groupId}/goals?${params.toString()}`
  );
  return data;
};

export const useFetchGroupGoals = (params: FetchGroupGoalsParams) => {
  return useQuery({
    queryKey: ['group-goals', params.groupId, params],
    queryFn: () => fetchGroupGoals(params),
    enabled: !!params.groupId,
  });
};

/* ========== DELETE GROUP GOAL ========== */
const deleteGroupGoal = async ({
  groupId,
  goalId,
}: {
  groupId: string;
  goalId: string;
}): Promise<{ message: string }> => {
  const { data } = await apiClient.delete(
    `/church/groups/${groupId}/goals/${goalId}`
  );
  return data;
};

export const useDeleteGroupGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGroupGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-goals'] });
      toast.success('Group goal has been deleted successfully.', {
        style: successToastStyle,
      });
    },
  });
};

/* ========== UPDATE GROUP GOAL ========== */
const updateGroupGoal = async ({
  groupId,
  goalId,
  payload,
}: {
  groupId: string;
  goalId: string;
  payload: Partial<AddGroupGoalPayload>;
}): Promise<any> => {
  const { data } = await apiClient.put(
    `/church/groups/${groupId}/goals/${goalId}`,
    payload
  );
  return data;
};

export const useUpdateGroupGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateGroupGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-goals'] });
      toast.success('Group goal has been updated successfully.', {
        style: successToastStyle,
      });
    },
  });
};

/* ========== ADD GROUP ACTIVITY ========== */
const addGroupActivity = async ({
  groupId,
  payload,
}: {
  groupId: string;
  payload: AddGroupActivityPayload;
}): Promise<any> => {
  const { data } = await apiClient.post(
    `/church/groups/${groupId}/activities`,
    payload
  );
  return data;
};

export const useAddGroupActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addGroupActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-activities'] });
      toast.success('Group activity has been logged successfully.', {
        style: successToastStyle,
      });
    },
  });
};

/* ========== UPDATE GROUP ACTIVITY ========== */
const updateGroupActivity = async ({
  groupId,
  activityId,
  payload,
}: {
  groupId: string;
  activityId: string;
  payload: Partial<AddGroupActivityPayload>;
}): Promise<any> => {
  const { data } = await apiClient.put(
    `/church/groups/${groupId}/activities/${activityId}`,
    payload
  );
  return data;
};

export const useUpdateGroupActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateGroupActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-activities'] });
      toast.success('Group activity has been updated successfully.', {
        style: successToastStyle,
      });
    },
  });
};

/* ========== FETCH GROUP ACTIVITIES ========== */
interface FetchGroupActivitiesParams {
  groupId: string;
  page?: number;
  limit?: number;
  search?: string;
  activityType?: string;
  startDate?: string;
  endDate?: string;
}

const fetchGroupActivities = async ({
  groupId,
  page = 1,
  limit = 20,
  search = '',
  activityType,
  startDate,
  endDate,
}: FetchGroupActivitiesParams): Promise<GroupActivitiesResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) params.append('search', search);
  if (activityType) params.append('activityType', activityType);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const { data } = await apiClient.get(
    `/church/groups/${groupId}/activities?${params.toString()}`
  );
  return data;
};

export const useFetchGroupActivities = (params: FetchGroupActivitiesParams) => {
  return useQuery({
    queryKey: ['group-activities', params.groupId, params],
    queryFn: () => fetchGroupActivities(params),
    enabled: !!params.groupId,
  });
};

/* ========== UPDATE GROUP MEMBER ========== */
const updateGroupMember = async ({
  groupId,
  memberId,
  payload,
}: {
  groupId: string;
  memberId: string;
  payload: Partial<AddGroupMemberPayload>;
}): Promise<any> => {
  const { data } = await apiClient.put(
    `/church/groups/${groupId}/members/${memberId}`,
    payload
  );
  return data;
};

export const useUpdateGroupMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateGroupMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-members'] });
      toast.success('Group member has been updated successfully.', {
        style: successToastStyle,
      });
    },
  });
};

/* ========== DELETE GROUP MEMBER ========== */
const deleteGroupMember = async ({
  groupId,
  memberId,
}: {
  groupId: string;
  memberId: string;
}): Promise<{ message: string }> => {
  const { data } = await apiClient.delete(
    `/church/groups/${groupId}/members/${memberId}`
  );
  return data;
};

export const useDeleteGroupMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGroupMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-members'] });
      toast.success('Group member has been deleted successfully.', {
        style: successToastStyle,
      });
    },
  });
};

/* ========== ADD GROUP MEMBER ========== */
const addGroupMember = async ({
  groupId,
  payload,
}: {
  groupId: string;
  payload: AddGroupMemberPayload;
}): Promise<any> => {
  const { data } = await apiClient.post(
    `/church/groups/${groupId}/members`,
    payload
  );
  return data;
};

export const useAddGroupMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addGroupMember,
    onSuccess: () => {
      // Invalidate group members query
      queryClient.invalidateQueries({ queryKey: ['group-members'] });
      toast.success('Group member has been added successfully.', {
        style: successToastStyle,
      });
    },
  });
};

/* ========== FETCH GROUP MEMBER ========== */

interface FetchGroupMembersParams {
  groupId: string;
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}

const fetchGroupMembers = async ({
  groupId,
  page = 1,
  limit = 20,
  search = '',
  role,
  isActive,
}: FetchGroupMembersParams): Promise<GroupMembersResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) params.append('search', search);
  if (role) params.append('role', role);
  if (isActive !== undefined) params.append('isActive', isActive.toString());
  const { data } = await apiClient.get(
    `/church/groups/${groupId}/members?${params.toString()}`
  );
  return data;
};

export const useFetchGroupMembers = (params: FetchGroupMembersParams) => {
  return useQuery({
    queryKey: ['group-members', params.groupId, params],
    queryFn: () => fetchGroupMembers(params),
    enabled: !!params.groupId, // only fetch if groupId is provided
  });
};

/* ========== DELETE GROUP ACTIVITY ========== */
const deleteGroupActivity = async ({
  groupId,
  activityId,
}: {
  groupId: string;
  activityId: string;
}): Promise<{ message: string }> => {
  const { data } = await apiClient.delete(
    `/church/groups/${groupId}/activities/${activityId}`
  );
  return data;
};

export const useDeleteGroupActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGroupActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-activities'] });
      toast.success('Group activity has been deleted successfully.', {
        style: successToastStyle,
      });
    },
  });
};

// Query parameters interface for better type safety
interface AttendanceSummaryParams {
  groupId: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  includeRecords?: boolean;
}

// Fetch function
const fetchAttendanceSummary = async ({
  groupId,
  startDate,
  endDate,
  limit = 10,
  includeRecords = false,
}: AttendanceSummaryParams): Promise<AttendanceSummaryResponse> => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  if (limit) params.append('limit', limit.toString());
  if (includeRecords) params.append('includeRecords', 'true');
  const { data } = await apiClient.get(
    `/church/groups/${groupId}/attendance/summary?${params.toString()}`
  );
  return data;
};

// React Query hook
export const useFetchAttendanceSummary = ({
  groupId,
  startDate,
  endDate,
  limit = 10,
  includeRecords = false,
}: AttendanceSummaryParams) => {
  return useQuery({
    queryKey: [
      'attendanceSummary',
      groupId,
      startDate,
      endDate,
      limit,
      includeRecords,
    ],
    queryFn: () =>
      fetchAttendanceSummary({
        groupId,
        startDate,
        endDate,
        limit,
        includeRecords,
      }),
    enabled: !!groupId, // Only run query if groupId is provided
  });
};
