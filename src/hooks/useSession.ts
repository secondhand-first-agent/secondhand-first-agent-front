import { useSyncExternalStore } from 'react';

import { getAccessToken, subscribeSession } from '@/api/session';

/**
 * 로그인 여부를 구독합니다.
 * 상태를 따로 두지 않고 localStorage 를 그대로 읽으므로, 새로고침해도 어긋나지 않습니다.
 */
export function useSession() {
  const accessToken = useSyncExternalStore(
    subscribeSession,
    () => getAccessToken(),
    () => null // 서버 렌더링 시에는 항상 로그아웃 상태
  );

  return { isLoggedIn: Boolean(accessToken) };
}
