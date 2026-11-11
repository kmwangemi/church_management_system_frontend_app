import apiClient from '@/lib/api-client';
import { errorToastStyle, successToastStyle } from '@/lib/toast-styles';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface ContributionEntry {
  id: string;
  contributorName: string;
  memberId?: string;
  amount: number;
  paymentMethod: string;
  date: string;
  notes?: string;
  createdAt?: string;
}

export interface ContributionCampaign {
  id: string;
  _id: string;
  event: string;
  type: string;
  date: string;
  amount: number;
  targetAmount: number;
  contributors: number;
  status: 'Active' | 'Ongoing' | 'Completed';
  description: string;
  entries?: ContributionEntry[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ContributionStats {
  totalContributions: number;
  totalTarget: number;
  totalEvents: number;
  activeContributions: number;
  completedContributions: number;
  totalContributors: number;
  thisMonthContributions: number;
  averagePerEvent: number;
  averagePerMonth: number;
  monthlyTrends: Array<{ month: string; amount: number }>;
  topContributors: Array<{ name: string; amount: number }>;
  byType: Array<{
    type: string;
    count: number;
    total: number;
    targetTotal: number;
  }>;
}

const fetchContributions = async (
  page = 1,
  search = '',
  type = '',
  status = ''
): Promise<{
  status: string;
  contributions: ContributionCampaign[];
  data: ContributionCampaign[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    ...(search && { search }),
    ...(type && type !== 'all' && { type }),
    ...(status && status !== 'all' && { status }),
  });
  const { data } = await apiClient.get(`/church/contributions?${params}`);
  return data;
};

export const useFetchContributions = (
  page = 1,
  search = '',
  type = '',
  status = ''
) => {
  return useQuery({
    queryKey: ['contributions', page, search, type, status],
    queryFn: () => fetchContributions(page, search, type, status),
  });
};

const fetchContributionStats = async (): Promise<{
  status: string;
  stats: ContributionStats;
  data: ContributionStats;
}> => {
  const { data } = await apiClient.get('/church/contributions/stats');
  return data;
};

export const useFetchContributionStats = () => {
  return useQuery({
    queryKey: ['contribution-stats'],
    queryFn: fetchContributionStats,
  });
};

const createContribution = async (payload: {
  event: string;
  type: string;
  targetAmount?: number | string;
  amount?: number | string;
  date?: string;
  status?: string;
  description?: string;
}) => {
  const { data } = await apiClient.post('/church/contributions', payload);
  return data;
};

export const useCreateContribution = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createContribution,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributions'] });
      queryClient.invalidateQueries({ queryKey: ['contribution-stats'] });
      toast.success('Contribution campaign created successfully.', {
        style: successToastStyle,
      });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.detail || 'Failed to create contribution campaign',
        { style: errorToastStyle }
      );
    },
  });
};

const updateContribution = async ({
  id,
  payload,
}: {
  id: string;
  payload: Record<string, any>;
}) => {
  const { data } = await apiClient.put(`/church/contributions/${id}`, payload);
  return data;
};

export const useUpdateContribution = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateContribution,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributions'] });
      queryClient.invalidateQueries({ queryKey: ['contribution-stats'] });
      toast.success('Contribution campaign updated successfully.', {
        style: successToastStyle,
      });
    },
  });
};

const deleteContribution = async (id: string) => {
  const { data } = await apiClient.delete(`/church/contributions/${id}`);
  return data;
};

export const useDeleteContribution = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteContribution,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributions'] });
      queryClient.invalidateQueries({ queryKey: ['contribution-stats'] });
      toast.success('Contribution campaign deleted successfully.', {
        style: successToastStyle,
      });
    },
  });
};

const addContributionEntry = async ({
  id,
  payload,
}: {
  id: string;
  payload: {
    contributorName: string;
    memberId?: string;
    amount: number | string;
    paymentMethod?: string;
    date?: string;
    notes?: string;
  };
}) => {
  const { data } = await apiClient.post(
    `/church/contributions/${id}/entries`,
    payload
  );
  return data;
};

export const useAddContributionEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addContributionEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributions'] });
      queryClient.invalidateQueries({ queryKey: ['contribution-stats'] });
      toast.success('Contribution recorded successfully.', {
        style: successToastStyle,
      });
    },
  });
};

const deleteContributionEntry = async ({
  id,
  entryId,
}: {
  id: string;
  entryId: string;
}) => {
  const { data } = await apiClient.delete(
    `/church/contributions/${id}/entries/${entryId}`
  );
  return data;
};

export const useDeleteContributionEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteContributionEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributions'] });
      queryClient.invalidateQueries({ queryKey: ['contribution-stats'] });
      toast.success('Contribution entry removed.', {
        style: successToastStyle,
      });
    },
  });
};
