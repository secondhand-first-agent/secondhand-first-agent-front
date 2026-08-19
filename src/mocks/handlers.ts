import { http, HttpResponse } from 'msw';

import type { RedirectHistory } from '@/api/activities/activity.schema';
import type { BestDealList } from '@/api/products/best-deal.schema';
import type { ProductList } from '@/api/products/product.schema';

const envelope = <T>(data: T) => ({ message: 'ok', data });

const unauthorized = () => HttpResponse.json({ message: '인증이 필요합니다.', data: null }, { status: 401 });

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

const bestDeals: BestDealList = {
  totalElements: 11,
  items: [
    {
      productId: 'mock_1',
      rank: 1,
      category: 'EARPHONES',
      platform: 'DAANGN',
      title: 'AirPods Pro 2 (USB-C)',
      price: 180_000,
      officialPrice: 299_000,
      savingsAmount: 119_000,
      savingsRate: 40,
      condition: 'LIKE_NEW',
      location: '판교 직거래',
      recommendationReason: '판매자 신뢰도와 상품 상태를 함께 고려하면 가장 합리적이에요.',
      recommendationScore: 96,
      imageUrl: null,
      isFavorite: false,
    },
    {
      productId: 'mock_2',
      rank: 2,
      category: 'LAPTOP',
      platform: 'JOONGGONARA',
      title: '맥북 에어 M2',
      price: 980_000,
      officialPrice: 1_300_000,
      savingsAmount: 320_000,
      savingsRate: 25,
      condition: 'GOOD',
      location: '강남 직거래',
      recommendationReason: '배터리 사이클이 낮고 박스·구성품이 모두 포함되어 있어요.',
      recommendationScore: 92,
      imageUrl: null,
      isFavorite: false,
    },
    {
      productId: 'mock_3',
      rank: 3,
      category: 'SMARTWATCH',
      platform: 'BUNGJANG',
      title: '애플워치 SE',
      price: 150_000,
      officialPrice: 245_000,
      savingsAmount: 95_000,
      savingsRate: 39,
      condition: 'UNOPENED',
      location: '분당 직거래',
      recommendationReason: '미개봉 상품이라 새것과 다름없지만 가격은 훨씬 저렴해요.',
      recommendationScore: 89,
      imageUrl: null,
      isFavorite: false,
    },
    {
      productId: 'mock_4',
      rank: 4,
      category: 'SMARTPHONE',
      platform: 'DAANGN',
      title: '아이폰 15 128GB 자급제',
      price: 820_000,
      officialPrice: 1_090_000,
      savingsAmount: 270_000,
      savingsRate: 25,
      condition: 'LIKE_NEW',
      location: '판교 직거래',
      recommendationReason: '배터리 상태와 외관이 좋아 안정적인 선택이에요.',
      recommendationScore: 87,
      imageUrl: null,
      isFavorite: false,
    },
    {
      productId: 'mock_5',
      rank: 5,
      category: 'EARPHONES',
      platform: 'BUNGJANG',
      title: '갤럭시 버즈2 프로',
      price: 89_000,
      officialPrice: 189_000,
      savingsAmount: 100_000,
      savingsRate: 53,
      condition: 'LIKE_NEW',
      location: '택배 거래',
      recommendationReason: '구성품이 잘 보존된 가성비 좋은 매물이에요.',
      recommendationScore: 84,
      imageUrl: null,
      isFavorite: false,
    },
    {
      productId: 'mock_6',
      rank: 6,
      category: 'LAPTOP',
      platform: 'JOONGGONARA',
      title: '아이패드 프로 11 M2',
      price: 720_000,
      officialPrice: 1_099_000,
      savingsAmount: 379_000,
      savingsRate: 35,
      condition: 'GOOD',
      location: '송파 직거래',
      recommendationReason: '사용감은 있지만 성능 대비 가격이 매력적이에요.',
      recommendationScore: 81,
      imageUrl: null,
      isFavorite: false,
    },
    {
      productId: 'mock_7',
      rank: 7,
      category: 'SMARTWATCH',
      platform: 'DAANGN',
      title: '애플워치 울트라2',
      price: 560_000,
      officialPrice: 1_149_000,
      savingsAmount: 589_000,
      savingsRate: 51,
      condition: 'GOOD',
      location: '판교 직거래',
      recommendationReason: '큰 폭의 할인과 판매자 신뢰도를 함께 확인했어요.',
      recommendationScore: 79,
      imageUrl: null,
      isFavorite: false,
    },
    {
      productId: 'mock_8',
      rank: 8,
      category: 'LAPTOP',
      platform: 'BUNGJANG',
      title: 'LG 27인치 모니터',
      price: 130_000,
      officialPrice: 249_000,
      savingsAmount: 119_000,
      savingsRate: 48,
      condition: 'GOOD',
      location: '택배 거래',
      recommendationReason: '사무용으로 부담 없이 시작하기 좋은 가격이에요.',
      recommendationScore: 76,
      imageUrl: null,
      isFavorite: false,
    },
    {
      productId: 'mock_9',
      rank: 9,
      category: 'OTHER',
      platform: 'JOONGGONARA',
      title: '닌텐도 스위치 OLED',
      price: 260_000,
      officialPrice: 415_000,
      savingsAmount: 155_000,
      savingsRate: 37,
      condition: 'LIKE_NEW',
      location: '택배 거래',
      recommendationReason: '구성품이 모두 있고 시세보다 저렴한 매물이에요.',
      recommendationScore: 73,
      imageUrl: null,
      isFavorite: false,
    },
    {
      productId: 'mock_10',
      rank: 10,
      category: 'SMARTPHONE',
      platform: 'BUNGJANG',
      title: '갤럭시 S24 256GB',
      price: 650_000,
      officialPrice: 1_155_000,
      savingsAmount: 505_000,
      savingsRate: 44,
      condition: 'LIKE_NEW',
      location: '택배 거래',
      recommendationReason: '최근 등록된 미세 사용감 매물이라 가격 경쟁력이 좋아요.',
      recommendationScore: 70,
      imageUrl: null,
      isFavorite: false,
    },
    {
      productId: 'mock_11',
      rank: 11,
      category: 'EARPHONES',
      platform: 'DAANGN',
      title: '소니 WF-1000XM5',
      price: 180_000,
      officialPrice: 359_000,
      savingsAmount: 179_000,
      savingsRate: 50,
      condition: 'LIKE_NEW',
      location: '성수 직거래',
      recommendationReason: '정품 구성품이 모두 있고 공식가 대비 절약 폭이 커요.',
      recommendationScore: 68,
      imageUrl: null,
      isFavorite: false,
    },
  ],
};

