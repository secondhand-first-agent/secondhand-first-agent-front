import { useQuery } from '@tanstack/react-query';
import { Settings } from 'lucide-react';
import { Link } from 'react-router';

import { getErrorMessage } from '@/api/response';
import type { Me } from '@/api/users/user.schema';
import { ROUTES } from '@/app/routes';
import { Avatar } from '@/components/Avatar';
import { CarbonQuestCard } from '@/features/rewards/components/CarbonQuestCard';
import { queryFactory } from '@/queryFactory';

function formatJoinedAt(joinedAt: string) {
  const [year, month] = joinedAt.split('-');
  return `${year}.${month} 가입`;
}

function profileSubtitle(me: Me) {
  const parts = [formatJoinedAt(me.joinedAt)];
  if (me.region) parts.push(me.region.name, me.region.district);
  return parts.join(' · ');
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-ds-lg border-ds-border bg-ds-surface border px-5 py-4">
      <p className="text-ds-body text-ds-text-subtle">{label}</p>
      <p className="text-ds-h-lg font-ds-bold text-ds-text mt-1.5">{value}</p>
    </div>
  );
}

export function ProfilePage() {
  const { data: me, isPending, isError, error } = useQuery(queryFactory.users.me());
  const recentSearches = useQuery(queryFactory.users.recentSearches());

  if (isPending) return <p className="text-ds-text-subtle mx-auto max-w-5xl px-4 py-16">불러오는 중…</p>;
  if (isError) return <p className="text-ds-danger-text mx-auto max-w-5xl px-4 py-16">{getErrorMessage(error)}</p>;

  return (
    <div className="mx-auto max-w-5xl space-y-4 px-4 py-8">
      <section className="rounded-ds-lg border-ds-border bg-ds-surface flex items-center gap-5 border px-6 py-6">
        <Avatar name={me.name} imageUrl={me.profileImageUrl} className="text-ds-h-md size-16" />
        <div className="min-w-0">
          <h1 className="text-ds-h-md font-ds-bold text-ds-text truncate">{me.name}</h1>
          <p className="text-ds-body text-ds-text-subtle mt-0.5 truncate">{me.email}</p>
          <p className="text-ds-body-sm text-ds-text-subtlest mt-1 truncate">{profileSubtitle(me)}</p>
        </div>
        <Link
          to={ROUTES.settings}
          className="rounded-ds-md border-ds-border text-ds-body text-ds-text-subtle hover:border-ds-border-bold hover:text-ds-text ml-auto inline-flex shrink-0 items-center gap-1.5 border px-3.5 py-2 transition-colors"
        >
          <Settings className="size-4" aria-hidden />
          설정
        </Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <StatCard label="플랫폼 이동" value={`${me.stats.platformRedirectCount}회`} />
        <StatCard label="AI 검색 횟수" value={`${me.stats.aiSearchCount}회`} />
      </section>

      <CarbonQuestCard />

      <section className="rounded-ds-lg border-ds-border bg-ds-surface border">
        <h2 className="border-ds-border text-ds-body font-ds-semibold text-ds-text border-b px-6 py-4">최근 검색</h2>
        {recentSearches.isPending ? (
          <p className="text-ds-body text-ds-text-subtlest px-6 py-5">불러오는 중…</p>
        ) : recentSearches.isError ? (
          <p className="text-ds-body text-ds-danger-text px-6 py-5">{getErrorMessage(recentSearches.error)}</p>
        ) : recentSearches.data.length === 0 ? (
          <p className="text-ds-body text-ds-text-subtlest px-6 py-5">아직 검색 기록이 없습니다.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recentSearches.data.map((search) => (
              <li key={search.id}>
                <Link
                  to={`${ROUTES.search}?q=${encodeURIComponent(search.keyword)}`}
                  className="hover:bg-ds-surface-sunken flex items-center justify-between gap-4 px-6 py-3.5 transition-colors"
                >
                  <span className="text-ds-body text-ds-text-subtle truncate">{search.keyword}</span>
                  <span className="text-ds-body-sm text-ds-text-subtlest shrink-0">
                    {new Date(search.searchedAt).toLocaleDateString('ko-KR')}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
