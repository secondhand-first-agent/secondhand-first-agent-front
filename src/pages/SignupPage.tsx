import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';

import { getErrorMessage } from '@/api/response';
import { ROUTES } from '@/app/routes';
import { signupFormSchema, type SignupFormValues } from '@/api/auth/auth.schema';
import { PasswordRules } from '@/features/auth/components/PasswordRules';
import { useSignupMutation } from '@/hooks/useAuthMutations';
import { Button } from '@/components/Button';
import { FormAlert } from '@/components/FormAlert';
import { PasswordField } from '@/components/PasswordField';
import { TextField } from '@/components/TextField';

export function SignupPage() {
  const navigate = useNavigate();
  const signupMutation = useSignupMutation();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    mode: 'onBlur',
  });

  const password = useWatch({ control, name: 'password' }) ?? '';

  const onSubmit = handleSubmit(({ email, password }) => {
    // passwordConfirm 은 화면에서만 쓰고 서버로는 보내지 않습니다.
    signupMutation.mutate({ email, password }, { onSuccess: () => navigate(ROUTES.login, { replace: true }) });
  });

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">회원가입</h1>
      <p className="mt-2 text-sm text-gray-600">이메일과 비밀번호만 있으면 시작할 수 있습니다.</p>

      <form onSubmit={onSubmit} noValidate className="mt-8 space-y-1.5">
        <FormAlert message={signupMutation.isError ? getErrorMessage(signupMutation.error) : undefined} />

        <TextField
          label="이메일"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        {/* 규칙 목록이 위 비밀번호 필드 설명으로 읽히도록, 아래 필드와는 간격을 둡니다 */}
        <div className="mb-3">
          <PasswordField
            label="비밀번호"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <PasswordRules value={password} />
        </div>

        <PasswordField
          label="비밀번호 확인"
          autoComplete="new-password"
          error={errors.passwordConfirm?.message}
          {...register('passwordConfirm')}
        />

        <Button type="submit" className="mt-4" isLoading={signupMutation.isPending}>
          회원가입
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        이미 계정이 있으신가요?{' '}
        <Link to={ROUTES.login} className="font-medium text-gray-900 underline underline-offset-4 hover:text-gray-700">
          로그인
        </Link>
      </p>
    </div>
  );
}
