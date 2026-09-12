import apiClient from '@/lib/api-client';
import { successToastStyle } from '@/lib/toast-styles';
import type {
  ContentAddResponse,
  ContentListResponse,
  ContentUpdateResponse,
} from '@/lib/types/content';
import type {
  AddContentPayload,
  UpdateContentPayload,
} from '@/lib/validations/content';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Content Query Options Interface
export interface ContentQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  category?: string;
  status?: string;
  tags?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Create Content
const createContent = async (
  payload: AddContentPayload
): Promise<ContentAddResponse> => {
  const { data } = await apiClient.post('/church/content', payload);
  return data;
};

export const useCreateContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      toast.success('Content has been created successfully.', {
        style: successToastStyle,
      });
    },
  });
};

// Fetch Content List
const fetchContent = async (
  options: ContentQueryOptions = {}
): Promise<ContentListResponse> => {
  const {
    page = 1,
    limit = 10,
    search = '',
    type = '',
    category = '',
    status = '',
    tags = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = options;
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  if (search) params.append('search', search);
  if (type) params.append('type', type);
  if (category) params.append('category', category);
  if (status) params.append('status', status);
  if (tags) params.append('tags', tags);
  if (sortBy) params.append('sortBy', sortBy);
  if (sortOrder) params.append('sortOrder', sortOrder);
  const { data } = await apiClient.get(`/church/content?${params.toString()}`);
  return data;
};

export const useFetchContent = (options: ContentQueryOptions = {}) => {
  const queryKey = ['content', options];
  return useQuery({
    queryKey,
    queryFn: () => fetchContent(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

// Fetch Single Content Item
const fetchContentById = async (id: string): Promise<ContentAddResponse> => {
  const { data } = await apiClient.get(`/church/content/${id}`);
  return data;
};

export const useFetchContentById = (id: string) => {
  return useQuery({
    queryKey: ['content', id],
    queryFn: () => fetchContentById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Update Content
const updateContent = async (
  id: string,
  payload: UpdateContentPayload
): Promise<ContentUpdateResponse> => {
  const { data } = await apiClient.put(`/church/content?id=${id}`, payload);
  return data;
};

export const useUpdateContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateContentPayload;
    }) => updateContent(id, payload),
    onSuccess: (data, variables) => {
      // Invalidate and refetch content list
      queryClient.invalidateQueries({ queryKey: ['content'] });
      // Update the specific content item in cache
      queryClient.setQueryData(['content', variables.id], data);
      toast.success('Content has been updated successfully.', {
        style: successToastStyle,
      });
    },
  });
};

// Delete Content
const deleteContent = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const { data } = await apiClient.delete(`/church/content/${id}`);
  return data;
};

export const useDeleteContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      toast.success('Content has been deleted successfully.', {
        style: successToastStyle,
      });
    },
  });
};

// Increment View Count
const incrementViewCount = async (
  id: string
): Promise<{ success: boolean }> => {
  const { data } = await apiClient.patch(`/church/content/${id}/view`);
  return data;
};

export const useIncrementViewCount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: incrementViewCount,
    onSuccess: (_data, contentId) => {
      // Optionally update the content item in cache to reflect new view count
      queryClient.invalidateQueries({ queryKey: ['content', contentId] });
    },
    // Don't show toast for view count increment as it's a silent action
  });
};

// Increment Download Count
const incrementDownloadCount = async (
  id: string
): Promise<{ success: boolean }> => {
  const { data } = await apiClient.patch(`/church/content/${id}/download`);
  return data;
};

export const useIncrementDownloadCount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: incrementDownloadCount,
    onSuccess: (_data, contentId) => {
      // Optionally update the content item in cache to reflect new download count
      queryClient.invalidateQueries({ queryKey: ['content', contentId] });
    },
    // Don't show toast for download count increment as it's a silent action
  });
};

// Bulk Operations
const bulkUpdateContentStatus = async (
  ids: string[],
  status: string
): Promise<{ success: boolean; message: string; updated: number }> => {
  const { data } = await apiClient.patch('/church/content/bulk/status', {
    ids,
    status,
  });
  return data;
};

export const useBulkUpdateContentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: string }) =>
      bulkUpdateContentStatus(ids, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      toast.success(
        `${data.updated} content items status updated successfully.`,
        {
          style: successToastStyle,
        }
      );
    },
  });
};

