'use client';

import apiClient from '@/lib/api-client';
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';

export type AdminGetTeamsParams = any;
export type AdminCreateTeamParams = any;
export type AdminUpdateTeamParams = any;

export const teamKeys = {
  all: ['teams'] as const,
  lists: () => [...teamKeys.all, 'list'] as const,
  list: (params: AdminGetTeamsParams) => [...teamKeys.lists(), params] as const,
  details: () => [...teamKeys.all, 'detail'] as const,
  detail: (teamId: string, organizationId: string) =>
    [...teamKeys.details(), teamId, organizationId] as const,
  statistics: (organizationId: string) =>
    [...teamKeys.all, 'statistics', organizationId] as const,
};

export function useAdminTeams(params: AdminGetTeamsParams) {
  return useQuery({
    queryKey: teamKeys.list(params),
    queryFn: async () => {
      const response = await apiClient.get('/admin/teams', { params });
      return response.data;
    },
    enabled: !!params.organizationId,
    staleTime: 30_000,
    retry: 2,
  });
}

export function useAdminTeam(
  teamId: string,
  organizationId: string,
  options?: Partial<UseQueryOptions>
) {
  return useQuery({
    queryKey: teamKeys.detail(teamId, organizationId),
    queryFn: async () => {
      const response = await apiClient.get(`/admin/teams/${teamId}`, { params: { organizationId } });
      return response.data;
    },
    enabled: !!teamId && !!organizationId,
    staleTime: 60_000,
    retry: 2,
    ...options,
  });
}

export function useAdminTeamStatistics(organizationId: string) {
  return useQuery({
    queryKey: teamKeys.statistics(organizationId),
    queryFn: async () => {
      const response = await apiClient.get('/admin/teams/statistics', { params: { organizationId } });
      return response.data;
    },
    enabled: !!organizationId,
    staleTime: 60_000,
    retry: 2,
  });
}

export function useAdminCreateTeam(organizationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: AdminCreateTeamParams) => {
      const response = await apiClient.post('/admin/teams', params);
      return response.data;
    },
    onSuccess: (response) => {
      toast.success('Team created successfully');
      queryClient.invalidateQueries({
        queryKey: teamKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: teamKeys.statistics(organizationId),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create team');
    },
  });
}

export function useAdminUpdateTeam(organizationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: AdminUpdateTeamParams) => {
      const response = await apiClient.put(`/admin/teams/${params.teamId}`, params);
      return response.data;
    },
    onSuccess: (response, variables) => {
      toast.success('Team updated successfully');
      queryClient.invalidateQueries({
        queryKey: teamKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: teamKeys.statistics(organizationId),
      });
      queryClient.invalidateQueries({
        queryKey: teamKeys.detail(variables.teamId, organizationId),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update team');
    },
  });
}

export function useAdminDeleteTeam(organizationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (teamId: string) => {
      const response = await apiClient.delete(`/admin/teams/${teamId}`, { params: { organizationId } });
      return response.data;
    },
    onSuccess: (response, teamId) => {
      toast.success('Team deleted successfully');
      queryClient.invalidateQueries({
        queryKey: teamKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: teamKeys.statistics(organizationId),
      });
      queryClient.removeQueries({
        queryKey: teamKeys.detail(teamId, organizationId),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete team');
    },
  });
}

export function useAdminToggleTeamStatus(organizationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (teamId: string) => {
      const response = await apiClient.patch(`/admin/teams/${teamId}/status`, { organizationId });
      return response.data;
    },
    onSuccess: (response, teamId) => {
      toast.success('Team status updated successfully');
      queryClient.invalidateQueries({
        queryKey: teamKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: teamKeys.statistics(organizationId),
      });
      queryClient.invalidateQueries({
        queryKey: teamKeys.detail(teamId, organizationId),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update team status');
    },
  });
}

