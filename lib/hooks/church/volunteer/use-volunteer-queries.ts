import apiClient from '@/lib/api-client';
import { successToastStyle } from '@/lib/toast-styles';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface VolunteerPayload {
  memberId?: string;
  volunteerName?: string;
  volunteerEmail?: string;
  volunteerPhone?: string;
  role?: string;
  skills?: string[];
  availability?: string[];
  hoursContributed?: number;
}

export interface VolunteerRolePayload {
  role: string;
  department?: string;
  description?: string;
  requiredSkills?: string[];
  timeCommitment?: string;
  neededVolunteers?: number;
  priority?: string;
  isActive?: boolean;
}

// Volunteers
const fetchVolunteers = async (page = 1, search = '') => {
  const { data } = await apiClient.get(
    `/church/volunteers?page=${page}&search=${search}`
  );
  return data;
};

export const useFetchVolunteers = (page = 1, search = '') => {
  return useQuery({
    queryKey: ['volunteers', page, search],
    queryFn: () => fetchVolunteers(page, search),
  });
};

const registerVolunteer = async (payload: VolunteerPayload) => {
  const { data } = await apiClient.post('/church/volunteers', payload);
  return data;
};

export const useRegisterVolunteer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerVolunteer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteers'] });
      toast.success('Volunteer registered successfully.', {
        style: successToastStyle,
      });
    },
  });
};

const deleteVolunteer = async (id: string | number) => {
  const { data } = await apiClient.delete(`/church/volunteers/${id}`);
  return data;
};

export const useDeleteVolunteer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteVolunteer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteers'] });
      toast.success('Volunteer deleted successfully.', {
        style: successToastStyle,
      });
    },
  });
};

// Volunteer Roles
const fetchVolunteerRoles = async (page = 1, search = '') => {
  const { data } = await apiClient.get(
    `/church/volunteers/roles?page=${page}&search=${search}`
  );
  return data;
};

export const useFetchVolunteerRoles = (page = 1, search = '') => {
  return useQuery({
    queryKey: ['volunteer-roles', page, search],
    queryFn: () => fetchVolunteerRoles(page, search),
  });
};

const registerVolunteerRole = async (payload: VolunteerRolePayload) => {
  const { data } = await apiClient.post('/church/volunteers/roles', payload);
  return data;
};

export const useRegisterVolunteerRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerVolunteerRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteer-roles'] });
      toast.success('Volunteer role created successfully.', {
        style: successToastStyle,
      });
    },
  });
};

const deleteVolunteerRole = async (id: string | number) => {
  const { data } = await apiClient.delete(`/church/volunteers/roles/${id}`);
  return data;
};

export const useDeleteVolunteerRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteVolunteerRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteer-roles'] });
      toast.success('Volunteer role deleted successfully.', {
        style: successToastStyle,
      });
    },
  });
};

