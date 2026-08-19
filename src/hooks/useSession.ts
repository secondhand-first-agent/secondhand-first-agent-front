import { useSyncExternalStore } from 'react';

import { getAccessToken, subscribeSession } from '@/api/session';

export function useSession() {
  const accessToken = useSyncExternalStore(
    subscribeSession,
    () => getAccessToken(),
    () => null
  );

  return { isLoggedIn: Boolean(accessToken) };
}
