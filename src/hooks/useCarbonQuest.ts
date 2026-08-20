import { useSyncExternalStore } from 'react';

import { DAILY_VIEW_GOAL, getEarnedPoints, getViewedCount, subscribeCarbonQuest } from '@/features/rewards/carbonQuest';

/**
 * 두 값을 따로 구독합니다. 하나의 객체로 묶어서 돌려주면 매번 새 객체가 만들어져
 * `useSyncExternalStore` 가 무한 루프로 판단합니다.
 */
export function useCarbonQuest() {
  const viewed = useSyncExternalStore(subscribeCarbonQuest, getViewedCount, () => 0);
  const points = useSyncExternalStore(subscribeCarbonQuest, getEarnedPoints, () => 0);

  return { viewed, points, goal: DAILY_VIEW_GOAL, completed: viewed >= DAILY_VIEW_GOAL };
}
