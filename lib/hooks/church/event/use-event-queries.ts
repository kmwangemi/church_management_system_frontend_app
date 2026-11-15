import apiClient from '@/lib/api-client';
import { successToastStyle } from '@/lib/toast-styles';
import type {
  DepartmentAddResponse,
  DepartmentListResponse,
} from '@/lib/types/department';
import type { AddEventPayload } from '@/lib/validations/event';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const registerEvent = async (
  payload: AddEventPayload
): Promise<DepartmentAddResponse> => {
  const { data } = await apiClient.post('/church/events', payload);
  return data;
};

export const useRegisterEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event has been created successfully.', {
        style: successToastStyle,
      });
    },
  });
};

const fetchEvents = async (
  page = 1,
  search = ''
): Promise<DepartmentListResponse> => {
  const params = new URLSearchParams();
  params.set('page', String(page));
  if (search) params.set('search', search);
  const { data } = await apiClient.get(`/church/events?${params.toString()}`);
  return data;
};

export const useFetchEvents = (page = 1, search = '') => {
  return useQuery({
    queryKey: ['events', page, search],
    queryFn: () => fetchEvents(page, search),
  });
};

const deleteEvent = async (id: string | number) => {
  const { data } = await apiClient.delete(`/church/events/${id}`);
  return data;
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event deleted successfully.', {
        style: successToastStyle,
      });
    },
  });
};

const updateEvent = async ({
  id,
  payload,
}: {
  id: string | number;
  payload: Record<string, any>;
}) => {
  const { data } = await apiClient.put(`/church/events/${id}`, payload);
  return data;
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event updated successfully.', {
        style: successToastStyle,
      });
    },
  });
};

export interface EventAttendeeRecord {
  id: string;
  _id: string;
  eventId: string;
  memberId: string;
  memberName: string;
  email?: string;
  phoneNumber?: string;
  status: string;
  checkedInAt?: string;
}

const fetchEventAttendance = async (eventId: string) => {
  const { data } = await apiClient.get(`/church/events/${eventId}/attendance`);
  return data;
};

export const useFetchEventAttendance = (eventId: string | null) => {
  return useQuery({
    queryKey: ['event-attendance', eventId],
    queryFn: () => fetchEventAttendance(eventId as string),
    enabled: Boolean(eventId),
  });
};

const recordEventAttendance = async ({
  eventId,
  memberId,
  status = 'PRESENT',
}: {
  eventId: string;
  memberId: string;
  status?: string;
}) => {
  const { data } = await apiClient.post(
    `/church/events/${eventId}/attendance`,
    { memberId, status }
  );
  return data;
};

export const useRecordEventAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recordEventAttendance,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['event-attendance', variables.eventId],
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Member attendance recorded.', {
        style: successToastStyle,
      });
    },
  });
};

const removeEventAttendance = async ({
  eventId,
  attendanceId,
}: {
  eventId: string;
  attendanceId: string;
}) => {
  const { data } = await apiClient.delete(
    `/church/events/${eventId}/attendance/${attendanceId}`
  );
  return data;
};

export const useRemoveEventAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeEventAttendance,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['event-attendance', variables.eventId],
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Attendee removed from event.', {
        style: successToastStyle,
      });
    },
  });
};

const sendEventReminder = async ({
  eventId,
  channel = 'all',
  message,
}: {
  eventId: string;
  channel?: string;
  message?: string;
}) => {
  const { data } = await apiClient.post(`/church/events/${eventId}/reminders`, {
    channel,
    message,
  });
  return data;
};

export const useSendEventReminder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendEventReminder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success(data?.message || 'Event reminders sent successfully.', {
        style: successToastStyle,
      });
    },
  });
};