const bulkDeleteContent = async (
  ids: string[]
): Promise<{ success: boolean; message: string; deleted: number }> => {
  const { data } = await apiClient.delete('/church/content/bulk', {
    data: { ids },
  });
  return data;
};

export const useBulkDeleteContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDeleteContent,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      toast.success(`${data.deleted} content items deleted successfully.`, {
        style: successToastStyle,
      });
    },
  });
};

// Search Content (with debounced search)
export const useSearchContent = (
  searchTerm: string,
  options: Omit<ContentQueryOptions, 'search'> = {}
) => {
  return useFetchContent({
    ...options,
    search: searchTerm,
  });
};

// Get Content Statistics
const fetchContentStats = async (): Promise<{
  totalContent: number;
  publishedContent: number;
  draftContent: number;
  archivedContent: number;
  totalViews: number;
  totalDownloads: number;
  contentByType: Array<{ type: string; count: number }>;
  contentByCategory: Array<{ category: string; count: number }>;
  recentContent: Array<{
    id: string;
    title: string;
    type: string;
    createdAt: string;
    viewCount: number;
  }>;
}> => {
  const { data } = await apiClient.get('/church/content/stats');
  return data;
};

export const useFetchContentStats = () => {
  return useQuery({
    queryKey: ['content', 'stats'],
    queryFn: fetchContentStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Get Popular Content (most viewed/downloaded)
const fetchPopularContent = async (
  limit = 10,
  timeframe: 'week' | 'month' | 'year' | 'all' = 'month'
): Promise<ContentListResponse> => {
  const { data } = await apiClient.get(
    `/church/content/popular?limit=${limit}&timeframe=${timeframe}`
  );
  return data;
};

export const useFetchPopularContent = (
  limit = 10,
  timeframe: 'week' | 'month' | 'year' | 'all' = 'month'
) => {
  return useQuery({
    queryKey: ['content', 'popular', limit, timeframe],
    queryFn: () => fetchPopularContent(limit, timeframe),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Get Content by Tags
export const useFetchContentByTags = (
  tags: string[],
  options: Omit<ContentQueryOptions, 'tags'> = {}
) => {
  const tagsString = tags.join(',');
  return useFetchContent({
    ...options,
    tags: tagsString,
  });
};

// Prefetch Content (useful for performance optimization)
export const usePrefetchContent = () => {
  const queryClient = useQueryClient();
  const prefetchContent = (options: ContentQueryOptions = {}) => {
    return queryClient.prefetchQuery({
      queryKey: ['content', options],
      queryFn: () => fetchContent(options),
      staleTime: 5 * 60 * 1000,
    });
  };
  const prefetchContentById = (id: string) => {
    return queryClient.prefetchQuery({
      queryKey: ['content', id],
      queryFn: () => fetchContentById(id),
      staleTime: 5 * 60 * 1000,
    });
  };
  return {
    prefetchContent,
    prefetchContentById,
  };
};

// Custom hook for content filters with localStorage persistence
export const useContentFilters = () => {
  const getStoredFilters = (): ContentQueryOptions => {
    if (typeof window === 'undefined') return {};
    try {
      const stored = localStorage.getItem('contentFilters');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  };
  const setStoredFilters = (filters: ContentQueryOptions) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('contentFilters', JSON.stringify(filters));
    } catch {
      // Ignore localStorage errors
    }
  };
  const clearStoredFilters = () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('contentFilters');
    } catch {
      // Ignore localStorage errors
    }
  };
  return {
    getStoredFilters,
    setStoredFilters,
    clearStoredFilters,
  };
};

// Export all query keys for easy cache management
export const contentQueryKeys = {
  all: ['content'] as const,
  lists: () => [...contentQueryKeys.all, 'list'] as const,
  list: (options: ContentQueryOptions) =>
    [...contentQueryKeys.lists(), options] as const,
  details: () => [...contentQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...contentQueryKeys.details(), id] as const,
  stats: () => [...contentQueryKeys.all, 'stats'] as const,
  popular: (limit: number, timeframe: string) =>
    [...contentQueryKeys.all, 'popular', limit, timeframe] as const,
};
