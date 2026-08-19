import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { useState } from 'react';

import { getErrorMessage } from '@/api/response';
import { ROUTES } from '@/app/routes';
import { signupFormSchema, type SignupFormValues } from '@/api/auth/auth.schema';
import { PasswordRules } from '@/features/auth/components/PasswordRules';
import { useSignupMutation } from '@/hooks/useAuthMutations';
import { Button } from '@/components/Button';
import { FormAlert } from '@/components/FormAlert';
import { PasswordField } from '@/components/PasswordField';
import { ProfileImagePicker } from '@/components/ProfileImagePicker';
import { TextField } from '@/components/TextField';

export function SignupPage() {
  const navigate = useNavigate();
  const signupMutation = useSignupMutation();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
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
    signupMutation.mutate(
      { email, password, profileImageUrl },
      { onSuccess: () => navigate(ROUTES.login, { replace: true }) }
    );
  });

  return (
    <div className="font-ds">
      <h1 className="text-ds-text text-ds-h-lg font-ds-bold">회원가입</h1>
      <p className="text-ds-text-subtle text-ds-body mt-2">
        이메일과 비밀번호로 시작하고, 프로필 사진은 선택해서 추가할 수 있어요.
      </p>

      <form onSubmit={onSubmit} noValidate className="mt-8 space-y-1.5">
        <FormAlert message={signupMutation.isError ? getErrorMessage(signupMutation.error) : undefined} />

        <div className="border-ds-border bg-ds-surface rounded-ds-lg mb-4 border p-4">
          <p className="text-ds-text text-ds-body font-ds-semibold mb-3">프로필 사진</p>
          <ProfileImagePicker
            name="내 프로필"
            value={profileImageUrl}
            onChange={setProfileImageUrl}
            disabled={signupMutation.isPending}
          />
        </div>

        <TextField
          label="이메일"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

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

      <p className="text-ds-text-subtle text-ds-body mt-6 text-center">
        이미 계정이 있으신가요?{' '}
        <Link
          to={ROUTES.login}
          className="text-ds-brand-text hover:text-ds-brand-pressed font-ds-medium underline underline-offset-4"
        >
          로그인
        </Link>
      </p>
    </div>
  );
}
