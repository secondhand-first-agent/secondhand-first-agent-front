import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { useState } from 'react';

import { getErrorMessage } from '@/api/response';
import { ROUTES } from '@/app/routes';
import { signupFormSchema, type SignupFormValues } from '@/api/auth/auth.schema';
import { PasswordRules } from '@/features/auth/components/PasswordRules';
import { LegalDocumentView } from '@/features/legal/components/LegalDocumentView';
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from '@/features/legal/legal.content';
import { useSignupMutation } from '@/hooks/useAuthMutations';
import { Button } from '@/components/Button';
import { CheckboxField } from '@/components/CheckboxField';
import { FormAlert } from '@/components/FormAlert';
import { Modal } from '@/components/Modal';
import { PasswordField } from '@/components/PasswordField';
import { ProfileImagePicker } from '@/components/ProfileImagePicker';
import { TextField } from '@/components/TextField';

const LEGAL_DOCUMENTS = { terms: TERMS_OF_SERVICE, privacy: PRIVACY_POLICY } as const;

type LegalDocumentKey = keyof typeof LEGAL_DOCUMENTS;

/**
 * 동의 문구 안에서 약관 본문을 여는 버튼.
 *
 * 새 탭으로 보내지 않고 모달로 띄웁니다. 가입 폼을 채우던 중에 페이지를 벗어나면
 * 입력하던 내용이 사라지기 때문입니다.
 */
function LegalLink({ onClick, children }: { onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={(event) => {
        // 라벨 안에 있는 버튼이라, 막지 않으면 클릭이 체크박스 토글까지 함께 일으킨다.
        event.preventDefault();
        onClick();
      }}
      className="text-ds-brand-text hover:text-ds-brand-pressed font-ds-medium rounded-ds-xs focus-visible:outline-ds-border-focused underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {children}
    </button>
  );
}

export function SignupPage() {
  const navigate = useNavigate();
  const signupMutation = useSignupMutation();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [openedLegal, setOpenedLegal] = useState<LegalDocumentKey | null>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    mode: 'onBlur',
    defaultValues: { termsAgreed: false },
  });

  const password = useWatch({ control, name: 'password' }) ?? '';

  const onSubmit = handleSubmit(({ name, email, password, termsAgreed }) => {
    signupMutation.mutate(
      { name, email, password, termsAgreed, profileImageUrl },
      { onSuccess: () => navigate(ROUTES.login, { replace: true }) }
    );
  });

  return (
    <div className="font-ds">
      <h1 className="text-ds-text text-ds-h-lg font-ds-bold">회원가입</h1>
      <p className="text-ds-text-subtle text-ds-body mt-2">
        이름과 이메일로 시작하고, 프로필 사진은 선택해서 추가할 수 있어요.
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
          label="이름"
          autoComplete="name"
          placeholder="김혜준"
          maxLength={20}
          error={errors.name?.message}
          {...register('name')}
        />

        <TextField
          label="이메일"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        {/* 규칙 줄이 아래 '비밀번호 확인' 에 붙어 보이지 않도록 아래 여백을 넉넉히 준다. */}
        <div className="mb-5">
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

        {/* 동의 항목이 하나뿐이라 카드로 감싸지 않는다. 감싸면 빈 상자처럼 보인다. */}
        <div className="pt-2">
          <CheckboxField
            label={
              <>
                (필수) <LegalLink onClick={() => setOpenedLegal('terms')}>이용약관</LegalLink> 및{' '}
                <LegalLink onClick={() => setOpenedLegal('privacy')}>개인정보 처리방침</LegalLink>에 동의합니다
              </>
            }
            // 라벨 안의 버튼 텍스트는 접근명 계산에서 빠져 "(필수) 및 에 동의합니다" 로 읽힌다.
            aria-label="(필수) 이용약관 및 개인정보 처리방침에 동의합니다"
            error={errors.termsAgreed?.message}
            {...register('termsAgreed')}
          />
        </div>

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

      <Modal
        open={openedLegal !== null}
        onClose={() => setOpenedLegal(null)}
        title={openedLegal ? LEGAL_DOCUMENTS[openedLegal].title : ''}
      >
        {openedLegal ? <LegalDocumentView document={LEGAL_DOCUMENTS[openedLegal]} /> : null}
      </Modal>
    </div>
  );
}
