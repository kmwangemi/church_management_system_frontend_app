import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/lib/store/use-auth-store';
import type { LoginResponse } from '@/lib/types';
import type { LoginPayload } from '@/lib/validations/auth';
import { useMutation } from '@tanstack/react-query';

const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const { data } = await apiClient.post('/auth/login/admin', payload);
  return data;
};

const sendLoginCode = async (payload: any): Promise<LoginResponse> => {
  const { data } = await apiClient.post(
    '/auth/login/member/send-login-code',
    payload
  );
  return data;
};

const verifyLoginCode = async (
  payload: any
): Promise<LoginResponse> => {
  const { data } = await apiClient.post(
    '/auth/login/member/verify-login-code',
    payload
  );
  return data;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.access_token && data.refresh_token) {
        useAuthStore.getState().setToken(data.access_token, data.refresh_token);
        useAuthStore.getState().setUser(data.user as any);
      }
    },
  });
};

export const useSendLoginCode = () => {
  return useMutation({
    mutationFn: sendLoginCode,
  });
};

export const useVerifyLoginCode = () => {
  return useMutation({
    mutationFn: verifyLoginCode,
    onSuccess: (data) => {
      if (data.access_token && data.refresh_token) {
        useAuthStore.getState().setToken(data.access_token, data.refresh_token);
        useAuthStore.getState().setUser(data.user as any);
      }
    },
  });
};
