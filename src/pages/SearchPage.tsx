import { useQuery } from '@tanstack/react-query';
import { Award, Headphones, Leaf, RefreshCw, ShieldCheck, Sparkles, Store, ThumbsUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';

import { getErrorMessage } from '@/api/response';
import { createSearchSession } from '@/api/searches/search.api';
import type { Condition, Platform, SearchRecommendation } from '@/api/searches/search.schema';
import assistantAvatarUrl from '@/assets/image/cat-avatar.png';
import { productDetailPath } from '@/app/routes';
import { Dropdown } from '@/components/Dropdown';

type PlatformFilter = 'ALL' | Platform;
type ResultSort = 'AI_RECOMMENDED' | 'PRICE_ASC';

const PLATFORM_TABS: Array<{ value: PlatformFilter; label: string }> = [
  { value: 'ALL', label: '전체' },
  { value: 'BUNJANG', label: '번개장터' },
  { value: 'JOONGNA', label: '중고나라' },
  { value: 'NAVER_FLEAMARKET', label: 'N플리마켓' },
  { value: 'ELEVENST', label: '11번가' },
];

const PLATFORM_LABELS: Record<Platform, string> = {
  BUNJANG: '번개장터',
  JOONGNA: '중고나라',
  NAVER_FLEAMARKET: 'N플리마켓',
  ELEVENST: '11번가',
};

const CONDITION_LABELS: Record<Condition, string> = {
  NEW: '미개봉',
  LIKE_NEW: '거의 새것',
  LIGHTLY_USED: '사용감 적음',
  USED: '사용감 있음',
  UNSPECIFIED: '상태 미기재',
  UNKNOWN: '상태 확인 필요',
};

const PLATFORM_STYLES: Record<Platform, string> = {
  BUNJANG: 'bg-ds-accent-red-bg text-ds-accent-red-text',
  JOONGNA: 'bg-ds-accent-yellow-bg text-ds-accent-yellow-text',
  NAVER_FLEAMARKET: 'bg-ds-accent-green-bg text-ds-accent-green-text',
  ELEVENST: 'bg-ds-accent-purple-bg text-ds-accent-purple-text',
};

const SORT_OPTIONS: Array<{ value: ResultSort; label: string }> = [
  { value: 'AI_RECOMMENDED', label: 'AI 추천순' },
  { value: 'PRICE_ASC', label: '가격 낮은순' },
];

function formatPrice(price: number) {
  return `₩${price.toLocaleString('ko-KR')}`;
}

function AssistantAvatar() {
  return <img src={assistantAvatarUrl} alt="" className="size-10 shrink-0 rounded-full object-cover" />;
}

function ResultCard({ product, featured, query }: { product: SearchRecommendation; featured: boolean; query: string }) {
  return (
    <article className={`rounded-ds-lg bg-ds-surface shadow-ds-raised relative overflow-hidden border ${featured ? 'border-ds-brand border-2' : 'border-ds-border'}`}>
      <Link
        to={`${productDetailPath(product.productId)}?q=${encodeURIComponent(query)}`}
        aria-label={`${product.title} 실제 상품 상세 보기`}
        className="absolute inset-0 z-10 rounded-ds-lg"
      />
      <div className="flex gap-4 p-4 sm:gap-5">
        <div className="bg-ds-surface-hovered relative flex w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg sm:w-36">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt="" className="size-full min-h-36 object-contain p-3" />
          ) : (
            <Headphones className="text-ds-text-subtlest size-14" strokeWidth={1.2} aria-hidden />
          )}
          {featured ? (
            <span className="bg-ds-brand text-ds-text-inverse absolute top-2 left-2 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-bold">
              <Award className="size-3" aria-hidden /> AI 추천 1순위
            </span>
          ) : null}
        </div>
        <div className="min-w-0 flex-1 py-1">
          <div className="flex items-center justify-between gap-3">
            <span className={`rounded px-2 py-1 text-xs font-bold ${PLATFORM_STYLES[product.platform]}`}>
              {PLATFORM_LABELS[product.platform]}
            </span>
            {product.recommendationScore != null ? (
              <span className="text-ds-brand-text text-sm font-semibold">AI {Math.round(product.recommendationScore)}점</span>
            ) : null}
          </div>
          <h2 className="text-ds-h-sm font-ds-bold text-ds-text mt-3 truncate">{product.title}</h2>
          <p className="text-ds-h-md font-ds-bold text-ds-text mt-2">{formatPrice(product.price)}</p>
          <p className="text-ds-body text-ds-text-subtle mt-3 line-clamp-2 leading-6">{product.recommendationReason}</p>
          {product.carbonSaving.co2eKg != null ? (
            <span className="bg-ds-success-bg text-ds-success-text mt-3 inline-flex items-center gap-1 rounded px-2 py-1 text-sm font-semibold">
              <Leaf className="size-3.5" aria-hidden /> 탄소 약 {product.carbonSaving.co2eKg.toFixed(1)}kg 절감
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const rawKeyword = searchParams.get('q')?.trim() ?? '';
  const keyword = rawKeyword || '맥북 에어 M2';
  const [platform, setPlatform] = useState<PlatformFilter>('ALL');
  const [sort, setSort] = useState<ResultSort>('AI_RECOMMENDED');

  const searchQuery = useQuery({
    queryKey: ['search-sessions', 'create', keyword],
    queryFn: () => createSearchSession(keyword),
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });

  const products = useMemo(() => {
    const filtered = (searchQuery.data?.recommendations ?? []).filter(
      (product) => platform === 'ALL' || product.platform === platform
    );
    return [...filtered].sort((left, right) =>
      sort === 'PRICE_ASC'
        ? left.price - right.price
        : (right.recommendationScore ?? 0) - (left.recommendationScore ?? 0)
    );
  }, [platform, searchQuery.data?.recommendations, sort]);

  if (searchQuery.isPending) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-24 text-center">
        <Sparkles className="text-ds-brand mx-auto size-8 animate-pulse" aria-hidden />
        <p className="text-ds-h-sm font-ds-semibold text-ds-text mt-4">AI가 실제 매물을 찾고 있습니다.</p>
      </section>
    );
  }

  if (searchQuery.isError || !searchQuery.data) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-24 text-center">
        <p className="text-ds-h-sm font-ds-semibold text-ds-text">검색 결과를 불러오지 못했습니다.</p>
        <p className="text-ds-body text-ds-text-subtle mt-2">{getErrorMessage(searchQuery.error)}</p>
        <button type="button" onClick={() => void searchQuery.refetch()} className="bg-ds-neutral-bold text-ds-text-inverse mt-5 inline-flex items-center gap-2 rounded-full px-5 py-3">
          <RefreshCw className="size-4" aria-hidden /> 다시 시도
        </button>
      </section>
    );
  }

  const session = searchQuery.data;

  return (
    <section className="font-ds bg-ds-surface-sunken px-3 py-5 sm:px-5 lg:px-6">
      <div className="mx-auto grid max-w-[1440px] gap-4 lg:grid-cols-[minmax(330px,0.7fr)_minmax(0,1.5fr)]">
        <aside className="rounded-ds-lg border-ds-border bg-ds-surface shadow-ds-raised h-fit border p-5 lg:sticky lg:top-20">
          <div className="flex items-center gap-3">
            <AssistantAvatar />
            <div><h1 className="text-ds-h-sm font-ds-bold text-ds-text">AI 구매 어시스턴트 고르밍</h1><p className="text-ds-success-text text-sm">실제 백엔드 검색 완료</p></div>
          </div>
          <div className="bg-ds-neutral-bold text-ds-text-inverse rounded-ds-lg mt-6 px-4 py-3">{keyword}</div>
          <div className="bg-ds-surface-hovered rounded-ds-lg mt-4 px-4 py-4">
            <p className="font-ds-bold text-ds-text">요청을 이렇게 이해했어요</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="border-ds-border rounded border px-2 py-1 text-sm">{session.parsedConditions.keyword}</span>
              {session.parsedConditions.maxPrice != null ? <span className="border-ds-border rounded border px-2 py-1 text-sm">{formatPrice(session.parsedConditions.maxPrice)} 이하</span> : null}
              {session.parsedConditions.condition.map((condition) => <span key={condition} className="border-ds-border rounded border px-2 py-1 text-sm">{CONDITION_LABELS[condition]}</span>)}
              <span className="border-ds-border rounded border px-2 py-1 text-sm">{session.parsedConditions.priority}</span>
            </div>
          </div>
          <div className="bg-ds-success-bg text-ds-success-text rounded-ds-lg mt-4 px-4 py-4 leading-6">{session.assistantMessage}</div>
          <p className="text-ds-text-subtle mt-4 text-sm"><Store className="mr-1 inline size-4" aria-hidden /> {session.resultCount}개의 실제 검색 결과</p>
        </aside>

        <div className="min-w-0">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {PLATFORM_TABS.map((tab) => (
                <button key={tab.value} type="button" onClick={() => setPlatform(tab.value)} aria-pressed={platform === tab.value} className={`rounded border px-3 py-2 text-sm font-semibold ${platform === tab.value ? 'border-ds-brand bg-ds-brand-subtlest text-ds-brand-text' : 'border-ds-border bg-ds-surface text-ds-text-subtle'}`}>
                  {tab.label}
                </button>
              ))}
            </div>
            <Dropdown value={sort} options={SORT_OPTIONS} onChange={setSort} ariaLabel="정렬 기준" className="w-full sm:w-44" />
          </header>

          <div className="mt-5 space-y-4">
            {products.map((product, index) => <ResultCard key={product.productId} product={product} featured={index === 0 && platform === 'ALL' && sort === 'AI_RECOMMENDED'} query={keyword} />)}
          </div>
          {products.length === 0 ? <div className="border-ds-border bg-ds-surface rounded-ds-lg mt-5 border border-dashed px-6 py-16 text-center"><p className="font-ds-semibold text-ds-text">이 플랫폼의 검색 결과가 없습니다.</p></div> : null}
          <div className="text-ds-text-subtlest mt-6 flex flex-wrap justify-center gap-5 text-sm">
            <span className="inline-flex items-center gap-1"><ShieldCheck className="size-4" aria-hidden /> 실제 상품 ID 사용</span>
            <span className="inline-flex items-center gap-1"><ThumbsUp className="size-4" aria-hidden /> AI 추천 점수 반영</span>
          </div>
        </div>
      </div>
    </section>
  );
}
