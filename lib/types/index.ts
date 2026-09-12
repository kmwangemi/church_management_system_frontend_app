export type OrganizationRole =
  | 'ADMIN'
  | 'MEMBER'
  | 'PASTOR'
  | 'BISHOP'
  | 'STAFF'
  | 'VOLUNTEER'
  | (string & {});
import type { UserResponse } from '@/lib/types/user';
import type { UseFormReturn } from 'react-hook-form';

// Form data interface
export interface UserFormData {
  // Pastor update
  pastorUpdate?: {
    pastorId: string;
    ordinationDate: string;
    sermonCount: number;
    counselingSessions: number;
    biography: string;
  };
  // Bishop update
  bishopUpdate?: {
    bishopId: string;
    appointmentDate: string;
    jurisdictionArea: string;
    biography: string;
  };
  // Admin update
  adminUpdate?: {
    adminId: string;
    accessLevel: string;
  };
  // Super Admin update
  superAdminUpdate?: {
    superAdminId: string;
    accessLevel: string;
  };
  // Visitor update
  visitorUpdate?: {
    visitorId: string;
    visitDate: string;
    howDidYouHear: string;
    followUpStatus: string;
    interestedInMembership: boolean;
    invitedBy: string;
  };
  // Member update
  memberUpdate?: {
    memberId: string;
    membershipDate: string;
    membershipStatus: string;
    baptismDate: string;
    joinedDate: string;
  };
  // Staff update
  staffUpdate?: {
    staffId: string;
    jobTitle: string;
    department: string;
    employmentType: string;
    startDate: string;
    salary: number;
    isActive: boolean;
  };
  // Volunteer update
  volunteerUpdate?: {
    volunteerId: string;
    volunteerStatus: string;
    availabilitySchedule: {
      days: string[];
      preferredTimes: string[];
    };
    departments: string[];
    backgroundCheck: {
      completed: boolean;
      clearanceLevel: string;
      completedDate?: string;
      expiryDate?: string;
    };
    hoursContributed: number;
  };
  // General fields
  isStaff?: boolean;
  isVolunteer?: boolean;
}

// Component prop interfaces
export interface PastorUpdateCardProps {
  form: UseFormReturn<UserFormData>;
}

export interface BishopUpdateCardProps {
  form: UseFormReturn<UserFormData>;
}

export interface AdminUpdateCardProps {
  form: UseFormReturn<UserFormData>;
}

export interface SuperAdminUpdateCardProps {
  form: UseFormReturn<UserFormData>;
}

export interface VisitorUpdateCardProps {
  form: UseFormReturn<UserFormData>;
}

export interface MemberUpdateCardProps {
  form: UseFormReturn<UserFormData>;
}

export interface StaffUpdateCardProps {
  form: UseFormReturn<UserFormData>;
}

export interface VolunteerUpdateCardProps {
  form: UseFormReturn<UserFormData>;
}

export interface RestSpecificFormProps {
  roles: OrganizationRole[];
  form: UseFormReturn<UserFormData | any>;
}

export interface RoleSpecificFormProps {
  roles: OrganizationRole[];
  position: string | undefined;
  form: UseFormReturn<UserFormData | any>;
}

export interface StaffUpdateFormProps {
  roles: OrganizationRole[];
  form: UseFormReturn<UserFormData | any>;
}

export interface UserViewProps {
  user: UserResponse | undefined;
  roles?: OrganizationRole[]; // Add roles array
  position?: string | undefined;
}

export interface RoleViewProps {
  position: string | undefined;
  user: UserResponse | undefined;
  roles?: OrganizationRole[]; // Add roles array
}
