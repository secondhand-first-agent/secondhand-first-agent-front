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
  productDetail: '/products/:productId',
  login: '/login',
  signup: '/signup',
} as const;

export function productDetailPath(productId: string) {
  return `${ROUTES.products}/${encodeURIComponent(productId)}`;
}

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
