import { http, HttpResponse } from 'msw';

import type { ProductList } from '@/api/products/product.schema';

/** 서버 응답 봉투 */
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

/** 실제 API 가 붙기 전까지 쓰는 임시 계정 */
const registered = new Map<string, string>([['test@example.com', 'test1234']]);

/**
 * 목 서버 상태는 localStorage 에 둡니다.
 * 모듈 변수로 두면 새로고침할 때마다 로그인 상태와 수정 내용이 날아갑니다.
 */
const STATE_KEY = 'msw:state';

interface MockState {
  email: string | null;
  name: string;
  regionId: string;
}

function readState(): MockState {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) return JSON.parse(raw) as MockState;
  } catch {
    // 손상된 값이면 기본값으로 되돌립니다.
  }
  return { email: null, name: '김혜준', regionId: '101' };
}

function writeState(patch: Partial<MockState>) {
  localStorage.setItem(STATE_KEY, JSON.stringify({ ...readState(), ...patch }));
}

/** 인증은 Authorization 헤더 존재 여부로만 판단합니다. */
const isAuthed = (request: Request) => Boolean(request.headers.get('Authorization'));

/** 프로필 수정이 반영되는지 확인할 수 있도록 목 서버가 상태를 들고 있습니다. */
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
    profileImageUrl: null,
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
    writeState({ email });
    return HttpResponse.json(envelope({ accessToken: 'mock-access-token', tokenType: 'Bearer', userId: 'u1' }));
  }),

  http.get('*/regions', () => HttpResponse.json(envelope(regions))),

  http.get('*/users/me/searches', ({ request }) => {
    if (!isAuthed(request)) return unauthorized();
    return HttpResponse.json(envelope(recentSearches));
  }),

  http.get('*/users/me', ({ request }) => {
    if (!isAuthed(request)) return unauthorized();
    return HttpResponse.json(envelope(currentProfile()));
  }),

  http.patch('*/users/me', async ({ request }) => {
    if (!isAuthed(request)) return unauthorized();
    const body = (await request.json()) as { name?: string; regionId?: string };
    writeState({
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.regionId !== undefined ? { regionId: body.regionId } : {}),
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
