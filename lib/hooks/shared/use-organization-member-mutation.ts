'use client';

import apiClient from '@/lib/api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export type AdminGetMembersParams = any;

export function useAdminOrganizationMembers(params: AdminGetMembersParams) {
  return useQuery({
    queryKey: ['organization-members', params],
    queryFn: async () => {
      const response = await apiClient.get('/admin/members', { params });
      return response.data;
    },
    enabled: !!params?.organizationId,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useAdminMemberDetails(userId: string, organizationId?: string) {
  return useQuery({
    queryKey: ['member-details', userId, organizationId],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/members/${userId}`, { params: { organizationId } });
      return response.data;
    },
    enabled: !!userId,
    staleTime: 60_000,
  });
}

export function useAdminMemberStatistics(organizationId: string) {
  return useQuery({
    queryKey: ['member-statistics', organizationId],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/members/statistics`, { params: { organizationId } });
      return response.data;
    },
    enabled: !!organizationId,
    staleTime: 60_000,
  });
}

export function useAdminAddMember(organizationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await apiClient.post('/admin/members', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-members', { organizationId }] });
      queryClient.invalidateQueries({ queryKey: ['member-statistics', organizationId] });
      toast.success('Member added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add member');
    },
  });
}

export function useAdminUpdateMember(organizationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await apiClient.put(`/admin/members/${payload.userId}`, payload);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['member-details', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['organization-members', { organizationId }] });
      toast.success('Member updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update member');
    },
  });
}

export function useAdminRemoveMember(organizationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const response = await apiClient.delete(`/admin/members/${userId}`, { params: { organizationId } });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-members', { organizationId }] });
      queryClient.invalidateQueries({ queryKey: ['member-statistics', organizationId] });
      toast.success('Member removed successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove member');
    },
  });
}

export function useAdminUpdateMemberRole(organizationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: any }) => {
      const response = await apiClient.patch(`/admin/members/${userId}/role`, { newRole, organizationId });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['member-details', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['organization-members', { organizationId }] });
      queryClient.invalidateQueries({ queryKey: ['member-statistics', organizationId] });
      toast.success('Member role updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update role');
    },
  });
}