const registered = new Map<string, { password: string; profileImageUrl: string | null }>([
  ['test@example.com', { password: 'test1234', profileImageUrl: null }],
]);

const STATE_KEY = 'msw:state';

interface MockState {
  email: string | null;
  name: string;
  regionId: string;
  profileImageUrl: string | null;
}

function readState(): MockState {
  const fallback: MockState = { email: null, name: '김혜준', regionId: '101', profileImageUrl: null };
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) return { ...fallback, ...(JSON.parse(raw) as Partial<MockState>) };
  } catch {}
  return fallback;
}

function writeState(patch: Partial<MockState>) {
  localStorage.setItem(STATE_KEY, JSON.stringify({ ...readState(), ...patch }));
}

const isAuthed = (request: Request) => Boolean(request.headers.get('Authorization'));

const regions = [
  { id: '101', name: '판교동', district: '성남시 분당구' },
  { id: '102', name: '정자동', district: '성남시 분당구' },
  { id: '103', name: '서현동', district: '성남시 분당구' },
  { id: '104', name: '삼평동', district: '성남시 분당구' },
  { id: '201', name: '역삼동', district: '서울 강남구' },
];

function currentProfile() {
  const state = readState();
  return {
    id: '1',
    name: state.name,
    email: state.email ?? 'test@example.com',
    profileImageUrl: state.profileImageUrl,
    region: regions.find((r) => r.id === state.regionId) ?? regions[0],
    joinedAt: '2026-03-02',
    stats: { favoriteCount: 12, platformRedirectCount: 8, aiSearchCount: 27 },
  };
}

const recentSearches = [
  { id: '1', keyword: '30만원으로 에어팟 사고 싶어, 중고 괜찮아', searchedAt: '2026-08-18T11:20:00.000Z' },
  { id: '2', keyword: '맥북 에어 M2 100만원 아래', searchedAt: '2026-08-17T08:05:00.000Z' },
  { id: '3', keyword: '애플워치 SE 미개봉', searchedAt: '2026-08-15T15:42:00.000Z' },
];

