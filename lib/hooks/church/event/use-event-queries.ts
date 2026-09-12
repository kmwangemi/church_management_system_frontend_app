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
  const { data } = await apiClient.get(`/church/events?page=${page}&search=${search}`);
  return data;
};

export const useFetchEvents = (page = 1, search = '') => {
  return useQuery({
    queryKey: ['events', page, search],
    queryFn: () => fetchEvents(page, search),
  });
};
