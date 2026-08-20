import { queryOptions } from '@tanstack/react-query';

import { fetchMe, fetchRecentSearches } from '@/api/users/user.api';

export const userQueryKeys = {
  all: ['users'],
  me: () => [...userQueryKeys.all, 'me'],
  recentSearches: () => [...userQueryKeys.all, 'recent-searches'],
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
};
