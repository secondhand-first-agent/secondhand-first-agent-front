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

/**
 * 세션이 바뀌면 구독자에게 알립니다.
 * 헤더처럼 로그인 여부를 보여주는 화면이 localStorage 를 직접 폴링하지 않아도 되게 하려는 것입니다.
 */
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function subscribeSession(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getAccessToken() {
  return localStorage.getItem(KEYS.accessToken);
}

export function getUserId() {
  return localStorage.getItem(KEYS.userId);
}

export function setAccessToken(accessToken: string) {
  localStorage.setItem(KEYS.accessToken, accessToken);
  emit();
}

export function saveSession({ accessToken, tokenType, userId }: Session) {
  localStorage.setItem(KEYS.accessToken, accessToken);
  if (tokenType) localStorage.setItem(KEYS.tokenType, tokenType);
  if (userId) localStorage.setItem(KEYS.userId, userId);
  emit();
}

export function clearSession() {
  for (const key of Object.values(KEYS)) localStorage.removeItem(key);
  emit();
}
