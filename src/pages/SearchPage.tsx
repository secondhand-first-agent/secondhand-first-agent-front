import {
  Award,
  ChevronDown,
  ExternalLink,
  Headphones,
  Heart,
  Leaf,
  MapPin,
  PiggyBank,
  Send,
  ShieldCheck,
  Sparkles,
  Store,
  ThumbsUp,
  TrendingDown,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router';

import type { Condition, Platform, SearchResultProduct, SearchSort } from '@/api/searches/search.schema';
import assistantAvatarUrl from '@/assets/image/cat-avatar.png';
import { productDetailPath } from '@/app/routes';
import { Dropdown } from '@/components/Dropdown';
import { CARBON_SAVED_HINT, estimateCarbonSavedKg } from '@/features/products/carbon';
import { createMockSearchData } from '@/features/search/search.mock';

type PlatformFilter = 'ALL' | Platform;

const PLATFORM_TABS: Array<{ value: PlatformFilter; label: string }> = [
  { value: 'ALL', label: '전체' },
  { value: 'DAANGN', label: '당근' },
  { value: 'BUNGJANG', label: '번개장터' },
  { value: 'JOONGGONARA', label: '중고나라' },
];

const SORT_OPTIONS: Array<{ value: SearchSort; label: string }> = [
  { value: 'AI_RECOMMENDED', label: 'AI 추천순' },
  { value: 'PRICE_ASC', label: '가격 낮은순' },
  { value: 'DISTANCE_ASC', label: '거리 가까운순' },
];

const CONDITION_LABELS: Record<Condition, string> = {
  UNOPENED: '미개봉',
  LIKE_NEW: '거의 새것',
  GOOD: '사용감 적음',
  USED: '사용감 있음',
};

const PLATFORM_LABELS: Record<Platform, string> = {
  DAANGN: '당근마켓',
  BUNGJANG: '번개장터',
  JOONGGONARA: '중고나라',
};

/** ADS Lozenge 톤. color.background.accent.*.subtlest + color.text.accent.* */
type LozengeTone = 'gray' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'magenta' | 'brand';

const LOZENGE_TONES: Record<LozengeTone, string> = {
  gray: 'bg-ds-accent-gray-bg text-ds-accent-gray-text',
  red: 'bg-ds-accent-red-bg text-ds-accent-red-text',
  orange: 'bg-ds-accent-orange-bg text-ds-accent-orange-text',
  yellow: 'bg-ds-accent-yellow-bg text-ds-accent-yellow-text',
  green: 'bg-ds-accent-green-bg text-ds-accent-green-text',
  blue: 'bg-ds-accent-blue-bg text-ds-accent-blue-text',
  purple: 'bg-ds-accent-purple-bg text-ds-accent-purple-text',
  magenta: 'bg-ds-accent-magenta-bg text-ds-accent-magenta-text',
  brand: 'bg-ds-brand text-ds-text-inverse',
};

const PLATFORM_TONES: Record<Platform, LozengeTone> = {
  DAANGN: 'orange',
  BUNGJANG: 'yellow',
  JOONGGONARA: 'red',
};

const QUICK_QUESTIONS = ['미개봉만 보여줘', '더 저렴한 것도', '판교 근처만'];

/** ADS 버튼 기본형 — height 32px, radius.small(4px), font.body(14/20) */
const BUTTON_BASE =
  'rounded-ds-sm text-ds-body font-ds-medium focus-visible:outline-ds-border-focused inline-flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2';

function formatPrice(price: number) {
  return `₩${price.toLocaleString('ko-KR')}`;
}

function formatDistance(distanceKm: number | null | undefined) {
  return distanceKm == null ? '택배 거래' : `${distanceKm}km 거리`;
}

function followUpReply(message: string) {
  if (message.includes('미개봉')) return '미개봉 매물만 추려서 다시 추천할게요.';
  if (message.includes('저렴')) return '가격을 낮춰서 더 가성비 좋은 매물을 찾아볼게요.';
  if (message.includes('판교')) return '판교 근처에서 직거래할 수 있는 매물을 우선해서 보여드릴게요.';
  return `'${message}' 조건을 반영해서 결과를 다시 정렬할게요.`;
}

function Lozenge({
  tone = 'gray',
  icon: Icon,
  title,
  children,
}: {
  tone?: LozengeTone;
  icon?: LucideIcon;
  /** 숫자만으로 뜻이 안 통하는 배지에 붙이는 설명. */
  title?: string;
  children: ReactNode;
}) {
  return (
    <span
      title={title}
      className={`rounded-ds-xs font-ds-bold inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] leading-4 ${LOZENGE_TONES[tone]}`}
    >
      {Icon ? <Icon className="size-3 shrink-0" aria-hidden /> : null}
      {children}
    </span>
  );
}

/**
 * ADS Tag — 파싱된 검색 조건 하나를 나타내는 라벨.
 * 조건들 사이에 의미 차이가 없으므로 색을 나누지 않고 한 가지 형태로 통일한다.
 */
function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="border-ds-border bg-ds-surface text-ds-text-subtle rounded-ds-sm text-ds-body font-ds-medium inline-flex items-center border px-2 py-1">
      {children}
    </span>
  );
}

