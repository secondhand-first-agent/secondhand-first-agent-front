import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';

import { getErrorMessage } from '@/api/response';
import { ROUTES } from '@/app/routes';
import { loginFormSchema, type LoginFormValues } from '@/api/auth/auth.schema';
import { useLoginMutation } from '@/hooks/useAuthMutations';
import { Button } from '@/components/Button';
import { FormAlert } from '@/components/FormAlert';
import { PasswordField } from '@/components/PasswordField';
import { TextField } from '@/components/TextField';

export function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    mode: 'onBlur',
  });

  const onSubmit = handleSubmit((values) => {
    loginMutation.mutate(values, {
      onSuccess: () => navigate(ROUTES.home, { replace: true }),
    });
  });

  return (
    <div className="font-ds">
      <h1 className="text-ds-text text-ds-h-lg font-ds-bold">로그인</h1>
      <p className="text-ds-text-subtle text-ds-body mt-2">이메일과 비밀번호를 입력해주세요.</p>

      <form onSubmit={onSubmit} noValidate className="mt-8 space-y-1.5">
        <FormAlert message={loginMutation.isError ? getErrorMessage(loginMutation.error) : undefined} />

        <TextField
          label="이메일"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <PasswordField
          label="비밀번호"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        <Button type="submit" className="mt-4" isLoading={loginMutation.isPending}>
          로그인
        </Button>
      </form>

      <p className="text-ds-text-subtle text-ds-body mt-6 text-center">
        아직 계정이 없으신가요?{' '}
        <Link
          to={ROUTES.signup}
          className="text-ds-brand-text hover:text-ds-brand-pressed font-ds-medium underline underline-offset-4"
        >
          회원가입
        </Link>
      </p>
    </div>
  );
}
