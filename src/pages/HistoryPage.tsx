import { useQuery } from '@tanstack/react-query';
import {
  Headphones,
  Info,
  Laptop,
  LoaderCircle,
  RefreshCw,
  Smartphone,
  Watch,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import type { ActivityPlatform, RedirectHistory } from '@/api/activities/activity.schema';
import { getErrorMessage } from '@/api/response';
import { queryFactory } from '@/queryFactory';

type HistoryFilter = 'ALL' | ActivityPlatform;

const FILTERS: { value: HistoryFilter; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'DAANGN', label: '당근마켓' },
  { value: 'BUNGJANG', label: '번개장터' },
  { value: 'JOONGGONARA', label: '중고나라' },
];

const PLATFORM_META: Record<ActivityPlatform, { label: string; badge: string }> = {
  DAANGN: { label: '당근마켓', badge: 'bg-orange-50 text-orange-600' },
  BUNGJANG: { label: '번개장터', badge: 'bg-yellow-50 text-yellow-700' },
  JOONGGONARA: { label: '중고나라', badge: 'bg-rose-50 text-rose-500' },
};

const THUMBNAIL_STYLES = ['bg-emerald-50', 'bg-sky-50', 'bg-amber-50'];

function formatPrice(price: number) {
  return `₩${price.toLocaleString('ko-KR')}`;
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(value));
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function formatDateLabel(value: string) {
  const target = new Date(value);
  const today = new Date();
  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dayDifference = Math.round((todayDay.getTime() - targetDay.getTime()) / 86_400_000);

  if (dayDifference === 0) return '오늘';
  if (dayDifference === 1) return '어제';

  return `${target.getFullYear()}.${String(target.getMonth() + 1).padStart(2, '0')}.${String(target.getDate()).padStart(2, '0')}`;
}

function groupByDate(histories: RedirectHistory[]) {
  const groups = new Map<string, { label: string; items: RedirectHistory[] }>();

  for (const history of histories) {
    const date = new Date(history.redirectedAt);
    const key = dateKey(date);
    const group = groups.get(key);

    if (group) {
      group.items.push(history);
    } else {
      groups.set(key, { label: formatDateLabel(history.redirectedAt), items: [history] });
    }
  }

  return [...groups.values()];
}

function getThumbnailIcon(title: string): LucideIcon {
  if (title.includes('워치')) return Watch;
  if (title.includes('맥북') || title.includes('그램')) return Laptop;
  if (title.includes('아이폰')) return Smartphone;
  return Headphones;
}

function HistoryThumbnail({ history, index }: { history: RedirectHistory; index: number }) {
  const Icon = getThumbnailIcon(history.title);

  return (
    <div
      className={`flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl ${THUMBNAIL_STYLES[index % THUMBNAIL_STYLES.length]}`}
    >
      {history.thumbnailUrl ? (
        <img src={history.thumbnailUrl} alt="" className="size-full object-cover" />
      ) : (
        <Icon className="size-12 text-gray-500/70" strokeWidth={1.25} aria-hidden />
      )}
    </div>
  );
}

function PlatformBadge({ platform }: { platform: ActivityPlatform }) {
  const meta = PLATFORM_META[platform];

  return <span className={`rounded-md px-2.5 py-1 text-xs font-bold ${meta.badge}`}>{meta.label}</span>;
}

