export interface MembersResponse {
  members: Member[];
  pagination: Pagination;
}

export interface Member {
  id: string;
  organizationId: string;
  userId: string;
  role: string[];
  position: string;
  createdAt: Date; // ISO date string
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  phoneNumber: string;
  occupation: string | null;
  gender: 'MALE' | 'FEMALE' | string; // Allow extension
  maritalStatus: string | null;
  globalRole: string;
  status: 'ACTIVE' | 'INACTIVE' | string;
  createdAt: string;
  address: Address | null;
  emergencyContact: EmergencyContact | null;
  teammembers: TeamMember[];
}

export interface Address {
  id: string;
}

export interface EmergencyContact {
  // Define when available
  [key: string]: any;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  createdAt: string;
  team: Team;
}

export interface Team {
  id: string;
  name: string;
}

export interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}
