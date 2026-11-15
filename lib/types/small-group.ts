import type { Pagination } from '@/lib/types';
export type GroupActivityType = 'meeting' | 'prayer' | 'social' | 'outreach' | 'other';
export type GroupGoalStatus = 'planned' | 'in-progress' | 'completed' | 'cancelled' | 'overdue';
export type GroupMemberRole = 'member' | 'leader' | 'assistant';

export interface GroupAddResponse {
  churchId: string;
  branchId: string;
  departmentName: string;
  meetingDay: string[];
  meetingTime: string;
  description: string;
  isActive: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GroupStats {
  totalMembers: number;
  activeMembers: number;
  averageAttendance: number;
  totalActivities: number;
  completedGoals: number;
}

export interface Leader {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isLocked: boolean;
  fullName: string;
  id: string;
}

export interface Group {
  stats: GroupStats;
  _id: string;
  churchId: string;
  groupName: string;
  leaderId: Leader;
  description: string;
  category: string;
  establishedDate: string;
  meetingDay: string[]; // e.g., ["monday", "tuesday"]
  meetingTime: string[]; // e.g., ["02:30", "03:15"]
  location: string;
  capacity: number;
  memberCount?: number;
  members?: number;
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

export interface GroupAnalytics {
  totalGroups: number;
  activeGroups: number;
  totalMembers: number;
  totalCapacity: number;
  capacityUtilization: number;
  availableSpots: number;
  monthlyActivities: number;
  attendanceData: {
    month: string;
    total: number;
    active: number;
    new: number;
  }[];
  categoryDistribution: {
    name: string;
    category?: string;
    value: number;
    color: string;
  }[];
  meetingDays: {
    day: string;
    groups: number;
  }[];
  activityData: {
    month: string;
    worship: number;
    children: number;
    youth: number;
    outreach: number;
    education: number;
    prayer: number;
    total?: number;
  }[];
}

export interface GroupListResponse {
  groups: Group[];
  analytics?: GroupAnalytics;
  pagination: Pagination;
}

export interface GroupGoal {
  _id: string;
  title: string;
  description: string;
  targetDate: Date;
  status: GroupGoalStatus;
  progress: number;
  assignee?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  priority: string;
  category: string;
  success: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupGoalsResponse {
  success: boolean;
  data: {
    goals: GroupGoal[];
    summary: {
      total: number;
      planned: number;
      inProgress: number;
      completed: number;
      cancelled: number;
      overdue: number;
      averageProgress: number;
    };
    pagination: Pagination;
  };
}

export interface Participant {
  _id: string;
  firstName: string;
  lastName: string;
  isLocked: boolean;
  fullName: string;
  id: string;
}

export interface GroupActivity {
  title: string;
  description: string;
  type: GroupActivityType; // e.g., "meeting"
  date: string; // ISO date string
  startTime: string; // e.g., "01:00"
  endTime: string; // e.g., "03:15"
  location: string;
  participants: Participant[];
  attendance: any[]; // could be refined later if attendance has structure
  isCompleted: boolean;
  _id: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface GroupActivitiesResponse {
  success: boolean;
  activities: GroupActivity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface GroupMember {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    profilePictureUrl?: string;
  };
  role: GroupMemberRole;
  joinedDate: string;
  isActive: boolean;
  notes?: string;
}

export interface GroupMembersResponse {
  success: boolean;
  data: {
    members: GroupMember[];
    summary: {
      total: number;
      active: number;
      inactive: number;
      leaders: number;
      assistantLeaders: number;
      members: number;
      capacity: number;
      capacityUsed: number;
    };
    pagination: {
      currentPage: number;
      totalPages: number;
      totalMembers: number;
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

// Types for the attendance summary response
interface AttendanceSummary {
  date: string;
  activityId: string;
  title: string;
  type: string;
  isCompleted: boolean;
  totalExpected: number;
  totalPresent: number;
  totalLate: number;
  totalAbsent: number;
  totalExcused: number;
  attendanceRate: number;
  records?: any[]; // Only included if includeRecords=true
}

interface OverallStats {
  totalActivities: number;
  activitiesWithAttendance: number;
  averageAttendanceRate: number;
  totalExpected: number;
  totalPresent: number;
  totalLate: number;
  totalAbsent: number;
  totalExcused: number;
  bestAttendanceRate: number;
  worstAttendanceRate: number;
}

interface AttendanceInsights {
  bestAttendanceActivity: {
    title: string;
    date: string;
    rate: number;
  } | null;
  worstAttendanceActivity: {
    title: string;
    date: string;
    rate: number;
  } | null;
}

interface AttendanceFilters {
  dateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  limit: number;
  includeRecords: boolean;
}

export interface AttendanceSummaryResponse {
  success: boolean;
  data: {
    summaries: AttendanceSummary[];
    overallStats: OverallStats;
    insights: AttendanceInsights;
    filters: AttendanceFilters;
  };
}
