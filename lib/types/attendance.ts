import type { BranchAddResponse } from '@/lib/types/branch';
import type { UserResponse } from '@/lib/types/user';

export interface AttendanceRecord {
  userId: UserResponse | string;
  checkInTime: string;
  checkOutTime?: string;
  status: 'present' | 'late' | 'absent' | 'excused';
  notes?: string;
}

export interface ServiceScheduleResponse {
  _id: string;
  service: string;
  day: string;
  time: string;
  type: string;
  duration?: number;
}

export interface AttendanceResponse {
  _id: string;
  churchId: string;
  branchId: BranchAddResponse | string;
  serviceScheduleId: ServiceScheduleResponse | string;
  attendanceDate: string;
  totalExpected?: number;
  totalPresent: number;
  totalLate: number;
  totalAbsent: number;
  totalExcused: number;
  attendancePercentage: number;
  records: AttendanceRecord[];
  takenBy: UserResponse | string;
  status: 'draft' | 'submitted' | 'approved' | 'archived';
  remarks?: string;
  weatherConditions?: string;
  specialEvents?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Virtuals
  totalAttended?: number;
  formattedAttendancePercentage?: string;
  attendanceSummary?: {
    totalRecords: number;
    totalAttended: number;
    totalPresent: number;
    totalLate: number;
    totalAbsent: number;
    totalExcused: number;
    attendanceRate: number;
  };
}

export interface AttendanceListResponse {
  attendance: AttendanceResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  searchTerm?: string;
  searchResults?: number;
  statusFilter?: string;
}

export interface AttendanceSingleResponse {
  attendance: AttendanceResponse;
  message?: string;
}

export interface AttendanceDeleteResponse {
  attendance?: AttendanceResponse;
  message: string;
}
