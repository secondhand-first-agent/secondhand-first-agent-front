import { createMockSearchData, type MockSearchProduct } from '@/features/search/search.mock';

export interface MockProductDetail {
  product: MockSearchProduct;
  description: string;
  viewCount: number;
  publishedAt: string;
  category: string;
  includedItems: string[];
  platformUrl: string;
  seller: {
    tradeCount: number;
    temperature: number;
  };
}

export function createMockProductDetail(productId: string, query: string): MockProductDetail | null {
  const { results } = createMockSearchData(query);
  const product = results.content.find((item) => item.productId === productId) ?? results.content[0];
  if (!product) return null;

  const platformUrl = {
    NAVER_FLEAMARKET: 'https://fleamarket.naver.com/',
    BUNJANG: 'https://m.bunjang.co.kr/',
    JOONGNA: 'https://web.joongna.com/',
    ELEVENST: 'https://www.11st.co.kr/',
  }[product.platform];

  return {
    product,
    description:
      '작년 생일 선물로 받았는데 아이폰을 안드로이드로 바꾸면서 거의 사용하지 않았습니다. 케이스, 충전 케이블, 박스 모두 있습니다. 배터리 상태 좋고 기스 없이 깨끗하게 사용했어요. 직거래는 판교역 근처에서 가능하고, 택배 거래도 가능합니다. 흥정은 조금 가능해요 :)',
    viewCount: 128,
    publishedAt: product.rank === 1 ? '2시간 전' : `${product.rank + 2}시간 전`,
    category: '이어폰',
    includedItems: ['본체', '충전 케이스', '충전 케이블', '제품 박스'],
    platformUrl,
    seller: {
      tradeCount: product.sellerTrustScore === 92 ? 32 : 24,
      temperature: product.sellerTrustScore === 92 ? 92 : 88,
    },
  };
}