function AssistantAvatar({ small = false }: { small?: boolean }) {
  return (
    <img
      src={assistantAvatarUrl}
      alt=""
      // 이미지 자체에 원형 배경이 그려져 있고 모서리는 흰색이라, 원으로 잘라낸다.
      className={`shrink-0 rounded-full object-cover ${small ? 'size-8' : 'size-10'}`}
    />
  );
}

type ThumbnailSize = 'featured' | 'card' | 'compact';

const THUMBNAIL_SIZES: Record<ThumbnailSize, { box: string; icon: string; pad: string }> = {
  featured: { box: 'min-h-44 sm:min-h-full', icon: 'size-20', pad: 'p-4' },
  // 카드 높이를 그대로 채워서 위/아래 여백이 항상 대칭이 되게 한다.
  card: { box: 'rounded-ds-md w-28 shrink-0 self-stretch sm:w-32', icon: 'size-14', pad: 'p-4' },
  compact: { box: 'rounded-ds-md size-14 shrink-0', icon: 'size-7', pad: 'p-2' },
};

function ProductThumbnail({ product, size = 'card' }: { product: SearchResultProduct; size?: ThumbnailSize }) {
  const { box, icon, pad } = THUMBNAIL_SIZES[size];
  return (
    <div className={`bg-ds-surface-hovered relative flex items-center justify-center overflow-hidden ${box}`}>
      {product.imageUrl ? (
        <img src={product.imageUrl} alt="" className={`size-full object-contain ${pad}`} />
      ) : (
        <Headphones className={`text-ds-text-subtlest ${icon}`} strokeWidth={1.2} aria-hidden />
      )}
    </div>
  );
}

