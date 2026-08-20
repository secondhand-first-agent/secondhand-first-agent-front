import { useQuery } from '@tanstack/react-query';
import {
  Armchair,
  BookOpen,
  Dumbbell,
  Gamepad2,
  Gem,
  Headphones,
  Laptop,
  LoaderCircle,
  Monitor,
  Medal,
  Package,
  PiggyBank,
  RefreshCw,
  Shirt,
  ShoppingBag,
  Smartphone,
  Tablet,
  Trophy,
  Watch,
  type LucideIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';

import type { BestDeal, BestDealCategory } from '@/api/products/best-deal.schema';
import { getErrorMessage } from '@/api/response';
import { productDetailPath } from '@/app/routes';
import { Dropdown } from '@/components/Dropdown';
import { queryFactory } from '@/queryFactory';

type CategoryFilter = 'ALL' | Exclude<BestDealCategory, 'OTHER'>;
type BestDealSort = 'AI_RECOMMENDED' | 'PRICE_ASC' | 'SAVINGS_DESC';

/** 카테고리별 이름과 아이콘. 필터 칩과 썸네일 대체 아이콘이 같은 표를 쓴다. */
const CATEGORIES: Record<BestDealCategory, { label: string; Icon: LucideIcon }> = {
  EARPHONES: { label: '이어폰', Icon: Headphones },
  LAPTOP: { label: '노트북', Icon: Laptop },
  SMARTPHONE: { label: '스마트폰', Icon: Smartphone },
  SMARTWATCH: { label: '스마트워치', Icon: Watch },
  TABLET: { label: '태블릿', Icon: Tablet },
  MONITOR: { label: '모니터', Icon: Monitor },
  GAME_CONSOLE: { label: '게임기', Icon: Gamepad2 },
  CLOTHING: { label: '의류', Icon: Shirt },
  BAG_SHOES: { label: '가방·신발', Icon: ShoppingBag },
  FURNITURE: { label: '가구', Icon: Armchair },
  SPORTS_TOYS: { label: '스포츠·완구', Icon: Dumbbell },
  BOOKS: { label: '도서', Icon: BookOpen },
  WATCH_JEWELRY: { label: '시계·주얼리', Icon: Gem },
  OTHER: { label: '기타', Icon: Package },
};

/** OTHER 는 "분류하지 못함" 이라 필터로 두지 않는다. */
const FILTERABLE_CATEGORIES = (Object.keys(CATEGORIES) as BestDealCategory[]).filter(
  (category): category is Exclude<BestDealCategory, 'OTHER'> => category !== 'OTHER'
);

const CATEGORY_FILTERS: Array<{ value: CategoryFilter; label: string; Icon?: LucideIcon }> = [
  { value: 'ALL', label: '전체' },
  ...FILTERABLE_CATEGORIES.map((value) => ({ value, ...CATEGORIES[value] })),
];

const CONDITION_LABELS: Record<BestDeal['condition'], string> = {
  NEW: '미개봉',
  LIKE_NEW: '거의 새것',
  LIGHTLY_USED: '사용감 적음',
  USED: '사용감 있음',
  UNSPECIFIED: '상태 미기재',
  UNKNOWN: '상태 확인 필요',
};

const PLATFORM_LABELS: Record<BestDeal['platform'], string> = {
  BUNJANG: '번개장터',
  JOONGNA: '중고나라',
  NAVER_FLEAMARKET: 'N플리마켓',
  ELEVENST: '11번가',
};

const PLATFORM_STYLES: Record<BestDeal['platform'], string> = {
  NAVER_FLEAMARKET: 'bg-ds-accent-orange-bg text-ds-accent-orange-text',
  BUNJANG: 'bg-ds-accent-yellow-bg text-ds-accent-yellow-text',
  JOONGNA: 'bg-ds-danger-bg text-ds-danger-text',
  // 새상품 채널이라 중고 셋과 색 계열을 구분한다.
  ELEVENST: 'bg-ds-accent-purple-bg text-ds-accent-purple-text',
};

/** 카테고리별로 색을 나누면 의미 없는 구분이 생기므로, 썸네일 배경은 하나로 통일한다. */
const THUMBNAIL_BACKGROUND = 'bg-ds-surface-hovered';
const EMPTY_DEALS: BestDeal[] = [];

function formatPrice(price: number) {
  return `₩${price.toLocaleString('ko-KR')}`;
}

/** 카테고리를 못 받았을 때를 대비해 제목에서 한 번 더 짚어 본다. */
function getCategoryIcon(category: BestDealCategory, title: string): LucideIcon {
  if (category !== 'OTHER') return CATEGORIES[category].Icon;
  if (title.includes('모니터')) return Monitor;
  if (title.includes('스위치') || title.includes('플레이스테이션')) return Gamepad2;
  if (title.includes('노트북') || title.includes('맥북')) return Laptop;
  return CATEGORIES.OTHER.Icon;
}

const SORT_OPTIONS: Array<{ value: BestDealSort; label: string }> = [
  { value: 'AI_RECOMMENDED', label: 'AI 추천순' },
  { value: 'PRICE_ASC', label: '가격 낮은순' },
  { value: 'SAVINGS_DESC', label: '할인율 높은순' },
];

function DealThumbnail({ deal, featured }: { deal: BestDeal; featured: boolean }) {
  const Icon = getCategoryIcon(deal.category, deal.title);

  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${THUMBNAIL_BACKGROUND} ${featured ? 'min-h-56 sm:min-h-64' : 'rounded-ds-lg size-24 shrink-0'}`}
    >
      {deal.imageUrl ? (
        <img src={deal.imageUrl} alt="" className="size-full object-contain p-5" />
      ) : (
        <Icon
          className={featured ? 'text-ds-text-subtlest size-24' : 'text-ds-text-subtlest size-12'}
          strokeWidth={1.2}
          aria-hidden
        />
      )}
    </div>
  );
}

function PlatformBadge({ platform }: { platform: BestDeal['platform'] }) {
  return (
    <span className={`rounded-ds-sm text-ds-body-sm font-ds-bold px-2.5 py-1.5 ${PLATFORM_STYLES[platform]}`}>
      {PLATFORM_LABELS[platform]}
    </span>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const style =
    rank === 1
      ? 'bg-ds-brand text-ds-text-inverse'
      : rank === 2
        ? 'bg-ds-neutral-bold text-ds-text-inverse'
        : 'bg-ds-accent-gray-bg text-ds-accent-gray-text';

  return (
    <span
      className={`rounded-ds-xs text-ds-body-sm font-ds-bold inline-flex items-center gap-1 px-1.5 py-0.5 ${style}`}
    >
      <Medal className="size-3 shrink-0" aria-hidden />
      {rank}위
    </span>
  );
}

function DealCard({
  deal,
  rank,
  featured,
  detailUrl,
}: {
  deal: BestDeal;
  rank: number;
  featured: boolean;
  detailUrl: string;
}) {
  if (!featured) {
    return (
      <article className="group rounded-ds-lg border-ds-border bg-ds-surface hover:border-ds-border hover:shadow-ds-raised flex items-center gap-4 border p-4 text-left transition-all hover:-translate-y-0.5">
        <DealThumbnail deal={deal} featured={false} />
        <div className="min-w-0 flex-1">
          <PlatformBadge platform={deal.platform} />
          <h3 className="text-ds-body-lg font-ds-bold text-ds-text mt-2 truncate">
            <Link to={detailUrl} className="group-hover:text-ds-brand-text">
              {deal.title}
            </Link>
          </h3>
          <p className="text-ds-h-sm font-ds-bold text-ds-text mt-1">{formatPrice(deal.price)}</p>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`group rounded-ds-lg bg-ds-surface hover:shadow-ds-overlay overflow-hidden border-2 text-left transition-all hover:-translate-y-0.5 ${rank === 1 ? 'border-ds-brand' : 'border-ds-border'}`}
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
        <h3 className="text-ds-h-md font-ds-bold text-ds-text truncate">
          <Link to={detailUrl} className="group-hover:text-ds-brand-text">
            {deal.title}
          </Link>
        </h3>
        <p className="text-ds-h-lg font-ds-bold text-ds-text mt-3">{formatPrice(deal.price)}</p>
        <p className="text-ds-body text-ds-text-subtlest mt-2">
          {CONDITION_LABELS[deal.condition]} <span aria-hidden>·</span> {deal.location}
        </p>
        <div className="border-ds-border my-5 border-t" />
        <p className="text-ds-body text-ds-text-subtle min-h-12 leading-6">“{deal.recommendationReason}”</p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="bg-ds-success-bg text-ds-success-text rounded-ds-sm text-ds-body font-ds-semibold inline-flex items-center gap-1.5 px-2 py-1">
            <PiggyBank className="size-4 shrink-0" aria-hidden />
            새상품 대비 {formatPrice(deal.savingsAmount)} 절약
          </span>
        </div>
      </div>
    </article>
  );
}

function DealSkeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-3" aria-label="Best Deal을 불러오는 중">
      {[0, 1, 2].map((item) => (
        <div key={item} className="rounded-ds-lg border-ds-border bg-ds-surface animate-pulse overflow-hidden border">
          <div className="bg-ds-surface-hovered min-h-56" />
          <div className="space-y-4 p-6">
            <div className="bg-ds-surface-hovered h-6 w-3/4 rounded" />
            <div className="bg-ds-surface-hovered h-7 w-1/2 rounded" />
            <div className="bg-ds-surface-hovered h-4 w-2/3 rounded" />
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
  const { data, isPending, isError, error, refetch, isFetching } = useQuery(queryFactory.products.bestDeals());
  const deals = data?.items ?? EMPTY_DEALS;

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

  return (
    <section className="bg-[#f8fafc] px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-[1440px]">
        <header>
          <h1 className="text-ds-h-xl font-ds-bold text-ds-text sm:text-ds-h-2xl flex items-center gap-2">
            <Trophy className="text-ds-warning-border size-8 sm:size-9" aria-hidden />
            오늘의 Best Deal
          </h1>
          <p className="text-ds-body-lg text-ds-text-subtle sm:text-ds-h-sm mt-3 leading-7">
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
                  className={`text-ds-body font-ds-semibold sm:text-ds-body-lg rounded-ds-sm inline-flex items-center gap-1.5 border px-3 py-1.5 transition-colors ${selected ? 'border-ds-brand bg-ds-brand-subtlest text-ds-brand-text' : 'border-ds-border bg-ds-surface text-ds-text-subtle hover:bg-ds-neutral hover:text-ds-text'}`}
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
            <div className="rounded-ds-lg border-ds-border bg-ds-surface border border-dashed px-6 py-16 text-center">
              <p className="font-ds-semibold text-ds-text">Best Deal을 불러오지 못했어요.</p>
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

          {!isPending && !isError && sortedDeals.length === 0 ? (
            <div className="rounded-ds-lg border-ds-border bg-ds-surface border border-dashed px-6 py-16 text-center">
              <p className="font-ds-semibold text-ds-text">아직 이 카테고리의 딜이 없어요.</p>
              <p className="text-ds-body text-ds-text-subtle mt-2">다른 카테고리에서 오늘의 추천 딜을 확인해 보세요.</p>
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
                  detailUrl={productDetailPath(deal.productId)}
                />
              ))}
            </div>
          ) : null}

          {!isPending && !isError && additionalDeals.length > 0 ? (
            <section className="mt-12" aria-labelledby="more-deals-heading">
              <h2 id="more-deals-heading" className="text-ds-h-md font-ds-bold text-ds-text sm:text-ds-h-lg">
                이런 딜도 놓치지 마세요
              </h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visibleAdditionalDeals.map((deal, index) => (
                  <DealCard
                    key={deal.productId}
                    deal={deal}
                    rank={index + 4}
                    featured={false}
                    detailUrl={productDetailPath(deal.productId)}
                  />
                ))}
              </div>
              {additionalDeals.length > 6 ? (
                <button
                  type="button"
                  onClick={() => setShowAll((visible) => !visible)}
                  className="rounded-ds-lg border-ds-border bg-ds-surface text-ds-body-lg font-ds-bold text-ds-text-subtle hover:border-ds-border-bold hover:text-ds-text mt-6 flex w-full items-center justify-center border py-5 transition-colors"
                >
                  {showAll ? '딜 접기' : '더 많은 딜 보기'}
                </button>
              ) : null}
            </section>
          ) : null}

          {isFetching && !isPending ? (
            <div
              className="text-ds-body text-ds-text-subtlest mt-5 flex items-center justify-center gap-2"
              role="status"
            >
              <LoaderCircle className="size-4 animate-spin" aria-hidden />
              최신 딜을 확인하는 중이에요.
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
