import type { OfficialProduct, Platform, SearchResults, SearchSession } from '@/api/searches/search.schema';

const officialProduct: OfficialProduct = {
  name: 'AirPods Pro 2 (USB-C)',
  officialStore: 'Apple 공식 스토어',
  officialPrice: 299_000,
  officialUrl: 'https://www.apple.com/kr/airpods-pro/',
};

const seeds: Array<{
  platform: Platform;
  title: string;
  price: number;
  condition: 'NEW' | 'LIKE_NEW' | 'LIGHTLY_USED' | 'USED';
  distanceKm: number | null;
}> = [
  { platform: 'NAVER_FLEAMARKET', title: 'AirPods Pro 2 (USB-C)', price: 180_000, condition: 'LIKE_NEW', distanceKm: 2.1 },
  { platform: 'BUNJANG', title: 'AirPods Pro 2 (미개봉)', price: 165_000, condition: 'NEW', distanceKm: null },
  { platform: 'JOONGNA', title: '에어팟 프로2 판매합니다', price: 145_000, condition: 'USED', distanceKm: null },
  { platform: 'NAVER_FLEAMARKET', title: '에어팟프로2 근처 판매', price: 195_000, condition: 'LIKE_NEW', distanceKm: 3.8 },
  { platform: 'BUNJANG', title: '에어팟 프로 2세대 정품', price: 210_000, condition: 'LIGHTLY_USED', distanceKm: null },
  { platform: 'JOONGNA', title: 'AirPods Pro 2 급처분', price: 155_000, condition: 'LIGHTLY_USED', distanceKm: null },
];

const products = seeds.map((seed, index) => {
  const savingsAmount = officialProduct.officialPrice - seed.price;

  return {
    productId: `mock_${index + 1}`,
    rank: index + 1,
    platform: seed.platform,
    title: seed.title,
    price: seed.price,
    officialPrice: officialProduct.officialPrice,
    savingsAmount,
    savingsRate: Math.round((savingsAmount / officialProduct.officialPrice) * 100),
    distanceKm: seed.distanceKm,
    condition: seed.condition,
    tradeType: seed.platform === 'NAVER_FLEAMARKET' ? ['DIRECT'] : ['DELIVERY'],
    sellerTrustScore: 92 - index * 2,
    recommendationScore: 94 - index * 3,
    recommendationReason:
      index === 0
        ? '판매자 신뢰도와 상품 상태가 좋아 가장 합리적입니다.'
        : '가격과 상품 상태를 함께 고려하면 좋은 선택지입니다.',
    imageUrl: null,
    changedSinceLastViewed: false,
  };
});

export function createMockSearchData(query: string): { session: SearchSession; results: SearchResults } {
  return {
    session: {
      sessionId: 'mock_session_01',
      status: 'COMPLETED',
      parsedConditions: {
        keyword: query.includes('맥북') ? '맥북' : '에어팟',
        maxPrice: 300_000,
        condition: ['LIKE_NEW', 'LIGHTLY_USED'],
        priority: 'BEST_VALUE',
      },
      assistantMessage: '당근·번개장터·중고나라에서 12개 매물을 찾았어요.',
      resultCount: 12,
    },
    results: {
      officialProduct,
      content: products,
      page: 0,
      size: 10,
      totalElements: 12,
      totalPages: 2,
      hasNext: true,
    },
  };
}
