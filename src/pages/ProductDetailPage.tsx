import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ExternalLink, Eye, Headphones, MapPin, Medal, Package, PiggyBank, RefreshCw, ShieldCheck, Sparkles, Thermometer } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';

import { recordPlatformRedirect, recordProductView } from '@/api/activities/activity.api';
import type { ProductCategory } from '@/api/products/product.schema';
import { getErrorMessage } from '@/api/response';
import type { Condition, Platform } from '@/api/searches/search.schema';
import { ROUTES } from '@/app/routes';
import { queryFactory } from '@/queryFactory';
import { userQueryKeys } from '@/queryFactory/userQueries';

const CONDITION_LABELS: Record<Condition, string> = {
  NEW: '미개봉', LIKE_NEW: '거의 새것', LIGHTLY_USED: '사용감 적음', USED: '사용감 있음',
  UNSPECIFIED: '상태 미기재', UNKNOWN: '상태 확인 필요',
};

const PLATFORM_LABELS: Record<Platform, string> = {
  BUNJANG: '번개장터', JOONGNA: '중고나라', NAVER_FLEAMARKET: 'N플리마켓', ELEVENST: '11번가',
};

const PLATFORM_STYLES: Record<Platform, { badge: string; button: string }> = {
  NAVER_FLEAMARKET: { badge: 'bg-ds-accent-orange-bg text-ds-accent-orange-text', button: 'bg-ds-brand hover:bg-ds-brand-hovered' },
  BUNJANG: { badge: 'bg-ds-accent-yellow-bg text-ds-accent-yellow-text', button: 'bg-ds-brand hover:bg-ds-brand-hovered' },
  JOONGNA: { badge: 'bg-ds-accent-red-bg text-ds-accent-red-text', button: 'bg-ds-brand hover:bg-ds-brand-hovered' },
  ELEVENST: { badge: 'bg-ds-accent-purple-bg text-ds-accent-purple-text', button: 'bg-ds-brand hover:bg-ds-brand-hovered' },
};

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  EARPHONES: '이어폰', LAPTOP: '노트북', SMARTPHONE: '스마트폰', SMARTWATCH: '스마트워치',
  TABLET: '태블릿', MONITOR: '모니터', GAME_CONSOLE: '게임기', CLOTHING: '의류',
  BAG_SHOES: '가방·신발', FURNITURE: '가구', SPORTS_TOYS: '스포츠·완구', BOOKS: '도서',
  WATCH_JEWELRY: '시계·주얼리', OTHER: '기타',
};

function formatPrice(price: number) {
  return `₩${price.toLocaleString('ko-KR')}`;
}

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function PlatformBadge({ platform }: { platform: Platform }) {
  return (
    <span className={`rounded-ds-sm text-ds-body-sm font-ds-bold px-2.5 py-1.5 ${PLATFORM_STYLES[platform].badge}`}>
      {PLATFORM_LABELS[platform]}
    </span>
  );
}

