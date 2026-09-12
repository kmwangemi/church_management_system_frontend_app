import apiClient from '@/lib/api-client';
import { successToastStyle } from '@/lib/toast-styles';
import type {
  Branch,
  BranchAddResponse,
  BranchListResponse,
} from '@/lib/types/branch';
import type { DepartmentListResponse } from '@/lib/types/department';
import type { UserListResponse } from '@/lib/types/user';
import type {
  AddBranchPayload,
  UpdateBranchPayload,
} from '@/lib/validations/branch';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const registerBranch = async (
  payload: AddBranchPayload
): Promise<BranchAddResponse> => {
  const { data } = await apiClient.post('/church/branches', payload);
  return data;
};

export const useRegisterBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast.success('Church branch has been created successfully.', {
        style: successToastStyle,
      });
    },
  });
};

const fetchBranches = async (
  page = 1,
  search = ''
): Promise<BranchListResponse> => {
  const { data } = await apiClient.get(
    `/church/branches?page=${page}&search=${search}`
  );
  return data;
};

export const useFetchBranches = (page = 1, search = '') => {
  return useQuery({
    queryKey: ['branches', page, search],
    queryFn: () => fetchBranches(page, search),
  });
};

/* ========== FETCH BRANCH BY ID ========== */
const fetchBranchById = async (branchId: string): Promise<Branch> => {
  const {
    data: { branch },
  } = await apiClient.get(`/church/branches/${branchId}`);
  return branch;
};

export const useFetchBranchById = (branchId: string) => {
  return useQuery({
    queryKey: ['branch', branchId],
    queryFn: () => fetchBranchById(branchId),
    enabled: !!branchId, // only fetch if id is provided
  });
};

/* ========== FETCH BRANCH MEMBERS ========== */
const fetchBranchMembers = async (
  branchId: string,
  page = 1,
  search = '',
  status?: 'active' | 'inactive' | 'suspended' | 'pending',
  limit = 10
): Promise<UserListResponse> => {
  // Build query parameters
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) {
    params.append('search', search);
  }
  if (status) {
    params.append('status', status);
  }
  const { data } = await apiClient.get(
    `/church/branches/${branchId}/members?${params.toString()}`
  );
  return data;
};

export const useFetchBranchMembers = (
  branchId: string,
  page = 1,
  search = '',
  status?: 'active' | 'inactive' | 'suspended' | 'pending',
  limit = 10
) => {
  return useQuery({
    queryKey: ['branchMembers', branchId, page, search, status, limit],
    queryFn: () => fetchBranchMembers(branchId, page, search, status, limit),
    enabled: !!branchId, // Only run query if branchId is provided
  });
};

/* ========== FETCH BRANCH DEPARTMENTS ========== */
const fetchBranchDepartments = async (
  branchId: string,
  page = 1,
  search = '',
  status?: 'active' | 'inactive',
  limit = 10
): Promise<DepartmentListResponse> => {
  // Build query parameters
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) {
    params.append('search', search);
  }
  if (status) {
    params.append('status', status);
  }
  const { data } = await apiClient.get(
    `/church/branches/${branchId}/departments?${params.toString()}`
  );
  return data;
};

export const useFetchBranchDepartments = (
  branchId: string,
  page = 1,
  search = '',
  status?: 'active' | 'inactive',
  limit = 10
) => {
  return useQuery({
    queryKey: ['branchDepartments', branchId, page, search, status, limit],
    queryFn: () =>
      fetchBranchDepartments(branchId, page, search, status, limit),
    enabled: !!branchId, // Only run query if branchId is provided
  });
};

/* ========== UPDATE BRANCH BY ID ========== */
const updateBranchById = async ({
  branchId,
  payload,
}: {
  branchId: string;
  payload: Partial<UpdateBranchPayload>;
}): Promise<Branch> => {
  const { data } = await apiClient.put(`/church/branches/${branchId}`, payload);
  return data;
};

export const useUpdateBranchById = (branchId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBranchById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      queryClient.invalidateQueries({ queryKey: ['branch', branchId] });
      toast.success('Branch has been updated successfully.', {
        style: successToastStyle,
      });
    },
  });
};

/* ========== DELETE BRANCH BY ID ========== */
const deleteBranchById = async (
  branchId: string
): Promise<{ message: string }> => {
  const { data } = await apiClient.delete(`/church/branches/${branchId}`);
  return data;
};

export const useDeleteBranchById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBranchById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast.success('Branch has been deleted successfully.', {
        style: successToastStyle,
      });
    },
  });
};
