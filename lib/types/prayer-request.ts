export interface PrayerRequest {
  memberId?: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  isAnonymous: boolean;
  isPublic: boolean;
}

export interface PrayerRequestAddResponse {
  success: boolean;
  data: PrayerRequest;
  message: string;
}

export interface PrayerRequestListResponse {
  success: boolean;
  data: {
    prayerRequests: PrayerRequest[];
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

export interface PrayerCountUpdateResponse {
  success: boolean;
  data: {
    prayerRequestId: string;
    prayerCount: number;
  };
  message: string;
}
