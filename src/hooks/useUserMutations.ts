import { useMutation, useQueryClient } from '@tanstack/react-query';

import { clearSession } from '@/api/session';
import { updateProfile, withdraw } from '@/api/users/user.api';
import { queryKeys } from '@/queryFactory';

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (me) => {
      queryClient.setQueryData(queryKeys.users.me(), me);
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
