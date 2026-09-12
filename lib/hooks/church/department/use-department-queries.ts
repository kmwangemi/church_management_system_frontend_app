import type { AddDepartmentActivityPayload } from '@/components/forms/add-department-activity-form';
import type { AddDepartmentExpensePayload } from '@/components/forms/add-department-expense-form';
import type { AddDepartmentGoalPayload } from '@/components/forms/add-department-goal-form';
import type { AddDepartmentMemberPayload } from '@/components/forms/add-department-member-form';
import apiClient from '@/lib/api-client';
import { successToastStyle } from '@/lib/toast-styles';
import type {
  Department,
  DepartmentActivitiesResponse,
  DepartmentAddResponse,
  DepartmentExpensesResponse,
  DepartmentGoalsResponse,
  DepartmentListResponse,
  DepartmentMembersResponse,
} from '@/lib/types/department';
import type { AddDepartmentPayload } from '@/lib/validations/department';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const registerDepartment = async (
  payload: AddDepartmentPayload
): Promise<DepartmentAddResponse> => {
  const { data } = await apiClient.post('/church/departments', payload);
  return data;
};

export const useRegisterDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['branchDepartments'] });
      toast.success('Church department has been created successfully.', {
        style: successToastStyle,
      });
    },
  });
};

const fetchDepartments = async (
  page = 1,
  search = ''
): Promise<DepartmentListResponse> => {
  const { data } = await apiClient.get(
    `/church/departments?page=${page}&search=${search}`
  );
  return data;
};

export const useFetchDepartments = (page = 1, search = '') => {
  return useQuery({
    queryKey: ['departments', page, search],
    queryFn: () => fetchDepartments(page, search),
  });
};

/* ========== FETCH DEPARTMENT BY ID ========== */
const fetchDepartmentById = async (
  departmentId: string
): Promise<Department> => {
  const {
    data: { department },
  } = await apiClient.get(`/church/departments/${departmentId}`);
  return department;
};

export const useFetchDepartmentById = (departmentId: string) => {
  return useQuery({
    queryKey: ['department', departmentId],
    queryFn: () => fetchDepartmentById(departmentId),
    enabled: !!departmentId, // only fetch if id is provided
  });
};

/* ========== UPDATE DEPARTMENT BY ID ========== */
const updateDepartmentById = async ({
  departmentId,
  payload,
}: {
  departmentId: string;
  payload: Partial<AddDepartmentPayload>;
}): Promise<Department> => {
  const { data } = await apiClient.put(
    `/church/departments/${departmentId}`,
    payload
  );
  return data;
};

export const useUpdateDepartmentById = (departmentId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDepartmentById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['department', departmentId] });
      toast.success('Department has been updated successfully.', {
        style: successToastStyle,
      });
    },
  });
};

/* ========== DELETE DEPARTMENT BY ID ========== */
const deleteDepartmentById = async ({
  departmentId,
  options,
}: {
  departmentId: string;
  options?: { force?: boolean; cancel?: boolean };
}): Promise<{ message: string }> => {
  const params = new URLSearchParams();
  if (options?.force) params.append('force', 'true');
  if (options?.cancel) params.append('cancel', 'true');
  const url = params.toString()
    ? `/church/departments/${departmentId}?${params.toString()}`
    : `/church/departments/${departmentId}`;
  const { data } = await apiClient.delete(url);
  return data;
};

export const useDeleteDepartmentById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDepartmentById,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      const message = variables.options?.cancel
        ? 'Department has been cancelled successfully.'
        : variables.options?.force
          ? 'Department has been permanently deleted.'
          : 'Department has been deleted successfully.';
      toast.success(message, {
        style: successToastStyle,
      });
    },
  });
};

/* ========== ADD DEPARTMENT MEMBER ========== */
const addDepartmentMember = async ({
  departmentId,
  payload,
}: {
  departmentId: string;
  payload: AddDepartmentMemberPayload;
}): Promise<any> => {
  const { data } = await apiClient.post(
    `/church/departments/${departmentId}/members`,
    payload
  );
  return data;
};

export const useAddDepartmentMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addDepartmentMember,
    onSuccess: () => {
      // Invalidate department members query
      queryClient.invalidateQueries({ queryKey: ['department-members'] });
      toast.success('Department member has been added successfully.', {
        style: successToastStyle,
      });
    },
  });
};

/* ========== FETCH DEPARTMENT MEMBER ========== */

interface FetchDepartmentMembersParams {
  departmentId: string;
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}

const fetchDepartmentMembers = async ({
  departmentId,
  page = 1,
  limit = 20,
  search = '',
  role,
  isActive,
}: FetchDepartmentMembersParams): Promise<DepartmentMembersResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) params.append('search', search);
  if (role) params.append('role', role);
  if (isActive !== undefined) params.append('isActive', isActive.toString());
  const { data } = await apiClient.get(
    `/church/departments/${departmentId}/members?${params.toString()}`
  );
  return data;
};

