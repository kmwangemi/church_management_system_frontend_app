export interface Disciple {
  _id: string;
  churchId: string;
  branchId: string;
  memberId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  mentorId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  startDate: string;
  endDate?: string;
  currentLevel: string;
  status: 'active' | 'completed' | 'paused' | 'discontinued';
  goals: string;
  notes?: string;
  progress: number;
  milestonesCompleted: Array<{
    _id: string;
    name: string;
    points: number;
    category: string;
  }>;
  durationInDays: number;
  completionPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface DisciplesResponse {
  success: boolean;
  data: {
    disciples: Disciple[];
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

export interface DiscipleResponse {
  success: boolean;
  data: {
    disciple: Disciple;
    progressRecords: Array<{
      _id: string;
      milestoneId: {
        _id: string;
        name: string;
        points: number;
        category: string;
      };
      completedDate: string;
      pointsEarned: number;
      status: 'pending' | 'approved' | 'rejected';
      notes?: string;
      evidence?: string;
    }>;
    totalPoints: number;
    stats: {
      milestonesCompleted: number;
      pendingApproval: number;
      totalPoints: number;
    };
  };
}

export interface DiscipleFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  level?: string;
  mentorId?: string;
}
