import apiClient from '../api-client';
import { useAuthStore } from '../store/use-auth-store';
export const authService = {
  login: async (credentials: any) => {
    const payload = {
      email: credentials.email,
      password: credentials.password,
    };
    const response = await apiClient.post('/auth/login', payload);
    useAuthStore.getState().setToken(response.data.access_token, response.data.refresh_token);
    useAuthStore.getState().setUser(response.data.user);
    return response.data;
  },
  
  signup: async (userData: any) => {
    const response = await apiClient.post('/auth/signup', userData);
    return response.data;
  },
  
  logout: async () => {
    try {
      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refresh_token: refreshToken });
      }
    } finally {
      useAuthStore.getState().logout();
    }
  },
  
  logoutAll: async () => {
    try {
      await apiClient.post('/auth/logout-all');
    } finally {
      useAuthStore.getState().logout();
    }
  }
};
