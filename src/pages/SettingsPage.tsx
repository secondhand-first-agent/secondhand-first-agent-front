import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Check, ChevronRight, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { clearSession } from '@/api/session';
import { getErrorMessage } from '@/api/response';
import { ROUTES } from '@/app/routes';
import { FormAlert } from '@/components/FormAlert';
import { ProfileImagePicker } from '@/components/ProfileImagePicker';
import { SettingRow } from '@/components/SettingRow';
import { useUpdateProfileMutation, useWithdrawMutation } from '@/hooks/useUserMutations';
import { queryFactory } from '@/queryFactory';

type EditingField = 'name' | 'region' | null;

function ChangeButton({ onClick, children = '변경' }: { onClick: () => void; children?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded px-1 text-sm text-gray-500 transition-colors hover:text-gray-900"
    >
      {children}
    </button>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <h2 className="mt-8 mb-2 text-xs font-semibold text-gray-500">{children}</h2>;
}

export function SettingsPage() {
  const navigate = useNavigate();
  const { data: me, isPending, isError, error } = useQuery(queryFactory.users.me());
  const regions = useQuery(queryFactory.users.regions());
  const updateProfile = useUpdateProfileMutation();
  const withdrawMutation = useWithdrawMutation();

  const [editing, setEditing] = useState<EditingField>(null);
  const [nameDraft, setNameDraft] = useState('');
  const [confirmingWithdraw, setConfirmingWithdraw] = useState(false);

  if (isPending) return <p className="mx-auto max-w-2xl px-4 py-16 text-gray-500">불러오는 중…</p>;
  if (isError) return <p className="mx-auto max-w-2xl px-4 py-16 text-red-600">{getErrorMessage(error)}</p>;

  const close = () => setEditing(null);

  const saveName = () => {
    updateProfile.mutate({ name: nameDraft.trim() }, { onSuccess: close });
  };

  const saveRegion = (regionId: string) => {
    updateProfile.mutate({ regionId }, { onSuccess: close });
  };

  const onLogout = () => {
    clearSession();
    navigate(ROUTES.home, { replace: true });
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
        className="-ml-1.5 inline-flex items-center gap-1.5 rounded px-1.5 py-1 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="size-4" aria-hidden />
        마이페이지로 돌아가기
      </Link>

      <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">설정</h1>
      <p className="mt-1 text-sm text-gray-500">프로필과 계정 정보를 관리해요</p>

      <div className="mt-6">
        <FormAlert message={updateProfile.isError ? getErrorMessage(updateProfile.error) : undefined} />
      </div>

      <SectionTitle>프로필</SectionTitle>
      <section className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
        <SettingRow label="프로필 사진" description="다른 사용자에게 보여지는 이미지예요">
          <div className="mt-3">
            <ProfileImagePicker
              name={me.name}
              value={me.profileImageUrl}
              onChange={(profileImageUrl) => updateProfile.mutate({ profileImageUrl })}
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
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
              <div className="mt-3 flex justify-end gap-2">
                <button type="button" onClick={close} className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900">
                  취소
                </button>
                <button
                  type="button"
                  onClick={saveName}
                  disabled={!nameDraft.trim() || updateProfile.isPending}
                  className="bg-brand hover:bg-brand-dark rounded-md px-4 py-1.5 text-sm font-medium text-white transition-colors disabled:bg-gray-300"
                >
                  저장
                </button>
              </div>
            </div>
          ) : null}
        </SettingRow>

        <SettingRow
          label="위치"
          leading={<MapPin className="size-4 text-gray-400" aria-hidden />}
          description={me.region ? `${me.region.name}, ${me.region.district}` : '설정되지 않음'}
          action={editing === 'region' ? null : <ChangeButton onClick={() => setEditing('region')} />}
        >
          {editing === 'region' ? (
            <div className="mt-3">
              <p className="mb-2 text-xs text-gray-500">활동 지역을 선택하세요</p>
              {regions.isPending ? (
                <p className="text-sm text-gray-400">불러오는 중…</p>
              ) : regions.isError ? (
                <p className="text-sm text-red-600">{getErrorMessage(regions.error)}</p>
              ) : (
                <ul className="divide-y divide-gray-100 overflow-hidden rounded-lg border border-gray-200">
                  {regions.data.map((region) => {
                    const selected = region.id === me.region?.id;
                    return (
                      <li key={region.id}>
                        <button
                          type="button"
                          onClick={() => saveRegion(region.id)}
                          disabled={updateProfile.isPending}
                          aria-current={selected || undefined}
                          className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors ${
                            selected ? 'bg-brand/5 font-medium text-gray-900' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {region.name} · {region.district}
                          {selected ? <Check className="text-brand size-4" aria-hidden /> : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
              <div className="mt-3 flex justify-end">
                <button type="button" onClick={close} className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900">
                  취소
                </button>
              </div>
            </div>
          ) : null}
        </SettingRow>
      </section>

      <SectionTitle>계정</SectionTitle>
      <section className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
        <SettingRow
          label="이메일"
          description={me.email}
          action={<span className="shrink-0 px-1 text-sm text-gray-300">준비 중</span>}
        />
        <SettingRow label="비밀번호" action={<span className="shrink-0 px-1 text-sm text-gray-300">준비 중</span>} />
      </section>

      <SectionTitle>계정 관리</SectionTitle>
      <section className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50"
        >
          <span className="text-sm font-semibold text-gray-900">로그아웃</span>
          <ChevronRight className="size-4 text-gray-400" aria-hidden />
        </button>

        <SettingRow
          label="회원 탈퇴"
          description="계정과 모든 데이터가 영구적으로 삭제돼요"
          action={
            confirmingWithdraw ? null : (
              <button
                type="button"
                onClick={() => setConfirmingWithdraw(true)}
                className="shrink-0 rounded px-1 text-sm text-red-600 hover:text-red-700"
              >
                탈퇴하기
              </button>
            )
          }
        >
          {confirmingWithdraw ? (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700">정말 탈퇴하시겠어요? 되돌릴 수 없습니다.</p>
              {withdrawMutation.isError ? (
                <p className="mt-1.5 text-xs text-red-600">{getErrorMessage(withdrawMutation.error)}</p>
              ) : null}
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmingWithdraw(false)}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={onWithdraw}
                  disabled={withdrawMutation.isPending}
                  className="rounded-md bg-red-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:bg-gray-300"
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
