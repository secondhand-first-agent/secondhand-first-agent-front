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
  DAANGN: { label: '당근마켓', badge: 'bg-ds-accent-orange-bg text-ds-accent-orange-text' },
  BUNGJANG: { label: '번개장터', badge: 'bg-ds-accent-yellow-bg text-ds-accent-yellow-text' },
  JOONGGONARA: { label: '중고나라', badge: 'bg-ds-danger-bg text-ds-danger-text' },
};

const THUMBNAIL_STYLES = ['bg-ds-success-bg', 'bg-ds-info-bg', 'bg-ds-warning-bg'];

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
      className={`rounded-ds-lg flex size-24 shrink-0 items-center justify-center overflow-hidden ${THUMBNAIL_STYLES[index % THUMBNAIL_STYLES.length]}`}
    >
      {history.thumbnailUrl ? (
        <img src={history.thumbnailUrl} alt="" className="size-full object-cover" />
      ) : (
        <Icon className="text-ds-text-subtlest size-12" strokeWidth={1.25} aria-hidden />
      )}
    </div>
  );
}

function PlatformBadge({ platform }: { platform: ActivityPlatform }) {
  const meta = PLATFORM_META[platform];

  return <span className={`rounded-ds-sm text-ds-body-sm font-ds-bold px-2.5 py-1 ${meta.badge}`}>{meta.label}</span>;
}

function HistoryCard({ history, index }: { history: RedirectHistory; index: number }) {
  return (
    <article className="rounded-ds-lg border-ds-border bg-ds-surface hover:border-ds-border flex items-center gap-4 border px-5 py-5 transition-colors sm:gap-6 sm:px-6">
      <HistoryThumbnail history={history} index={index} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <PlatformBadge platform={history.platform} />
          <span className="text-ds-body text-ds-text-subtlest">{formatTime(history.redirectedAt)}</span>
        </div>
        <h3 className="text-ds-body-lg font-ds-bold text-ds-text sm:text-ds-h-sm mt-2 truncate">{history.title}</h3>
        <p className="text-ds-body text-ds-text-subtlest sm:text-ds-body-lg mt-1">
          {formatPrice(history.price)} <span aria-hidden>·</span> 이동 시점 가격
        </p>
      </div>

      <a
        href={history.platformUrl}
        target="_blank"
        rel="noreferrer"
        className="text-ds-body font-ds-semibold text-ds-text-subtle hover:text-ds-text sm:text-ds-body-lg inline-flex shrink-0 items-center gap-1 transition-colors"
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
          className="rounded-ds-lg border-ds-border bg-ds-surface flex animate-pulse items-center gap-4 border px-5 py-5 sm:px-6"
        >
          <div className="rounded-ds-lg bg-ds-surface-hovered size-24 shrink-0" />
          <div className="min-w-0 flex-1 space-y-3">
            <div className="bg-ds-surface-hovered h-5 w-24 rounded" />
            <div className="bg-ds-surface-hovered h-5 w-56 max-w-full rounded" />
            <div className="bg-ds-surface-hovered h-4 w-36 rounded" />
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
          <h1 className="text-ds-h-xl font-ds-bold text-ds-text sm:text-ds-h-2xl">이동 내역</h1>
          <p className="text-ds-body-lg text-ds-text-subtle sm:text-ds-h-sm mt-3 leading-7">
            “상품 보기”를 눌러 원 플랫폼으로 이동했던 매물 기록이에요. 실제 거래 완료 여부는 각 플랫폼에서 확인해주세요.
          </p>
        </header>

        <div className="rounded-ds-lg bg-ds-surface-hovered text-ds-body text-ds-text-subtle sm:text-ds-body-lg mt-7 flex items-start gap-3 px-5 py-4 leading-6 sm:px-6">
          <Info className="text-ds-text-subtle mt-0.5 size-5 shrink-0" aria-hidden />
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
                className={`text-ds-body font-ds-semibold sm:text-ds-body-lg rounded-ds-sm border px-3 py-1.5 transition-colors ${selected ? 'border-ds-brand bg-ds-brand-subtlest text-ds-brand-text' : 'border-ds-border bg-ds-surface text-ds-text-subtle hover:bg-ds-neutral hover:text-ds-text'}`}
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
            <div className="rounded-ds-lg border-ds-border bg-ds-surface border border-dashed px-6 py-14 text-center">
              <p className="font-ds-semibold text-ds-text">이동 내역을 불러오지 못했어요.</p>
              <p className="text-ds-body text-ds-text-subtle mt-2">{getErrorMessage(error)}</p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-ds-lg bg-ds-neutral-bold text-ds-body font-ds-semibold text-ds-text-inverse hover:bg-ds-neutral-bold-hovered mt-5 inline-flex items-center gap-2 px-4 py-2.5 transition-colors"
              >
                <RefreshCw className="size-4" aria-hidden />
                다시 시도
              </button>
            </div>
          ) : null}

          {!isPending && !isError && groups.length === 0 ? (
            <div className="rounded-ds-lg border-ds-border bg-ds-surface border border-dashed px-6 py-16 text-center">
              <p className="font-ds-semibold text-ds-text">아직 이동한 매물이 없어요.</p>
              <p className="text-ds-body text-ds-text-subtle mt-2">
                검색 결과에서 마음에 드는 매물의 상품 보기를 눌러보세요.
              </p>
            </div>
          ) : null}

          {!isPending && !isError && groups.length > 0 ? (
            <div className="space-y-8">
              {groups.map((group) => (
                <section key={group.label} aria-labelledby={`history-${group.label}`}>
                  <h2
                    id={`history-${group.label}`}
                    className="text-ds-h-sm font-ds-bold text-ds-text-subtlest sm:text-ds-h-md mb-3 px-1"
                  >
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
            <div
              className="text-ds-body text-ds-text-subtlest mt-4 flex items-center justify-center gap-2"
              role="status"
            >
              <LoaderCircle className="size-4 animate-spin" aria-hidden />
              최신 내역을 확인하는 중이에요.
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
