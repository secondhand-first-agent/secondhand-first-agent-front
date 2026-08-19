import {
  ChevronDown,
  ExternalLink,
  Headphones,
  Heart,
  MapPin,
  Send,
  ShieldCheck,
  Store,
  ThumbsUp,
  Zap,
} from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import type { Condition, Platform, SearchResultProduct, SearchSort } from '@/api/searches/search.schema';
import { productDetailPath } from '@/app/routes';
import { Dropdown } from '@/components/Dropdown';
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

const PLATFORM_STYLES: Record<Platform, string> = {
  DAANGN: 'bg-orange-50 text-orange-600',
  BUNGJANG: 'bg-yellow-50 text-yellow-600',
  JOONGGONARA: 'bg-red-50 text-red-500',
};

const QUICK_QUESTIONS = ['미개봉만 보여줘', '더 저렴한 것도', '판교 근처만'];

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

function AssistantAvatar({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`bg-brand flex shrink-0 items-center justify-center rounded-full text-white ${small ? 'size-8' : 'size-12'}`}
    >
      <Zap className={small ? 'size-4' : 'size-6'} strokeWidth={2.5} aria-hidden />
    </span>
  );
}

function ProductThumbnail({ product, featured = false }: { product: SearchResultProduct; featured?: boolean }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${
        featured
          ? 'min-h-44 bg-gradient-to-br from-emerald-50 via-green-100 to-cyan-50 sm:min-h-full'
          : 'size-24 shrink-0 rounded-xl bg-gradient-to-br from-sky-50 to-blue-100 sm:size-28'
      }`}
    >
      {product.imageUrl ? (
        <img src={product.imageUrl} alt="" className="size-full object-contain p-4" />
      ) : (
        <Headphones className={featured ? 'size-24 text-gray-400/80' : 'size-14 text-gray-400/80'} strokeWidth={1.2} />
      )}
    </div>
  );
}

function PlatformBadge({ platform }: { platform: Platform }) {
  return (
    <span className={`rounded-md px-2 py-1 text-xs font-bold ${PLATFORM_STYLES[platform]}`}>
      {PLATFORM_LABELS[platform]}
    </span>
  );
}

function ResultCard({
  product,
  featured,
  favorite,
  selected,
  onToggleFavorite,
  onSelect,
}: {
  product: SearchResultProduct;
  featured: boolean;
  favorite: boolean;
  selected: boolean;
  onToggleFavorite: () => void;
  onSelect: () => void;
}) {
  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white transition-shadow ${
        featured
          ? 'border-brand border-2 shadow-[0_10px_30px_rgba(16,185,129,0.12)]'
          : 'border-gray-200 hover:shadow-md'
      }`}
    >
      <div
        className={featured ? 'grid sm:grid-cols-[minmax(180px,0.55fr)_minmax(0,1.45fr)]' : 'flex gap-4 p-5 sm:gap-5'}
      >
        <div className={featured ? 'relative' : ''}>
          <ProductThumbnail product={product} featured={featured} />
          {featured ? (
            <span className="bg-brand absolute top-4 left-4 rounded-full px-3 py-2 text-xs font-bold text-white">
              🥇 AI 추천 1순위
            </span>
          ) : null}
        </div>

        <div
          className={
            featured
              ? 'flex min-w-0 flex-col justify-between p-5 sm:p-6'
              : 'flex min-w-0 flex-1 flex-col justify-center'
          }
        >
          <div className="flex items-center gap-2 text-sm">
            <PlatformBadge platform={product.platform} />
            <span className="text-gray-400">{product.rank === 1 ? '2시간 전' : `${product.rank + 2}시간 전`}</span>
          </div>
          <h3 className={`mt-2 truncate font-bold text-gray-900 ${featured ? 'text-xl' : 'text-base sm:text-lg'}`}>
            {product.title}
          </h3>
          <p className="mt-1 truncate text-sm text-gray-500">
            {CONDITION_LABELS[product.condition]} · {product.tradeType[0] === 'DIRECT' ? '판매 직거래' : '택배 거래'} ·{' '}
            {formatDistance(product.distanceKm)}
          </p>

          <div className={`flex items-end justify-between gap-4 ${featured ? 'mt-6' : 'mt-4'}`}>
            <div>
              <p className={`font-bold tracking-tight text-gray-900 ${featured ? 'text-2xl' : 'text-xl'}`}>
                {formatPrice(product.price)}
              </p>
              {featured ? (
                <p className="mt-0.5 text-xs text-gray-400 line-through">{formatPrice(product.officialPrice)}</p>
              ) : null}
              <p className="text-brand mt-1 text-xs font-semibold">정가 대비 {product.savingsRate}% 절약</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={onToggleFavorite}
                aria-label={favorite ? '찜 취소' : '찜하기'}
                aria-pressed={favorite}
                className={`flex size-11 items-center justify-center rounded-full border transition-colors ${
                  favorite
                    ? 'border-rose-200 bg-rose-50 text-rose-500'
                    : 'border-gray-200 bg-white text-gray-400 hover:border-gray-400 hover:text-gray-700'
                }`}
              >
                <Heart className="size-5" fill={favorite ? 'currentColor' : 'none'} aria-hidden />
              </button>
              {featured ? (
                <button
                  type="button"
                  onClick={onSelect}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold text-white transition-colors ${selected ? 'bg-gray-700' : 'bg-brand hover:bg-brand-dark'}`}
                >
                  {selected ? '선택됨' : '상품 보기'}
                </button>
              ) : null}
            </div>
          </div>

          {featured ? (
            <div className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-500">
              💰 정가 대비 {formatPrice(product.savingsAmount)} 절약
            </div>
          ) : null}
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
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
        <Store className="size-5" aria-hidden />
        공식 사이트 정가 비교
      </div>
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center xl:flex-nowrap">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gray-900 text-white">
          <Store className="size-7" strokeWidth={1.7} aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-gray-400">{officialStore}</p>
          <h1 className="mt-1 truncate text-xl font-bold text-gray-900 sm:text-2xl">{name}</h1>
        </div>
        <div className="sm:ml-auto sm:text-right">
          <p className="text-sm text-gray-400">공식 정가</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-gray-400 line-through">
            {formatPrice(officialPrice)}
          </p>
        </div>
        <a
          href={officialUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-900"
        >
          공식 사이트에서 보기
          <ExternalLink className="size-4" aria-hidden />
        </a>
      </div>
      <div className="mt-5 inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700">
        ♻️ 아래 중고 매물은 공식 정가 대비 최대 {maxSavingsRate}% 저렴해요
      </div>
    </section>
  );
}

export function SearchPage() {
  const navigate = useNavigate();
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
    <section className="bg-[#f8fafc] px-3 py-4 sm:px-5 lg:px-6 lg:py-6">
      <div className="mx-auto grid max-w-[1440px] gap-4 lg:grid-cols-[minmax(360px,0.78fr)_minmax(0,1.42fr)]">
        <aside className="flex min-h-[680px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:sticky lg:top-20 lg:h-[calc(100dvh-7rem)] lg:min-h-0">
          <header className="flex items-center gap-3 border-b border-gray-100 px-5 py-5 sm:px-6">
            <span className="bg-brand flex size-12 shrink-0 items-center justify-center rounded-full text-white">
              <Zap className="size-6" strokeWidth={2.4} aria-hidden />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">AI 구매 어시스턴트</h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                <span className="size-2 rounded-full bg-emerald-500" aria-hidden /> 3개 플랫폼 실시간 탐색 중
              </p>
            </div>
          </header>

          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:px-6">
            <div className="flex justify-end">
              <div className="max-w-[88%] rounded-2xl rounded-tr-md bg-gray-900 px-5 py-3.5 text-sm leading-6 font-medium text-white">
                {keyword}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <AssistantAvatar />
              <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md bg-slate-100 px-5 py-4">
                <p className="text-sm font-semibold text-gray-700">요청을 이렇게 이해했어요</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold text-emerald-700">
                    🎧 {session.parsedConditions.keyword}
                  </span>
                  <span className="rounded-xl border border-sky-200 bg-white px-3 py-2 text-sm font-semibold text-sky-700">
                    💰 30만원 이하
                  </span>
                  <span className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm font-semibold text-amber-700">
                    📦 중고 OK
                  </span>
                  <span className="rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-600">
                    🏆 최고 가성비
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <AssistantAvatar small />
              <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md bg-slate-100 px-5 py-4 text-sm leading-7 text-gray-700">
                당근·번개장터·중고나라에서 <strong className="text-gray-900">{session.resultCount}개</strong> 매물을
                찾았어요. Apple 공식 정가(₩299,000) 대비 최대{' '}
                <strong className="text-emerald-600">{maxSavingsRate}% 저렴해요.</strong>
              </div>
            </div>

            {featuredProduct ? (
              <div className="flex items-start gap-3">
                <AssistantAvatar small />
                <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md bg-slate-100 px-5 py-4 text-sm leading-7 text-gray-700">
                  <p>
                    최저가는 아니지만{' '}
                    <strong className="text-gray-900">판매자 신뢰도(거래 {featuredProduct.sellerTrustScore}회)</strong>
                    와 상품 상태를 고려하면 이 매물을 추천해요.
                  </p>
                  <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-300 bg-white p-3">
                    <ProductThumbnail product={featuredProduct} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-gray-900">{featuredProduct.title}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        당근마켓 · {CONDITION_LABELS[featuredProduct.condition]}
                      </p>
                    </div>
                    <span className="ml-auto shrink-0 text-sm font-bold text-gray-900">
                      {formatPrice(featuredProduct.price)}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            {followUps.map((message, index) => (
              <div key={`${message}-${index}`} className="space-y-3">
                <div className="flex justify-end">
                  <div className="max-w-[88%] rounded-2xl rounded-tr-md bg-gray-900 px-5 py-3 text-sm leading-6 font-medium text-white">
                    {message}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AssistantAvatar small />
                  <div className="rounded-2xl rounded-tl-md bg-slate-100 px-5 py-3.5 text-sm leading-6 text-gray-700">
                    {followUpReply(message)}
                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-2 pl-11">
              {QUICK_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => sendFollowUp(question)}
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-900"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={submitFollowUp} className="border-t border-gray-100 p-4 sm:p-5">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 focus-within:border-gray-400">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="AI에게 더 물어보세요"
                aria-label="AI에게 추가 질문하기"
                className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                aria-label="추가 질문 보내기"
                className="bg-brand hover:bg-brand-dark flex size-10 shrink-0 items-center justify-center rounded-xl text-white transition-colors disabled:cursor-not-allowed disabled:bg-gray-200"
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

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <p className="mr-2 text-xl font-bold tracking-tight text-gray-900">
                {results.totalElements}개의 <span className="font-medium text-gray-400">중고 매물</span>
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {PLATFORM_TABS.map((tab) => (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => {
                      setPlatform(tab.value);
                      setShowAll(false);
                    }}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${platform === tab.value ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-900'}`}
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

          <div className="space-y-4">
            {visibleProducts.map((product, index) => (
              <ResultCard
                key={product.productId}
                product={product}
                featured={index === 0 && platform === 'ALL' && sort === 'AI_RECOMMENDED'}
                favorite={favoriteIds.has(product.productId)}
                selected={selectedProductId === product.productId}
                onToggleFavorite={() => toggleFavorite(product.productId)}
                onSelect={() => {
                  setSelectedProductId(product.productId);
                  navigate(`${productDetailPath(product.productId)}?q=${encodeURIComponent(keyword)}`);
                }}
              />
            ))}
          </div>

          {visibleProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
              <p className="text-base font-semibold text-gray-700">조건에 맞는 매물이 없어요</p>
              <p className="mt-2 text-sm text-gray-400">다른 플랫폼이나 정렬 기준으로 다시 확인해 보세요.</p>
            </div>
          ) : null}

          {sortedProducts.length > 4 && !showAll ? (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="flex w-full items-center justify-center rounded-2xl border border-gray-200 bg-white py-5 text-base font-bold text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-900"
            >
              매물 더 보기 <ChevronDown className="ml-2 size-5" aria-hidden />
            </button>
          ) : null}

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 py-3 text-xs text-gray-400">
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
