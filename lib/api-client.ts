import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from './store/use-auth-store';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 50000,
});

// Add Authorization and multi-tenant X-Church-Id headers
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const authState = useAuthStore.getState();
  const token = authState.token;
  const user = authState.user;

  if (config.headers) {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Automatically attach active church ID for multi-tenant isolation
    const hasExplicitChurchHeader =
      Boolean(config.headers['X-Church-Id'] || config.headers['x-church-id']);

    const targetChurchId =
      user?.churchId ||
      config.data?.organizationId ||
      config.data?.churchId ||
      config.params?.organizationId ||
      config.params?.churchId;

    if (!hasExplicitChurchHeader && targetChurchId) {
      config.headers['X-Church-Id'] = targetChurchId;
    }
  }

  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Send refresh token in the JSON body matching backend RefreshRequest
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refresh_token: refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const { access_token, refresh_token: new_refresh_token } =
          response.data;
        useAuthStore.getState().setToken(access_token, new_refresh_token);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }

        processQueue(null, access_token);
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err as AxiosError, null);
        useAuthStore.getState().logout();
        // Redirect to login or trigger global logout event
        if (typeof window !== 'undefined') {
          const pathname = window.location.pathname;
          const isPublicRoute =
            pathname === '/' ||
            pathname.startsWith('/auth') ||
            pathname.startsWith('/shared');
          if (!isPublicRoute) {
            window.location.href = '/auth/member';
          }
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
