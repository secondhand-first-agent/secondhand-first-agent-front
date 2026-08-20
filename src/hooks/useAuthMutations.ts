import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { changePassword, login, logout, signup } from '@/api/auth/auth.api';
import { clearSession, saveSession } from '@/api/session';
import { ROUTES } from '@/app/routes';

export function useSignupMutation() {
  return useMutation({ mutationFn: signup });
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: login,
    onSuccess: ({ accessToken, tokenType, user }) => {
      saveSession({ accessToken, tokenType, userId: user.id });
    },
  });
}

/**
 * 서버에서 refreshToken 을 만료시킵니다.
 * 요청이 실패하더라도 브라우저에 남은 세션은 반드시 지웁니다.
 *
 * 뒷정리와 화면 이동을 모두 여기서 합니다. 세션을 지우면 호출한 컴포넌트가
 * 곧바로 언마운트되고, 그러면 `mutate` 에 넘긴 콜백은 실행되지 않기 때문입니다.
 */
export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearSession();
      queryClient.clear();
      navigate(ROUTES.home, { replace: true });
    },
  });
}

export function useChangePasswordMutation() {
  return useMutation({ mutationFn: changePassword });
}