export function ProductDetailPage() {
  const queryClient = useQueryClient();
  const recordedProductIdRef = useRef<string | null>(null);
  const { productId = '' } = useParams<{ productId: string }>();
  const [searchParams] = useSearchParams();
  const { data: detail, isPending, isError, error, refetch } = useQuery({
    ...queryFactory.products.detail(productId),
    enabled: productId.length > 0,
  });
  const [activePhoto, setActivePhoto] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectError, setRedirectError] = useState<string | null>(null);

  useEffect(() => setActivePhoto(0), [detail?.id]);

  useEffect(() => {
    if (!detail || recordedProductIdRef.current === detail.id) return;
    recordedProductIdRef.current = detail.id;
    void recordProductView(detail.id)
      .then(() => queryClient.invalidateQueries({ queryKey: userQueryKeys.dashboard() }))
      .catch(() => undefined);
  }, [detail, queryClient]);

  if (isPending) {
    return <section className="mx-auto max-w-5xl px-4 py-20 text-center"><p className="text-ds-h-sm font-ds-semibold text-ds-text">상품 정보를 불러오는 중입니다.</p></section>;
  }

  if (isError || !detail) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-20 text-center">
        <p className="text-ds-h-sm font-ds-semibold text-ds-text">상품을 불러오지 못했습니다.</p>
        <p className="text-ds-body text-ds-text-subtle mt-2">{getErrorMessage(error)}</p>
        <button type="button" onClick={() => void refetch()} className="bg-ds-neutral-bold text-ds-body font-ds-medium text-ds-text-inverse mt-5 inline-flex items-center gap-2 rounded-full px-5 py-3">
          <RefreshCw className="size-4" aria-hidden /> 다시 시도
        </button>
      </section>
    );
  }

  const backTo = searchParams.get('q') ? `${ROUTES.search}?q=${encodeURIComponent(searchParams.get('q') ?? '')}` : ROUTES.bestDeal;
  const activeImage = detail.images[activePhoto] ?? null;
  const tradeTypeLabel = [detail.tradeTypes.includes('DIRECT') ? '직거래' : null, detail.tradeTypes.includes('DELIVERY') ? '택배' : null].filter(Boolean).join(' · ');

  const handlePlatformRedirect = async () => {
    if (isRedirecting) return;
    setIsRedirecting(true);
    setRedirectError(null);
    const externalWindow = window.open('about:blank', '_blank');
    if (externalWindow) externalWindow.opener = null;
    try {
      const response = await recordPlatformRedirect(detail.id);
      if (externalWindow) externalWindow.location.href = response.redirectUrl;
      else window.location.href = response.redirectUrl;
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.dashboard() });
    } catch (redirectRequestError) {
      externalWindow?.close();
      setRedirectError(getErrorMessage(redirectRequestError));
    } finally {
      setIsRedirecting(false);
    }
  };

  return (
    <section className="bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <Link to={backTo} className="text-ds-body-lg font-ds-semibold text-ds-text-subtle hover:text-ds-text inline-flex items-center gap-2 transition-colors">
          <ArrowLeft className="size-5" aria-hidden /> 이전 화면으로 돌아가기
        </Link>
        <div className="mt-6 grid items-start gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(360px,0.9fr)]">
          <div className="space-y-4">
            <section className="rounded-ds-lg border-ds-border bg-ds-surface shadow-ds-raised overflow-hidden border">
              <div className="bg-ds-surface-hovered relative flex min-h-[360px] items-center justify-center sm:min-h-[470px] lg:min-h-[530px]">
                {detail.rank ? <span className="bg-ds-brand text-ds-text-inverse rounded-ds-xs text-ds-body-sm font-ds-bold absolute top-6 left-6 inline-flex items-center gap-1 px-1.5 py-0.5"><Medal className="size-3" aria-hidden /> AI 추천 {detail.rank}순위</span> : null}
                {activeImage ? <img src={activeImage} alt={detail.title} className="size-full max-h-[530px] object-contain p-6" /> : <Headphones className="text-ds-text-subtlest size-44 sm:size-56" strokeWidth={1.1} aria-hidden />}
              </div>
              {detail.images.length > 1 ? (
                <div className="border-ds-border flex gap-3 overflow-x-auto border-t p-4">
                  {detail.images.map((image, index) => (
                    <button key={image} type="button" onClick={() => setActivePhoto(index)} aria-label={`${index + 1}번 상품 이미지 보기`} className={`rounded-ds-md bg-ds-surface-hovered flex size-20 shrink-0 overflow-hidden transition-all ${activePhoto === index ? 'ring-ds-brand ring-2 ring-offset-2' : 'opacity-70 hover:opacity-100'}`}>
                      <img src={image} alt="" className="size-full object-cover" />
                    </button>
                  ))}
                </div>
              ) : null}
            </section>

            {detail.recommendationReason ? (
              <section className="rounded-ds-lg border-ds-success-border bg-ds-success-bg border px-6 py-6 sm:px-8">
                <h2 className="text-ds-h-sm font-ds-bold text-ds-success-text flex items-center gap-2"><Sparkles className="size-5" aria-hidden /> AI가 이 매물을 추천하는 이유</h2>
                <p className="text-ds-body sm:text-ds-body-lg text-ds-success-text mt-4 leading-7">{detail.recommendationReason}</p>
              </section>
            ) : null}

            <section className="rounded-ds-lg border-ds-border bg-ds-surface border px-6 py-7 sm:px-8">
              <h2 className="text-ds-h-md font-ds-bold text-ds-text">상세 설명</h2>
              <p className="text-ds-body text-ds-text-subtle sm:text-ds-body-lg mt-5 leading-8 whitespace-pre-line">{detail.description || '판매자가 등록한 상세 설명이 없습니다.'}</p>
              <dl className="border-ds-border mt-7 grid grid-cols-2 gap-y-5 border-t pt-6 sm:grid-cols-4">
                <div><dt className="text-ds-body-sm text-ds-text-subtlest">카테고리</dt><dd className="text-ds-body font-ds-bold text-ds-text mt-1">{CATEGORY_LABELS[detail.category]}</dd></div>
                <div><dt className="text-ds-body-sm text-ds-text-subtlest">상품 상태</dt><dd className="text-ds-body font-ds-bold text-ds-text mt-1">{CONDITION_LABELS[detail.condition]}</dd></div>
                <div><dt className="text-ds-body-sm text-ds-text-subtlest">거래 방식</dt><dd className="text-ds-body font-ds-bold text-ds-text mt-1">{tradeTypeLabel || '정보 없음'}</dd></div>
                <div><dt className="text-ds-body-sm text-ds-text-subtlest">갱신일</dt><dd className="text-ds-body font-ds-bold text-ds-text mt-1">{formatUpdatedAt(detail.updatedAt)}</dd></div>
              </dl>
            </section>
            <div className="rounded-ds-lg bg-ds-surface-hovered text-ds-body text-ds-text-subtle flex items-start gap-3 px-6 py-5 leading-6"><ShieldCheck className="text-ds-text-subtlest mt-0.5 size-5 shrink-0" aria-hidden />직거래는 안전한 공공장소에서 진행하고, 선입금을 요구하는 경우 사기 위험에 주의해주세요.</div>
          </div>

          <aside className="lg:sticky lg:top-20">
            <section className="rounded-ds-lg border-ds-border bg-ds-surface shadow-ds-raised border px-6 py-7" aria-label="상품 구매 정보">
              <div className="text-ds-body text-ds-text-subtlest flex items-center gap-2"><PlatformBadge platform={detail.platform} /><span className="inline-flex items-center gap-1"><Eye className="size-4" aria-hidden /> {detail.viewCount ?? 0}</span></div>
              <h1 className="text-ds-h-lg font-ds-bold text-ds-text sm:text-ds-h-xl mt-5 leading-tight">{detail.title}</h1>
              <div className="mt-6 flex items-baseline gap-3"><p className="text-ds-h-xl font-ds-bold text-ds-text">{formatPrice(detail.price)}</p>{detail.officialPrice > detail.price ? <p className="text-ds-body-lg text-ds-text-subtlest line-through">{formatPrice(detail.officialPrice)}</p> : null}</div>
              {detail.savingsAmount > 0 ? <div className="bg-ds-success-bg text-ds-success-text rounded-ds-sm text-ds-body font-ds-semibold mt-4 inline-flex items-center gap-1.5 px-2 py-1"><PiggyBank className="size-4" aria-hidden /> 새상품 대비 {formatPrice(detail.savingsAmount)}({detail.savingsRate}%) 절약</div> : null}
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="border-ds-border text-ds-body text-ds-text-subtle rounded-full border px-3 py-2">{CONDITION_LABELS[detail.condition]}</span>
                <span className="border-ds-border text-ds-body text-ds-text-subtle rounded-full border px-3 py-2"><MapPin className="mr-1 inline size-3.5" aria-hidden />{detail.location || '위치 정보 없음'}</span>
                {tradeTypeLabel ? <span className="border-ds-border text-ds-body text-ds-text-subtle rounded-full border px-3 py-2"><Package className="mr-1 inline size-3.5" aria-hidden />{tradeTypeLabel}</span> : null}
              </div>
              <button type="button" onClick={() => void handlePlatformRedirect()} disabled={isRedirecting} className={`rounded-ds-lg text-ds-body-lg font-ds-bold text-ds-text-inverse mt-7 flex w-full items-center justify-center gap-2 px-4 py-4 transition-colors ${PLATFORM_STYLES[detail.platform].button}`}>
                {isRedirecting ? '이동 준비 중…' : `${PLATFORM_LABELS[detail.platform]}으로 이동하기`} <ExternalLink className="size-4" aria-hidden />
              </button>
              {redirectError ? <p className="text-ds-body-sm text-ds-danger-text mt-3 text-center" role="alert">{redirectError}</p> : null}
              <p className="text-ds-body-sm text-ds-text-subtlest mt-4 text-center">채팅과 결제는 {PLATFORM_LABELS[detail.platform]}에서 진행돼요</p>
            </section>
            <div className="rounded-ds-lg bg-ds-surface text-ds-body text-ds-text-subtle mt-4 flex items-center gap-2 px-5 py-4"><Thermometer className="text-ds-success-border size-5" aria-hidden />판매자 매너온도 {detail.seller.temperature}°C · 거래 {detail.seller.tradeCount}회</div>
          </aside>
        </div>
      </div>
    </section>
  );
}
