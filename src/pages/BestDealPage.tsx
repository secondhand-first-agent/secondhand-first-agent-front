import { useQuery } from '@tanstack/react-query';
import {
  Gamepad2,
  Headphones,
  Heart,
  Laptop,
  LoaderCircle,
  Monitor,
  RefreshCw,
  Smartphone,
  Trophy,
  Watch,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';

import type { BestDeal, BestDealCategory } from '@/api/products/best-deal.schema';
import { getErrorMessage } from '@/api/response';
import { productDetailPath } from '@/app/routes';
import { Dropdown } from '@/components/Dropdown';
import { queryFactory } from '@/queryFactory';

type CategoryFilter = 'ALL' | Exclude<BestDealCategory, 'OTHER'>;
type BestDealSort = 'AI_RECOMMENDED' | 'PRICE_ASC' | 'SAVINGS_DESC';

const CATEGORY_FILTERS: Array<{ value: CategoryFilter; label: string; Icon?: LucideIcon }> = [
  { value: 'ALL', label: '전체' },
  { value: 'EARPHONES', label: '이어폰', Icon: Headphones },
  { value: 'LAPTOP', label: '노트북', Icon: Laptop },
  { value: 'SMARTPHONE', label: '스마트폰', Icon: Smartphone },
  { value: 'SMARTWATCH', label: '스마트워치', Icon: Watch },
];

const SORT_OPTIONS: Array<{ value: BestDealSort; label: string }> = [
  { value: 'AI_RECOMMENDED', label: 'AI 추천순' },
  { value: 'PRICE_ASC', label: '가격 낮은순' },
  { value: 'SAVINGS_DESC', label: '할인율 높은순' },
];

const CONDITION_LABELS: Record<BestDeal['condition'], string> = {
  UNOPENED: '미개봉',
  LIKE_NEW: '거의 새것',
  GOOD: '상태 좋음',
  USED: '사용감 있음',
};

const PLATFORM_LABELS: Record<BestDeal['platform'], string> = {
  DAANGN: '당근마켓',
  BUNGJANG: '번개장터',
  JOONGGONARA: '중고나라',
};

const PLATFORM_STYLES: Record<BestDeal['platform'], string> = {
  DAANGN: 'bg-orange-50 text-orange-600',
  BUNGJANG: 'bg-yellow-50 text-yellow-700',
  JOONGGONARA: 'bg-rose-50 text-rose-500',
};

const CATEGORY_BACKGROUNDS: Record<BestDealCategory, string> = {
  EARPHONES: 'bg-emerald-50',
  LAPTOP: 'bg-sky-50',
  SMARTPHONE: 'bg-emerald-50',
  SMARTWATCH: 'bg-amber-50',
  OTHER: 'bg-violet-50',
};

function formatPrice(price: number) {
  return `₩${price.toLocaleString('ko-KR')}`;
}

function getCategoryIcon(category: BestDealCategory, title: string): LucideIcon {
  if (title.includes('모니터')) return Monitor;
  if (title.includes('스위치')) return Gamepad2;
  if (category === 'EARPHONES') return Headphones;
  if (category === 'LAPTOP') return Laptop;
  if (category === 'SMARTPHONE') return Smartphone;
  if (category === 'SMARTWATCH') return Watch;
  return Gamepad2;
}

function DealThumbnail({ deal, featured }: { deal: BestDeal; featured: boolean }) {
  const Icon = getCategoryIcon(deal.category, deal.title);

  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${CATEGORY_BACKGROUNDS[deal.category]} ${featured ? 'min-h-56 sm:min-h-64' : 'size-24 shrink-0 rounded-2xl'}`}
    >
      {deal.imageUrl ? (
        <img src={deal.imageUrl} alt="" className="size-full object-contain p-5" />
      ) : (
        <Icon
          className={featured ? 'size-24 text-gray-500/70' : 'size-12 text-gray-500/70'}
          strokeWidth={1.2}
          aria-hidden
        />
      )}
    </div>
  );
}

function PlatformBadge({ platform }: { platform: BestDeal['platform'] }) {
  return (
    <span className={`rounded-md px-2.5 py-1.5 text-xs font-bold ${PLATFORM_STYLES[platform]}`}>
      {PLATFORM_LABELS[platform]}
    </span>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉';
  const style = rank === 1 ? 'bg-brand text-white' : rank === 2 ? 'bg-slate-700 text-white' : 'bg-amber-600 text-white';

  return (
    <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-bold ${style}`}>
      {medal} {rank}위
    </span>
  );
}

