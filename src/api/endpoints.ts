export const ENDPOINTS = {
  auth: {
    signup: '/users/signup',
    login: '/users/login',
    refresh: '/users/token/refresh',
  },
  users: {
    me: '/users/me',
    regions: '/regions',
    recentSearches: '/users/me/searches',
  },
  products: {
    list: '/products',
    detail: (productId: string) => `/products/${productId}`,
    refresh: (productId: string) => `/products/${productId}/refresh`,
    bestDeals: '/products/best-deals',
    similar: (productId: string) => `/products/${productId}/similar`,
  },
  searches: {
    sessions: '/search-sessions',
    results: (sessionId: string) => `/search-sessions/${sessionId}/results`,
    messages: (sessionId: string) => `/search-sessions/${sessionId}/messages`,
    recent: '/users/me/search-sessions',
  },
  activities: {
    redirectHistories: '/users/me/redirect-histories',
  },
} as const;
