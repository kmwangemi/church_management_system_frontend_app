import apiClient from '@/lib/api-client';
import { successToastStyle } from '@/lib/toast-styles';
import type {
  PrayerCountUpdateResponse,
  PrayerRequestAddResponse,
  PrayerRequestListResponse,
} from '@/lib/types/prayer-request';
import type { AddPrayerRequestPayload } from '@/lib/validations/prayer-request';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface CounselorItem {
  id: string;
  _id?: string;
  memberId?: string | null;
  name: string;
  email: string;
  phone: string;
  specialization: string[];
  currentCases: number;
  maxCapacity: number;
  status: 'Available' | 'Full' | 'Unavailable' | string;
  experience: string;
  avatar?: string;
  assignedCases?: Array<{
    id: string;
    title: string;
    category: string;
    priority: string;
    status: string;
    requester: string;
    dateSubmitted: string;
  }>;
}

export interface PrayerStatsData {
  totalRequests: number;
  activeRequests: number;
  inProgressRequests: number;
  answeredRequests: number;
  closedRequests: number;
  totalPrayers: number;
  activeCounselors: number;
  totalCounselors: number;
  categories: Array<{
    slug: string;
    name: string;
    count: number;
    activeCount: number;
    answeredCount: number;
    percentage: number;
  }>;
  priorities: Array<{
    priority: string;
    count: number;
    percentage: number;
  }>;
  counselorWorkload: Array<{
    id: string;
    name: string;
    currentCases: number;
    maxCapacity: number;
    status: string;
    percentage: number;
  }>;
}

// Create Prayer Request
const createPrayerRequest = async (
  payload: AddPrayerRequestPayload & { counselorId?: string }
): Promise<PrayerRequestAddResponse> => {
  const { data } = await apiClient.post('/church/prayer-requests', payload);
  return data;
};

export const useCreatePrayerRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPrayerRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayer-requests'] });
      queryClient.invalidateQueries({ queryKey: ['prayer-stats'] });
      queryClient.invalidateQueries({ queryKey: ['prayer-counselors'] });
      toast.success('Prayer request has been submitted successfully.', {
        style: successToastStyle,
      });
    },
  });
};

// Fetch Prayer Requests with filters
export interface FetchPrayerRequestsParams {
  page?: number;
  search?: string;
  category?: string;
  priority?: string;
  status?: string;
  isPublic?: boolean;
  memberId?: string;
  counselorId?: string;
  limit?: number;
}

const fetchPrayerRequests = async (
  params: FetchPrayerRequestsParams = {}
): Promise<PrayerRequestListResponse> => {
  const {
    page = 1,
    search = '',
    category = '',
    priority = '',
    status = '',
    isPublic,
    memberId = '',
    counselorId = '',
    limit = 50,
  } = params;
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());
  if (search) queryParams.append('search', search);
  if (category && category !== 'all') queryParams.append('category', category);
  if (priority && priority !== 'all') queryParams.append('priority', priority);
  if (status && status !== 'all') queryParams.append('status', status);
  if (isPublic !== undefined)
    queryParams.append('isPublic', isPublic.toString());
  if (memberId) queryParams.append('memberId', memberId);
  if (counselorId) queryParams.append('counselorId', counselorId);
  const { data } = await apiClient.get(
    `/church/prayer-requests?${queryParams.toString()}`
  );
  return data;
};

export const useFetchPrayerRequests = (
  params: FetchPrayerRequestsParams = {}
) => {
  return useQuery({
    queryKey: ['prayer-requests', params],
    queryFn: () => fetchPrayerRequests(params),
  });
};

// Update Prayer Count (when someone prays)
const updatePrayerCount = async (
  prayerRequestId: string
): Promise<PrayerCountUpdateResponse> => {
  const { data } = await apiClient.patch('/church/prayer-requests', {
    prayerRequestId,
  });
  return data;
};

export const useUpdatePrayerCount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePrayerCount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayer-requests'] });
      queryClient.invalidateQueries({ queryKey: ['prayer-stats'] });
      toast.success('Thank you for praying! 🙏', {
        style: successToastStyle,
      });
    },
  });
};

// Fetch Prayer Requests by Category
export const useFetchPrayerRequestsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['prayer-requests', 'category', category],
    queryFn: () => fetchPrayerRequests({ category, status: 'active' }),
    enabled: !!category,
  });
};

// Fetch Urgent Prayer Requests
export const useFetchUrgentPrayerRequests = () => {
  return useQuery({
    queryKey: ['prayer-requests', 'urgent'],
    queryFn: () =>
      fetchPrayerRequests({ priority: 'high', status: 'active' }),
  });
};

// Fetch My Prayer Requests
export const useFetchMyPrayerRequests = (userId?: string) => {
  return useQuery({
    queryKey: ['prayer-requests', 'my-requests', userId],
    queryFn: () => fetchPrayerRequests({ memberId: userId }),
    enabled: !!userId,
  });
};

