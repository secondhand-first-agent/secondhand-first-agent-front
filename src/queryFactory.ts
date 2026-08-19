import { queryOptions } from '@tanstack/react-query';

import { fetchMe } from '@/api/auth/auth.api';
import { fetchProducts, type ProductListParams } from '@/api/products/product.api';

/**
 * 모든 queryKey 는 여기서만 만듭니다. 화면에서 배열 리터럴을 직접 쓰지 않습니다.
 *
 * - 무효화할 때는 `queryKeys` 를 씁니다.  예) invalidateQueries({ queryKey: queryKeys.products.all })
 * - 조회할 때는 `queryFactory` 를 씁니다. 예) useQuery(queryFactory.products.list({ keyword }))
 *
 * 계층을 지켜 두면 상위 키 하나로 하위 캐시를 통째로 무효화할 수 있습니다.
 */
export const queryKeys = {
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (params: ProductListParams) => [...queryKeys.products.lists(), params] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
  },
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },
} as const;

export const queryFactory = {
  auth: {
    me: () =>
      queryOptions({
        queryKey: queryKeys.auth.me(),
        queryFn: fetchMe,
      }),
  },
  products: {
    list: (params: ProductListParams = {}) =>
      queryOptions({
        queryKey: queryKeys.products.list(params),
        queryFn: () => fetchProducts(params),
      }),
  },
};
