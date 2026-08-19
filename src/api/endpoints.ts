/**
 * 서버 엔드포인트 경로.
 * refresh 경로만 확정이고 나머지는 백엔드와 맞춰야 합니다 — 바뀌면 여기만 고치면 됩니다.
 */
export const ENDPOINTS = {
  auth: {
    signup: '/users/signup',
    login: '/users/login',
    refresh: '/users/token/refresh',
  },
  products: {
    list: '/products',
  },
} as const;
