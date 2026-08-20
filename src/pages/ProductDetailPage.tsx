import {
  ArrowLeft,
  ExternalLink,
  Eye,
  Heart,
  Headphones,
  MapPin,
  Medal,
  Package,
  PiggyBank,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Thermometer,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';

import type { Condition, Platform, SearchResultProduct } from '@/api/searches/search.schema';
import { ROUTES, productDetailPath } from '@/app/routes';
import { createMockProductDetail } from '@/features/products/product-detail.mock';
import { recordCarbonProductView } from '@/features/rewards/carbonQuest';
import { createMockSearchData } from '@/features/search/search.mock';

const CONDITION_LABELS: Record<Condition, string> = {
  NEW: '미개봉',
  LIKE_NEW: '거의 새것',
  LIGHTLY_USED: '사용감 적음',
  USED: '사용감 있음',
  UNSPECIFIED: '상태 미기재',
  UNKNOWN: '상태 확인 필요',
};

const PLATFORM_LABELS: Record<Platform, string> = {
  BUNJANG: '번개장터',
  JOONGNA: '중고나라',
  NAVER_FLEAMARKET: 'N플리마켓',
  ELEVENST: '11번가',
};

const PLATFORM_STYLES: Record<Platform, { badge: string; button: string }> = {
  NAVER_FLEAMARKET: {
    badge: 'bg-ds-accent-orange-bg text-ds-accent-orange-text',
    button: 'bg-ds-brand hover:bg-ds-brand-hovered',
  },
  BUNJANG: {
    badge: 'bg-ds-accent-yellow-bg text-ds-accent-yellow-text',
    button: 'bg-ds-brand hover:bg-ds-brand-hovered',
  },
  JOONGNA: {
    badge: 'bg-ds-accent-red-bg text-ds-accent-red-text',
    button: 'bg-ds-brand hover:bg-ds-brand-hovered',
  },
  // 새상품 채널이라 중고 셋과 색 계열을 구분한다.
  ELEVENST: {
    badge: 'bg-ds-accent-purple-bg text-ds-accent-purple-text',
    button: 'bg-ds-brand hover:bg-ds-brand-hovered',
  },
};

/** 실제 사진이 없는 목업이라, 각도별 자리표시용 아이콘을 쓴다. */
const PHOTO_PLACEHOLDERS: LucideIcon[] = [Headphones, Package, ReceiptText, Sparkles];

function formatPrice(price: number) {
  return `₩${price.toLocaleString('ko-KR')}`;
}

function PlatformBadge({ platform }: { platform: Platform }) {
  return (
    <span className={`rounded-ds-sm text-ds-body-sm font-ds-bold px-2.5 py-1.5 ${PLATFORM_STYLES[platform].badge}`}>
      {PLATFORM_LABELS[platform]}
    </span>
  );
}

function RankBadge({ rank }: { rank: number }) {
  return (
    <span className="bg-ds-brand text-ds-text-inverse rounded-ds-xs text-ds-body-sm font-ds-bold inline-flex items-center gap-1 px-1.5 py-0.5">
      <Medal className="size-3 shrink-0" aria-hidden />
      AI 추천 {rank}순위
    </span>
  );
}

function RankedProductCard({ product, rank, query }: { product: SearchResultProduct; rank: number; query: string }) {
  return (
    <Link
      to={`${productDetailPath(product.productId)}?q=${encodeURIComponent(query)}`}
      className="group rounded-ds-lg border-ds-border bg-ds-surface hover:border-ds-border hover:shadow-ds-raised border p-4 transition-all hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-ds-body font-ds-bold inline-flex size-9 items-center justify-center rounded-full ${rank === 1 ? 'text-ds-success-text bg-ds-success-bg' : rank === 2 ? 'text-ds-info-text bg-ds-info-bg' : 'text-ds-warning-text bg-ds-warning-bg'}`}
        >
          {rank}
        </span>
        <PlatformBadge platform={product.platform} />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div
          className={`rounded-ds-lg flex size-20 shrink-0 items-center justify-center ${rank === 1 ? 'bg-ds-success-bg' : rank === 2 ? 'bg-ds-info-bg' : 'bg-ds-warning-bg'}`}
        >
          <Headphones className="text-ds-text-subtlest size-12" strokeWidth={1.2} aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="group-hover:text-ds-brand text-ds-body font-ds-bold text-ds-text truncate">{product.title}</p>
          <p className="text-ds-body-sm text-ds-text-subtle mt-1">
            {CONDITION_LABELS[product.condition]} · 정가 대비 {product.savingsRate}% 절약
          </p>
          <p className="text-ds-h-sm font-ds-bold text-ds-text mt-2">{formatPrice(product.price)}</p>
        </div>
      </div>
    </Link>
  );
}

export function ProductDetailPage() {
  const { productId = 'mock_1' } = useParams<{ productId: string }>();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '30만원으로 에어팟 사고 싶어, 중고 괜찮아';
  const detail = useMemo(() => createMockProductDetail(productId, query), [productId, query]);
  const rankedProducts = useMemo(() => createMockSearchData(query).results.content.slice(0, 3), [query]);
  const [isFavorite, setIsFavorite] = useState(detail?.product.isFavorite ?? false);
  const [activePhoto, setActivePhoto] = useState(0);

  /*
   * 탄소 절감 미션 진행도를 쌓는다. 지금은 모든 상품에 탄소 절감 태그가 붙으므로
   * 상세를 연 것만으로 조건을 만족한다. 태그가 붙는 조건이 생기면 여기서 가려내면 된다.
   */
  useEffect(() => {
    if (!detail) return;
    recordCarbonProductView(productId);
  }, [detail, productId]);

  if (!detail) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-20 text-center">
        <p className="text-ds-h-sm font-ds-semibold text-ds-text">상품을 찾을 수 없습니다.</p>
        <Link
          to={ROUTES.search}
          className="bg-ds-neutral-bold text-ds-body font-ds-medium text-ds-text-inverse mt-5 inline-flex rounded-full px-5 py-3"
        >
          검색 결과로 돌아가기
        </Link>
      </section>
    );
  }

  const { product } = detail;
  const backTo = searchParams.get('q')
    ? `${ROUTES.search}?q=${encodeURIComponent(searchParams.get('q') ?? '')}`
    : ROUTES.search;
  const platformStyle = PLATFORM_STYLES[product.platform];

  return (
    <section className="bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <Link
          to={backTo}
          className="text-ds-body-lg font-ds-semibold text-ds-text-subtle hover:text-ds-text inline-flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="size-5" aria-hidden />
          검색 결과로 돌아가기
        </Link>

        <div className="mt-6 grid items-start gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(360px,0.9fr)]">
          <div className="space-y-4">
            <section className="rounded-ds-lg border-ds-border bg-ds-surface shadow-ds-raised overflow-hidden border">
              <div className="bg-ds-surface-hovered relative flex min-h-[360px] items-center justify-center sm:min-h-[470px] lg:min-h-[530px]">
                <span className="absolute top-6 left-6">
                  <RankBadge rank={product.rank} />
                </span>
                <button
                  type="button"
                  aria-label={isFavorite ? '찜 취소' : '찜하기'}
                  aria-pressed={isFavorite}
                  onClick={() => setIsFavorite((favorite) => !favorite)}
                  className={`bg-ds-surface text-ds-text-subtlest shadow-ds-raised absolute top-6 right-6 flex size-14 items-center justify-center rounded-full border transition-colors ${isFavorite ? 'border-ds-danger-border text-ds-danger-text' : 'border-ds-border hover:text-ds-text-subtle'}`}
                >
                  <Heart className="size-6" fill={isFavorite ? 'currentColor' : 'none'} aria-hidden />
                </button>
                <Headphones className="text-ds-text-subtlest size-44 sm:size-56" strokeWidth={1.1} aria-hidden />
              </div>
              <div className="border-ds-border flex gap-3 overflow-x-auto border-t p-4">
                {PHOTO_PLACEHOLDERS.map((PhotoIcon, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActivePhoto(index)}
                    aria-label={`${index + 1}번 상품 이미지 보기`}
                    className={`rounded-ds-md bg-ds-surface-hovered text-ds-text-subtlest flex size-20 shrink-0 items-center justify-center transition-all ${activePhoto === index ? 'ring-ds-brand ring-2 ring-offset-2' : 'opacity-70 hover:opacity-100'}`}
                  >
                    <PhotoIcon className="size-8" strokeWidth={1.4} aria-hidden />
                  </button>
                ))}
              </div>
            </section>

            <section
              className="rounded-ds-lg border-ds-success-border bg-ds-success-bg border px-6 py-6 sm:px-8"
              aria-labelledby="recommendation-reason"
            >
              <h2
                id="recommendation-reason"
                className="text-ds-h-sm font-ds-bold text-ds-success-text flex items-center gap-2"
              >
                <Sparkles className="size-5" aria-hidden />
                AI가 이 매물을 추천하는 이유
              </h2>
              <p className="text-ds-body sm:text-ds-body-lg text-ds-success-text mt-4 leading-7">
                최저가는 아니지만{' '}
                <strong className="text-ds-success-text">
                  판매자 신뢰도(거래 {detail.seller.tradeCount}회, 매너온도 {detail.seller.temperature}°C)
                </strong>
                가 높고, 구성품이 모두 포함된 {CONDITION_LABELS[product.condition]} 상태예요. 30만원 예산과 ‘최대한 좋은
                걸로’라는 조건을 함께 고려했을 때 가장 합리적인 선택이에요.
              </p>
            </section>

            <section
              className="rounded-ds-lg border-ds-border bg-ds-surface border px-6 py-7 sm:px-8"
              aria-labelledby="description-heading"
            >
              <h2 id="description-heading" className="text-ds-h-md font-ds-bold text-ds-text">
                상세 설명
              </h2>
              <p className="text-ds-body text-ds-text-subtle sm:text-ds-body-lg mt-5 leading-8 whitespace-pre-line">
                {detail.description}
              </p>
              <dl className="border-ds-border mt-7 grid grid-cols-2 gap-y-5 border-t pt-6 sm:grid-cols-4">
                <div>
                  <dt className="text-ds-body-sm text-ds-text-subtlest">카테고리</dt>
                  <dd className="text-ds-body font-ds-bold text-ds-text mt-1">{detail.category}</dd>
                </div>
                <div>
                  <dt className="text-ds-body-sm text-ds-text-subtlest">상품 상태</dt>
                  <dd className="text-ds-body font-ds-bold text-ds-text mt-1">{CONDITION_LABELS[product.condition]}</dd>
                </div>
                <div>
                  <dt className="text-ds-body-sm text-ds-text-subtlest">거래 방식</dt>
                  <dd className="text-ds-body font-ds-bold text-ds-text mt-1">직거래 · 택배</dd>
                </div>
                <div>
                  <dt className="text-ds-body-sm text-ds-text-subtlest">등록일</dt>
                  <dd className="text-ds-body font-ds-bold text-ds-text mt-1">{detail.publishedAt}</dd>
                </div>
              </dl>
            </section>

            <div className="rounded-ds-lg bg-ds-surface-hovered text-ds-body text-ds-text-subtle flex items-start gap-3 px-6 py-5 leading-6">
              <ShieldCheck className="text-ds-text-subtlest mt-0.5 size-5 shrink-0" aria-hidden />
              직거래는 안전한 공공장소에서 진행하고, 가능하면 판매자와 채팅 이력을 남겨두세요. 선입금을 요구하는 경우
              사기 위험이 있으니 주의해주세요.
            </div>
          </div>

          <aside className="lg:sticky lg:top-20">
            <section
              className="rounded-ds-lg border-ds-border bg-ds-surface shadow-ds-raised border px-6 py-7"
              aria-label="상품 구매 정보"
            >
              <div className="text-ds-body text-ds-text-subtlest flex items-center gap-2">
                <PlatformBadge platform={product.platform} />
                <span>{detail.publishedAt}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <Eye className="size-4" aria-hidden /> {detail.viewCount}
                </span>
              </div>
              <h1 className="text-ds-h-lg font-ds-bold text-ds-text sm:text-ds-h-xl mt-5 leading-tight">
                {product.title} 미개봉급
              </h1>
              <div className="mt-6 flex items-baseline gap-3">
                <p className="text-ds-h-xl font-ds-bold text-ds-text">{formatPrice(product.price)}</p>
                <p className="text-ds-body-lg text-ds-text-subtlest line-through">
                  {formatPrice(product.officialPrice)}
                </p>
              </div>
              <div className="bg-ds-success-bg text-ds-success-text rounded-ds-sm text-ds-body font-ds-semibold mt-4 inline-flex items-center gap-1.5 px-2 py-1">
                <PiggyBank className="size-4 shrink-0" aria-hidden />
                새상품 대비 {formatPrice(product.savingsAmount)}({product.savingsRate}%) 절약
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="border-ds-border text-ds-body text-ds-text-subtle rounded-full border px-3 py-2">
                  {CONDITION_LABELS[product.condition]}
                </span>
                <span className="border-ds-border text-ds-body text-ds-text-subtle rounded-full border px-3 py-2">
                  <MapPin className="mr-1 inline size-3.5" aria-hidden />
                  판교 직거래
                </span>
                <span className="border-ds-border text-ds-body text-ds-text-subtle rounded-full border px-3 py-2">
                  <Package className="mr-1 inline size-3.5" aria-hidden />
                  구성품 포함
                </span>
              </div>
              <div className="mt-7 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsFavorite((favorite) => !favorite)}
                  aria-label={isFavorite ? '찜 취소' : '찜하기'}
                  aria-pressed={isFavorite}
                  className={`rounded-ds-lg flex size-14 shrink-0 items-center justify-center border transition-colors ${isFavorite ? 'border-ds-danger-border bg-ds-danger-bg text-ds-danger-text' : 'border-ds-border text-ds-text-subtlest hover:border-ds-border-bold hover:text-ds-text-subtle'}`}
                >
                  <Heart className="size-6" fill={isFavorite ? 'currentColor' : 'none'} aria-hidden />
                </button>
                <a
                  href={detail.platformUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`rounded-ds-lg text-ds-body-lg font-ds-bold text-ds-text-inverse flex min-w-0 flex-1 items-center justify-center gap-2 px-4 py-4 transition-colors ${platformStyle.button}`}
                >
                  {PLATFORM_LABELS[product.platform]}으로 이동하기
                  <ExternalLink className="size-4" aria-hidden />
                </a>
              </div>
              <p className="text-ds-body-sm text-ds-text-subtlest mt-4 text-center">
                채팅과 결제는 {PLATFORM_LABELS[product.platform]}에서 진행돼요
              </p>
            </section>
            <div className="rounded-ds-lg bg-ds-surface text-ds-body text-ds-text-subtle mt-4 flex items-center gap-2 px-5 py-4">
              <Thermometer className="text-ds-success-border size-5" aria-hidden />
              판매자 매너온도 {detail.seller.temperature}°C · 거래 {detail.seller.tradeCount}회
            </div>
          </aside>
        </div>

        <section className="mt-12" aria-labelledby="ranked-heading">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-ds-brand text-ds-body font-ds-semibold">AI 추천 결과</p>
              <h2 id="ranked-heading" className="text-ds-h-lg font-ds-bold text-ds-text mt-2">
                추천 순위
              </h2>
            </div>
            <p className="text-ds-body text-ds-text-subtlest">같은 검색 조건으로 비교한 매물이에요.</p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {rankedProducts.map((rankedProduct, index) => (
              <RankedProductCard key={rankedProduct.productId} product={rankedProduct} rank={index + 1} query={query} />
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