function DealCard({
  deal,
  rank,
  featured,
  favorite,
  detailUrl,
  onToggleFavorite,
}: {
  deal: BestDeal;
  rank: number;
  featured: boolean;
  favorite: boolean;
  detailUrl: string;
  onToggleFavorite: () => void;
}) {
  if (!featured) {
    return (
      <article className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md">
        <DealThumbnail deal={deal} featured={false} />
        <div className="min-w-0 flex-1">
          <PlatformBadge platform={deal.platform} />
          <h3 className="mt-2 truncate text-base font-bold text-gray-900">
            <Link to={detailUrl} className="group-hover:text-emerald-600">
              {deal.title}
            </Link>
          </h3>
          <p className="mt-1 text-lg font-bold tracking-tight text-gray-900">{formatPrice(deal.price)}</p>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite();
          }}
          aria-label={favorite ? '찜 취소' : '찜하기'}
          aria-pressed={favorite}
          className={`flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors ${favorite ? 'border-rose-200 bg-rose-50 text-rose-500' : 'border-gray-200 bg-white text-gray-400 hover:border-gray-400 hover:text-gray-700'}`}
        >
          <Heart className="size-5" fill={favorite ? 'currentColor' : 'none'} aria-hidden />
        </button>
      </article>
    );
  }

  return (
    <article
      className={`group overflow-hidden rounded-2xl border-2 bg-white text-left transition-all hover:-translate-y-0.5 hover:shadow-lg ${rank === 1 ? 'border-brand shadow-[0_10px_30px_rgba(16,185,129,0.12)]' : 'border-gray-200'}`}
    >
      <div className="relative">
        <DealThumbnail deal={deal} featured />
        <span className="absolute top-5 left-5">
          <RankBadge rank={rank} />
        </span>
        <span className="absolute top-5 right-5">
          <PlatformBadge platform={deal.platform} />
        </span>
      </div>

      <div className="p-6 sm:p-7">
        <h3 className="truncate text-xl font-bold text-gray-900">
          <Link to={detailUrl} className="group-hover:text-emerald-600">
            {deal.title}
          </Link>
        </h3>
        <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900">{formatPrice(deal.price)}</p>
        <p className="mt-2 text-sm text-gray-400">
          {CONDITION_LABELS[deal.condition]} <span aria-hidden>·</span> {deal.location}
        </p>
        <div className="my-5 border-t border-gray-100" />
        <p className="min-h-12 text-sm leading-6 text-gray-500">“{deal.recommendationReason}”</p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="inline-flex rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-500">
            💰 새상품 대비 {formatPrice(deal.savingsAmount)} 절약
          </span>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite();
            }}
            aria-label={favorite ? '찜 취소' : '찜하기'}
            aria-pressed={favorite}
            className={`flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors ${favorite ? 'border-rose-200 bg-rose-50 text-rose-500' : 'border-gray-200 bg-white text-gray-400 hover:border-gray-400 hover:text-gray-700'}`}
          >
            <Heart className="size-5" fill={favorite ? 'currentColor' : 'none'} aria-hidden />
          </button>
        </div>
      </div>
    </article>
  );
}

function DealSkeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-3" aria-label="Best Deal을 불러오는 중">
      {[0, 1, 2].map((item) => (
        <div key={item} className="animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="min-h-56 bg-gray-100" />
          <div className="space-y-4 p-6">
            <div className="h-6 w-3/4 rounded bg-gray-100" />
            <div className="h-7 w-1/2 rounded bg-gray-100" />
            <div className="h-4 w-2/3 rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function BestDealPage() {
  const [category, setCategory] = useState<CategoryFilter>('ALL');
  const [sort, setSort] = useState<BestDealSort>('AI_RECOMMENDED');
  const [showAll, setShowAll] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const { data, isPending, isError, error, refetch, isFetching } = useQuery(queryFactory.products.bestDeals());
  const deals = data?.items ?? [];

  useEffect(() => {
    setFavoriteIds(new Set(deals.filter((deal) => deal.isFavorite).map((deal) => deal.productId)));
  }, [deals]);

  const sortedDeals = useMemo(() => {
    const filtered = deals.filter((deal) => category === 'ALL' || deal.category === category);

    return [...filtered].sort((left, right) => {
      if (sort === 'PRICE_ASC') return left.price - right.price;
      if (sort === 'SAVINGS_DESC') return right.savingsRate - left.savingsRate;
      return right.recommendationScore - left.recommendationScore;
    });
  }, [category, deals, sort]);

  const featuredDeals = sortedDeals.slice(0, 3);
  const additionalDeals = sortedDeals.slice(3);
  const visibleAdditionalDeals = showAll ? additionalDeals : additionalDeals.slice(0, 6);

  const toggleFavorite = (productId: string) => {
    setFavoriteIds((previous) => {
      const next = new Set(previous);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  return (
    <section className="bg-[#f8fafc] px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-[1440px]">
        <header>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            <Trophy className="size-8 text-amber-500 sm:size-9" aria-hidden />
            오늘의 Best Deal
          </h1>
          <p className="mt-3 text-base leading-7 text-gray-500 sm:text-lg">
            AI가 가격·상품 상태·판매자 신뢰도까지 종합해서 고른 매물이에요. 최저가가 아니라, 가장 합리적인 딜이에요.
          </p>
        </header>

        <div className="mt-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Best Deal 카테고리 필터">
            {CATEGORY_FILTERS.map(({ value, label, Icon }) => {
              const selected = category === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => {
                    setCategory(value);
                    setShowAll(false);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors sm:text-base ${selected ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-900'}`}
                >
                  {Icon ? <Icon className="size-4" aria-hidden /> : null}
                  {label}
                </button>
              );
            })}
          </div>

          <Dropdown
            value={sort}
            options={SORT_OPTIONS}
            onChange={setSort}
            ariaLabel="Best Deal 정렬 기준"
            className="w-full sm:w-48"
          />
        </div>

        <div className="mt-8">
          {isPending ? <DealSkeleton /> : null}

          {isError ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
              <p className="font-semibold text-gray-900">Best Deal을 불러오지 못했어요.</p>
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

          {!isPending && !isError && sortedDeals.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
              <p className="font-semibold text-gray-900">아직 이 카테고리의 딜이 없어요.</p>
              <p className="mt-2 text-sm text-gray-500">다른 카테고리에서 오늘의 추천 딜을 확인해 보세요.</p>
            </div>
          ) : null}

          {!isPending && !isError && featuredDeals.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-3">
              {featuredDeals.map((deal, index) => (
                <DealCard
                  key={deal.productId}
                  deal={deal}
                  rank={index + 1}
                  featured
                  favorite={favoriteIds.has(deal.productId)}
                  detailUrl={productDetailPath(deal.productId)}
                  onToggleFavorite={() => toggleFavorite(deal.productId)}
                />
              ))}
            </div>
          ) : null}

          {!isPending && !isError && additionalDeals.length > 0 ? (
            <section className="mt-12" aria-labelledby="more-deals-heading">
              <h2 id="more-deals-heading" className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                이런 딜도 놓치지 마세요
              </h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visibleAdditionalDeals.map((deal, index) => (
                  <DealCard
                    key={deal.productId}
                    deal={deal}
                    rank={index + 4}
                    featured={false}
                    favorite={favoriteIds.has(deal.productId)}
                    detailUrl={productDetailPath(deal.productId)}
                    onToggleFavorite={() => toggleFavorite(deal.productId)}
                  />
                ))}
              </div>
              {additionalDeals.length > 6 ? (
                <button
                  type="button"
                  onClick={() => setShowAll((visible) => !visible)}
                  className="mt-6 flex w-full items-center justify-center rounded-2xl border border-gray-200 bg-white py-5 text-base font-bold text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-900"
                >
                  {showAll ? '딜 접기' : '더 많은 딜 보기'}
                </button>
              ) : null}
            </section>
          ) : null}

          {isFetching && !isPending ? (
            <div className="mt-5 flex items-center justify-center gap-2 text-sm text-gray-400" role="status">
              <LoaderCircle className="size-4 animate-spin" aria-hidden />
              최신 딜을 확인하는 중이에요.
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
