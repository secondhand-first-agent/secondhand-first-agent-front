export const ENDPOINTS = {
  auth: {
    signup: '/auth/signup',
    login: '/auth/login',
    refresh: '/auth/token/refresh',
    logout: '/auth/logout',
    password: '/auth/password',
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
