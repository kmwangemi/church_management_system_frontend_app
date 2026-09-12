import type { Address, Pagination } from '@/lib/types';
import type { Branch } from '@/lib/types/branch';
import type { Department } from '@/lib/types/department';
import type { Group } from '@/lib/types/small-group';

export interface UserAddResponse {
  message: string;
  memberId: string;
  branchId: string;
  userId: string;
}

export type UserRole =
  | 'member'
  | 'pastor'
  | 'bishop'
  | 'staff'
  | 'admin'
  | 'superadmin'
  | 'visitor';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed';

export interface EmergencyDetails {
  emergencyContactFullName?: string;
  emergencyContactEmail?: string;
  emergencyContactPhoneNumber?: string;
  emergencyContactRelationship?: string;
  emergencyContactAddress?: string;
  emergencyContactNotes?: string;
}

/* --- Role-specific details (re-usable types) --- */
export interface MemberDetails {
  memberId: string;
  membershipDate: Date;
  membershipStatus: 'active' | 'inactive' | 'transferred' | 'deceased';
  departmentIds: Department[];
  groupIds: Group[];
  occupation: string;
  baptismDate?: Date;
  joinedDate?: Date;
}

export interface PastorDetails {
  pastorId: string;
  ordinationDate: Date;
  qualifications: string[];
  specializations: string[];
  assignments: {
    branchId: string;
    position: string;
    startDate: Date;
    isActive: boolean;
  }[];
  sermonCount: number;
  counselingSessions: number;
  biography: string;
}

export interface BishopDetails {
  bishopId: string;
  appointmentDate: Date;
  jurisdictionArea: string;
  oversight: {
    branchIds: string[];
    pastorIds: string[];
  };
  qualifications: string[];
  achievements: string[];
  biography: string;
}

export interface StaffDetails {
  staffId: string;
  jobTitle: string;
  department: string;
  startDate: Date;
  salary: number;
  employmentType: 'full-time' | 'part-time' | 'contract';
  isActive: boolean;
}

export interface VolunteerDetails {
  volunteerId: string;
  volunteerStatus: 'active' | 'inactive' | 'on_hold' | 'suspended';
  availabilitySchedule: {
    days: string[];
    timeSlots: string[];
    preferredTimes: string[];
  };
  departments: string[];
  volunteerRoles: {
    role: string;
    department: string;
    startDate: Date;
    isActive: boolean;
  }[];
  backgroundCheck: {
    completed: boolean;
    completedDate: Date;
    expiryDate: Date;
    clearanceLevel: 'children_ministry' | 'youth_ministry' | 'general';
  };
  hoursContributed: number;
}

export interface AdminDetails {
  adminId: string;
  accessLevel: 'national' | 'regional' | 'branch';
  assignedBranches: string[];
}

export interface SuperAdminDetails {
  superAdminId: string;
  accessLevel: 'global' | 'system';
  systemSettings: {
    canCreateChurches: boolean;
    canDeleteChurches: boolean;
    canManageUsers: boolean;
    canAccessAnalytics: boolean;
    canManageSubscriptions: boolean;
    canAccessSystemLogs: boolean;
  };
  companyInfo: {
    position: string;
    department: string;
    startDate: Date;
  };
}

export interface VisitorDetails {
  visitorId: string;
  visitDate: Date;
  invitedBy: string;
  howDidYouHear: 'friend' | 'family' | 'online' | 'flyer' | 'other';
  followUpStatus: 'interested' | 'not_interested' | 'pending';
  followUpDate?: Date;
  followUpNotes?: string;
  interestedInMembership: boolean;
  servicesAttended: string[];
}

export interface UserResponse {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber: string;
  address?: Address;
  dateOfBirth?: Date;
  gender: 'male' | 'female';
  profilePictureUrl?: string;
  occupation?: string;
  churchId?: string;
  branchId?: Branch;
  isMember: boolean;
  role: UserRole;
  isStaff: boolean;
  isVolunteer: boolean;
  /* Role-specific */
  memberDetails?: MemberDetails;
  pastorDetails?: PastorDetails;
  bishopDetails?: BishopDetails;
  staffDetails?: StaffDetails;
  volunteerDetails?: VolunteerDetails;
  adminDetails?: AdminDetails;
  superAdminDetails?: SuperAdminDetails;
  visitorDetails?: VisitorDetails;
  /* Account */
  status: UserStatus;
  isEmailVerified: boolean;
  lastLogin?: Date;
  passwordHash?: string;
  /* Audit fields */
  createdBy?: string;
  updatedBy?: string;
  /* Verification / Auth */
  verificationCode?: string;
  verificationCodeExpiresAt?: Date;
  lastCodeSentAt?: Date;
  failedVerificationAttempts?: number;
  isPasswordUpdated: boolean;
  agreeToTerms: boolean;
  isDeleted: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  /* Security & Rate limiting */
  loginAttempts: number;
  lockUntil?: Date;
  /* Misc */
  maritalStatus: MaritalStatus;
  emergencyDetails?: EmergencyDetails;
  notes?: string;
  skills?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserListResponse {
  users: UserResponse[];
  pagination: Pagination;
}