export const useFetchDepartmentMembers = (
  params: FetchDepartmentMembersParams
) => {
  return useQuery({
    queryKey: ['department-members', params.departmentId, params],
    queryFn: () => fetchDepartmentMembers(params),
    enabled: !!params.departmentId, // only fetch if departmentId is provided
  });
};

/* ========== ADD DEPARTMENT ACTIVITY ========== */
const addDepartmentActivity = async ({
  departmentId,
  payload,
}: {
  departmentId: string;
  payload: AddDepartmentActivityPayload;
}): Promise<any> => {
  const { data } = await apiClient.post(
    `/church/departments/${departmentId}/activities`,
    payload
  );
  return data;
};

export const useAddDepartmentActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addDepartmentActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['department-activities'] });
      toast.success('Department activity has been logged successfully.', {
        style: successToastStyle,
      });
    },
  });
};

/* ========== FETCH DEPARTMENT ACTIVITIES ========== */
interface FetchDepartmentActivitiesParams {
  departmentId: string;
  page?: number;
  limit?: number;
  search?: string;
  activityType?: string;
  startDate?: string;
  endDate?: string;
}

const fetchDepartmentActivities = async ({
  departmentId,
  page = 1,
  limit = 20,
  search = '',
  activityType,
  startDate,
  endDate,
}: FetchDepartmentActivitiesParams): Promise<DepartmentActivitiesResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) params.append('search', search);
  if (activityType) params.append('activityType', activityType);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const { data } = await apiClient.get(
    `/church/departments/${departmentId}/activities?${params.toString()}`
  );
  return data;
};

export const useFetchDepartmentActivities = (
  params: FetchDepartmentActivitiesParams
) => {
  return useQuery({
    queryKey: ['department-activities', params.departmentId, params],
    queryFn: () => fetchDepartmentActivities(params),
    enabled: !!params.departmentId,
  });
};

/* ========== ADD DEPARTMENT EXPENSE ========== */
const addDepartmentExpense = async ({
  departmentId,
  payload,
}: {
  departmentId: string;
  payload: AddDepartmentExpensePayload;
}): Promise<any> => {
  const { data } = await apiClient.post(
    `/church/departments/${departmentId}/expenses`,
    payload
  );
  return data;
};

export const useAddDepartmentExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addDepartmentExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['department-expenses'] });
      toast.success('Department expense has been added successfully.', {
        style: successToastStyle,
      });
    },
  });
};

/* ========== FETCH DEPARTMENT EXPENSES ========== */
interface FetchDepartmentExpensesParams {
  departmentId: string;
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

const fetchDepartmentExpenses = async ({
  departmentId,
  page = 1,
  limit = 20,
  search = '',
  category,
}: FetchDepartmentExpensesParams): Promise<DepartmentExpensesResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) params.append('search', search);
  if (category) params.append('category', category);
  const { data } = await apiClient.get(
    `/church/departments/${departmentId}/expenses?${params.toString()}`
  );
  return data;
};

export const useFetchDepartmentExpenses = (
  params: FetchDepartmentExpensesParams
) => {
  return useQuery({
    queryKey: ['department-expenses', params.departmentId, params],
    queryFn: () => fetchDepartmentExpenses(params),
    enabled: !!params.departmentId,
  });
};

/* ========== ADD DEPARTMENT GOAL ========== */
const addDepartmentGoal = async ({
  departmentId,
  payload,
}: {
  departmentId: string;
  payload: AddDepartmentGoalPayload;
}): Promise<any> => {
  const { data } = await apiClient.post(
    `/church/departments/${departmentId}/goals`,
    payload
  );
  return data;
};

export const useAddDepartmentGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addDepartmentGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['department-goals'] });
      toast.success('Department goal has been added successfully.', {
        style: successToastStyle,
      });
    },
  });
};

/* ========== FETCH DEPARTMENT GOALS ========== */
interface FetchDepartmentGoalsParams {
  departmentId: string;
  page?: number;
  limit?: number;
  search?: string;
  priority?: string;
  category?: string;
  status?: string;
  assigneeId?: string;
}

const fetchDepartmentGoals = async ({
  departmentId,
  page = 1,
  limit = 20,
  search = '',
  priority,
  category,
  status,
  assigneeId,
}: FetchDepartmentGoalsParams): Promise<DepartmentGoalsResponse> => {
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
    `/church/departments/${departmentId}/goals?${params.toString()}`
  );
  return data;
};

export const useFetchDepartmentGoals = (params: FetchDepartmentGoalsParams) => {
  return useQuery({
    queryKey: ['department-goals', params.departmentId, params],
    queryFn: () => fetchDepartmentGoals(params),
    enabled: !!params.departmentId,
  });
};

