import { useQuery } from '@tanstack/react-query';
import {
  Award,
  ChevronDown,
  Headphones,
  Leaf,
  LoaderCircle,
  Search,
  Send,
  Sparkles,
  ThumbsUp,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router';

import { getErrorMessage } from '@/api/response';
import type {
  Condition,
  ParsedConditions,
  Platform,
  SearchPriority,
  SearchRecommendation,
  SearchSort,
} from '@/api/searches/search.schema';
import assistantAvatarUrl from '@/assets/image/cat-avatar.png';
import { ROUTES, productDetailPath } from '@/app/routes';
import { Dropdown } from '@/components/Dropdown';
import { queryFactory } from '@/queryFactory';

type PlatformFilter = 'ALL' | Platform;

const PLATFORM_TABS: Array<{ value: PlatformFilter; label: string }> = [
  { value: 'ALL', label: '전체' },
  { value: 'BUNJANG', label: '번개장터' },
  { value: 'JOONGNA', label: '중고나라' },
  { value: 'NAVER_FLEAMARKET', label: 'N플리마켓' },
  { value: 'ELEVENST', label: '11번가' },
];

/**
 * 서버가 정렬해 주지 않아 받은 목록을 화면에서 정렬한다.
 * 거리는 검색 응답에 없으므로 거리순은 두지 않는다.
 */
const SORT_OPTIONS: Array<{ value: SearchSort; label: string }> = [
  { value: 'AI_RECOMMENDED', label: 'AI 추천순' },
  { value: 'PRICE_ASC', label: '가격 낮은순' },
];

const CONDITION_LABELS: Record<Condition, string> = {
  NEW: '미개봉',
  LIKE_NEW: '거의 새것',
  LIGHTLY_USED: '사용감 적음',
  USED: '사용감 있음',
  UNSPECIFIED: '상태 미기재',
  UNKNOWN: '상태 확인 필요',
};

const PRIORITY_LABELS: Record<SearchPriority, string> = {
  BEST_VALUE: '최고 가성비',
  LOWEST_PRICE: '최저가',
  BEST_CONDITION: '상태 우선',
  NEAREST: '가까운 거리 우선',
};

const PLATFORM_LABELS: Record<Platform, string> = {
  BUNJANG: '번개장터',
  JOONGNA: '중고나라',
  NAVER_FLEAMARKET: 'N플리마켓',
  ELEVENST: '11번가',
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
  BUNJANG: 'red',
  JOONGNA: 'yellow',
  NAVER_FLEAMARKET: 'green',
  // 새상품 채널이라 중고 셋과 색 계열을 구분한다.
  ELEVENST: 'purple',
};

/** ADS 버튼 기본형 — height 32px, radius.small(4px), font.body(14/20) */
const BUTTON_BASE =
  'rounded-ds-sm text-ds-body font-ds-medium focus-visible:outline-ds-border-focused inline-flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2';

function formatPrice(price: number) {
  return `₩${price.toLocaleString('ko-KR')}`;
}

/** 소수점이 길게 붙어 오는 값이라 한 자리로 줄인다. */
function formatCarbon(co2eKg: number) {
  return co2eKg >= 10 ? Math.round(co2eKg) : Math.round(co2eKg * 10) / 10;
}

/** AI가 해석한 조건을 라벨 목록으로 편다. 없는 조건은 칩도 만들지 않는다. */
function conditionTags(parsed: ParsedConditions): string[] {
  return [
    parsed.keyword,
    parsed.maxPrice == null ? null : `${formatPrice(parsed.maxPrice)} 이하`,
    ...parsed.condition.map((condition) => CONDITION_LABELS[condition]),
    PRIORITY_LABELS[parsed.priority],
  ].filter((label): label is string => Boolean(label));
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

function ProductThumbnail({ product, size = 'card' }: { product: SearchRecommendation; size?: ThumbnailSize }) {
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

function CarbonLozenge({ carbonSaving }: { carbonSaving: SearchRecommendation['carbonSaving'] }) {
  if (!carbonSaving || carbonSaving.status !== 'AVAILABLE' || carbonSaving.co2eKg == null) return null;

  return (
    <Lozenge tone="blue" icon={Leaf} title={carbonSaving.source ?? undefined}>
      탄소 약 {formatCarbon(carbonSaving.co2eKg)}kg 절감
    </Lozenge>
  );
}

function ResultCard({
  product,
  featured,
  selected,
  detailHref,
  onSelect,
}: {
  product: SearchRecommendation;
  featured: boolean;
  selected: boolean;
  detailHref: string | null;
  onSelect: () => void;
}) {
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
      {detailHref ? (
        <Link
          to={detailHref}
          onClick={onSelect}
          aria-label={`${product.title} 상세 보기`}
          className="rounded-ds-lg focus-visible:outline-ds-border-focused absolute inset-0 focus-visible:outline-2 focus-visible:outline-offset-2"
        />
      ) : null}
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
            {product.recommendationScore == null ? null : (
              <span className="text-ds-text-subtlest text-ds-body-sm">
                AI 추천 점수 {Math.round(product.recommendationScore)}점
              </span>
            )}
          </div>

          <h3 className={`text-ds-text font-ds-bold mt-1.5 truncate ${featured ? 'text-ds-h-md' : 'text-ds-h-sm'}`}>
            {product.title}
          </h3>

          <p className={`text-ds-text font-ds-bold ${featured ? 'text-ds-h-lg mt-5' : 'text-ds-h-md mt-3'}`}>
            {formatPrice(product.price)}
          </p>

          {product.recommendationReason ? (
            <p className="text-ds-text-subtle text-ds-body mt-1.5 line-clamp-2">{product.recommendationReason}</p>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <CarbonLozenge carbonSaving={product.carbonSaving} />
          </div>

          {featured && detailHref ? (
            /* 카드를 덮은 링크 위로 올려서 각자의 동작이 살아 있게 한다. */
            <div className="relative z-10 mt-4 flex shrink-0 items-center gap-2">
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
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

/** 세션 없이 들어왔거나 결과를 되살릴 수 없을 때 보여주는 안내. */
function SearchPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <section className="font-ds bg-ds-surface-sunken min-h-[60dvh] px-4 py-20">
      <div className="rounded-ds-lg border-ds-border bg-ds-surface mx-auto max-w-lg border border-dashed px-6 py-14 text-center">
        <Sparkles className="text-ds-text-subtlest mx-auto size-6" aria-hidden />
        <p className="text-ds-text text-ds-h-sm font-ds-bold mt-3">{title}</p>
        <p className="text-ds-text-subtle text-ds-body mt-1">{description}</p>
        <Link
          to={ROUTES.home}
          className={`${BUTTON_BASE} bg-ds-brand hover:bg-ds-brand-hovered active:bg-ds-brand-pressed text-ds-text-inverse mt-5 h-9 px-4`}
        >
          <Search className="size-4" aria-hidden />
          검색하러 가기
        </Link>
      </div>
    </section>
  );
}

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId')?.trim() ?? '';

  const session = useQuery(queryFactory.searches.session(sessionId));
  // 결과 목록은 검색을 만든 뮤테이션이 캐시에 심어 둔 것만 있다. 다시 받아올 API 가 없다.
  const { data: recommendations } = useQuery(queryFactory.searches.recommendations(sessionId));

  const [platform, setPlatform] = useState<PlatformFilter>('ALL');
  const [sort, setSort] = useState<SearchSort>('AI_RECOMMENDED');
  const [showAll, setShowAll] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    setPlatform('ALL');
    setSort('AI_RECOMMENDED');
    setShowAll(false);
    setSelectedProductId(null);
  }, [sessionId]);

  const products = useMemo(() => recommendations ?? [], [recommendations]);

  const sortedProducts = useMemo(() => {
    const filtered = products.filter((product) => platform === 'ALL' || product.platform === platform);
    return [...filtered].sort((left, right) =>
      sort === 'PRICE_ASC' ? left.price - right.price : left.rank - right.rank
    );
  }, [platform, products, sort]);

  if (!sessionId) {
    return (
      <SearchPlaceholder
        title="검색어를 먼저 알려주세요"
        description="홈에서 찾고 싶은 물건과 조건을 적으면 AI가 매물을 찾아드려요."
      />
    );
  }

  if (session.isPending) {
    return (
      <section className="font-ds bg-ds-surface-sunken flex min-h-[60dvh] items-center justify-center px-4">
        <p className="text-ds-text-subtle text-ds-body inline-flex items-center gap-2">
          <LoaderCircle className="size-4 animate-spin" aria-hidden />
          검색 결과를 불러오는 중이에요
        </p>
      </section>
    );
  }

  if (session.isError) {
    return <SearchPlaceholder title="검색을 불러오지 못했어요" description={getErrorMessage(session.error)} />;
  }

  const detail = session.data;
  const visibleProducts = showAll ? sortedProducts : sortedProducts.slice(0, 4);
  const featuredProduct = products[0];

  return (
    <section className="font-ds bg-ds-surface-sunken px-3 py-4 sm:px-5 lg:px-6 lg:py-6">
      <div className="mx-auto grid max-w-[1440px] gap-4 lg:grid-cols-[minmax(360px,0.78fr)_minmax(0,1.42fr)]">
        <aside className="rounded-ds-lg border-ds-border bg-ds-surface shadow-ds-raised flex min-h-[680px] flex-col overflow-hidden border lg:sticky lg:top-20 lg:h-[calc(100dvh-7rem)] lg:min-h-0">
          <header className="border-ds-border flex items-center gap-3 border-b px-4 py-4 sm:px-5">
            <AssistantAvatar />
            <div>
              <h1 className="text-ds-text text-ds-h-sm font-ds-bold">AI 구매 어시스턴스 고르밍</h1>
              <p className="text-ds-success-text text-ds-body-sm font-ds-medium mt-0.5 flex items-center gap-1.5">
                <span className="bg-ds-success-border size-1.5 rounded-full" aria-hidden /> 3개 플랫폼 탐색 완료
              </p>
            </div>
          </header>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5">
            <div className="flex justify-end">
              <div className="bg-ds-neutral-bold text-ds-text-inverse rounded-ds-lg text-ds-body max-w-[88%] px-3.5 py-2.5">
                {detail.originalQuery}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <AssistantAvatar small />
              <div className="bg-ds-surface-hovered rounded-ds-lg min-w-0 flex-1 px-3.5 py-3">
                <p className="text-ds-text text-ds-body font-ds-semibold">요청을 이렇게 이해했어요</p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {conditionTags(detail.parsedConditions).map((label) => (
                    <Tag key={label}>{label}</Tag>
                  ))}
                </div>
              </div>
            </div>

            {/*
              메시지에 발신 주체가 없다. 서버는 세션을 만들 때 AI 답변만 저장하므로
              여기 오는 것은 모두 AI 쪽 발화다.
            */}
            {detail.messages.map((message) => (
              <div key={message.id} className="flex items-start gap-3">
                <AssistantAvatar small />
                <div className="bg-ds-surface-hovered text-ds-text text-ds-body rounded-ds-lg min-w-0 flex-1 px-3.5 py-3 leading-6">
                  {message.content}
                </div>
              </div>
            ))}

            {featuredProduct ? (
              <div className="flex items-start gap-3">
                <AssistantAvatar small />
                <div className="bg-ds-surface-hovered text-ds-text text-ds-body rounded-ds-lg min-w-0 flex-1 px-3.5 py-3 leading-6">
                  {featuredProduct.recommendationReason ? (
                    <p>{featuredProduct.recommendationReason}</p>
                  ) : (
                    <p>AI 추천 순위가 가장 높은 매물이에요.</p>
                  )}
                  <div className="border-ds-border bg-ds-surface rounded-ds-md mt-3 flex items-center gap-3 border p-2.5">
                    <ProductThumbnail product={featuredProduct} size="compact" />
                    <div className="min-w-0">
                      <p className="text-ds-text text-ds-body font-ds-bold truncate">{featuredProduct.title}</p>
                      <p className="text-ds-text-subtle text-ds-body-sm mt-0.5">
                        {PLATFORM_LABELS[featuredProduct.platform]}
                      </p>
                    </div>
                    <span className="text-ds-text text-ds-body font-ds-bold ml-auto shrink-0">
                      {formatPrice(featuredProduct.price)}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/*
            추가 질문은 백엔드에 엔드포인트가 없다. 눌러도 아무 일이 없는 입력창을
            열어두는 대신 왜 못 쓰는지 알린다.
          */}
          <div className="border-ds-border border-t p-3 sm:p-4">
            <div className="border-ds-border-input bg-ds-surface-sunken rounded-ds-sm flex items-center gap-2 border p-1">
              <input
                disabled
                placeholder="추가 질문은 준비 중이에요"
                aria-label="AI에게 추가 질문하기"
                className="text-ds-text placeholder:text-ds-text-subtlest text-ds-body min-w-0 flex-1 bg-transparent px-2 py-1.5 outline-none"
              />
              <button
                type="button"
                disabled
                aria-label="추가 질문 보내기"
                className={`${BUTTON_BASE} bg-ds-neutral text-ds-text-disabled size-8 shrink-0 cursor-not-allowed`}
              >
                <Send className="size-4" aria-hidden />
              </button>
            </div>
          </div>
        </aside>

        <div className="min-w-0 space-y-4">
          {recommendations === undefined ? (
            <div className="rounded-ds-lg border-ds-border bg-ds-surface border border-dashed px-6 py-14 text-center">
              <Sparkles className="text-ds-text-subtlest mx-auto size-6" aria-hidden />
              <p className="text-ds-text text-ds-h-sm font-ds-bold mt-3">매물 목록을 다시 불러올 수 없어요</p>
              <p className="text-ds-text-subtle text-ds-body mt-1">
                매물은 검색을 실행한 순간에만 받아옵니다. 같은 조건으로 다시 검색해주세요.
              </p>
              <Link
                to={ROUTES.home}
                className={`${BUTTON_BASE} bg-ds-brand hover:bg-ds-brand-hovered active:bg-ds-brand-pressed text-ds-text-inverse mt-5 h-9 px-4`}
              >
                <Search className="size-4" aria-hidden />
                다시 검색하기
              </Link>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-ds-text text-ds-h-md font-ds-bold mr-1">
                    {products.length}개의 <span className="text-ds-text-subtlest font-ds-regular">매물</span>
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
                    key={product.productId ?? `rank-${product.rank}`}
                    product={product}
                    featured={index === 0 && platform === 'ALL' && sort === 'AI_RECOMMENDED'}
                    selected={selectedProductId === product.productId}
                    detailHref={
                      product.productId
                        ? `${productDetailPath(product.productId)}?q=${encodeURIComponent(detail.originalQuery)}`
                        : null
                    }
                    onSelect={() => setSelectedProductId(product.productId)}
                  />
                ))}
              </div>

              {visibleProducts.length === 0 ? (
                <div className="rounded-ds-lg border-ds-border bg-ds-surface border border-dashed px-6 py-14 text-center">
                  <Sparkles className="text-ds-text-subtlest mx-auto size-6" aria-hidden />
                  <p className="text-ds-text text-ds-h-sm font-ds-bold mt-3">조건에 맞는 매물이 없어요</p>
                  <p className="text-ds-text-subtle text-ds-body mt-1">
                    다른 플랫폼이나 정렬 기준으로 다시 확인해 보세요.
                  </p>
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
                  <ThumbsUp className="size-3.5" aria-hidden /> AI 추천 점수 반영
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Leaf className="size-3.5" aria-hidden /> 탄소 절감량 계산
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
