import { queryOptions } from '@tanstack/react-query';

import { fetchBestDeals } from '@/api/products/best-deal.api';
import { fetchProducts, type ProductListParams } from '@/api/products/product.api';

export const productQueryKeys = {
  all: ['products'],
  lists: () => [...productQueryKeys.all, 'list'],
  list: (params: ProductListParams) => [...productQueryKeys.lists(), params],
  details: () => [...productQueryKeys.all, 'detail'],
  detail: (id: string) => [...productQueryKeys.details(), id],
  bestDeals: () => [...productQueryKeys.all, 'best-deals'],
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
