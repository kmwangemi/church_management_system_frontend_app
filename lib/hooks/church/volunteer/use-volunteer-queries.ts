import apiClient from '@/lib/api-client';
import { successToastStyle } from '@/lib/toast-styles';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface VolunteerItem {
  id: string;
  _id: string;
  memberId: string;
  name: string;
  email: string;
  phone: string;
  photoUrl?: string | null;
  skills: string[];
  availability: string[];
  currentRoles: string[];
  roleIds: string[];
  joinDate: string;
  status: 'Active' | 'Inactive' | string;
  hoursThisMonth: number;
  notes?: string;
}

export interface VolunteerPayload {
  memberId?: string;
  volunteerName?: string;
  volunteerEmail?: string;
  volunteerPhone?: string;
  role?: string;
  roleIds?: string[];
  skills?: string[];
  availability?: string[];
  hoursContributed?: number;
  hoursThisMonth?: number;
  notes?: string;
  status?: string;
}

export interface VolunteerUpdatePayload {
  id: string;
  volunteerName?: string;
  volunteerEmail?: string;
  volunteerPhone?: string;
  skills?: string[];
  availability?: string[];
  roleIds?: string[];
  hoursContributed?: number;
  hoursThisMonth?: number;
  notes?: string;
  status?: string;
}

export interface VolunteerRoleItem {
  id: string;
  _id: string;
  title: string;
  role: string;
  department: string;
  description: string;
  requiredSkills: string[];
  timeCommitment: string;
  currentVolunteers: number;
  neededVolunteers: number;
  maxVolunteers: number;
  assignedVolunteers: string[];
  assignedVolunteerIds: string[];
  priority: 'High' | 'Medium' | 'Low' | string;
  isActive: boolean;
}

export interface VolunteerRolePayload {
  role?: string;
  title?: string;
  department?: string;
  description?: string;
  requiredSkills?: string[];
  timeCommitment?: string;
  neededVolunteers?: number;
  priority?: string;
  isActive?: boolean;
}

export interface VolunteerRoleUpdatePayload extends VolunteerRolePayload {
  id: string;
}

export interface VolunteerTaskItem {
  id: string;
  _id: string;
  title: string;
  description: string;
  department: string;
  date: string;
  time: string;
  assignedVolunteers: string[];
  assignedVolunteerIds: string[];
  requiredVolunteers: number;
  status: 'Scheduled' | 'Needs Volunteers' | 'Open' | 'Completed' | string;
  priority: 'High' | 'Medium' | 'Low' | string;
}

export interface VolunteerTaskPayload {
  title: string;
  description?: string;
  department?: string;
  date?: string;
  time?: string;
  requiredVolunteers?: number;
  priority?: string;
  status?: string;
  assignedVolunteerIds?: string[];
}

export interface VolunteerTaskUpdatePayload extends Partial<VolunteerTaskPayload> {
  id: string;
}

export interface VolunteerStatsResponse {
  totalVolunteers: number;
  newVolunteersThisMonth: number;
  activeVolunteers: number;
  activeRate: number;
  retentionRate: number;
  hoursThisMonth: number;
  avgHoursPerVolunteer: number;
  openPositions: number;
  rolesNeedingVolunteers: number;
  totalRoles: number;
  totalTasks: number;
  upcomingTasksCount: number;
  topVolunteers: VolunteerItem[];
}

const invalidateAllVolunteerQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ['volunteers'] });
  queryClient.invalidateQueries({ queryKey: ['volunteer-roles'] });
  queryClient.invalidateQueries({ queryKey: ['volunteer-tasks'] });
  queryClient.invalidateQueries({ queryKey: ['volunteer-stats'] });
};

// Volunteers
const fetchVolunteers = async (page = 1, search = '', status = 'all') => {
  const params = new URLSearchParams({
    page: String(page),
    search,
  });
  if (status && status !== 'all') {
    params.set('status', status);
  }
  const { data } = await apiClient.get(`/church/volunteers?${params.toString()}`);
  return data;
};