export function useAdminPrefetchTeam() {
  const queryClient = useQueryClient();
  return {
    prefetch: (teamId: string, organizationId: string) => {
      return queryClient.prefetchQuery({
        queryKey: teamKeys.detail(teamId, organizationId),
        queryFn: async () => {
          const response = await apiClient.get(`/admin/teams/${teamId}`, { params: { organizationId } });
          return response.data;
        },
        staleTime: 60_000,
      });
    },
  };
}

export function useAdminInvalidateTeams() {
  const queryClient = useQueryClient();
  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: teamKeys.all }),
    invalidateLists: (organizationId?: string) => queryClient.invalidateQueries({ queryKey: teamKeys.lists() }),
    invalidateTeam: (teamId: string, organizationId: string) => queryClient.invalidateQueries({ queryKey: teamKeys.detail(teamId, organizationId) }),
    invalidateStatistics: (organizationId: string) => queryClient.invalidateQueries({ queryKey: teamKeys.statistics(organizationId) }),
  };
}

export function useAdminOptimisticTeamUpdate(organizationId: string) {
  const queryClient = useQueryClient();
  return {
    updateTeamOptimistically: (teamId: string, updateFn: (old: any) => any) => {
      const queryKey = teamKeys.detail(teamId, organizationId);
      queryClient.cancelQueries({ queryKey });
      const previousTeam = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, updateFn);
      return {
        previousTeam,
        rollback: () => queryClient.setQueryData(queryKey, previousTeam),
      };
    },
  };
}

export function useAdminTeamFilters(initialParams: Partial<AdminGetTeamsParams> = {}) {
  const [filters, setFilters] = React.useState<Partial<AdminGetTeamsParams>>(initialParams);
  const updateFilter = <K extends keyof AdminGetTeamsParams>(key: K, value: AdminGetTeamsParams[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  const resetFilters = () => setFilters(initialParams);
  return { filters, updateFilter, resetFilters, setFilters };
}

export function useAdminBulkTeamOperations(organizationId: string) {
  const queryClient = useQueryClient();
  const toggleStatus = useAdminToggleTeamStatus(organizationId);
  const deleteTeamMutation = useAdminDeleteTeam(organizationId);
  return {
    bulkToggleStatus: async (teamIds: string[]) => {
      const results = await Promise.allSettled(teamIds.map((id) => toggleStatus.mutateAsync(id)));
      const successful = results.filter((r) => r.status === 'fulfilled').length;
      if (successful > 0) toast.success(`${successful} team(s) status updated successfully`);
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
    },
    bulkDelete: async (teamIds: string[]) => {
      const results = await Promise.allSettled(teamIds.map((id) => deleteTeamMutation.mutateAsync(id)));
      const successful = results.filter((r) => r.status === 'fulfilled').length;
      if (successful > 0) toast.success(`${successful} team(s) deleted successfully`);
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
    },
  };
}

export function useAdminTeamCache() {
  const queryClient = useQueryClient();
  return {
    getTeamFromCache: (teamId: string, organizationId: string) => queryClient.getQueryData(teamKeys.detail(teamId, organizationId)),
    setTeamInCache: (teamId: string, organizationId: string, data: any) => queryClient.setQueryData(teamKeys.detail(teamId, organizationId), data),
    removeTeamFromCache: (teamId: string, organizationId: string) => queryClient.removeQueries({ queryKey: teamKeys.detail(teamId, organizationId) }),
    clearAllTeamCache: () => queryClient.removeQueries({ queryKey: teamKeys.all }),
  };
}

export type TeamListFilters = Partial<AdminGetTeamsParams>;

export interface UseAdminTeamFiltersReturn {
  filters: TeamListFilters;
  updateFilter: <K extends keyof AdminGetTeamsParams>(key: K, value: AdminGetTeamsParams[K]) => void;
  resetFilters: () => void;
  setFilters: React.Dispatch<React.SetStateAction<TeamListFilters>>;
}