function HistoryCard({ history, index }: { history: RedirectHistory; index: number }) {
  return (
    <article className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-5 transition-colors hover:border-gray-300 sm:gap-6 sm:px-6">
      <HistoryThumbnail history={history} index={index} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <PlatformBadge platform={history.platform} />
          <span className="text-sm text-gray-400">{formatTime(history.redirectedAt)}</span>
        </div>
        <h3 className="mt-2 truncate text-base font-bold text-gray-900 sm:text-lg">{history.title}</h3>
        <p className="mt-1 text-sm text-gray-400 sm:text-base">
          {formatPrice(history.price)} <span aria-hidden>·</span> 이동 시점 가격
        </p>
      </div>

      <a
        href={history.platformUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-900 sm:text-base"
      >
        다시 보기
        <ChevronRight className="size-5" aria-hidden />
      </a>
    </article>
  );
}

function HistorySkeleton() {
  return (
    <div className="space-y-3" aria-label="이동 내역을 불러오는 중">
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className="flex animate-pulse items-center gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-5 sm:px-6"
        >
          <div className="size-24 shrink-0 rounded-2xl bg-gray-100" />
          <div className="min-w-0 flex-1 space-y-3">
            <div className="h-5 w-24 rounded bg-gray-100" />
            <div className="h-5 w-56 max-w-full rounded bg-gray-100" />
            <div className="h-4 w-36 rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function HistoryPage() {
  const [filter, setFilter] = useState<HistoryFilter>('ALL');
  const {
    data: histories = [],
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery(queryFactory.activities.redirectHistories());

  const filteredHistories = useMemo(
    () =>
      histories
        .filter((history) => filter === 'ALL' || history.platform === filter)
        .sort((a, b) => new Date(b.redirectedAt).getTime() - new Date(a.redirectedAt).getTime()),
    [filter, histories]
  );
  const groups = useMemo(() => groupByDate(filteredHistories), [filteredHistories]);

  return (
    <section className="bg-[#f8fafc] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">이동 내역</h1>
          <p className="mt-3 text-base leading-7 text-gray-500 sm:text-lg">
            “상품 보기”를 눌러 원 플랫폼으로 이동했던 매물 기록이에요. 실제 거래 완료 여부는 각 플랫폼에서 확인해주세요.
          </p>
        </header>

        <div className="mt-7 flex items-start gap-3 rounded-2xl bg-slate-100 px-5 py-4 text-sm leading-6 text-gray-500 sm:px-6 sm:text-base">
          <Info className="mt-0.5 size-5 shrink-0 text-slate-500" aria-hidden />
          <p className="min-w-0">
            Secondhand First는 매물 탐색과 비교만 도와드려요. 채팅, 결제, 거래는 당근마켓·번개장터·중고나라 등 각
            플랫폼에서 직접 진행돼요.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="이동 내역 플랫폼 필터">
          {FILTERS.map((item) => {
            const selected = filter === item.value;
            const countLabel = item.value === 'ALL' ? ` ${histories.length}` : '';

            return (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setFilter(item.value)}
                className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors sm:text-base ${selected ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-900'}`}
              >
                {item.label}
                {countLabel}
              </button>
            );
          })}
        </div>

        <div className="mt-10">
          {isPending ? <HistorySkeleton /> : null}

          {isError ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
              <p className="font-semibold text-gray-900">이동 내역을 불러오지 못했어요.</p>
              <p className="mt-2 text-sm text-gray-500">{getErrorMessage(error)}</p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
              >
                <RefreshCw className="size-4" aria-hidden />
                다시 시도
              </button>
            </div>
          ) : null}

          {!isPending && !isError && groups.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
              <p className="font-semibold text-gray-900">아직 이동한 매물이 없어요.</p>
              <p className="mt-2 text-sm text-gray-500">검색 결과에서 마음에 드는 매물의 상품 보기를 눌러보세요.</p>
            </div>
          ) : null}

          {!isPending && !isError && groups.length > 0 ? (
            <div className="space-y-8">
              {groups.map((group) => (
                <section key={group.label} aria-labelledby={`history-${group.label}`}>
                  <h2 id={`history-${group.label}`} className="mb-3 px-1 text-lg font-bold text-slate-400 sm:text-xl">
                    {group.label}
                  </h2>
                  <div className="space-y-3">
                    {group.items.map((history, index) => (
                      <HistoryCard key={history.id} history={history} index={index} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : null}

          {isFetching && !isPending ? (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400" role="status">
              <LoaderCircle className="size-4 animate-spin" aria-hidden />
              최신 내역을 확인하는 중이에요.
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
