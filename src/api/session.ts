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
