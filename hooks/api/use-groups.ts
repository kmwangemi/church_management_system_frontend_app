import { groupsService } from '@/lib/api/groups';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGroups = () => {
  return useQuery({
    queryKey: ['groups'],
    queryFn: groupsService.getGroups,
  });
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupData: any) => groupsService.createGroup(groupData),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId: string) => groupsService.deleteGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
};
