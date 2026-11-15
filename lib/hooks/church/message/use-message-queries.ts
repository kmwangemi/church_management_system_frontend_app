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
      queryClient.invalidateQueries({ queryKey: ['message-templates'] });
      queryClient.invalidateQueries({ queryKey: ['communication-stats'] });
      const messageType =
        data.data?.scheduleType === 'draft' ? 'saved' : 'sent';
      toast.success(`Message has been ${messageType} successfully.`, {
        style: successToastStyle,
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.error ||
        'Failed to create message';
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

const deleteMessage = async (id: string | number) => {
  const { data } = await apiClient.delete(`/church/messages/${id}`);
  return data;
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['communication-stats'] });
      toast.success('Message deleted successfully.', {
        style: successToastStyle,
      });
    },
  });
};

const duplicateMessage = async (id: string | number) => {
  const { data } = await apiClient.post(`/church/messages/${id}/duplicate`);
  return data;
};

export const useDuplicateMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: duplicateMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['communication-stats'] });
      toast.success('Message duplicated as draft.', {
        style: successToastStyle,
      });
    },
  });
};

const updateMessage = async ({
  id,
  payload,
}: {
  id: string | number;
  payload: Record<string, any>;
}) => {
  const { data } = await apiClient.put(`/church/messages/${id}`, payload);
  return data;
};

export const useUpdateMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['communication-stats'] });
      toast.success('Message updated successfully.', {
        style: successToastStyle,
      });
    },
  });
};

// Message Templates Hooks
export interface MessageTemplateItem {
  id: string;
  _id: string;
  name: string;
  type: 'SMS' | 'Email';
  category: string;
  content: string;
  usageCount: number;
  lastUsed: string;
  createdAt?: string;
}

const fetchMessageTemplates = async (
  search = '',
  type = '',
  category = ''
): Promise<{
  status: string;
  templates: MessageTemplateItem[];
  data: { templates: MessageTemplateItem[]; total: number };
}> => {
  const params = new URLSearchParams({
    ...(search && { search }),
    ...(type && { type }),
    ...(category && { category }),
  });
  const { data } = await apiClient.get(`/church/messages/templates?${params}`);
  return data;
};

export const useFetchMessageTemplates = (
  search = '',
  type = '',
  category = ''
) => {
  return useQuery({
    queryKey: ['message-templates', search, type, category],
    queryFn: () => fetchMessageTemplates(search, type, category),
  });
};

const createMessageTemplate = async (payload: {
  name: string;
  type: string;
  category: string;
  content: string;
}) => {
  const { data } = await apiClient.post('/church/messages/templates', payload);
  return data;
};

export const useCreateMessageTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMessageTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['message-templates'] });
      queryClient.invalidateQueries({ queryKey: ['communication-stats'] });
      toast.success('Message template created successfully.', {
        style: successToastStyle,
      });
    },
  });
};

const updateMessageTemplate = async ({
  id,
  payload,
}: {
  id: string | number;
  payload: {
    name?: string;
    type?: string;
    category?: string;
    content?: string;
  };
}) => {
  const { data } = await apiClient.put(
    `/church/messages/templates/${id}`,
    payload
  );
  return data;
};

export const useUpdateMessageTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMessageTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['message-templates'] });
      toast.success('Message template updated successfully.', {
        style: successToastStyle,
      });
    },
  });
};

const deleteMessageTemplate = async (id: string | number) => {
  const { data } = await apiClient.delete(`/church/messages/templates/${id}`);
  return data;
};

export const useDeleteMessageTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMessageTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['message-templates'] });
      queryClient.invalidateQueries({ queryKey: ['communication-stats'] });
      toast.success('Message template deleted successfully.', {
        style: successToastStyle,
      });
    },
  });
};

// Communication Stats Hook
export interface CommunicationStatsData {
  totalMessages: number;
  sentToday: number;
  activeAnnouncements: number;
  totalAnnouncements: number;
  totalRecipients: number;
  smsDeliveryRate: number;
  emailDeliveryRate: number;
  smsCount: number;
  emailCount: number;
  messagesThisWeek: number;
  messagesLastWeek: number;
  thisWeekPercent: number;
  lastWeekPercent: number;
  totalTemplates: number;
  totalViews: number;
}

const fetchCommunicationStats = async (): Promise<{
  status: string;
  stats: CommunicationStatsData;
  data: CommunicationStatsData;
}> => {
  const { data } = await apiClient.get('/church/communications/stats');
  return data;
};

export const useFetchCommunicationStats = () => {
  return useQuery({
    queryKey: ['communication-stats'],
    queryFn: fetchCommunicationStats,
  });
};

