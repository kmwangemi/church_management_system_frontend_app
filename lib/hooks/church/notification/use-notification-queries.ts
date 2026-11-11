import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/lib/store/use-auth-store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface ChurchNotificationItem {
  id: string;
  type: 'urgent' | 'warning' | 'success' | 'info' | string;
  title: string;
  message: string;
  time: string;
  timestamp: string;
  read: boolean;
  category: string;
  actionUrl?: string;
}

export interface ChurchNotificationStats {
  total: number;
  unread: number;
  urgent: number;
  today: number;
}

export interface ChurchNotificationsResponse {
  notifications: ChurchNotificationItem[];
  stats: ChurchNotificationStats;
}

export interface AdminSelfProfile {
  id: string;
  memberId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePictureUrl: string;
  position: string;
  bio: string;
  role: string;
  roles: string[];
  churchId: string;
  churchName: string;
  branchId: string;
  branchName: string;
}

export const useFetchChurchNotifications = (params?: {
  filter?: string;
  category?: string;
  search?: string;
}) => {
  return useQuery<ChurchNotificationsResponse>({
    queryKey: ['church-notifications', params?.filter || 'all', params?.category || 'all', params?.search || ''],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/notifications', {
        params: {
          filter: params?.filter && params.filter !== 'all' ? params.filter : undefined,
          category: params?.category && params.category !== 'all' ? params.category : undefined,
          search: params?.search?.trim() || undefined,
        },
      });
      return data;
    },
    staleTime: 30 * 1000,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, read = true }: { id: string; read?: boolean }) => {
      const { data } = await apiClient.post(`/admin/notifications/${encodeURIComponent(id)}/read`, {
        read,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['church-notifications'] });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post('/admin/notifications/mark-all-read');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['church-notifications'] });
      toast.success('All notifications marked as read');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to mark notifications as read');
    },
  });
};

export const useDismissNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/admin/notifications/${encodeURIComponent(id)}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['church-notifications'] });
      toast.success('Notification dismissed');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to dismiss notification');
    },
  });
};

export const useFetchAdminSelfProfile = (enabled = true) => {
  return useQuery<AdminSelfProfile>({
    queryKey: ['admin-self-profile'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/profile');
      return data;
    },
    enabled,
    staleTime: 60 * 1000,
  });
};

export const useUpdateAdminSelfProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      profilePictureUrl?: string;
      position?: string;
      bio?: string;
      currentPassword?: string;
      newPassword?: string;
    }) => {
      const { data } = await apiClient.put('/admin/profile', payload);
      return data as AdminSelfProfile;
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['admin-self-profile'] });
      queryClient.invalidateQueries({ queryKey: ['authStatus'] });
      const currentUser = useAuthStore.getState().user;
      if (currentUser && updated) {
        useAuthStore.getState().setUser({
          ...currentUser,
          firstName: updated.firstName,
          lastName: updated.lastName,
          fullName: updated.fullName,
          name: updated.fullName,
          phoneNumber: updated.phoneNumber,
          profilePictureUrl: updated.profilePictureUrl,
          image: updated.profilePictureUrl,
          churchName: updated.churchName || currentUser.churchName,
        } as any);
      }
      toast.success('Profile updated successfully');
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          'Failed to update profile'
      );
    },
  });
};
