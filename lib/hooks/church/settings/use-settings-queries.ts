import apiClient from '@/lib/api-client';
import { successToastStyle } from '@/lib/toast-styles';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface ChurchSettingsData {
  churchId: string;
  churchName: string;
  slug: string;
  logo: string;
  denomination: string;
  description: string;
  address: string;
  addressDetails: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone: string;
  email: string;
  website: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  autoBackup: boolean;
  maintenanceMode: boolean;
  publicRegistration: boolean;
  requireApproval: boolean;
  lastBackupAt?: string | null;
  updatedAt?: string | null;
}

export interface ChurchAdminUser {
  id: string;
  memberId: string;
  userId: string | null;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  avatar: string | null;
  role: string;
  roleLabel: string;
  roles: string[];
  position: string;
  branchId: string;
  branchName: string;
  accessLevel: string;
  status: 'Active' | 'Inactive';
  memberStatus: string;
  accountStatus: string;
  hasLogin: boolean;
  lastLogin: string | null;
  permissions: string[];
  permissionCodes: string[];
  createdAt?: string | null;
}

export interface AssignedRoleMember {
  id: string;
  name: string;
  email: string;
  branchName: string;
}

export interface ChurchRoleItem {
  id: string;
  name: string;
  displayName: string;
  description: string;
  churchId: string | null;
  isSystem: boolean;
  isBuiltIn: boolean;
  isCustomized: boolean;
  isLocked: boolean;
  userCount: number;
  assignedMembers: AssignedRoleMember[];
  permissions: string[];
  permissionCodes: string[];
  permissionLabels: string[];
}

export interface ChurchPermissionItem {
  id: string;
  name: string;
  code: string;
  description: string;
  label: string;
  category: string;
}

/* ========== CHURCH SETTINGS ========== */
export const useFetchChurchSettings = () => {
  return useQuery<ChurchSettingsData>({
    queryKey: ['church-settings'],
    queryFn: async () => {
      const { data } = await apiClient.get('/church/settings');
      return data.settings || data;
    },
  });
};

export const useUpdateChurchSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<ChurchSettingsData>) => {
      const { data } = await apiClient.put('/church/settings', payload);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['church-settings'] });
      toast.success(data?.message || 'Church settings saved successfully.', {
        style: successToastStyle,
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          'Failed to save church settings.'
      );
    },
  });
};

export const useBackupChurchData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post('/church/settings/backup');
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['church-settings'] });
      if (data?.backup) {
        const blob = new Blob([JSON.stringify(data.backup, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const dateStr = new Date().toISOString().split('T')[0];
        const slug = data.backup?.church?.slug || 'church';
        link.href = url;
        link.download = `${slug}-backup-${dateStr}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      toast.success(
        data?.message || 'Backup generated and downloaded successfully.',
        { style: successToastStyle }
      );
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.detail || 'Failed to generate church backup.'
      );
    },
  });
};

/* ========== CHURCH ADMINS ========== */
export const useFetchChurchAdmins = (search = '') => {
  return useQuery<{ admins: ChurchAdminUser[]; total: number }>({
    queryKey: ['church-admins', search],
    queryFn: async () => {
      const params = search ? `?search=${encodeURIComponent(search)}` : '';
      const { data } = await apiClient.get(`/church/admins${params}`);
      return {
        admins: data.admins || data.users || [],
        total: data.total ?? 0,
      };
    },
  });
};

export const useCreateChurchAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, any>) => {
      const { data } = await apiClient.post('/church/admins', payload);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['church-admins'] });
      queryClient.invalidateQueries({ queryKey: ['church-roles'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(data?.message || 'Administrator added successfully.', {
        style: successToastStyle,
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          'Failed to create administrator.'
      );
    },
  });
};

export const useUpdateChurchAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      memberId,
      payload,
    }: {
      memberId: string;
      payload: Record<string, any>;
    }) => {
      const { data } = await apiClient.put(
        `/church/admins/${memberId}`,
        payload
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['church-admins'] });
      queryClient.invalidateQueries({ queryKey: ['church-roles'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(data?.message || 'Administrator updated successfully.', {
        style: successToastStyle,
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.detail || 'Failed to update administrator.'
      );
    },
  });
};

export const useResetChurchAdminPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      memberId,
      password,
    }: {
      memberId: string;
      password: string;
    }) => {
      const { data } = await apiClient.post(
        `/church/admins/${memberId}/reset-password`,
        { password }
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['church-admins'] });
      toast.success(data?.message || 'Password reset successfully.', {
        style: successToastStyle,
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.detail || 'Failed to reset administrator password.'
      );
    },
  });
};

export const useRemoveChurchAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      memberId,
      mode = 'demote',
    }: {
      memberId: string;
      mode?: 'demote' | 'remove';
    }) => {
      const { data } = await apiClient.delete(
        `/church/admins/${memberId}?mode=${mode}`
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['church-admins'] });
      queryClient.invalidateQueries({ queryKey: ['church-roles'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(data?.message || 'Administrator updated successfully.', {
        style: successToastStyle,
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.detail || 'Failed to remove administrator.'
      );
    },
  });
};

/* ========== CHURCH ROLES & PERMISSIONS ========== */
export const useFetchChurchRoles = () => {
  return useQuery<{ roles: ChurchRoleItem[] }>({
    queryKey: ['church-roles'],
    queryFn: async () => {
      const { data } = await apiClient.get('/church/roles');
      return { roles: data.roles || [] };
    },
  });
};

export const useFetchChurchPermissions = () => {
  return useQuery<{ permissions: ChurchPermissionItem[] }>({
    queryKey: ['church-permissions'],
    queryFn: async () => {
      const { data } = await apiClient.get('/church/permissions');
      return { permissions: data.permissions || [] };
    },
  });
};

export const useCreateChurchRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      name: string;
      description?: string;
      permissions: string[];
    }) => {
      const { data } = await apiClient.post('/church/roles', payload);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['church-roles'] });
      queryClient.invalidateQueries({ queryKey: ['church-admins'] });
      toast.success(data?.message || 'Role created successfully.', {
        style: successToastStyle,
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.detail || 'Failed to create role.'
      );
    },
  });
};

export const useUpdateChurchRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      roleId,
      payload,
    }: {
      roleId: string;
      payload: {
        name?: string;
        description?: string;
        permissionCodes?: string[];
      };
    }) => {
      const { data } = await apiClient.put(`/church/roles/${roleId}`, payload);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['church-roles'] });
      queryClient.invalidateQueries({ queryKey: ['church-admins'] });
      toast.success(data?.message || 'Role updated successfully.', {
        style: successToastStyle,
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.detail || 'Failed to update role.'
      );
    },
  });
};

export const useDeleteChurchRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (roleId: string) => {
      const { data } = await apiClient.delete(`/church/roles/${roleId}`);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['church-roles'] });
      queryClient.invalidateQueries({ queryKey: ['church-admins'] });
      toast.success(data?.message || 'Role removed successfully.', {
        style: successToastStyle,
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.detail || 'Failed to delete role.'
      );
    },
  });
};

export const useAssignChurchRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      roleId,
      memberIds,
      mode = 'set',
    }: {
      roleId: string;
      memberIds: string[];
      mode?: 'set' | 'add' | 'remove';
    }) => {
      const { data } = await apiClient.post(`/church/roles/${roleId}/assign`, {
        memberIds,
        mode,
      });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['church-roles'] });
      queryClient.invalidateQueries({ queryKey: ['church-admins'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(data?.message || 'Role assignments updated.', {
        style: successToastStyle,
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.detail || 'Failed to update role assignments.'
      );
    },
  });
};

