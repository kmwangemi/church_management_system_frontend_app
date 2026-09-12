import type { Address } from '@/lib/types';

export interface BranchAddResponse {
  churchId: string;
  branchName: string;
  address: Address;
  capacity: number;
  establishedDate: string;
  isActive: boolean;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface TeamMemberUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  phoneNumber?: string | null;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  createdAt: string; // ISO date string
  user: TeamMemberUser;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
}

export interface TeamCount {
  teammembers: number;
}

/**
 * Represents a "Branch" (aka Team in your API)
 */
export interface Branch {
  id: string;
  name: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  email?: string | null;
  phoneNumber?: string | null;
  capacity?: number | null;
  memberCount: number;
  establishedDate?: string | null; // ISO string
  description?: string | null;
  isActive: boolean;
  isDeleted: boolean;
  metadata?: Record<string, any> | null;
  organization: Organization;
  address: Address[];
  teammembers: TeamMember[];
  _count: TeamCount;
}

/**
 * Pagination structure from the API
 */
export interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * Root response for branches
 */
export interface BranchListResponse {
  teams: Branch[];
  pagination: Pagination;
}
