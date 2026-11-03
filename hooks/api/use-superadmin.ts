import { superadminService } from '@/lib/api/superadmin';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Dashboard
export const useSuperAdminDashboard = () => {
  return useQuery({
    queryKey: ['superadmin', 'dashboard'],
    queryFn: superadminService.getDashboard,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
};

// Branches
export const useSuperAdminBranches = (params?: { search?: string; churchId?: string; status?: string }) => {
  return useQuery({
    queryKey: ['superadmin', 'branches', params],
    queryFn: () => superadminService.getBranches(params),
    staleTime: 30_000,
  });
};

export const useCreateSuperAdminBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: superadminService.createBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'branches'] });
      toast.success('Branch created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || error.message || 'Failed to create branch');
    },
  });
};

export const useUpdateSuperAdminBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      superadminService.updateBranch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'branches'] });
      toast.success('Branch updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || error.message || 'Failed to update branch');
    },
  });
};

export const useDeleteSuperAdminBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => superadminService.deleteBranch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'branches'] });
      toast.success('Branch deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || error.message || 'Failed to delete branch');
    },
  });
};

// Users
export const useSuperAdminUsers = (params?: { search?: string; role?: string; status?: string; churchId?: string }) => {
  return useQuery({
    queryKey: ['superadmin', 'users', params],
    queryFn: () => superadminService.getUsers(params),
    staleTime: 30_000,
  });
};

export const useCreateSuperAdminUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: superadminService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'users'] });
      toast.success('User created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || error.message || 'Failed to create user');
    },
  });
};

export const useUpdateSuperAdminUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      superadminService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'users'] });
      toast.success('User updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || error.message || 'Failed to update user');
    },
  });
};

export const useDeleteSuperAdminUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => superadminService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'users'] });
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || error.message || 'Failed to delete user');
    },
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => superadminService.toggleUserStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'users'] });
      toast.success('User status updated');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || error.message || 'Failed to update status');
    },
  });
};

// Analytics
export const useSuperAdminAnalytics = (params?: { timeRange?: string }) => {
  return useQuery({
    queryKey: ['superadmin', 'analytics', params],
    queryFn: () => superadminService.getAnalytics(params),
    staleTime: 60_000,
  });
};

// System Health
export const useSuperAdminSystemHealth = () => {
  return useQuery({
    queryKey: ['superadmin', 'system-health'],
    queryFn: superadminService.getSystemHealth,
    refetchInterval: 30_000,
  });
};

// Settings
export const useSuperAdminSettings = () => {
  return useQuery({
    queryKey: ['superadmin', 'settings'],
    queryFn: superadminService.getSettings,
    staleTime: 60_000,
  });
};

export const useUpdateSuperAdminSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: superadminService.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'settings'] });
      toast.success('Settings saved successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || error.message || 'Failed to save settings');
    },
  });
};

