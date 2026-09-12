import apiClient from '@/lib/api-client';
import { successToastStyle } from '@/lib/toast-styles';
import type {
  DepartmentAddResponse,
  DepartmentListResponse,
} from '@/lib/types/department';
import type { AddAnnouncementPayload } from '@/lib/validations/announcement';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const registerAnnouncement = async (
  payload: AddAnnouncementPayload
): Promise<DepartmentAddResponse> => {
  const { data } = await apiClient.post('/church/announcements', payload);
  return data;
};

export const useRegisterAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast.success('Announcement has been created successfully.', {
        style: successToastStyle,
      });
    },
  });
};

const fetchAnnouncements = async (
  page = 1,
  search = ''
): Promise<DepartmentListResponse> => {
  const { data } = await apiClient.get(
    `/church/announcements?page=${page}&search=${search}`
  );
  return data;
};

export const useFetchAnnouncements = (page = 1, search = '') => {
  return useQuery({
    queryKey: ['announcements', page, search],
    queryFn: () => fetchAnnouncements(page, search),
  });
};
