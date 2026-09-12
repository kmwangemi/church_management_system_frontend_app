// /lib/types/report.ts - Report related type definitions

export interface Report {
  _id: string;
  churchId: string;
  branchId?: string;
  name: string;
  type:
    | 'attendance'
    | 'financial'
    | 'membership'
    | 'events'
    | 'giving'
    | 'activities';
  description: string;
  dateRange:
    | 'last7days'
    | 'last30days'
    | 'last3months'
    | 'last6months'
    | 'lastyear'
    | 'custom';
  customStartDate?: string;
  customEndDate?: string;
  format: 'pdf' | 'excel' | 'csv';
  includeCharts: boolean;
  includeComparisons: boolean;
  departments: string[];
  status: 'generating' | 'completed' | 'failed' | 'cancelled';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  generatedAt?: string;
  downloadCount: number;
  reportData?: {
    totalRecords: number;
    departmentCounts: Array<{
      departmentId: string;
      departmentName: string;
      count: number;
    }>;
    dateRangeUsed: {
      startDate: string;
      endDate: string;
    };
    generationTime: number;
  };
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  // Virtual fields
  formattedFileSize?: string;
  generationDuration?: string;
  dateRangeDisplay?: string;
}

export interface ReportListResponse {
  success: boolean;
  data: {
    reports: Report[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface ReportAddResponse {
  success: boolean;
  data: Report;
  message: string;
}

export interface ReportDownloadResponse {
  data: Blob;
  headers: {
    'content-disposition': string;
    'content-type': string;
  };
}

export interface ReportStats {
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
    recentReports: Report[];
  };
}

export interface ReportPreview {
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
}

// Report form validation types
export interface AddReportPayload {
  name: string;
  type:
    | 'attendance'
    | 'financial'
    | 'membership'
    | 'events'
    | 'giving'
    | 'activities';
  description: string;
  dateRange:
    | 'last7days'
    | 'last30days'
    | 'last3months'
    | 'last6months'
    | 'lastyear'
    | 'custom';
  customStartDate?: string;
  customEndDate?: string;
  format: 'pdf' | 'excel' | 'csv';
  includeCharts: boolean;
  includeComparisons: boolean;
  departments: string[];
}

// Report filter types
export interface ReportFilters {
  search?: string;
  type?:
    | 'attendance'
    | 'financial'
    | 'membership'
    | 'events'
    | 'giving'
    | 'activities';
  status?: 'generating' | 'completed' | 'failed' | 'cancelled';
  dateRange?:
    | 'last7days'
    | 'last30days'
    | 'last3months'
    | 'last6months'
    | 'lastyear'
    | 'custom';
  page?: number;
  limit?: number;
}

// Department count calculation types
export interface DepartmentCount {
  departmentId: string;
  departmentName: string;
  count: number;
}

export interface DepartmentCountResponse {
  success: boolean;
  data: {
    totalCount: number;
    departmentCounts: DepartmentCount[];
  };
}

// Bulk operations
export interface BulkDeleteResponse {
  success: boolean;
  data: {
    deletedCount: number;
    failedCount: number;
  };
  message: string;
}

// Report constants and options
export const REPORT_TYPE_OPTIONS = [
  { value: 'attendance', label: 'Attendance Report' },
  { value: 'financial', label: 'Financial Report' },
  { value: 'membership', label: 'Membership Report' },
  { value: 'events', label: 'Events Report' },
  { value: 'giving', label: 'Giving Report' },
  { value: 'activities', label: 'Activities Report' },
] as const;

export const REPORT_DATE_RANGE_OPTIONS = [
  { value: 'last7days', label: 'Last 7 days' },
  { value: 'last30days', label: 'Last 30 days' },
  { value: 'last3months', label: 'Last 3 months' },
  { value: 'last6months', label: 'Last 6 months' },
  { value: 'lastyear', label: 'Last year' },
  { value: 'custom', label: 'Custom date range' },
] as const;

export const REPORT_OUTPUT_FORMAT_OPTIONS = [
  { value: 'pdf', label: 'PDF Document' },
  { value: 'excel', label: 'Excel Spreadsheet' },
  { value: 'csv', label: 'CSV File' },
] as const;

export const REPORT_STATUS_OPTIONS = [
  { value: 'generating', label: 'Generating' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'cancelled', label: 'Cancelled' },
] as const;

// Status colors for UI
export const REPORT_STATUS_COLORS = {
  generating: 'blue',
  completed: 'green',
  failed: 'red',
  cancelled: 'gray',
} as const;

// Type guards
export const isReportType = (value: string): value is Report['type'] => {
  return [
    'attendance',
    'financial',
    'membership',
    'events',
    'giving',
    'activities',
  ].includes(value);
};

export const isReportStatus = (value: string): value is Report['status'] => {
  return ['generating', 'completed', 'failed', 'cancelled'].includes(value);
};

export const isReportFormat = (value: string): value is Report['format'] => {
  return ['pdf', 'excel', 'csv'].includes(value);
};

export const isDateRange = (value: string): value is Report['dateRange'] => {
  return [
    'last7days',
    'last30days',
    'last3months',
    'last6months',
    'lastyear',
    'custom',
  ].includes(value);
};
