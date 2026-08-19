import { useMutation } from '@tanstack/react-query';

import { login, signup } from '@/api/auth/auth.api';
import { saveSession } from '@/api/session';

export function useSignupMutation() {
  return useMutation({ mutationFn: signup });
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => saveSession(data),
  });
}
