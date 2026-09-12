export interface RecipientGroup {
  id: string;
  name: string;
  count: number;
  type: 'system' | 'department' | 'group';
  description: string;
  targetModel: 'User' | 'Department' | 'Group';
  targetId?: string;
  criteria: Record<string, any>;
}

export interface RecipientGroupsResponse {
  success: boolean;
  data: {
    groups: RecipientGroup[];
    total: number;
  };
}
