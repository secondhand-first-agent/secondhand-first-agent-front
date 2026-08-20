import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { ENDPOINTS } from './endpoints';
import { clearSession, getAccessToken, setAccessToken } from './session';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

let refreshPromise: Promise<string> | null = null;

const CREDENTIAL_ENDPOINTS: string[] = [ENDPOINTS.auth.login, ENDPOINTS.auth.password, ENDPOINTS.auth.refresh];

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

function redirectToLogin() {
  clearSession();
  window.location.href = '/login';
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 100000,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${BASE_URL}${ENDPOINTS.auth.refresh}`, null, { withCredentials: true })
      .then((response) => {
        const accessToken: string | undefined = response.data?.data?.accessToken;

        if (!accessToken) {
          throw new Error('토큰 재발급 실패');
        }

        setAccessToken(accessToken);

        return accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined;
    const status = error.response?.status;
    const url = originalRequest?.url ?? '';
    const isCredentialRequest = CREDENTIAL_ENDPOINTS.some((endpoint) => url.includes(endpoint));

    if (status !== 401 || !originalRequest || originalRequest._retry || isCredentialRequest) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const accessToken = await refreshAccessToken();

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      redirectToLogin();

      return Promise.reject(new Error('세션이 만료되었습니다.', { cause: refreshError }));
    }
  }
);

export default apiClient;
