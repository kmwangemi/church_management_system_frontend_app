import apiClient from '../api-client';

export const groupsService = {
  getGroups: async () => {
    const response = await apiClient.get('/groups/');
    return response.data;
  },
  
  createGroup: async (groupData: any) => {
    const response = await apiClient.post('/groups/', groupData);
    return response.data;
  },
  
  deleteGroup: async (groupId: string) => {
    const response = await apiClient.delete(`/groups/${groupId}`);
    return response.data;
  }
};
