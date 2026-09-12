// Base interfaces for Content system
export interface IContentBase {
  _id: string;
  churchId: string;
  branchId: string;
  title: string;
  description: string;
  type: string;
  category: string;
  tags: string[];
  status: string;
  author: string;
  isPublic: boolean;
  viewCount: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// Extended Content interface with file properties
export interface IContent extends IContentBase {
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileMimeType?: string;
  // Virtual properties from Mongoose
  ageInDays?: number;
  formattedFileSize?: string;
  engagementScore?: number;
}


// API Response Types
export interface ContentAddResponse {
  success: boolean;
  data: IContent;
  message: string;
}

export interface ContentUpdateResponse {
  success: boolean;
  data: IContent;
  message: string;
}

export interface ContentListResponse {
  success: boolean;
  data: {
    content: IContent[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    filters: {
      search: string;
      type: string;
      category: string;
      status: string;
      tags: string;
      sortBy: string;
      sortOrder: string;
    };
  };
}

export interface ContentDeleteResponse {
  success: boolean;
  message: string;
}

// Content Statistics Types
export interface ContentStats {
  totalContent: number;
  publishedContent: number;
  draftContent: number;
  archivedContent: number;
  privateContent: number;
  totalViews: number;
  totalDownloads: number;
  contentByType: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  contentByCategory: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  contentByStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  recentContent: Array<{
    _id: string;
    title: string;
    type: string;
    status: string;
    createdAt: string;
    viewCount: number;
    downloadCount: number;
  }>;
  topAuthors: Array<{
    author: string;
    contentCount: number;
    totalViews: number;
    totalDownloads: number;
  }>;
}

export interface ContentStatsResponse {
  success: boolean;
  data: ContentStats;
}

// Popular Content Types
export interface PopularContent {
  _id: string;
  title: string;
  type: string;
  category: string;
  author: string;
  viewCount: number;
  downloadCount: number;
  engagementScore: number;
  publishedAt?: string;
  createdAt: string;
}

export interface PopularContentResponse {
  success: boolean;
  data: {
    content: PopularContent[];
    timeframe: string;
    metric: string;
  };
}

// Content Analytics Types
export interface ContentAnalytics {
  contentId: string;
  title: string;
  type: string;
  category: string;
  status: string;
  author: string;
  publishedAt?: string;
  createdAt: string;
  metrics: {
    views: {
      total: number;
      daily: Array<{ date: string; count: number }>;
      weekly: Array<{ week: string; count: number }>;
      monthly: Array<{ month: string; count: number }>;
    };
    downloads: {
      total: number;
      daily: Array<{ date: string; count: number }>;
      weekly: Array<{ week: string; count: number }>;
      monthly: Array<{ month: string; count: number }>;
    };
    engagement: {
      score: number;
      viewToDownloadRatio: number;
      averageTimeSpent?: number;
      uniqueViewers?: number;
    };
  };
  comparisons: {
    previousPeriod: {
      views: number;
      downloads: number;
      viewsChange: number;
      downloadsChange: number;
    };
    categoryAverage: {
      views: number;
      downloads: number;
      performanceRatio: number;
    };
  };
}

export interface ContentAnalyticsResponse {
  success: boolean;
  data: ContentAnalytics;
}

// Bulk Operations Types
export interface BulkOperationResponse {
  success: boolean;
  message: string;
  processed: number;
  failed: number;
  errors?: Array<{
    contentId: string;
    error: string;
  }>;
}

// File Upload Types
export interface FileUploadResponse {
  success: boolean;
  data: {
    fileUrl: string;
    fileName: string;
    fileSize: number;
    fileMimeType: string;
  };
  message: string;
}

// Search Result Types
export interface ContentSearchResult {
  _id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  tags: string[];
  status: string;
  author: string;
  createdAt: string;
  publishedAt?: string;
  viewCount: number;
  downloadCount: number;
  // Search-specific fields
  score: number;
  matchedFields: string[];
  highlights: {
    title?: string[];
    description?: string[];
    tags?: string[];
  };
}

export interface ContentSearchResponse {
  success: boolean;
  data: {
    results: ContentSearchResult[];
    totalResults: number;
    searchTime: number;
    suggestions?: string[];
    facets: {
      types: Array<{ type: string; count: number }>;
      categories: Array<{ category: string; count: number }>;
      statuses: Array<{ status: string; count: number }>;
      authors: Array<{ author: string; count: number }>;
    };
  };
  query: string;
}

// Filter and Sort Types
export interface ContentFilters {
  search?: string;
  type?: string | '';
  category?: string | '';
  status?: string | '';
  tags?: string[];
  author?: string;
  dateFrom?: Date;
  dateTo?: Date;
  hasFile?: boolean;
  minViews?: number;
  maxViews?: number;
}

export interface ContentSortOptions {
  sortBy:
    | 'createdAt'
    | 'updatedAt'
    | 'publishedAt'
    | 'title'
    | 'viewCount'
    | 'downloadCount';
  sortOrder: 'asc' | 'desc';
}

// Content Form Types (for React forms)
export interface ContentFormData {
  title: string;
  description: string;
  type: string | '';
  category: string | '';
  tags: string;
  status: string;
  isPublic: boolean;
  file?: File;
}

// Content Table Types (for data tables)
export interface ContentTableRow {
  _id: string;
  title: string;
  type: string;
  category: string;
  status: string;
  author: string;
  viewCount: number;
  downloadCount: number;
  createdAt: string;
  publishedAt?: string;
  hasFile: boolean;
}

// Content Card Types (for UI components)
export interface ContentCardData {
  _id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  status: string;
  author: string;
  tags: string[];
  viewCount: number;
  downloadCount: number;
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
  publishedAt?: string;
}

// Activity Log Types (for content history)
export interface ContentActivity {
  _id: string;
  contentId: string;
  action:
    | 'created'
    | 'updated'
    | 'published'
    | 'archived'
    | 'deleted'
    | 'viewed'
    | 'downloaded';
  userId: string;
  userName: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface ContentActivityResponse {
  success: boolean;
  data: {
    activities: ContentActivity[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Content Validation Types
export interface ContentValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ContentValidationResponse {
  success: boolean;
  errors: ContentValidationError[];
}

// Export utility types
export type CreateContentData = Omit<
  IContent,
  '_id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'downloadCount'
>;
export type UpdateContentData = Partial<
  Omit<IContent, '_id' | 'churchId' | 'createdAt' | 'updatedAt'>
>;
export type ContentSummary = Pick<
  IContent,
  '_id' | 'title' | 'type' | 'status' | 'createdAt' | 'viewCount'
>;
