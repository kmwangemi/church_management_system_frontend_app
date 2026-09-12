import type { Pagination } from '@/lib/types';
import type { UserResponse } from '@/lib/types/user';

export interface ActivityAddResponse {
  churchId: string;
  branchId: string;
  _id: string;
  date: string;
  activity: string;
  participants: number;
  type:
    | 'service'
    | 'meeting'
    | 'event'
    | 'program'
    | 'ministry'
    | 'social'
    | 'outreach';
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled' | 'postponed';
  startTime?: string;
  endTime?: string;
  location?: string;
  facilitator?: string;
  budget?: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  churchId: string;
  branchId: string;
  _id: string;
  date: string;
  activity: string;
  participants: number;
  type:
    | 'service'
    | 'meeting'
    | 'event'
    | 'program'
    | 'ministry'
    | 'social'
    | 'outreach';
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled' | 'postponed';
  startTime?: string;
  endTime?: string;
  location?: string;
  facilitator?: UserResponse;
  budget?: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface ActivityListResponse {
  activities: Activity[];
  pagination: Pagination;
}

export interface ActivityStatsResponse {
  totalActivities: number;
  activitiesByType: Record<string, number>;
  activitiesByStatus: Record<string, number>;
}
