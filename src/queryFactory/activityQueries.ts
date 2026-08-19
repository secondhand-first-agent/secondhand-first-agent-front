import { queryOptions } from '@tanstack/react-query';

import { fetchRedirectHistories } from '@/api/activities/activity.api';

export const activityQueryKeys = {
  all: ['activities'] as const,
  redirectHistories: () => [...activityQueryKeys.all, 'redirect-histories'] as const,
};

export const activityQueries = {
  redirectHistories: () =>
    queryOptions({
      queryKey: activityQueryKeys.redirectHistories(),
      queryFn: fetchRedirectHistories,
    }),
};