function ResultCard({
  product,
  featured,
  favorite,
  selected,
  detailHref,
  onToggleFavorite,
  onSelect,
}: {
  product: SearchResultProduct;
  featured: boolean;
  favorite: boolean;
  selected: boolean;
  detailHref: string;
  onToggleFavorite: () => void;
  onSelect: () => void;
}) {
  const carbonSavedKg = estimateCarbonSavedKg(product.title);

  return (
    <article
      className={`rounded-ds-lg bg-ds-surface hover:shadow-ds-overlay relative overflow-hidden transition-shadow ${
        featured ? 'border-ds-brand shadow-ds-raised border-2' : 'border-ds-border shadow-ds-raised border'
      }`}
    >
      {/*
        카드 전체를 상세로 가는 링크로 덮는다. 제목에 링크를 걸면 h3 의 truncate
        (overflow:hidden) 가 넓혀둔 영역까지 잘라내서 카드 전체가 눌리지 않는다.
        카드 안의 버튼들은 relative z-10 으로 이 덮개 위에 올린다.
      */}
      <Link
        to={detailHref}
        onClick={onSelect}
        aria-label={`${product.title} 상세 보기`}
        className="rounded-ds-lg focus-visible:outline-ds-border-focused absolute inset-0 focus-visible:outline-2 focus-visible:outline-offset-2"
      />
      <div
        className={featured ? 'grid sm:grid-cols-[minmax(180px,0.55fr)_minmax(0,1.45fr)]' : 'flex gap-4 p-4 sm:gap-5'}
      >
        {featured ? (
          <div className="relative">
            <ProductThumbnail product={product} size="featured" />
            <span className="absolute top-3 left-3">
              <Lozenge tone="brand" icon={Award}>
                AI 추천 1순위
              </Lozenge>
            </span>
          </div>
        ) : (
          <ProductThumbnail product={product} size="card" />
        )}

        <div
          className={
            featured
              ? 'flex min-w-0 flex-col justify-between p-4 sm:p-5'
              : 'flex min-w-0 flex-1 flex-col justify-center'
          }
        >
          <div className="flex items-center gap-2">
            <Lozenge tone={PLATFORM_TONES[product.platform]}>{PLATFORM_LABELS[product.platform]}</Lozenge>
            <span className="text-ds-text-subtlest text-ds-body-sm">
              {product.rank === 1 ? '2시간 전' : `${product.rank + 2}시간 전`}
            </span>
          </div>

          <h3 className={`text-ds-text font-ds-bold mt-1.5 truncate ${featured ? 'text-ds-h-md' : 'text-ds-h-sm'}`}>
            {product.title}
          </h3>
          <p className="text-ds-text-subtle text-ds-body mt-0.5 truncate">
            {CONDITION_LABELS[product.condition]} · {product.tradeType[0] === 'DIRECT' ? '판매 직거래' : '택배 거래'} ·{' '}
            {formatDistance(product.distanceKm)}
          </p>

          <div className={`flex items-end justify-between gap-4 ${featured ? 'mt-5' : 'mt-3'}`}>
            <div>
              <p className={`text-ds-text font-ds-bold ${featured ? 'text-ds-h-lg' : 'text-ds-h-md'}`}>
                {formatPrice(product.price)}
              </p>
              {featured ? (
                <p className="text-ds-text-subtlest text-ds-body-sm mt-0.5 line-through">
                  {formatPrice(product.officialPrice)}
                </p>
              ) : null}
              <p className="text-ds-success-text text-ds-body-sm font-ds-semibold mt-1">
                정가 대비 {product.savingsRate}% 절약
              </p>
            </div>
            {/* 카드를 덮은 링크 위로 올려서 각자의 동작이 살아 있게 한다. */}
            <div className="relative z-10 flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={onToggleFavorite}
                aria-label={favorite ? '찜 취소' : '찜하기'}
                aria-pressed={favorite}
                className={`${BUTTON_BASE} size-8 ${
                  favorite
                    ? 'bg-ds-danger-bg text-ds-danger-bold hover:bg-ds-accent-red-bg'
                    : 'text-ds-text-subtle hover:bg-ds-neutral hover:text-ds-text bg-transparent'
                }`}
              >
                <Heart className="size-4" fill={favorite ? 'currentColor' : 'none'} aria-hidden />
              </button>
              {featured ? (
                <Link
                  to={detailHref}
                  onClick={onSelect}
                  className={`${BUTTON_BASE} text-ds-text-inverse h-8 px-3 ${
                    selected
                      ? 'bg-ds-neutral-bold hover:bg-ds-neutral-bold-hovered'
                      : 'bg-ds-brand hover:bg-ds-brand-hovered active:bg-ds-brand-pressed'
                  }`}
                >
                  {selected ? '선택됨' : '상품 보기'}
                </Link>
              ) : null}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {featured ? (
              <Lozenge tone="green" icon={PiggyBank}>
                정가 대비 {formatPrice(product.savingsAmount)} 절약
              </Lozenge>
            ) : null}
            <Lozenge tone="blue" icon={Leaf} title={CARBON_SAVED_HINT}>
              탄소 약 {carbonSavedKg}kg 절감
            </Lozenge>
          </div>
        </div>
      </div>
    </article>
  );
}

