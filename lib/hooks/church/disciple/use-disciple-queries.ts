import apiClient from '@/lib/api-client';
import { successToastStyle } from '@/lib/toast-styles';
import type {
  DiscipleFilters,
  DiscipleResponse,
  DisciplesResponse,
} from '@/lib/types/disciple';
import type { AddDisciplePayload } from '@/lib/validations/disciple';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface DiscipleItem {
  id: string;
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  mentor: string;
  mentorRefId?: string;
  memberIdStr?: string;
  startDate: string;
  currentLevel: 'New Convert' | 'Growing' | 'Mature' | 'Leader' | string;
  progress: number;
  completedClasses: number;
  totalClasses: number;
  enrolledClassIds: string[];
  followUpCount: number;
  lastContact: string;
  milestones: string[];
  status: 'Active' | 'Graduated' | 'Inactive' | string;
  goals?: string;
  notes?: string;
}

export interface DiscipleUpdatePayload {
  id: string;
  memberId?: string;
  mentorId?: string;
  name?: string;
  email?: string;
  phone?: string;
  startDate?: string;
  currentLevel?: string;
  goals?: string;
  notes?: string;
  status?: string;
  progress?: number;
  completedClasses?: number;
  totalClasses?: number;
  followUpCount?: number;
  lastContact?: string;
  enrolledClassIds?: string[];
  milestones?: string[];
}

export interface DiscipleFollowUpPayload {
  id: string;
  date?: string;
  notes?: string;
  progress?: number;
  completedClasses?: number;
  currentLevel?: string;
  status?: string;
}

export interface DiscipleshipClassItem {
  id: string;
  _id: string;
  name: string;
  instructor: string;
  instructorId?: string | null;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  duration: string;
  currentStudents: number;
  maxCapacity: number;
  studentIds: string[];
  students: Array<{
    id: string;
    name: string;
    email: string;
    level: string;
  }>;
  startDate: string;
  endDate: string;
  schedule: string;
  description: string;
  status: 'Active' | 'Scheduled' | 'Completed' | 'Inactive' | string;
  progress: number;
}

export interface DiscipleshipClassPayload {
  name: string;
  instructor?: string;
  instructorId?: string;
  level?: string;
  duration?: string;
  maxCapacity?: number;
  startDate?: string;
  endDate?: string;
  schedule?: string;
  description?: string;
  status?: string;
  progress?: number;
  studentIds?: string[];
}

export interface DiscipleshipClassUpdatePayload extends Partial<DiscipleshipClassPayload> {
  id: string;
}

export interface MentorItem {
  id: string;
  _id: string;
  memberId?: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  experience: string;
  specialization: string;
  currentMentees: number;
  mentees: Array<{
    id: string;
    name: string;
    level: string;
  }>;
  menteeIds: string[];
  maxCapacity: number;
  status: 'Active' | 'Inactive' | string;
  notes?: string;
}

export interface MentorPayload {
  memberId?: string;
  name?: string;
  email?: string;
  phone?: string;
  experience?: string;
  specialization?: string;
  maxCapacity?: number;
  status?: string;
  notes?: string;
}

export interface MentorUpdatePayload extends Partial<MentorPayload> {
  id: string;
}

export interface DiscipleshipStatsResponse {
  newConverts: number;
  totalDisciples: number;
  activeDisciples: number;
  graduated: number;
  graduatedDisciples: number;
  inactiveDisciples: number;
  activeClasses: number;
  totalClasses: number;
  activeMentors: number;
  totalMentors: number;
  averageProgress: number;
  averageFollowUps: number;
  mentorUtilization: number;
  totalMilestones: number;
}

// Query Keys
const discipleKeys = {
  all: ['disciples'] as const,
  lists: () => [...discipleKeys.all, 'list'] as const,
  list: (filters: DiscipleFilters) =>
    [...discipleKeys.lists(), filters] as const,
  details: () => [...discipleKeys.all, 'detail'] as const,
  detail: (id: string) => [...discipleKeys.details(), id] as const,
  classes: ['discipleship-classes'] as const,
  mentors: ['discipleship-mentors'] as const,
  stats: ['discipleship-stats'] as const,
} as const;

