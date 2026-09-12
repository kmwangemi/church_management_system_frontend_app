import apiClient from '@/lib/api-client';
import { errorToastStyle, successToastStyle } from '@/lib/toast-styles';
import type {
  MessageAddResponse,
  MessageListResponse,
} from '@/lib/types/message';
import type {
  RecipientGroupsResponse,
} from '@/lib/types/recipient-group';
import type { AddMessagePayload } from '@/lib/validations/message';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Create Message Hook
const createMessage = async (
  payload: AddMessagePayload
): Promise<MessageAddResponse> => {
  const { data } = await apiClient.post('/church/messages', payload);
  return data;
};

export const useCreateMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMessage,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      const messageType =
        data.data?.scheduleType === 'draft' ? 'saved' : 'sent';
      toast.success(`Message has been ${messageType} successfully.`, {
        style: successToastStyle,
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error || 'Failed to create message';
      toast.error(errorMessage, {
        style: errorToastStyle,
      });
    },
  });
};

// Fetch Messages Hook
const fetchMessages = async (
  page = 1,
  search = '',
  type = '',
  status = '',
  scheduleType = ''
): Promise<MessageListResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    ...(search && { search }),
    ...(type && { type }),
    ...(status && { status }),
    ...(scheduleType && { scheduleType }),
  });
  const { data } = await apiClient.get(`/church/messages?${params}`);
  return data;
};

export const useFetchMessages = (
  page = 1,
  search = '',
  type = '',
  status = '',
  scheduleType = ''
) => {
  return useQuery({
    queryKey: ['messages', page, search, type, status, scheduleType],
    queryFn: () => fetchMessages(page, search, type, status, scheduleType),
  });
};

// Fetch Recipient Groups Hook
const fetchRecipientGroups = async (
  withCounts = true
): Promise<RecipientGroupsResponse> => {
  const { data } = await apiClient.get(
    `/recipient-groups?withCounts=${withCounts}`
  );
  return data;
};

export const useFetchRecipientGroups = (withCounts = true) => {
  return useQuery({
    queryKey: ['recipient-groups', withCounts],
    queryFn: () => fetchRecipientGroups(withCounts),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Calculate Member Count Hook
const calculateMemberCount = async (
  recipients: string[]
): Promise<{
  success: boolean;
  data: {
    totalCount: number;
    recipientCounts: Array<{ recipientId: string; count: number }>;
  };
}> => {
  const { data } = await apiClient.post('/recipient-groups/calculate-count', {
    recipients,
  });
  return data;
};

export const useCalculateMemberCount = () => {
  return useMutation({
    mutationFn: calculateMemberCount,
  });
};

// Get Message Members Hook
const getMessageMembers = async (payload: {
  recipients: string[];
  messageType: 'sms' | 'email';
  includeInactive?: boolean;
}): Promise<{
  success: boolean;
  data: {
    members: any[];
    totalCount: number;
    membersBySource: Record<string, string[]>;
    messageType: string;
  };
}> => {
  const { data } = await apiClient.post('/church/messages/members', payload);
  return data;
};

export const useGetMessageMembers = () => {
  return useMutation({
    mutationFn: getMessageMembers,
  });
};