/* ========== UPDATE DEPARTMENT MEMBER ========== */
const updateDepartmentMember = async ({
  departmentId,
  memberId,
  payload,
}: {
  departmentId: string;
  memberId: string;
  payload: Partial<AddDepartmentMemberPayload>;
}): Promise<any> => {
  const { data } = await apiClient.put(
    `/church/departments/${departmentId}/members/${memberId}`,
    payload
  );
  return data;
};

export const useUpdateDepartmentMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDepartmentMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['department-members'] });
      toast.success('Department member has been updated successfully.', {
        style: successToastStyle,
      });
    },
  });
};

/* ========== UPDATE DEPARTMENT GOAL ========== */
const updateDepartmentGoal = async ({
  departmentId,
  goalId,
  payload,
}: {
  departmentId: string;
  goalId: string;
  payload: Partial<AddDepartmentGoalPayload>;
}): Promise<any> => {
  const { data } = await apiClient.put(
    `/church/departments/${departmentId}/goals/${goalId}`,
    payload
  );
  return data;
};

export const useUpdateDepartmentGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDepartmentGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['department-goals'] });
      toast.success('Department goal has been updated successfully.', {
        style: successToastStyle,
      });
    },
  });
};

/* ========== UPDATE DEPARTMENT EXPENSE ========== */
const updateDepartmentExpense = async ({
  departmentId,
  expenseId,
  payload,
}: {
  departmentId: string;
  expenseId: string;
  payload: Partial<AddDepartmentExpensePayload>;
}): Promise<any> => {
  const { data } = await apiClient.put(
    `/church/departments/${departmentId}/expenses/${expenseId}`,
    payload
  );
  return data;
};

export const useUpdateDepartmentExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDepartmentExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['department-expenses'] });
      toast.success('Department expense has been updated successfully.', {
        style: successToastStyle,
      });
    },
  });
};

/* ========== UPDATE DEPARTMENT ACTIVITY ========== */
const updateDepartmentActivity = async ({
  departmentId,
  activityId,
  payload,
}: {
  departmentId: string;
  activityId: string;
  payload: Partial<AddDepartmentActivityPayload>;
}): Promise<any> => {
  const { data } = await apiClient.put(
    `/church/departments/${departmentId}/activities/${activityId}`,
    payload
  );
  return data;
};

export const useUpdateDepartmentActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDepartmentActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['department-activities'] });
      toast.success('Department activity has been updated successfully.', {
        style: successToastStyle,
      });
    },
  });
};

/* ========== DELETE DEPARTMENT ACTIVITY ========== */
const deleteDepartmentActivity = async ({
  departmentId,
  activityId,
}: {
  departmentId: string;
  activityId: string;
}): Promise<{ message: string }> => {
  const { data } = await apiClient.delete(
    `/church/departments/${departmentId}/activities/${activityId}`
  );
  return data;
};

export const useDeleteDepartmentActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDepartmentActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['department-activities'] });
      toast.success('Department activity has been deleted successfully.', {
        style: successToastStyle,
      });
    },
  });
};

/* ========== DELETE DEPARTMENT GOAL ========== */
const deleteDepartmentGoal = async ({
  departmentId,
  goalId,
}: {
  departmentId: string;
  goalId: string;
}): Promise<{ message: string }> => {
  const { data } = await apiClient.delete(
    `/church/departments/${departmentId}/goals/${goalId}`
  );
  return data;
};

export const useDeleteDepartmentGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDepartmentGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['department-goals'] });
      toast.success('Department goal has been deleted successfully.', {
        style: successToastStyle,
      });
    },
  });
};

/* ========== DELETE DEPARTMENT EXPENSE ========== */
const deleteDepartmentExpense = async ({
  departmentId,
  expenseId,
}: {
  departmentId: string;
  expenseId: string;
}): Promise<{ message: string }> => {
  const { data } = await apiClient.delete(
    `/church/departments/${departmentId}/expenses/${expenseId}`
  );
  return data;
};

export const useDeleteDepartmentExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDepartmentExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['department-expenses'] });
      toast.success('Department expense has been deleted successfully.', {
        style: successToastStyle,
      });
    },
  });
};

/* ========== DELETE DEPARTMENT MEMBER ========== */
const deleteDepartmentMember = async ({
  departmentId,
  memberId,
}: {
  departmentId: string;
  memberId: string;
}): Promise<{ message: string }> => {
  const { data } = await apiClient.delete(
    `/church/departments/${departmentId}/members/${memberId}`
  );
  return data;
};

export const useDeleteDepartmentMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDepartmentMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['department-members'] });
      toast.success('Department member has been deleted successfully.', {
        style: successToastStyle,
      });
    },
  });
};
