// hooks/use-church-management.ts
'use client';

import apiClient from '@/lib/api-client';
import { successToastStyle } from '@/lib/toast-styles';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateChurchPayload } from '@/lib/validations/church';

// ============================================
// QUERY HOOKS
// ============================================

export function useAllChurches() {
  return useQuery({
    queryKey: ['churches', 'all'],
    queryFn: async () => {
      const response = await apiClient.get('/superadmin/churches');
      return response.data;
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useChurchStatistics() {
  return useQuery({
    queryKey: ['churches', 'statistics'],
    queryFn: async () => {
      const response = await apiClient.get('/superadmin/churches/statistics');
      return response.data;
    },
    staleTime: 60_000,
  });
}

export function useChurchDetails(organizationId: string) {
  return useQuery({
    queryKey: ['church-details', organizationId],
    queryFn: async () => {
      const response = await apiClient.get(`/superadmin/churches/${organizationId}`);
      return response.data;
    },
    enabled: !!organizationId,
    staleTime: 60_000,
  });
}

// ============================================
// MUTATION HOOKS
// ============================================

export function useCreateChurch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateChurchPayload) => {
      const response = await apiClient.post('/superadmin/churches', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['churches'] });
      toast.success('Church registered successfully! 🎉', {
        description: 'Your 30-day trial has started.',
        style: successToastStyle,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create church');
    },
  });
}

export function useUpdateChurch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await apiClient.put(`/superadmin/churches/${payload.organizationId}`, payload);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['church-details', variables.organizationId] });
      queryClient.invalidateQueries({ queryKey: ['churches', 'all'] });
      toast.success('Church updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update church');
    },
  });
}

export function useSuspendChurch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (organizationId: string) => {
      const response = await apiClient.post(`/superadmin/churches/${organizationId}/suspend`);
      return response.data;
    },
    onSuccess: (data, organizationId) => {
      queryClient.invalidateQueries({ queryKey: ['church-details', organizationId] });
      queryClient.invalidateQueries({ queryKey: ['churches', 'all'] });
      toast.success('Church suspended successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to suspend church');
    },
  });
}

export function useActivateChurch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (organizationId: string) => {
      const response = await apiClient.post(`/superadmin/churches/${organizationId}/activate`);
      return response.data;
    },
    onSuccess: (data, organizationId) => {
      queryClient.invalidateQueries({ queryKey: ['church-details', organizationId] });
      queryClient.invalidateQueries({ queryKey: ['churches', 'all'] });
      toast.success('Church activated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to activate church');
    },
  });
}

export function useDeleteChurch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (organizationId: string) => {
      const response = await apiClient.delete(`/superadmin/churches/${organizationId}`);
      return response.data;
    },
    onSuccess: (data, organizationId) => {
      queryClient.invalidateQueries({ queryKey: ['church-details', organizationId] });
      queryClient.invalidateQueries({ queryKey: ['churches', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['churches', 'statistics'] });
      toast.success('Church deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete church');
    },
  });
}

export function useChurchActions() {
  const suspend = useSuspendChurch();
  const activate = useActivateChurch();
  const deleteChurch = useDeleteChurch();
  const update = useUpdateChurch();
  return {
    suspend,
    activate,
    delete: deleteChurch,
    update,
    isLoading:
      suspend.isPending ||
      activate.isPending ||
      deleteChurch.isPending ||
      update.isPending,
  };
}

export type ChurchDetailsData = any;
export type AllChurchesData = any;
export type ChurchStatistics = any;
