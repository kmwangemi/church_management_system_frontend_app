export interface Milestone {
  _id: string;
  churchId: string;
  branchId: string;
  name: string;
  description: string;
  category: string;
  points: number;
  requirements?: string;
  isActive: boolean;
  order: number;
  level: string;
  prerequisiteMilestones: Array<{
    _id: string;
    name: string;
    points: number;
    category: string;
    level: string;
  }>;
  completionCount: number;
  difficulty: string;
  formattedPoints: string;
  createdAt: string;
  updatedAt: string;
}

export interface MilestonesResponse {
  success: boolean;
  data: {
    milestones: Milestone[];
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

export interface MilestoneResponse {
  success: boolean;
  data: {
    milestone: Milestone;
    stats: {
      approved: number;
      pending: number;
      rejected: number;
      total: number;
    };
    recentCompletions: Array<{
      _id: string;
      discipleId: {
        memberId: {
          firstName: string;
          lastName: string;
        };
      };
      verifiedBy: {
        firstName: string;
        lastName: string;
      };
      completedDate: string;
      pointsEarned: number;
      status: string;
    }>;
  };
}

export interface MilestoneFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  level?: string;
  isActive?: boolean;
}