function OfficialPriceCard({
  name,
  officialStore,
  officialPrice,
  officialUrl,
  maxSavingsRate,
}: {
  name: string;
  officialStore: string;
  officialPrice: number;
  officialUrl: string;
  maxSavingsRate: number;
}) {
  return (
    <section className="rounded-ds-lg border-ds-border bg-ds-surface shadow-ds-raised border p-4 sm:p-5">
      <h2 className="text-ds-text text-ds-h-sm font-ds-bold flex items-center gap-1.5">
        <Store className="text-ds-text-subtle size-4" aria-hidden />
        공식 사이트 정가 비교
      </h2>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center xl:flex-nowrap">
        <div className="bg-ds-surface-hovered text-ds-text-subtle rounded-ds-md flex size-12 shrink-0 items-center justify-center">
          <Store className="size-6" strokeWidth={1.7} aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="text-ds-text-subtlest text-ds-body-sm">{officialStore}</p>
          <p className="text-ds-text text-ds-h-md font-ds-bold mt-0.5 truncate">{name}</p>
        </div>
        <div className="sm:ml-auto sm:text-right">
          <p className="text-ds-text-subtlest text-ds-body-sm">공식 정가</p>
          <p className="text-ds-text-subtle text-ds-h-lg font-ds-bold mt-0.5 line-through">
            {formatPrice(officialPrice)}
          </p>
        </div>
        <a
          href={officialUrl}
          target="_blank"
          rel="noreferrer"
          className={`${BUTTON_BASE} border-ds-border text-ds-text-subtle hover:bg-ds-neutral hover:text-ds-text h-8 shrink-0 border px-3`}
        >
          공식 사이트에서 보기
          <ExternalLink className="size-3.5" aria-hidden />
        </a>
      </div>

      <div className="bg-ds-success-bg text-ds-success-text rounded-ds-sm text-ds-body font-ds-medium mt-4 flex items-center gap-2 px-3 py-2">
        <TrendingDown className="size-4 shrink-0" aria-hidden />
        아래 중고 매물은 공식 정가 대비 최대 {maxSavingsRate}% 저렴해요
      </div>
    </section>
  );
}

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const rawKeyword = searchParams.get('q')?.trim() ?? '';
  const keyword = rawKeyword || '30만원으로 에어팟 사고 싶어, 중고 괜찮아';
  const { session, results } = useMemo(() => createMockSearchData(keyword), [keyword]);
  const [platform, setPlatform] = useState<PlatformFilter>('ALL');
  const [sort, setSort] = useState<SearchSort>('AI_RECOMMENDED');
  const [draft, setDraft] = useState('');
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(
    () => new Set(results.content.filter((product) => product.isFavorite).map((product) => product.productId))
  );

  useEffect(() => {
    setPlatform('ALL');
    setSort('AI_RECOMMENDED');
    setDraft('');
    setFollowUps([]);
    setShowAll(false);
    setSelectedProductId(null);
    setFavoriteIds(
      new Set(results.content.filter((product) => product.isFavorite).map((product) => product.productId))
    );
  }, [keyword, results.content]);

  const sortedProducts = useMemo(() => {
    const filtered = results.content.filter((product) => platform === 'ALL' || product.platform === platform);
    return [...filtered].sort((left, right) => {
      if (sort === 'PRICE_ASC') return left.price - right.price;
      if (sort === 'DISTANCE_ASC')
        return (left.distanceKm ?? Number.POSITIVE_INFINITY) - (right.distanceKm ?? Number.POSITIVE_INFINITY);
      return right.recommendationScore - left.recommendationScore;
    });
  }, [platform, results.content, sort]);

  const visibleProducts = showAll ? sortedProducts : sortedProducts.slice(0, 4);
  const featuredProduct = results.content[0];
  const maxSavingsRate = featuredProduct?.savingsRate ?? 0;

  const sendFollowUp = (message: string) => {
    const trimmed = message.trim();
    if (!trimmed) return;
    setFollowUps((previous) => [...previous, trimmed]);
    setDraft('');
  };

  const submitFollowUp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendFollowUp(draft);
  };

  const toggleFavorite = (productId: string) => {
    setFavoriteIds((previous) => {
      const next = new Set(previous);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  return (
    <section className="font-ds bg-ds-surface-sunken px-3 py-4 sm:px-5 lg:px-6 lg:py-6">
      <div className="mx-auto grid max-w-[1440px] gap-4 lg:grid-cols-[minmax(360px,0.78fr)_minmax(0,1.42fr)]">
        <aside className="rounded-ds-lg border-ds-border bg-ds-surface shadow-ds-raised flex min-h-[680px] flex-col overflow-hidden border lg:sticky lg:top-20 lg:h-[calc(100dvh-7rem)] lg:min-h-0">
          <header className="border-ds-border flex items-center gap-3 border-b px-4 py-4 sm:px-5">
            <AssistantAvatar />
            <div>
              <h1 className="text-ds-text text-ds-h-sm font-ds-bold">AI 구매 어시스턴스 고르밍</h1>
              <p className="text-ds-success-text text-ds-body-sm font-ds-medium mt-0.5 flex items-center gap-1.5">
                <span className="bg-ds-success-border size-1.5 rounded-full" aria-hidden /> 3개 플랫폼 실시간 탐색 중
              </p>
            </div>
          </header>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5">
            <div className="flex justify-end">
              <div className="bg-ds-neutral-bold text-ds-text-inverse rounded-ds-lg text-ds-body max-w-[88%] px-3.5 py-2.5">
                {keyword}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <AssistantAvatar small />
              <div className="bg-ds-surface-hovered rounded-ds-lg min-w-0 flex-1 px-3.5 py-3">
                <p className="text-ds-text text-ds-body font-ds-semibold">요청을 이렇게 이해했어요</p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  <Tag>{session.parsedConditions.keyword}</Tag>
                  <Tag>30만원 이하</Tag>
                  <Tag>중고 OK</Tag>
                  <Tag>최고 가성비</Tag>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <AssistantAvatar small />
              <div className="bg-ds-surface-hovered text-ds-text text-ds-body rounded-ds-lg min-w-0 flex-1 px-3.5 py-3 leading-6">
                당근·번개장터·중고나라에서 <strong className="font-ds-bold">{session.resultCount}개</strong> 매물을
                찾았어요. Apple 공식 정가(₩299,000) 대비 최대{' '}
                <strong className="text-ds-success-text font-ds-bold">{maxSavingsRate}% 저렴해요.</strong>
              </div>
            </div>

            {featuredProduct ? (
              <div className="flex items-start gap-3">
                <AssistantAvatar small />
                <div className="bg-ds-surface-hovered text-ds-text text-ds-body rounded-ds-lg min-w-0 flex-1 px-3.5 py-3 leading-6">
                  <p>
                    최저가는 아니지만{' '}
                    <strong className="font-ds-bold">판매자 신뢰도(거래 {featuredProduct.sellerTrustScore}회)</strong>와
                    상품 상태를 고려하면 이 매물을 추천해요.
                  </p>
                  <div className="border-ds-border bg-ds-surface rounded-ds-md mt-3 flex items-center gap-3 border p-2.5">
                    <ProductThumbnail product={featuredProduct} size="compact" />
                    <div className="min-w-0">
                      <p className="text-ds-text text-ds-body font-ds-bold truncate">{featuredProduct.title}</p>
                      <p className="text-ds-text-subtle text-ds-body-sm mt-0.5">
                        당근마켓 · {CONDITION_LABELS[featuredProduct.condition]}
                      </p>
                    </div>
                    <span className="text-ds-text text-ds-body font-ds-bold ml-auto shrink-0">
                      {formatPrice(featuredProduct.price)}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            {followUps.map((message, index) => (
              <div key={`${message}-${index}`} className="space-y-3">
                <div className="flex justify-end">
                  <div className="bg-ds-neutral-bold text-ds-text-inverse rounded-ds-lg text-ds-body max-w-[88%] px-3.5 py-2.5">
                    {message}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AssistantAvatar small />
                  <div className="bg-ds-surface-hovered text-ds-text text-ds-body rounded-ds-lg px-3.5 py-2.5 leading-6">
                    {followUpReply(message)}
                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-1.5 pl-11">
              {QUICK_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => sendFollowUp(question)}
                  className={`${BUTTON_BASE} border-ds-border text-ds-text-subtle hover:bg-ds-neutral hover:text-ds-text h-8 border px-3`}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={submitFollowUp} className="border-ds-border border-t p-3 sm:p-4">
            <div className="border-ds-border-input bg-ds-surface rounded-ds-sm focus-within:border-ds-border-focused focus-within:ring-ds-border-focused flex items-center gap-2 border p-1 transition-colors focus-within:ring-1">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="AI에게 더 물어보세요"
                aria-label="AI에게 추가 질문하기"
                className="text-ds-text placeholder:text-ds-text-subtlest text-ds-body min-w-0 flex-1 bg-transparent px-2 py-1.5 outline-none"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                aria-label="추가 질문 보내기"
                className={`${BUTTON_BASE} bg-ds-brand hover:bg-ds-brand-hovered active:bg-ds-brand-pressed text-ds-text-inverse disabled:bg-ds-neutral disabled:text-ds-text-disabled size-8 shrink-0 disabled:cursor-not-allowed`}
              >
                <Send className="size-4" aria-hidden />
              </button>
            </div>
          </form>
        </aside>

        <div className="min-w-0 space-y-4">
          <OfficialPriceCard
            name={results.officialProduct.name}
            officialStore={results.officialProduct.officialStore}
            officialPrice={results.officialProduct.officialPrice}
            officialUrl={results.officialProduct.officialUrl}
            maxSavingsRate={maxSavingsRate}
          />

          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-ds-text text-ds-h-md font-ds-bold mr-1">
                {results.totalElements}개의 <span className="text-ds-text-subtlest font-ds-regular">중고 매물</span>
              </h2>
              <div className="flex flex-wrap items-center gap-1.5">
                {PLATFORM_TABS.map((tab) => (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => {
                      setPlatform(tab.value);
                      setShowAll(false);
                    }}
                    aria-pressed={platform === tab.value}
                    className={`${BUTTON_BASE} h-8 border px-3 ${
                      platform === tab.value
                        ? 'border-ds-brand bg-ds-brand-subtlest text-ds-brand-text'
                        : 'border-ds-border bg-ds-surface text-ds-text-subtle hover:bg-ds-neutral hover:text-ds-text'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <Dropdown
              value={sort}
              options={SORT_OPTIONS}
              onChange={setSort}
              ariaLabel="정렬 기준"
              className="w-full xl:w-44"
            />
          </div>

          <div className="space-y-3">
            {visibleProducts.map((product, index) => (
              <ResultCard
                key={product.productId}
                product={product}
                featured={index === 0 && platform === 'ALL' && sort === 'AI_RECOMMENDED'}
                favorite={favoriteIds.has(product.productId)}
                selected={selectedProductId === product.productId}
                detailHref={`${productDetailPath(product.productId)}?q=${encodeURIComponent(keyword)}`}
                onToggleFavorite={() => toggleFavorite(product.productId)}
                onSelect={() => setSelectedProductId(product.productId)}
              />
            ))}
          </div>

          {visibleProducts.length === 0 ? (
            <div className="rounded-ds-lg border-ds-border bg-ds-surface border border-dashed px-6 py-14 text-center">
              <Sparkles className="text-ds-text-subtlest mx-auto size-6" aria-hidden />
              <p className="text-ds-text text-ds-h-sm font-ds-bold mt-3">조건에 맞는 매물이 없어요</p>
              <p className="text-ds-text-subtle text-ds-body mt-1">다른 플랫폼이나 정렬 기준으로 다시 확인해 보세요.</p>
            </div>
          ) : null}

          {sortedProducts.length > 4 && !showAll ? (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className={`${BUTTON_BASE} border-ds-border bg-ds-surface text-ds-text-subtle hover:bg-ds-neutral hover:text-ds-text w-full border py-3`}
            >
              매물 더 보기 <ChevronDown className="size-4" aria-hidden />
            </button>
          ) : null}

          <div className="text-ds-text-subtlest text-ds-body-sm flex flex-wrap items-center justify-center gap-x-5 gap-y-2 py-2">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5" aria-hidden /> 판매자 신뢰도 반영
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ThumbsUp className="size-3.5" aria-hidden /> AI 추천 점수 반영
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" aria-hidden /> 거리 정보 반영
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
