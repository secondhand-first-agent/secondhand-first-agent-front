import { queryOptions } from '@tanstack/react-query';

import { searchLocations } from '@/api/locations/location.api';

export const MIN_LOCATION_QUERY_LENGTH = 2;

export const locationQueryKeys = {
  all: ['locations'],
  search: (query: string) => [...locationQueryKeys.all, 'search', query],
};

export const locationQueries = {
  search: (query: string) =>
    queryOptions({
      queryKey: locationQueryKeys.search(query),
      queryFn: () => searchLocations(query),
      staleTime: 5 * 60 * 1000,
      enabled: query.length >= MIN_LOCATION_QUERY_LENGTH,
    }),
};