// Fetch Public Prayer Requests
export const useFetchPublicPrayerRequests = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['prayer-requests', 'public', page, limit],
    queryFn: () =>
      fetchPrayerRequests({
        isPublic: true,
        status: 'active',
        page,
        limit,
      }),
  });
};

// Fetch Prayer Request Statistics
const fetchPrayerRequestStats = async (): Promise<{
  success: boolean;
  data: PrayerStatsData;
}> => {
  const { data } = await apiClient.get('/church/prayer-requests/stats');
  return data;
};

export const useFetchPrayerRequestStats = () => {
  return useQuery({
    queryKey: ['prayer-stats'],
    queryFn: fetchPrayerRequestStats,
  });
};

// Delete Prayer Request
const deletePrayerRequest = async (id: string | number) => {
  const { data } = await apiClient.delete(`/church/prayer-requests/${id}`);
  return data;
};

export const useDeletePrayerRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePrayerRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayer-requests'] });
      queryClient.invalidateQueries({ queryKey: ['prayer-stats'] });
      queryClient.invalidateQueries({ queryKey: ['prayer-counselors'] });
      toast.success('Prayer request deleted successfully.', {
        style: successToastStyle,
      });
    },
  });
};

// Update Prayer Request
const updatePrayerRequest = async ({
  id,
  payload,
}: {
  id: string | number;
  payload: Partial<
    AddPrayerRequestPayload & {
      status?: string;
      counselorId?: string | null;
    }
  >;
}) => {
  const { data } = await apiClient.put(
    `/church/prayer-requests/${id}`,
    payload
  );
  return data;
};

export const useUpdatePrayerRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePrayerRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayer-requests'] });
      queryClient.invalidateQueries({ queryKey: ['prayer-stats'] });
      queryClient.invalidateQueries({ queryKey: ['prayer-counselors'] });
      toast.success('Prayer request updated successfully.', {
        style: successToastStyle,
      });
    },
  });
};

// Add Update Note to Prayer Request
const addPrayerRequestUpdate = async ({
  id,
  message,
  status,
}: {
  id: string | number;
  message: string;
  status?: string;
}) => {
  const { data } = await apiClient.post(
    `/church/prayer-requests/${id}/updates`,
    {
      message,
      status,
    }
  );
  return data;
};

export const useAddPrayerRequestUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addPrayerRequestUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayer-requests'] });
      queryClient.invalidateQueries({ queryKey: ['prayer-stats'] });
      queryClient.invalidateQueries({ queryKey: ['prayer-counselors'] });
      toast.success('Prayer request update added.', {
        style: successToastStyle,
      });
    },
  });
};

// Counselors Hooks
const fetchCounselors = async (): Promise<{
  success: boolean;
  data: {
    counselors: CounselorItem[];
    total: number;
  };
  counselors: CounselorItem[];
}> => {
  const { data } = await apiClient.get('/church/prayer-requests/counselors');
  return data;
};

export const useFetchCounselors = () => {
  return useQuery({
    queryKey: ['prayer-counselors'],
    queryFn: fetchCounselors,
  });
};

const createCounselor = async (payload: {
  memberId?: string;
  name: string;
  email?: string;
  phone?: string;
  specialization?: string[] | string;
  maxCapacity?: number;
  experience?: string;
  status?: string;
}) => {
  const { data } = await apiClient.post(
    '/church/prayer-requests/counselors',
    payload
  );
  return data;
};

export const useCreateCounselor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCounselor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayer-counselors'] });
      queryClient.invalidateQueries({ queryKey: ['prayer-stats'] });
      toast.success('Counselor added successfully.', {
        style: successToastStyle,
      });
    },
  });
};

const updateCounselor = async ({
  counselorId,
  payload,
}: {
  counselorId: string;
  payload: Partial<{
    name: string;
    email: string;
    phone: string;
    specialization: string[] | string;
    maxCapacity: number;
    experience: string;
    status: string;
  }>;
}) => {
  const { data } = await apiClient.patch(
    `/church/prayer-requests/counselors/${counselorId}`,
    payload
  );
  return data;
};

export const useUpdateCounselor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCounselor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayer-counselors'] });
      queryClient.invalidateQueries({ queryKey: ['prayer-requests'] });
      queryClient.invalidateQueries({ queryKey: ['prayer-stats'] });
      toast.success('Counselor updated successfully.', {
        style: successToastStyle,
      });
    },
  });
};

const deleteCounselor = async (counselorId: string) => {
  const { data } = await apiClient.delete(
    `/church/prayer-requests/counselors/${counselorId}`
  );
  return data;
};

export const useDeleteCounselor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCounselor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayer-counselors'] });
      queryClient.invalidateQueries({ queryKey: ['prayer-requests'] });
      queryClient.invalidateQueries({ queryKey: ['prayer-stats'] });
      toast.success('Counselor removed successfully.', {
        style: successToastStyle,
      });
    },
  });
};
