import {
  ArrowLeft,
  ExternalLink,
  Eye,
  Heart,
  Headphones,
  MapPin,
  Package,
  ShieldCheck,
  Sparkles,
  Thermometer,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';

import type { Condition, Platform, SearchResultProduct } from '@/api/searches/search.schema';
import { ROUTES, productDetailPath } from '@/app/routes';
import { createMockProductDetail } from '@/features/products/product-detail.mock';
import { createMockSearchData } from '@/features/search/search.mock';

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

const PLATFORM_STYLES: Record<Platform, { badge: string; button: string }> = {
  DAANGN: { badge: 'bg-orange-50 text-orange-600', button: 'bg-orange-500 hover:bg-orange-600' },
  BUNGJANG: { badge: 'bg-yellow-50 text-yellow-600', button: 'bg-yellow-500 hover:bg-yellow-600' },
  JOONGGONARA: { badge: 'bg-red-50 text-red-500', button: 'bg-red-500 hover:bg-red-600' },
};

const PHOTO_PLACEHOLDERS = ['🎧', '📦', '🧾', '🧴'];

function formatPrice(price: number) {
  return `₩${price.toLocaleString('ko-KR')}`;
}

function PlatformBadge({ platform }: { platform: Platform }) {
  return (
    <span className={`rounded-md px-2.5 py-1.5 text-xs font-bold ${PLATFORM_STYLES[platform].badge}`}>
      {PLATFORM_LABELS[platform]}
    </span>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const label = rank === 1 ? '🥇 AI 추천 1순위' : rank === 2 ? '🥈 AI 추천 2순위' : '🥉 AI 추천 3순위';
  return (
    <span className="bg-brand inline-flex items-center rounded-full px-4 py-2.5 text-sm font-bold text-white">
      {label}
    </span>
  );
}

function RankedProductCard({ product, rank, query }: { product: SearchResultProduct; rank: number; query: string }) {
  return (
    <Link
      to={`${productDetailPath(product.productId)}?q=${encodeURIComponent(query)}`}
      className="group rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex size-9 items-center justify-center rounded-full text-sm font-bold ${rank === 1 ? 'bg-emerald-100 text-emerald-700' : rank === 2 ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'}`}
        >
          {rank}
        </span>
        <PlatformBadge platform={product.platform} />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div
          className={`flex size-20 shrink-0 items-center justify-center rounded-xl ${rank === 1 ? 'bg-emerald-50' : rank === 2 ? 'bg-sky-50' : 'bg-amber-50'}`}
        >
          <Headphones className="size-12 text-gray-400/80" strokeWidth={1.2} aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="group-hover:text-brand truncate text-sm font-bold text-gray-900">{product.title}</p>
          <p className="mt-1 text-xs text-gray-500">
            {CONDITION_LABELS[product.condition]} · 정가 대비 {product.savingsRate}% 절약
          </p>
          <p className="mt-2 text-lg font-bold tracking-tight text-gray-900">{formatPrice(product.price)}</p>
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

  if (!detail) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-20 text-center">
        <p className="text-lg font-semibold text-gray-900">상품을 찾을 수 없습니다.</p>
        <Link
          to={ROUTES.search}
          className="mt-5 inline-flex rounded-full bg-gray-900 px-5 py-3 text-sm font-medium text-white"
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
          className="inline-flex items-center gap-2 text-base font-semibold text-gray-500 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="size-5" aria-hidden />
          검색 결과로 돌아가기
        </Link>

        <div className="mt-6 grid items-start gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(360px,0.9fr)]">
          <div className="space-y-4">
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="relative flex min-h-[360px] items-center justify-center bg-gradient-to-br from-emerald-50 via-green-100 to-cyan-50 sm:min-h-[470px] lg:min-h-[530px]">
                <span className="absolute top-6 left-6">
                  <RankBadge rank={product.rank} />
                </span>
                <button
                  type="button"
                  aria-label={isFavorite ? '찜 취소' : '찜하기'}
                  aria-pressed={isFavorite}
                  onClick={() => setIsFavorite((favorite) => !favorite)}
                  className={`absolute top-6 right-6 flex size-14 items-center justify-center rounded-full border bg-white text-gray-400 shadow-sm transition-colors ${isFavorite ? 'border-rose-200 text-rose-500' : 'border-gray-200 hover:text-gray-700'}`}
                >
                  <Heart className="size-6" fill={isFavorite ? 'currentColor' : 'none'} aria-hidden />
                </button>
                <Headphones className="size-44 text-gray-400/80 sm:size-56" strokeWidth={1.1} aria-hidden />
              </div>
              <div className="flex gap-3 overflow-x-auto border-t border-gray-100 p-4">
                {PHOTO_PLACEHOLDERS.map((photo, index) => (
                  <button
                    key={photo}
                    type="button"
                    onClick={() => setActivePhoto(index)}
                    aria-label={`${index + 1}번 상품 이미지 보기`}
                    className={`flex size-20 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-3xl transition-all ${activePhoto === index ? 'ring-brand ring-2 ring-offset-2' : 'opacity-70 hover:opacity-100'}`}
                  >
                    {photo}
                  </button>
                ))}
              </div>
            </section>

            <section
              className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-6 sm:px-8"
              aria-labelledby="recommendation-reason"
            >
              <h2 id="recommendation-reason" className="flex items-center gap-2 text-lg font-bold text-emerald-800">
                <Sparkles className="size-5" aria-hidden />
                AI가 이 매물을 추천하는 이유
              </h2>
              <p className="mt-4 text-sm leading-7 text-emerald-900/80 sm:text-base">
                최저가는 아니지만{' '}
                <strong className="text-emerald-900">
                  판매자 신뢰도(거래 {detail.seller.tradeCount}회, 매너온도 {detail.seller.temperature}°C)
                </strong>
                가 높고, 구성품이 모두 포함된 {CONDITION_LABELS[product.condition]} 상태예요. 30만원 예산과 ‘최대한 좋은
                걸로’라는 조건을 함께 고려했을 때 가장 합리적인 선택이에요.
              </p>
            </section>

            <section
              className="rounded-2xl border border-gray-200 bg-white px-6 py-7 sm:px-8"
              aria-labelledby="description-heading"
            >
              <h2 id="description-heading" className="text-xl font-bold text-gray-900">
                상세 설명
              </h2>
              <p className="mt-5 text-sm leading-8 whitespace-pre-line text-gray-600 sm:text-base">
                {detail.description}
              </p>
              <dl className="mt-7 grid grid-cols-2 gap-y-5 border-t border-gray-100 pt-6 sm:grid-cols-4">
                <div>
                  <dt className="text-xs text-gray-400">카테고리</dt>
                  <dd className="mt-1 text-sm font-bold text-gray-900">{detail.category}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">상품 상태</dt>
                  <dd className="mt-1 text-sm font-bold text-gray-900">{CONDITION_LABELS[product.condition]}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">거래 방식</dt>
                  <dd className="mt-1 text-sm font-bold text-gray-900">직거래 · 택배</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-400">등록일</dt>
                  <dd className="mt-1 text-sm font-bold text-gray-900">{detail.publishedAt}</dd>
                </div>
              </dl>
            </section>

            <div className="flex items-start gap-3 rounded-2xl bg-slate-100 px-6 py-5 text-sm leading-6 text-gray-500">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-gray-400" aria-hidden />
              직거래는 안전한 공공장소에서 진행하고, 가능하면 판매자와 채팅 이력을 남겨두세요. 선입금을 요구하는 경우
              사기 위험이 있으니 주의해주세요.
            </div>
          </div>

          <aside className="lg:sticky lg:top-20">
            <section
              className="rounded-2xl border border-gray-200 bg-white px-6 py-7 shadow-sm"
              aria-label="상품 구매 정보"
            >
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <PlatformBadge platform={product.platform} />
                <span>{detail.publishedAt}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <Eye className="size-4" aria-hidden /> {detail.viewCount}
                </span>
              </div>
              <h1 className="mt-5 text-2xl leading-tight font-bold tracking-tight text-gray-900 sm:text-3xl">
                {product.title} 미개봉급
              </h1>
              <div className="mt-6 flex items-baseline gap-3">
                <p className="text-3xl font-bold tracking-tight text-gray-900">{formatPrice(product.price)}</p>
                <p className="text-base text-gray-400 line-through">{formatPrice(product.officialPrice)}</p>
              </div>
              <div className="mt-4 inline-flex rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-500">
                💰 새상품 대비 {formatPrice(product.savingsAmount)}({product.savingsRate}%) 절약
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-gray-200 px-3 py-2 text-sm text-gray-600">
                  {CONDITION_LABELS[product.condition]}
                </span>
                <span className="rounded-full border border-gray-200 px-3 py-2 text-sm text-gray-600">
                  <MapPin className="mr-1 inline size-3.5" aria-hidden />
                  판교 직거래
                </span>
                <span className="rounded-full border border-gray-200 px-3 py-2 text-sm text-gray-600">
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
                  className={`flex size-14 shrink-0 items-center justify-center rounded-xl border transition-colors ${isFavorite ? 'border-rose-200 bg-rose-50 text-rose-500' : 'border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-700'}`}
                >
                  <Heart className="size-6" fill={isFavorite ? 'currentColor' : 'none'} aria-hidden />
                </button>
                <a
                  href={detail.platformUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-4 py-4 text-base font-bold text-white transition-colors ${platformStyle.button}`}
                >
                  {PLATFORM_LABELS[product.platform]}으로 이동하기
                  <ExternalLink className="size-4" aria-hidden />
                </a>
              </div>
              <p className="mt-4 text-center text-xs text-gray-400">
                채팅과 결제는 {PLATFORM_LABELS[product.platform]}에서 진행돼요
              </p>
            </section>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-white px-5 py-4 text-sm text-gray-500">
              <Thermometer className="size-5 text-emerald-500" aria-hidden />
              판매자 매너온도 {detail.seller.temperature}°C · 거래 {detail.seller.tradeCount}회
            </div>
          </aside>
        </div>

        <section className="mt-12" aria-labelledby="ranked-heading">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-brand text-sm font-semibold">AI 추천 결과</p>
              <h2 id="ranked-heading" className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
                추천 순위
              </h2>
            </div>
            <p className="text-sm text-gray-400">같은 검색 조건으로 비교한 매물이에요.</p>
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
