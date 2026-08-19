import { http, HttpResponse } from 'msw';

import type { ProductList } from '@/api/products/product.schema';

/** 서버 응답 봉투 */
const envelope = <T>(data: T) => ({ data });

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

/** 실제 API 가 붙기 전까지 쓰는 임시 계정 */
const registered = new Map<string, string>([['test@example.com', 'test1234']]);

/** /users/me 가 누구를 돌려줄지 알기 위해 마지막 로그인 계정을 기억합니다. */
let currentEmail: string | null = null;

export const handlers = [
  http.get('*/products', () => HttpResponse.json(envelope(products))),

  http.post('*/users/signup', async ({ request }) => {
    const { email, password } = (await request.json()) as { email: string; password: string };
    if (registered.has(email)) {
      return HttpResponse.json({ message: '이미 가입된 이메일입니다' }, { status: 409 });
    }
    registered.set(email, password);
    return HttpResponse.json(envelope({ id: crypto.randomUUID(), email }), { status: 201 });
  }),

  http.post('*/users/login', async ({ request }) => {
    const { email, password } = (await request.json()) as { email: string; password: string };
    if (registered.get(email) !== password) {
      return HttpResponse.json({ message: '이메일 또는 비밀번호가 올바르지 않습니다' }, { status: 401 });
    }
    currentEmail = email;
    return HttpResponse.json(envelope({ accessToken: 'mock-access-token', tokenType: 'Bearer', userId: 'u1' }));
  }),

  http.get('*/users/me', () => {
    if (!currentEmail) {
      return HttpResponse.json({ message: '로그인이 필요합니다' }, { status: 401 });
    }
    return HttpResponse.json(
      envelope({ id: 'u1', email: currentEmail, nickname: currentEmail.split('@')[0], profileImageUrl: null })
    );
  }),

  http.post('*/users/token/refresh', () => HttpResponse.json(envelope({ accessToken: 'mock-refreshed-token' }))),
];
