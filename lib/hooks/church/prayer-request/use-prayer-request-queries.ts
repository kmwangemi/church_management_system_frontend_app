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

// Create Prayer Request
const createPrayerRequest = async (
  payload: AddPrayerRequestPayload
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
      toast.success('Prayer request has been submitted successfully.', {
        style: successToastStyle,
      });
    },
  });
};

// Fetch Prayer Requests with filters
interface FetchPrayerRequestsParams {
  page?: number;
  search?: string;
  category?: string;
  priority?: string;
  status?: string;
  isPublic?: boolean;
  memberId?: string;
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
    limit = 10,
  } = params;
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());
  if (search) queryParams.append('search', search);
  if (category) queryParams.append('category', category);
  if (priority) queryParams.append('priority', priority);
  if (status) queryParams.append('status', status);
  if (isPublic !== undefined)
    queryParams.append('isPublic', isPublic.toString());
  if (memberId) queryParams.append('memberId', memberId);
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
    staleTime: 1000 * 60 * 5, // 5 minutes
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
    onSuccess: (data) => {
      // Update the specific prayer request in the cache
      queryClient.setQueriesData(
        { queryKey: ['prayer-requests'] },
        (oldData: any) => {
          if (!oldData?.data?.prayerRequests) return oldData;
          return {
            ...oldData,
            data: {
              ...oldData.data,
              prayerRequests: oldData.data.prayerRequests.map((request: any) =>
                request._id === data.data.prayerRequestId
                  ? { ...request, prayerCount: data.data.prayerCount }
                  : request
              ),
            },
          };
        }
      );
      toast.success('Thank you for praying! 🙏', {
        style: successToastStyle,
      });
    },
  });
};

// Fetch Prayer Requests by Category (for dashboard widgets)
export const useFetchPrayerRequestsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['prayer-requests', 'category', category],
    queryFn: () => fetchPrayerRequests({ category, status: 'active' }),
    enabled: !!category,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Fetch Prayer Requests by Priority (for urgent requests)
export const useFetchUrgentPrayerRequests = () => {
  return useQuery({
    queryKey: ['prayer-requests', 'urgent'],
    queryFn: () =>
      fetchPrayerRequests({ priority: 'urgent', status: 'active' }),
    staleTime: 1000 * 60 * 2, // 2 minutes for urgent requests
  });
};

// Fetch My Prayer Requests (for current user)
export const useFetchMyPrayerRequests = (userId?: string) => {
  return useQuery({
    queryKey: ['prayer-requests', 'my-requests', userId],
    queryFn: () => fetchPrayerRequests({ memberId: userId }),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Fetch Public Prayer Requests (for community prayer wall)
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
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Fetch Prayer Request Statistics (for dashboard)
const fetchPrayerRequestStats = async () => {
  const [active, answered, total] = await Promise.all([
    fetchPrayerRequests({ status: 'active', limit: 1 }),
    fetchPrayerRequests({ status: 'answered', limit: 1 }),
    fetchPrayerRequests({ limit: 1 }),
  ]);
  return {
    active: active.data.pagination.total,
    answered: answered.data.pagination.total,
    total: total.data.pagination.total,
  };
};

export const useFetchPrayerRequestStats = () => {
  return useQuery({
    queryKey: ['prayer-requests', 'stats'],
    queryFn: fetchPrayerRequestStats,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};
