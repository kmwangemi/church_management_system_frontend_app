import apiClient from '../api-client';

export const superadminService = {
  // Dashboard overview
  getDashboard: async () => {
    const response = await apiClient.get('/superadmin/dashboard');
    return response.data;
  },

  // Branches
  getBranches: async (params?: { search?: string; churchId?: string; status?: string }) => {
    const response = await apiClient.get('/superadmin/branches', { params });
    return response.data;
  },

  createBranch: async (branchData: any) => {
    const response = await apiClient.post('/superadmin/branches', branchData);
    return response.data;
  },

  updateBranch: async (branchId: string, branchData: any) => {
    const response = await apiClient.put(`/superadmin/branches/${branchId}`, branchData);
    return response.data;
  },

  deleteBranch: async (branchId: string) => {
    const response = await apiClient.delete(`/superadmin/branches/${branchId}`);
    return response.data;
  },

  // Users
  getUsers: async (params?: { search?: string; role?: string; status?: string; churchId?: string }) => {
    const response = await apiClient.get('/superadmin/users', { params });
    return response.data;
  },

  createUser: async (userData: any) => {
    const response = await apiClient.post('/superadmin/users', userData);
    return response.data;
  },

  updateUser: async (userId: string, userData: any) => {
    const response = await apiClient.put(`/superadmin/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await apiClient.delete(`/superadmin/users/${userId}`);
    return response.data;
  },

  toggleUserStatus: async (userId: string) => {
    const response = await apiClient.post(`/superadmin/users/${userId}/status`);
    return response.data;
  },

  // Analytics
  getAnalytics: async (params?: { timeRange?: string }) => {
    const response = await apiClient.get('/superadmin/analytics', { params });
    return response.data;
  },

  // System Health
  getSystemHealth: async () => {
    const response = await apiClient.get('/superadmin/system-health');
    return response.data;
  },

  // Settings
  getSettings: async () => {
    const response = await apiClient.get('/superadmin/settings');
    return response.data;
  },

  updateSettings: async (settingsData: any) => {
    const response = await apiClient.put('/superadmin/settings', settingsData);
    return response.data;
  },
};

