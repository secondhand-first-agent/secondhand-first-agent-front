import { queryOptions } from '@tanstack/react-query';

import { fetchDashboard, fetchMe, fetchRecentSearches } from '@/api/users/user.api';

export const userQueryKeys = {
  all: ['users'] as const,
  me: () => [...userQueryKeys.all, 'me'] as const,
  recentSearches: () => [...userQueryKeys.all, 'recent-searches'] as const,
  dashboard: () => [...userQueryKeys.all, 'dashboard'] as const,
};

export const userQueries = {
  me: () =>
    queryOptions({
      queryKey: userQueryKeys.me(),
      queryFn: fetchMe,
    }),
  recentSearches: () =>
    queryOptions({
      queryKey: userQueryKeys.recentSearches(),
      queryFn: fetchRecentSearches,
    }),
  dashboard: () =>
    queryOptions({
      queryKey: userQueryKeys.dashboard(),
      queryFn: fetchDashboard,
    }),
};
