import { useSyncExternalStore } from 'react';

import { DAILY_VIEW_GOAL, getViewedCount, subscribeCarbonQuest } from '@/features/rewards/carbonQuest';

export function useCarbonQuest() {
  const viewed = useSyncExternalStore(subscribeCarbonQuest, getViewedCount, () => 0);

  return { viewed, goal: DAILY_VIEW_GOAL, completed: viewed >= DAILY_VIEW_GOAL };
}
