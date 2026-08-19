import { useMutation, useQueryClient } from '@tanstack/react-query';

import { clearSession } from '@/api/session';
import { updateProfile, withdraw } from '@/api/users/user.api';
import { queryKeys } from '@/queryFactory';

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (me) => {
      // 헤더 아바타까지 함께 갱신되도록 캐시를 바로 채웁니다.
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
