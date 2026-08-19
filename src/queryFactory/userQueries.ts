import { queryOptions } from '@tanstack/react-query';

import { fetchMe, fetchRecentSearches, fetchRegions } from '@/api/users/user.api';

export const userQueryKeys = {
  all: ['users'] as const,
  me: () => [...userQueryKeys.all, 'me'] as const,
  recentSearches: () => [...userQueryKeys.all, 'recent-searches'] as const,
  regions: () => ['regions'] as const,
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
  regions: () =>
    queryOptions({
      queryKey: userQueryKeys.regions(),
      queryFn: fetchRegions,
      staleTime: Infinity,
    }),
};
