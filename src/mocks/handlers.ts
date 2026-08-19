import { http, HttpResponse } from 'msw';

import type { ProductList } from '@/features/products/api/product.schema';

const products: ProductList = {
  items: [
    {
      id: '1',
      title: '아이폰 15 프로 256GB 자급제',
      price: 1_050_000,
      status: 'selling',
      thumbnailUrl: null,
      createdAt: '2026-08-18T09:00:00.000Z',
    },
    {
      id: '2',
      title: '허먼밀러 에어론 리마스터드',
      price: 890_000,
      status: 'reserved',
      thumbnailUrl: null,
      createdAt: '2026-08-17T12:30:00.000Z',
    },
    {
      id: '3',
      title: '캠핑 테이블 + 의자 2개 세트',
      price: 65_000,
      status: 'sold',
      thumbnailUrl: null,
      createdAt: '2026-08-16T03:10:00.000Z',
    },
  ],
  nextCursor: null,
};

export const handlers = [http.get('*/api/products', () => HttpResponse.json(products))];
