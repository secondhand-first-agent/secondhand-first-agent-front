import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateLocation } from '@/api/locations/location.api';
import type { Me } from '@/api/users/user.schema';
import { queryKeys } from '@/queryFactory';

export function useUpdateLocationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLocation,
    onSuccess: (coordinate) => {
      queryClient.setQueryData<Me>(queryKeys.users.me(), (previous) =>
        previous ? { ...previous, region: coordinate.region } : previous
      );
    },
  });
}
