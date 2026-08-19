import { useQuery } from '@tanstack/react-query';
import { Settings } from 'lucide-react';
import { Link } from 'react-router';

import { getErrorMessage } from '@/api/response';
import type { Me } from '@/api/users/user.schema';
import { ROUTES } from '@/app/routes';
import { Avatar } from '@/components/Avatar';
import { queryFactory } from '@/queryFactory';

/** "2026-03-02" -> "2026.03 가입" */
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
    <div className="rounded-xl border border-gray-200 bg-white px-5 py-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1.5 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export function ProfilePage() {
  const { data: me, isPending, isError, error } = useQuery(queryFactory.users.me());
  const recentSearches = useQuery(queryFactory.users.recentSearches());

  if (isPending) return <p className="mx-auto max-w-5xl px-4 py-16 text-gray-500">불러오는 중…</p>;
  if (isError) return <p className="mx-auto max-w-5xl px-4 py-16 text-red-600">{getErrorMessage(error)}</p>;

  return (
    <div className="mx-auto max-w-5xl space-y-4 px-4 py-8">
      <section className="flex items-center gap-5 rounded-xl border border-gray-200 bg-white px-6 py-6">
        <Avatar name={me.name} imageUrl={me.profileImageUrl} className="size-16 text-xl" />
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold text-gray-900">{me.name}</h1>
          <p className="mt-0.5 truncate text-sm text-gray-500">{me.email}</p>
          <p className="mt-1 truncate text-xs text-gray-400">{profileSubtitle(me)}</p>
        </div>
        <Link
          to={ROUTES.settings}
          className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 px-3.5 py-2 text-sm text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900"
        >
          <Settings className="size-4" aria-hidden />
          설정
        </Link>
      </section>

      {/* 찜한 매물(favoriteCount)은 아직 화면에 넣지 않습니다. */}
      <section className="grid gap-4 sm:grid-cols-2">
        <StatCard label="플랫폼 이동" value={`${me.stats.platformRedirectCount}회`} />
        <StatCard label="AI 검색 횟수" value={`${me.stats.aiSearchCount}회`} />
      </section>

      <section className="rounded-xl border border-gray-200 bg-white">
        <h2 className="border-b border-gray-100 px-6 py-4 text-sm font-semibold text-gray-900">최근 검색</h2>
        {recentSearches.isPending ? (
          <p className="px-6 py-5 text-sm text-gray-400">불러오는 중…</p>
        ) : recentSearches.isError ? (
          <p className="px-6 py-5 text-sm text-red-600">{getErrorMessage(recentSearches.error)}</p>
        ) : recentSearches.data.length === 0 ? (
          <p className="px-6 py-5 text-sm text-gray-400">아직 검색 기록이 없습니다.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recentSearches.data.map((search) => (
              <li key={search.id}>
                <Link
                  to={`${ROUTES.search}?q=${encodeURIComponent(search.keyword)}`}
                  className="flex items-center justify-between gap-4 px-6 py-3.5 transition-colors hover:bg-gray-50"
                >
                  <span className="truncate text-sm text-gray-700">{search.keyword}</span>
                  <span className="shrink-0 text-xs text-gray-400">
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
