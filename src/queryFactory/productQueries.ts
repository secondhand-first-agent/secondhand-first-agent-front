import { queryOptions } from '@tanstack/react-query';

import { fetchBestDeals } from '@/api/products/best-deal.api';
import { fetchProducts, type ProductListParams } from '@/api/products/product.api';

export const productQueryKeys = {
  all: ['products'] as const,
  lists: () => [...productQueryKeys.all, 'list'] as const,
  list: (params: ProductListParams) => [...productQueryKeys.lists(), params] as const,
  details: () => [...productQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...productQueryKeys.details(), id] as const,
  bestDeals: () => [...productQueryKeys.all, 'best-deals'] as const,
};

export const productQueries = {
  list: (params: ProductListParams = {}) =>
    queryOptions({
      queryKey: productQueryKeys.list(params),
      queryFn: () => fetchProducts(params),
    }),
  bestDeals: () =>
    queryOptions({
      queryKey: productQueryKeys.bestDeals(),
      queryFn: fetchBestDeals,
    }),
};
