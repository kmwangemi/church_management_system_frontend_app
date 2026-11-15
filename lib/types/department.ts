import type { Address, Pagination } from '@/lib/types';

export type ActivityType = 'meeting' | 'prayer' | 'social' | 'outreach' | 'other';
export type DepartmentCategory = 'adults' | 'youth' | 'children' | 'music' | 'worship' | 'other';
export type ExpenseCategory = 'supplies' | 'equipment' | 'events' | 'travel' | 'other';
export type GoalStatus = 'planned' | 'in-progress' | 'completed' | 'cancelled' | 'overdue';
export type MemberRole = 'member' | 'leader' | 'assistant';

export interface DepartmentMember {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    profilePictureUrl?: string;
  };
  role: MemberRole;
  skills: string[];
  joinedDate: string;
  isActive: boolean;
  notes?: string;
}

export interface DepartmentBudgetCategory {
  category: ExpenseCategory;
  allocatedAmount: number;
  spentAmount: number;
  description?: string;
}

export interface DepartmentExpense {
  _id: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  date: Date;
  approvedBy?: string;
  receiptUrl?: string;
  reference?: string;
  vendor?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DepartmentActivity {
  _id: string;
  title: string;
  description: string;
  type: ActivityType;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  participants: {
    _id: string;
    firstName: string;
    lastName: string;
    isLocked: boolean;
    fullName: string;
  }[];
  organizedBy: string;
  notes?: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DepartmentGoal {
  _id: string;
  title: string;
  description: string;
  targetDate: Date;
  status: GoalStatus;
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

export interface DepartmentAddResponse {
  _id: string;
  churchId: string;
  branchId: string;
  leaderId: string | null;
  departmentName: string;
  meetingDay: string[];
  meetingTime: string[];
  budget: number; // maps to totalBudget
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface Department {
  _id: string;
  id?: string;
  churchId: string;
  branchId: {
    _id: string;
    branchName: string;
    address?: Address;
  } | null;
  leaderId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    profilePictureUrl: string;
  } | null;
  departmentName: string;
  meetingDay: string[];
  meetingTime: string[];
  description: string;
  location?: string;
  category: DepartmentCategory | string;
  establishedDate: string;
  isActive: boolean;
  isDeleted: boolean;
  totalBudget: number;
  spentBudget?: number;
  growth?: number;
  memberCount?: number;
  _count?: {
    members?: number;
    activities?: number;
    monthlyActivities?: number;
    expenses?: number;
  };
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface DepartmentAnalytics {
  totalDepartments: number;
  activeDepartments: number;
  totalMembers: number;
  totalBudget: number;
  totalSpent: number;
  monthlyActivities: number;
  totalActivities: number;
  activityData: {
    month: string;
    worship: number;
    children: number;
    youth: number;
    outreach: number;
    education: number;
    prayer: number;
    total: number;
  }[];
  memberDistribution: {
    name: string;
    value: number;
    color: string;
  }[];
  departmentBudgets: {
    name: string;
    budget: number;
    spent: number;
  }[];
}

export interface DepartmentListResponse {
  departments: Department[];
  analytics?: DepartmentAnalytics;
  pagination: Pagination;
}

interface DepartmentInfo {
  id: string;
  departmentName: string;
  description?: string;
}

export interface DepartmentMembersResponse {
  success: boolean;
  data: {
    members: DepartmentMember[];
    department: DepartmentInfo;
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

export interface DepartmentActivitiesResponse {
  success: boolean;
  data: {
    activities: DepartmentActivity[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalActivities: number;
      hasMore: boolean;
    };
  };
}

export interface DepartmentExpensesResponse {
  success: boolean;
  expenses: DepartmentExpense[];
  pagination: Pagination;
  summary: {
    filteredTotal: number;
    departmentName: string;
    totalBudget: number;
    totalSpent: number;
    remainingBudget: number;
    budgetCategories: [];
  };
}

export interface DepartmentGoalsResponse {
  success: boolean;
  data: {
    goals: DepartmentGoal[];
    pagination: Pagination;
  };
}
