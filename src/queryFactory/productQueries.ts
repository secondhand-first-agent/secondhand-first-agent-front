import { queryOptions } from '@tanstack/react-query';

import { fetchBestDeals, type BestDealParams } from '@/api/products/best-deal.api';
import { fetchProductDetail, fetchProducts, type ProductListParams } from '@/api/products/product.api';

export const productQueryKeys = {
  all: ['products'],
  lists: () => [...productQueryKeys.all, 'list'],
  list: (params: ProductListParams) => [...productQueryKeys.lists(), params],
  details: () => [...productQueryKeys.all, 'detail'],
  detail: (id: string) => [...productQueryKeys.details(), id],
  bestDeals: (params: BestDealParams) => [...productQueryKeys.all, 'best-deals', params],
};

export const productQueries = {
  list: (params: ProductListParams = {}) =>
    queryOptions({
      queryKey: productQueryKeys.list(params),
      queryFn: () => fetchProducts(params),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: productQueryKeys.detail(id),
      queryFn: () => fetchProductDetail(id),
    }),
  bestDeals: (params: BestDealParams = {}) =>
    queryOptions({
      queryKey: productQueryKeys.bestDeals(params),
      queryFn: () => fetchBestDeals(params),
    }),
};