const invalidateAllDiscipleshipQueries = (
  queryClient: ReturnType<typeof useQueryClient>
) => {
  queryClient.invalidateQueries({ queryKey: discipleKeys.all });
  queryClient.invalidateQueries({ queryKey: discipleKeys.classes });
  queryClient.invalidateQueries({ queryKey: discipleKeys.mentors });
  queryClient.invalidateQueries({ queryKey: discipleKeys.stats });
};

const fetchDisciplesApi = async (
  filters: DiscipleFilters = {}
): Promise<DisciplesResponse> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== 'all') {
      params.append(key, value.toString());
    }
  });
  const { data } = await apiClient.get(`/church/disciples?${params.toString()}`);
  return data;
};

const fetchDiscipleApi = async (id: string): Promise<DiscipleResponse> => {
  const { data } = await apiClient.get(`/church/disciples/${id}`);
  return data;
};

const createDiscipleApi = async (payload: AddDisciplePayload | Record<string, any>) => {
  const { data } = await apiClient.post('/church/disciples', payload);
  return data;
};

const updateDiscipleApi = async ({
  id,
  ...payload
}: DiscipleUpdatePayload) => {
  const { data } = await apiClient.put(`/church/disciples/${id}`, payload);
  return data;
};

const recordFollowUpApi = async ({
  id,
  ...payload
}: DiscipleFollowUpPayload) => {
  const { data } = await apiClient.post(
    `/church/disciples/${id}/follow-up`,
    payload
  );
  return data;
};

const deleteDiscipleApi = async (id: string) => {
  const { data } = await apiClient.delete(`/church/disciples/${id}`);
  return data;
};

const addMilestoneCompletionApi = async (payload: {
  discipleId: string;
  milestoneId: string;
  notes?: string;
  evidence?: string;
}) => {
  const { discipleId } = payload;
  const { data } = await apiClient.post(
    `/church/disciples/${discipleId}/milestones`,
    payload
  );
  return data;
};

// Custom Hooks - Disciples
export function useDisciples(filters: DiscipleFilters = {}) {
  return useQuery({
    queryKey: discipleKeys.list(filters),
    queryFn: () => fetchDisciplesApi(filters),
  });
}

export function useDisciple(id: string) {
  return useQuery({
    queryKey: discipleKeys.detail(id),
    queryFn: () => fetchDiscipleApi(id),
    enabled: !!id,
  });
}

export function useRegisterDisciple() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDiscipleApi,
    onSuccess: () => {
      invalidateAllDiscipleshipQueries(queryClient);
      toast.success('Disciple added successfully!', {
        style: successToastStyle,
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to add disciple.');
    },
  });
}

export function useUpdateDisciple() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDiscipleApi,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(discipleKeys.detail(variables.id), data);
      invalidateAllDiscipleshipQueries(queryClient);
      toast.success('Disciple updated successfully!', {
        style: successToastStyle,
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update disciple.');
    },
  });
}

export function useRecordDiscipleFollowUp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recordFollowUpApi,
    onSuccess: () => {
      invalidateAllDiscipleshipQueries(queryClient);
      toast.success('Follow-up visit recorded!', {
        style: successToastStyle,
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to record follow-up.');
    },
  });
}

export function useDeleteDisciple() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDiscipleApi,
    onSuccess: (_data, discipleId) => {
      queryClient.removeQueries({ queryKey: discipleKeys.detail(discipleId) });
      invalidateAllDiscipleshipQueries(queryClient);
      toast.success('Disciple removed from program.', {
        style: successToastStyle,
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to remove disciple.');
    },
  });
}

export function useAddMilestoneCompletion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addMilestoneCompletionApi,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: discipleKeys.detail(variables.discipleId),
      });
      invalidateAllDiscipleshipQueries(queryClient);
      toast.success('Milestone completion recorded!', {
        style: successToastStyle,
      });
    },
  });
}

// Discipleship Classes Hooks
const fetchDiscipleshipClassesApi = async (search = '', status = '') => {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (status && status !== 'all') params.set('status', status);
  const { data } = await apiClient.get(
    `/church/discipleship/classes?${params.toString()}`
  );
  return data;
};

