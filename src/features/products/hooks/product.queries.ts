import { queryOptions } from '@tanstack/react-query';

import { fetchProducts, type ProductListParams } from '../api/product.api';

/** queryKey 는 항상 이 팩토리를 통해서만 만듭니다. 오타로 캐시가 갈라지는 걸 막아줍니다. */
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: ProductListParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

export function productListQuery(params: ProductListParams = {}) {
  return queryOptions({
    queryKey: productKeys.list(params),
    queryFn: () => fetchProducts(params),
  });
}
