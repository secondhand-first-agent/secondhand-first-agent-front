import { useMutation, useQueryClient } from '@tanstack/react-query';

import { clearSession } from '@/api/session';
import { updateProfile, withdraw } from '@/api/users/user.api';
import type { Me } from '@/api/users/user.schema';
import { queryKeys } from '@/queryFactory';

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (me) => {
      queryClient.setQueryData<Me>(queryKeys.users.me(), (previous) => ({
        ...me,
        region: me.region ?? previous?.region ?? null,
      }));
    },
  });
}

export function useWithdrawMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: withdraw,
    onSuccess: () => {
      clearSession();
      queryClient.clear();
    },
  });
}