export function useFetchDiscipleshipClasses(search = '', status = '') {
  return useQuery({
    queryKey: [...discipleKeys.classes, search, status],
    queryFn: () => fetchDiscipleshipClassesApi(search, status),
  });
}

export function useCreateDiscipleshipClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: DiscipleshipClassPayload) => {
      const { data } = await apiClient.post(
        '/church/discipleship/classes',
        payload
      );
      return data;
    },
    onSuccess: () => {
      invalidateAllDiscipleshipQueries(queryClient);
      toast.success('Discipleship class created successfully!', {
        style: successToastStyle,
      });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || 'Failed to create discipleship class.'
      );
    },
  });
}

export function useUpdateDiscipleshipClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: DiscipleshipClassUpdatePayload) => {
      const { data } = await apiClient.patch(
        `/church/discipleship/classes/${id}`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      invalidateAllDiscipleshipQueries(queryClient);
      toast.success('Discipleship class updated successfully!', {
        style: successToastStyle,
      });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || 'Failed to update discipleship class.'
      );
    },
  });
}

export function useEnrollDisciplesInClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      classId,
      discipleIds,
    }: {
      classId: string;
      discipleIds: string[];
    }) => {
      const { data } = await apiClient.post(
        `/church/discipleship/classes/${classId}/enroll`,
        { discipleIds }
      );
      return data;
    },
    onSuccess: () => {
      invalidateAllDiscipleshipQueries(queryClient);
      toast.success('Class student enrollment updated!', {
        style: successToastStyle,
      });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || 'Failed to update class enrollment.'
      );
    },
  });
}

export function useDeleteDiscipleshipClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(
        `/church/discipleship/classes/${id}`
      );
      return data;
    },
    onSuccess: () => {
      invalidateAllDiscipleshipQueries(queryClient);
      toast.success('Discipleship class deleted.', {
        style: successToastStyle,
      });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || 'Failed to delete discipleship class.'
      );
    },
  });
}

// Mentors Hooks
const fetchMentorsApi = async (search = '') => {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  const { data } = await apiClient.get(
    `/church/discipleship/mentors?${params.toString()}`
  );
  return data;
};

export function useFetchMentors(search = '') {
  return useQuery({
    queryKey: [...discipleKeys.mentors, search],
    queryFn: () => fetchMentorsApi(search),
  });
}

export function useCreateMentor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: MentorPayload) => {
      const { data } = await apiClient.post(
        '/church/discipleship/mentors',
        payload
      );
      return data;
    },
    onSuccess: () => {
      invalidateAllDiscipleshipQueries(queryClient);
      toast.success('Mentor added successfully!', {
        style: successToastStyle,
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to add mentor.');
    },
  });
}

export function useUpdateMentor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: MentorUpdatePayload) => {
      const { data } = await apiClient.patch(
        `/church/discipleship/mentors/${id}`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      invalidateAllDiscipleshipQueries(queryClient);
      toast.success('Mentor updated successfully!', {
        style: successToastStyle,
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update mentor.');
    },
  });
}

export function useAssignMenteesToMentor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      mentorId,
      discipleIds,
    }: {
      mentorId: string;
      discipleIds: string[];
    }) => {
      const { data } = await apiClient.post(
        `/church/discipleship/mentors/${mentorId}/assign`,
        { discipleIds }
      );
      return data;
    },
    onSuccess: () => {
      invalidateAllDiscipleshipQueries(queryClient);
      toast.success('Mentees assigned to mentor!', {
        style: successToastStyle,
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to assign mentees.');
    },
  });
}

export function useDeleteMentor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(
        `/church/discipleship/mentors/${id}`
      );
      return data;
    },
    onSuccess: () => {
      invalidateAllDiscipleshipQueries(queryClient);
      toast.success('Mentor removed.', {
        style: successToastStyle,
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to remove mentor.');
    },
  });
}

// Discipleship Stats Hook
const fetchDiscipleshipStatsApi = async (): Promise<DiscipleshipStatsResponse> => {
  const { data } = await apiClient.get('/church/discipleship/stats');
  return data?.data || data;
};

export function useFetchDiscipleshipStats() {
  return useQuery({
    queryKey: discipleKeys.stats,
    queryFn: fetchDiscipleshipStatsApi,
  });
}