const redirectHistories: RedirectHistory[] = [
  {
    id: 'redirect-1',
    productId: 'mock-airpods-pro-2',
    title: 'AirPods Pro 2 (USB-C)',
    price: 180_000,
    platform: 'DAANGN',
    thumbnailUrl: null,
    redirectedAt: '2026-08-19T05:14:00.000Z',
    platformUrl: 'https://www.daangn.com/',
  },
  {
    id: 'redirect-2',
    productId: 'history-watch-se',
    title: '애플워치 SE 미개봉',
    price: 150_000,
    platform: 'BUNGJANG',
    thumbnailUrl: null,
    redirectedAt: '2026-08-19T02:02:00.000Z',
    platformUrl: 'https://m.bunjang.co.kr/',
  },
  {
    id: 'redirect-3',
    productId: 'history-macbook',
    title: '맥북 에어 M2 245',
    price: 980_000,
    platform: 'JOONGGONARA',
    thumbnailUrl: null,
    redirectedAt: '2026-08-18T09:40:00.000Z',
    platformUrl: 'https://web.joongna.com/',
  },
  {
    id: 'redirect-4',
    productId: 'history-iphone',
    title: '아이폰 15 128GB 자급제',
    price: 820_000,
    platform: 'DAANGN',
    thumbnailUrl: null,
    redirectedAt: '2026-08-18T06:21:00.000Z',
    platformUrl: 'https://www.daangn.com/',
  },
  {
    id: 'redirect-5',
    productId: 'history-galaxy-buds',
    title: '갤럭시 버즈2 프로',
    price: 89_000,
    platform: 'BUNGJANG',
    thumbnailUrl: null,
    redirectedAt: '2026-08-18T00:55:00.000Z',
    platformUrl: 'https://m.bunjang.co.kr/',
  },
  {
    id: 'redirect-6',
    productId: 'history-watch-ultra',
    title: '애플워치 울트라2',
    price: 560_000,
    platform: 'DAANGN',
    thumbnailUrl: null,
    redirectedAt: '2026-08-16T08:10:00.000Z',
    platformUrl: 'https://www.daangn.com/',
  },
  {
    id: 'redirect-7',
    productId: 'history-airpods',
    title: '에어팟 프로 2 미개봉',
    price: 165_000,
    platform: 'JOONGGONARA',
    thumbnailUrl: null,
    redirectedAt: '2026-08-16T04:35:00.000Z',
    platformUrl: 'https://web.joongna.com/',
  },
  {
    id: 'redirect-8',
    productId: 'history-laptop',
    title: 'LG 그램 16인치',
    price: 700_000,
    platform: 'BUNGJANG',
    thumbnailUrl: null,
    redirectedAt: '2026-08-15T03:12:00.000Z',
    platformUrl: 'https://m.bunjang.co.kr/',
  },
];

export const handlers = [
  http.get('*/products/best-deals', () => HttpResponse.json(envelope(bestDeals))),

  http.get('*/products', () => HttpResponse.json(envelope(products))),

  http.post('*/users/signup', async ({ request }) => {
    const { email, password, profileImageUrl } = (await request.json()) as {
      email: string;
      password: string;
      profileImageUrl?: string | null;
    };
    if (registered.has(email)) {
      return HttpResponse.json({ message: '이미 가입된 이메일입니다' }, { status: 409 });
    }
    registered.set(email, { password, profileImageUrl: profileImageUrl ?? null });
    return HttpResponse.json(envelope({ id: crypto.randomUUID(), email }), { status: 201 });
  }),

  http.post('*/users/login', async ({ request }) => {
    const { email, password } = (await request.json()) as { email: string; password: string };
    const account = registered.get(email);
    if (!account || account.password !== password) {
      return HttpResponse.json({ message: '이메일 또는 비밀번호가 올바르지 않습니다' }, { status: 401 });
    }
    writeState({ email, profileImageUrl: account.profileImageUrl });
    return HttpResponse.json(envelope({ accessToken: 'mock-access-token', tokenType: 'Bearer', userId: 'u1' }));
  }),

  http.get('*/regions', () => HttpResponse.json(envelope(regions))),

  http.get('*/users/me/searches', ({ request }) => {
    if (!isAuthed(request)) return unauthorized();
    return HttpResponse.json(envelope(recentSearches));
  }),

  http.get('*/users/me/redirect-histories', ({ request }) => {
    if (!isAuthed(request)) return unauthorized();
    return HttpResponse.json(envelope(redirectHistories));
  }),

  http.get('*/users/me', ({ request }) => {
    if (!isAuthed(request)) return unauthorized();
    return HttpResponse.json(envelope(currentProfile()));
  }),

  http.patch('*/users/me', async ({ request }) => {
    if (!isAuthed(request)) return unauthorized();
    const body = (await request.json()) as { name?: string; regionId?: string; profileImageUrl?: string | null };
    writeState({
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.regionId !== undefined ? { regionId: body.regionId } : {}),
      ...(body.profileImageUrl !== undefined ? { profileImageUrl: body.profileImageUrl } : {}),
    });
    return HttpResponse.json(envelope(currentProfile()));
  }),

  http.delete('*/users/me', ({ request }) => {
    if (!isAuthed(request)) return unauthorized();
    localStorage.removeItem(STATE_KEY);
    return HttpResponse.json(envelope(null));
  }),

  http.post('*/users/token/refresh', () => HttpResponse.json(envelope({ accessToken: 'mock-refreshed-token' }))),
];
