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
    enabled: true,
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

export function useAdminMemberStatistics(organizationId?: string) {
  return useQuery({
    queryKey: ['member-statistics', organizationId],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/members/statistics`, { params: { organizationId } });
      return response.data;
    },
    enabled: true,
    staleTime: 60_000,
  });
}

export function useAdminAddMember(organizationId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const fullPayload = {
        organizationId: payload.organizationId || organizationId,
        ...payload,
        branchId: payload.branchId || payload.teamId,
      };
      const response = await apiClient.post('/admin/members', fullPayload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-members'] });
      queryClient.invalidateQueries({ queryKey: ['member-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['branchMembers'] });
      queryClient.invalidateQueries({ queryKey: ['branch'] });
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Member added successfully');
    },
    onError: (error: any) => {
      const detail = error?.response?.data?.detail;
      const message =
        (typeof detail === 'string' ? detail : null) ||
        (Array.isArray(detail) && detail[0]?.msg ? detail[0].msg : null) ||
        error?.message ||
        'Failed to add member';
      toast.error(message);
    },
  });
}

export function useAdminUpdateMember(organizationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const userId = payload.userId || payload.id;
      const body = payload.payload !== undefined ? payload.payload : payload;
      const response = await apiClient.put(`/admin/members/${userId}`, body, {
        params: { organizationId },
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['member-details'] });
      queryClient.invalidateQueries({ queryKey: ['organization-members'] });
      queryClient.invalidateQueries({ queryKey: ['member-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['branchMembers'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Member updated successfully');
    },
    onError: (error: any) => {
      const detail = error?.response?.data?.detail;
      const message =
        (typeof detail === 'string' ? detail : null) ||
        (Array.isArray(detail) && detail[0]?.msg ? detail[0].msg : null) ||
        error?.message ||
        'Failed to update member';
      toast.error(message);
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
      queryClient.invalidateQueries({ queryKey: ['organization-members'] });
      queryClient.invalidateQueries({ queryKey: ['member-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['branchMembers'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Member removed successfully');
    },
    onError: (error: any) => {
      const detail = error?.response?.data?.detail;
      const message =
        (typeof detail === 'string' ? detail : null) ||
        (Array.isArray(detail) && detail[0]?.msg ? detail[0].msg : null) ||
        error?.message ||
        'Failed to remove member';
      toast.error(message);
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