export const useFetchVolunteers = (page = 1, search = '', status = 'all') => {
  return useQuery({
    queryKey: ['volunteers', page, search, status],
    queryFn: () => fetchVolunteers(page, search, status),
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
      invalidateAllVolunteerQueries(queryClient);
      toast.success('Volunteer registered successfully.', {
        style: successToastStyle,
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to register volunteer.');
    },
  });
};

const updateVolunteer = async ({ id, ...payload }: VolunteerUpdatePayload) => {
  const { data } = await apiClient.patch(`/church/volunteers/${id}`, payload);
  return data;
};

export const useUpdateVolunteer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateVolunteer,
    onSuccess: () => {
      invalidateAllVolunteerQueries(queryClient);
      toast.success('Volunteer updated successfully.', {
        style: successToastStyle,
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update volunteer.');
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
      invalidateAllVolunteerQueries(queryClient);
      toast.success('Volunteer deleted successfully.', {
        style: successToastStyle,
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to delete volunteer.');
    },
  });
};

// Volunteer Roles
const fetchVolunteerRoles = async (page = 1, search = '') => {
  const { data } = await apiClient.get(
    `/church/volunteers/roles?page=${page}&search=${encodeURIComponent(search)}`
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
      invalidateAllVolunteerQueries(queryClient);
      toast.success('Volunteer role created successfully.', {
        style: successToastStyle,
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to create volunteer role.');
    },
  });
};

const updateVolunteerRole = async ({ id, ...payload }: VolunteerRoleUpdatePayload) => {
  const { data } = await apiClient.patch(`/church/volunteers/roles/${id}`, payload);
  return data;
};

export const useUpdateVolunteerRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateVolunteerRole,
    onSuccess: () => {
      invalidateAllVolunteerQueries(queryClient);
      toast.success('Volunteer role updated successfully.', {
        style: successToastStyle,
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update volunteer role.');
    },
  });
};

const assignVolunteersToRole = async ({
  roleId,
  volunteerIds,
}: {
  roleId: string;
  volunteerIds: string[];
}) => {
  const { data } = await apiClient.post(`/church/volunteers/roles/${roleId}/assign`, {
    volunteerIds,
  });
  return data;
};

export const useAssignVolunteersToRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignVolunteersToRole,
    onSuccess: () => {
      invalidateAllVolunteerQueries(queryClient);
      toast.success('Volunteer role assignments updated.', {
        style: successToastStyle,
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to assign volunteers to role.');
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
      invalidateAllVolunteerQueries(queryClient);
      toast.success('Volunteer role deleted successfully.', {
        style: successToastStyle,
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to delete volunteer role.');
    },
  });
};

// Volunteer Tasks & Scheduling
const fetchVolunteerTasks = async (search = '', status = 'all') => {
  const params = new URLSearchParams({ search });
  if (status && status !== 'all') {
    params.set('status', status);
  }
  const { data } = await apiClient.get(`/church/volunteers/tasks?${params.toString()}`);
  return data;
};

export const useFetchVolunteerTasks = (search = '', status = 'all') => {
  return useQuery({
    queryKey: ['volunteer-tasks', search, status],
    queryFn: () => fetchVolunteerTasks(search, status),
  });
};

const createVolunteerTask = async (payload: VolunteerTaskPayload) => {
  const { data } = await apiClient.post('/church/volunteers/tasks', payload);
  return data;
};

export const useCreateVolunteerTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createVolunteerTask,
    onSuccess: () => {
      invalidateAllVolunteerQueries(queryClient);
      toast.success('Volunteer task scheduled successfully.', {
        style: successToastStyle,
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to schedule volunteer task.');
    },
  });
};

const updateVolunteerTask = async ({ id, ...payload }: VolunteerTaskUpdatePayload) => {
  const { data } = await apiClient.patch(`/church/volunteers/tasks/${id}`, payload);
  return data;
};

export const useUpdateVolunteerTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateVolunteerTask,
    onSuccess: () => {
      invalidateAllVolunteerQueries(queryClient);
      toast.success('Volunteer task updated successfully.', {
        style: successToastStyle,
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update volunteer task.');
    },
  });
};

const assignVolunteersToTask = async ({
  taskId,
  volunteerIds,
}: {
  taskId: string;
  volunteerIds: string[];
}) => {
  const { data } = await apiClient.post(`/church/volunteers/tasks/${taskId}/assign`, {
    volunteerIds,
  });
  return data;
};

export const useAssignVolunteersToTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignVolunteersToTask,
    onSuccess: () => {
      invalidateAllVolunteerQueries(queryClient);
      toast.success('Volunteers assigned to task successfully.', {
        style: successToastStyle,
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to assign volunteers to task.');
    },
  });
};

const deleteVolunteerTask = async (id: string | number) => {
  const { data } = await apiClient.delete(`/church/volunteers/tasks/${id}`);
  return data;
};

export const useDeleteVolunteerTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteVolunteerTask,
    onSuccess: () => {
      invalidateAllVolunteerQueries(queryClient);
      toast.success('Volunteer task deleted successfully.', {
        style: successToastStyle,
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to delete volunteer task.');
    },
  });
};

// Volunteer Stats
const fetchVolunteerStats = async (): Promise<VolunteerStatsResponse> => {
  const { data } = await apiClient.get('/church/volunteers/stats');
  return data?.data || data;
};

export const useFetchVolunteerStats = () => {
  return useQuery({
    queryKey: ['volunteer-stats'],
    queryFn: fetchVolunteerStats,
  });
};
