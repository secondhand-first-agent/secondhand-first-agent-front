import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ChevronRight, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { getErrorMessage } from '@/api/response';
import { ROUTES } from '@/app/routes';
import { FormAlert } from '@/components/FormAlert';
import { ProfileImagePicker } from '@/components/ProfileImagePicker';
import { SettingRow } from '@/components/SettingRow';
import { PasswordChangeForm } from '@/features/auth/components/PasswordChangeForm';
import { RegionPicker } from '@/features/regions/components/RegionPicker';
import { useLogoutMutation } from '@/hooks/useAuthMutations';
import { useUpdateLocationMutation } from '@/hooks/useLocationMutations';
import { useUpdateProfileMutation, useWithdrawMutation } from '@/hooks/useUserMutations';
import { queryFactory } from '@/queryFactory';

type EditingField = 'name' | 'password' | 'region' | null;

function ComingSoon() {
  return <span className="text-ds-body text-ds-text-subtlest shrink-0 px-1">준비 중</span>;
}

function ChangeButton({ onClick, children = '변경' }: { onClick: () => void; children?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-ds-body text-ds-text-subtle hover:text-ds-text shrink-0 rounded px-1 transition-colors"
    >
      {children}
    </button>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <h2 className="text-ds-body-sm font-ds-semibold text-ds-text-subtle mt-8 mb-2">{children}</h2>;
}

export function SettingsPage() {
  const navigate = useNavigate();
  const { data: me, isPending, isError, error } = useQuery(queryFactory.users.me());
  const updateProfile = useUpdateProfileMutation();
  const updateLocation = useUpdateLocationMutation();
  const withdrawMutation = useWithdrawMutation();
  const logoutMutation = useLogoutMutation();

  const [editing, setEditing] = useState<EditingField>(null);
  const [nameDraft, setNameDraft] = useState('');
  const [confirmingWithdraw, setConfirmingWithdraw] = useState(false);

  if (isPending) return <p className="text-ds-text-subtle mx-auto max-w-2xl px-4 py-16">불러오는 중…</p>;
  if (isError) return <p className="text-ds-danger-text mx-auto max-w-2xl px-4 py-16">{getErrorMessage(error)}</p>;

  const close = () => setEditing(null);

  const saveName = () => {
    updateProfile.mutate({ name: nameDraft.trim() }, { onSuccess: close });
  };

  const onLogout = () => {
    logoutMutation.mutate();
  };

  const onWithdraw = () => {
    withdrawMutation.mutate(undefined, {
      onSuccess: () => navigate(ROUTES.home, { replace: true }),
    });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link
        to={ROUTES.profile}
        className="text-ds-body text-ds-text-subtle hover:text-ds-text -ml-1.5 inline-flex items-center gap-1.5 rounded px-1.5 py-1"
      >
        <ArrowLeft className="size-4" aria-hidden />
        마이페이지로 돌아가기
      </Link>

      <h1 className="text-ds-h-lg font-ds-bold text-ds-text mt-3">설정</h1>
      <p className="text-ds-body text-ds-text-subtle mt-1">프로필과 계정 정보를 관리해요</p>

      <div className="mt-6">
        <FormAlert message={updateProfile.isError ? getErrorMessage(updateProfile.error) : undefined} />
      </div>

      <SectionTitle>프로필</SectionTitle>
      <section className="rounded-ds-lg border-ds-border bg-ds-surface divide-y divide-gray-100 border">
        <SettingRow label="프로필 사진" description="다른 사용자에게 보여지는 이미지예요">
          <div className="mt-3">
            <ProfileImagePicker
              name={me.name}
              value={me.profileImageUrl}
              onChange={(profileImageUrl) => updateProfile.mutate({ name: me.name, profileImageUrl })}
              disabled={updateProfile.isPending}
            />
          </div>
        </SettingRow>

        <SettingRow
          label="이름"
          description={me.name}
          action={
            editing === 'name' ? null : (
              <ChangeButton
                onClick={() => {
                  setNameDraft(me.name);
                  setEditing('name');
                }}
              />
            )
          }
        >
          {editing === 'name' ? (
            <div className="mt-3">
              <input
                value={nameDraft}
                onChange={(event) => setNameDraft(event.target.value)}
                aria-label="이름"
                maxLength={20}
                autoFocus
                className="rounded-ds-sm border-ds-border text-ds-body focus:border-ds-border-focused focus:ring-ds-border-focused block w-full border px-3 py-2 outline-none focus:ring-1"
              />
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={close}
                  className="text-ds-body text-ds-text-subtle hover:text-ds-text px-3 py-1.5"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={saveName}
                  disabled={!nameDraft.trim() || updateProfile.isPending}
                  className="bg-ds-brand hover:bg-ds-brand-hovered rounded-ds-sm text-ds-body font-ds-medium text-ds-text-inverse disabled:bg-ds-neutral-hovered px-4 py-1.5 transition-colors"
                >
                  저장
                </button>
              </div>
            </div>
          ) : null}
        </SettingRow>

        <SettingRow
          label="위치"
          leading={<MapPin className="text-ds-text-subtlest size-4" aria-hidden />}
          description={me.region ?? '설정되지 않음'}
          action={
            editing === 'region' ? null : (
              <ChangeButton onClick={() => setEditing('region')}>{me.region ? '변경' : '설정'}</ChangeButton>
            )
          }
        >
          {editing === 'region' ? (
            <RegionPicker
              currentRegion={me.region}
              isSaving={updateLocation.isPending}
              saveError={updateLocation.isError ? getErrorMessage(updateLocation.error) : undefined}
              onCancel={close}
              onSave={(region) => updateLocation.mutate(region, { onSuccess: close })}
            />
          ) : null}
        </SettingRow>
      </section>

      <SectionTitle>계정</SectionTitle>
      <section className="rounded-ds-lg border-ds-border bg-ds-surface divide-y divide-gray-100 border">
        <SettingRow label="이메일" description={me.email} action={<ComingSoon />} />

        <SettingRow
          label="비밀번호"
          action={editing === 'password' ? null : <ChangeButton onClick={() => setEditing('password')} />}
        >
          {editing === 'password' ? <PasswordChangeForm onClose={close} /> : null}
        </SettingRow>
      </section>

      <SectionTitle>계정 관리</SectionTitle>
      <section className="rounded-ds-lg border-ds-border bg-ds-surface divide-y divide-gray-100 border">
        <button
          type="button"
          onClick={onLogout}
          className="hover:bg-ds-surface-sunken flex w-full items-center justify-between px-5 py-4 text-left transition-colors"
        >
          <span className="text-ds-body font-ds-semibold text-ds-text">로그아웃</span>
          <ChevronRight className="text-ds-text-subtlest size-4" aria-hidden />
        </button>

        <SettingRow
          label="회원 탈퇴"
          description="계정과 모든 데이터가 영구적으로 삭제돼요"
          action={
            confirmingWithdraw ? null : (
              <button
                type="button"
                onClick={() => setConfirmingWithdraw(true)}
                className="text-ds-body text-ds-danger-text hover:text-ds-danger-text shrink-0 rounded px-1"
              >
                탈퇴하기
              </button>
            )
          }
        >
          {confirmingWithdraw ? (
            <div className="rounded-ds-md border-ds-danger-border bg-ds-danger-bg mt-3 border px-4 py-3">
              <p className="text-ds-body text-ds-danger-text">정말 탈퇴하시겠어요? 되돌릴 수 없습니다.</p>
              {withdrawMutation.isError ? (
                <p className="text-ds-body-sm text-ds-danger-text mt-1.5">{getErrorMessage(withdrawMutation.error)}</p>
              ) : null}
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmingWithdraw(false)}
                  className="text-ds-body text-ds-text-subtle hover:text-ds-text px-3 py-1.5"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={onWithdraw}
                  disabled={withdrawMutation.isPending}
                  className="rounded-ds-sm bg-ds-danger-bold text-ds-body font-ds-medium text-ds-text-inverse hover:bg-ds-danger-text disabled:bg-ds-neutral-hovered px-4 py-1.5 transition-colors"
                >
                  탈퇴하기
                </button>
              </div>
            </div>
          ) : null}
        </SettingRow>
      </section>
    </div>
  );
}
