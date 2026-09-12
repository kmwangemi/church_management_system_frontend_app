import type { Pagination } from '@/lib/types';
import type { UserResponse } from '@/lib/types/user';

export interface ServiceScheduleAddResponse {
  churchId: string;
  branchId: string;
  day:
    | 'sunday'
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday';
  time: string;
  service: string;
  attendance?: number;
  type:
    | 'worship'
    | 'prayer'
    | 'bible_study'
    | 'youth'
    | 'children'
    | 'special'
    | 'fellowship';
  duration?: number; // in minutes
  facilitator?: string;
  location?: string;
  recurring: boolean;
  startDate?: Date;
  endDate?: Date;
  notes?: string;
  isActive: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ServiceSchedule {
  _id: string;
  churchId: string;
  branchId: {
    _id: string;
    branchName: string;
    address: string;
    country: string;
  };
  day:
    | 'sunday'
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday';
  time: string;
  service: string;
  attendance?: number;
  type:
    | 'worship'
    | 'prayer'
    | 'bible_study'
    | 'youth'
    | 'children'
    | 'special'
    | 'fellowship';
  duration?: number; // in minutes
  facilitator?: UserResponse;
  location?: string;
  recurring: boolean;
  startDate?: string;
  endDate?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ServiceScheduleListResponse {
  schedules: ServiceSchedule[];
  pagination: Pagination;
}

export interface ServiceScheduleStatsResponse {
  totalSchedules: number;
  activeSchedules: number;
  inactiveSchedules: number;
}
