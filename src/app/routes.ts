/** 라우트 경로는 항상 여기서 가져옵니다. 문자열을 화면에 직접 쓰지 않습니다. */
export const ROUTES = {
  home: '/',
  search: '/search',
  bestDeal: '/best-deal',
  howItWorks: '/how-it-works',
  profile: '/profile',
  wishlist: '/wishlist',
  history: '/history',
  settings: '/settings',
  products: '/products',
  login: '/login',
  signup: '/signup',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
