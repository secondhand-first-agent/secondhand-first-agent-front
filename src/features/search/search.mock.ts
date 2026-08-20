import type { Condition, Platform, SearchPriority } from '@/api/searches/search.schema';

/*
 * 상품 상세 화면 전용 목 데이터.
 *
 * 검색 화면은 실 API 로 옮겨 갔지만 상세 화면은 아직 목을 쓴다. 아래 타입들은
 * 서버 계약이 아니라 이 목 데이터의 모양이므로 api/ 가 아니라 여기에 둔다.
 * 서버 `SearchResultItemResponse` 에는 officialPrice·savings·distanceKm·
 * sellerTrustScore 같은 필드가 없다.
 */
export interface MockOfficialProduct {
  name: string;
  officialStore: string;
  officialPrice: number;
  officialUrl: string;
}

export interface MockSearchProduct {
  productId: string;
  rank: number;
  platform: Platform;
  title: string;
  price: number;
  officialPrice: number;
  savingsAmount: number;
  savingsRate: number;
  distanceKm: number | null;
  condition: Condition;
  tradeType: string[];
  sellerTrustScore: number;
  recommendationScore: number;
  recommendationReason: string;
  imageUrl: string | null;
  changedSinceLastViewed: boolean;
}

export interface MockSearchResults {
  officialProduct: MockOfficialProduct;
  content: MockSearchProduct[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export interface MockSearchSession {
  sessionId: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  parsedConditions: {
    keyword: string;
    maxPrice: number | null;
    condition: Condition[];
    priority: SearchPriority;
  };
  assistantMessage: string;
  resultCount: number;
}

const officialProduct: MockOfficialProduct = {
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
  {
    platform: 'NAVER_FLEAMARKET',
    title: 'AirPods Pro 2 (USB-C)',
    price: 180_000,
    condition: 'LIKE_NEW',
    distanceKm: 2.1,
  },
  { platform: 'BUNJANG', title: 'AirPods Pro 2 (미개봉)', price: 165_000, condition: 'NEW', distanceKm: null },
  { platform: 'JOONGNA', title: '에어팟 프로2 판매합니다', price: 145_000, condition: 'USED', distanceKm: null },
  {
    platform: 'NAVER_FLEAMARKET',
    title: '에어팟프로2 근처 판매',
    price: 195_000,
    condition: 'LIKE_NEW',
    distanceKm: 3.8,
  },
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

export function createMockSearchData(query: string): { session: MockSearchSession; results: MockSearchResults } {
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
