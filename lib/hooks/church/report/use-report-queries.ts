import apiClient from '@/lib/api-client';
import { successToastStyle } from '@/lib/toast-styles';
import type {
  ReportAddResponse,
  ReportDownloadResponse,
  ReportListResponse,
} from '@/lib/types/report';
import type { AddReportPayload } from '@/lib/validations/report';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Create Report Hook
const createReport = async (
  payload: AddReportPayload
): Promise<ReportAddResponse> => {
  const { data } = await apiClient.post('/church/reports', payload);
  return data;
};

export const useCreateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Report generation started successfully.', {
        style: successToastStyle,
      });
    },
  });
};

// Fetch Reports Hook
const fetchReports = async (
  page = 1,
  search = '',
  type = '',
  status = '',
  dateRange = ''
): Promise<ReportListResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    ...(search && { search }),
    ...(type && { type }),
    ...(status && { status }),
    ...(dateRange && { dateRange }),
  });
  const { data } = await apiClient.get(`/church/reports?${params}`);
  return data;
};

export const useFetchReports = (
  page = 1,
  search = '',
  type = '',
  status = '',
  dateRange = ''
) => {
  return useQuery({
    queryKey: ['reports', page, search, type, status, dateRange],
    queryFn: () => fetchReports(page, search, type, status, dateRange),
    refetchInterval: (query) => {
      // Auto-refresh if there are generating reports
      const data = query.state.data as any;
      const reports = data?.data?.reports || data?.reports;
      const hasGeneratingReports = reports?.some(
        (report: any) => report.status === 'generating'
      );
      return hasGeneratingReports ? 5000 : false; // Refresh every 5 seconds
    },
  });
};

// Fetch Single Report Hook
const fetchReport = async (
  reportId: string
): Promise<{
  success: boolean;
  data: any;
}> => {
  const { data } = await apiClient.get(`/church/reports/${reportId}`);
  return data;
};

export const useFetchReport = (reportId: string) => {
  return useQuery({
    queryKey: ['report', reportId],
    queryFn: () => fetchReport(reportId),
    enabled: !!reportId,
    refetchInterval: (query) => {
      // Auto-refresh if report is still generating
      return (query.state.data as any)?.data?.status === 'generating' ? 3000 : false;
    },
  });
};

// Download Report Hook
const downloadReport = async (
  reportId: string
): Promise<ReportDownloadResponse> => {
  const response = await apiClient.get(`/church/reports/${reportId}/download`, {
    responseType: 'blob',
  });
  return response as any;
};

export const useDownloadReport = () => {
  return useMutation({
    mutationFn: downloadReport,
    onSuccess: (response, reportId) => {
      // Create blob URL and trigger download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Get filename from response headers or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = `report_${reportId}.pdf`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Report downloaded successfully.', {
        style: successToastStyle,
      });
    },
  });
};

// Cancel Report Hook
const cancelReport = async (
  reportId: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  const { data } = await apiClient.patch(`/church/reports/${reportId}/cancel`);
  return data;
};

export const useCancelReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Report cancelled successfully.', {
        style: successToastStyle,
      });
    },
  });
};

// Delete Report Hook
const deleteReport = async (
  reportId: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  const { data } = await apiClient.delete(`/church/reports/${reportId}`);
  return data;
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Report deleted successfully.', {
        style: successToastStyle,
      });
    },
  });
};

// Fetch Report Stats Hook
const fetchReportStats = async (): Promise<{
  success: boolean;
  data: {
    totalReports: number;
    completedReports: number;
    generatingReports: number;
    failedReports: number;
    reportsByType: Array<{
      type: string;
      count: number;
    }>;
    reportsByStatus: Array<{
      status: string;
      count: number;
    }>;
    recentReports: any[];
  };
}> => {
  const { data } = await apiClient.get('/church/reports/stats');
  return data;
};

export const useFetchReportStats = () => {
  return useQuery({
    queryKey: ['report-stats'],
    queryFn: fetchReportStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Duplicate Report Hook
const duplicateReport = async (
  reportId: string
): Promise<ReportAddResponse> => {
  const { data } = await apiClient.post(`/church/reports/${reportId}/duplicate`);
  return data;
};

export const useDuplicateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: duplicateReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Report duplicated successfully.', {
        style: successToastStyle,
      });
    },
  });
};

// Get Report Preview Hook
const getReportPreview = async (payload: {
  type: string;
  departments: string[];
  dateRange: string;
  customStartDate?: string;
  customEndDate?: string;
}): Promise<{
  success: boolean;
  data: {
    estimatedRecords: number;
    departmentBreakdown: Array<{
      departmentId: string;
      departmentName: string;
      count: number;
    }>;
    dateRangeUsed: {
      startDate: string;
      endDate: string;
    };
    estimatedSize: string;
    estimatedGenerationTime: string;
  };
}> => {
  const { data } = await apiClient.post('/church/reports/preview', payload);
  return data;
};

export const useGetReportPreview = () => {
  return useMutation({
    mutationFn: getReportPreview,
  });
};

// Calculate Report Department Count Hook
const calculateReportDepartmentCount = async (
  departments: string[]
): Promise<{
  success: boolean;
  data: {
    totalCount: number;
    departmentCounts: Array<{
      departmentId: string;
      departmentName: string;
      count: number;
    }>;
  };
}> => {
  const { data } = await apiClient.post('/church/reports/calculate-count', {
    departments,
  });
  return data;
};

export const useCalculateReportDepartmentCount = () => {
  return useMutation({
    mutationFn: calculateReportDepartmentCount,
  });
};

// Retry Failed Report Hook
const retryReport = async (
  reportId: string
): Promise<{
  success: boolean;
  data: any;
  message: string;
}> => {
  const { data } = await apiClient.post(`/church/reports/${reportId}/retry`);
  return data;
};

export const useRetryReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: retryReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Report generation restarted successfully.', {
        style: successToastStyle,
      });
    },
  });
};

// Bulk Delete Reports Hook
const bulkDeleteReports = async (
  reportIds: string[]
): Promise<{
  success: boolean;
  data: {
    deletedCount: number;
    failedCount: number;
  };
  message: string;
}> => {
  const { data } = await apiClient.delete('/church/reports/bulk', {
    data: { reportIds },
  });
  return data;
};

export const useBulkDeleteReports = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDeleteReports,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success(`${data.data.deletedCount} reports deleted successfully.`, {
        style: successToastStyle,
      });
    },
  });
};
