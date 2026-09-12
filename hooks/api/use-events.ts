import { eventsService } from '@/lib/api/events';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: eventsService.getEvents,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => eventsService.createEvent(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => eventsService.deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};
