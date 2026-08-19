/** apiClient 가 읽고 쓰는 localStorage 키. 다른 곳에서 직접 접근하지 않습니다. */
const KEYS = {
  accessToken: 'accessToken',
  tokenType: 'tokenType',
  userId: 'userId',
} as const;

export interface Session {
  accessToken: string;
  tokenType?: string;
  userId?: string;
}

export function getAccessToken() {
  return localStorage.getItem(KEYS.accessToken);
}

export function setAccessToken(accessToken: string) {
  localStorage.setItem(KEYS.accessToken, accessToken);
}

export function saveSession({ accessToken, tokenType, userId }: Session) {
  localStorage.setItem(KEYS.accessToken, accessToken);
  if (tokenType) localStorage.setItem(KEYS.tokenType, tokenType);
  if (userId) localStorage.setItem(KEYS.userId, userId);
}

export function clearSession() {
  for (const key of Object.values(KEYS)) localStorage.removeItem(key);
}
