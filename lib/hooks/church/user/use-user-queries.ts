import apiClient from '@/lib/api-client';
import { successToastStyle } from '@/lib/toast-styles';
import type {
  UserAddResponse,
  UserListResponse,
  UserResponse,
} from '@/lib/types/user';
import type {
  AddUserPayload,
  UpdateUserPayload,
} from '@/lib/validations/users';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

/* ========== CREATE USER ========== */
const registerUser = async (
  payload: AddUserPayload
): Promise<UserAddResponse> => {
  const { data } = await apiClient.post('/church/users', payload);
  return data;
};

export const useRegisterUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User has been created successfully.', {
        style: successToastStyle,
      });
    },
  });
};

/* ========== FETCH ALL USERS ========== */
const fetchUsers = async (page = 1, search = ''): Promise<UserListResponse> => {
  const { data } = await apiClient.get(`/church/users?page=${page}&search=${search}`);
  return data;
};

export const useFetchUsers = (page = 1, search = '') => {
  return useQuery({
    queryKey: ['users', page, search],
    queryFn: () => fetchUsers(page, search),
  });
};

/* ========== FETCH USER BY ID ========== */
const fetchUserById = async (userId: string): Promise<UserResponse> => {
  const {
    data: { user },
  } = await apiClient.get(`/church/users/${userId}`);
  return user;
};

export const useFetchUserById = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUserById(userId),
    enabled: !!userId, // only fetch if id is provided
  });
};

/* ========== UPDATE USER BY ID ========== */
const updateUserById = async ({
  userId,
  payload,
}: {
  userId: string;
  payload: Partial<UpdateUserPayload>;
}): Promise<UserResponse> => {
  const { data } = await apiClient.put(`/church/users/${userId}`, payload);
  return data;
};

export const useUpdateUserById = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      toast.success('User has been updated successfully.', {
        style: successToastStyle,
      });
    },
  });
};

/* ========== DELETE USER BY ID ========== */
const deleteUserById = async (userId: string): Promise<{ message: string }> => {
  const { data } = await apiClient.delete(`/church/users/${userId}`);
  return data;
};

export const useDeleteUserById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUserById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User has been deleted successfully.', {
        style: successToastStyle,
      });
    },
  });
};
