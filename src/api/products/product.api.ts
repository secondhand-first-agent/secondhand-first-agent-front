import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';
import { unwrap } from '../response';

import { productDetailSchema, productListSchema, type ProductDetail, type ProductList } from './product.schema';

export interface ProductListParams {
  keyword?: string;
  cursor?: string;
}

export async function fetchProducts(params: ProductListParams = {}): Promise<ProductList> {
  const { data } = await apiClient.get(ENDPOINTS.products.list, { params });
  return unwrap(productListSchema, data);
}

export async function fetchProductDetail(productId: string): Promise<ProductDetail> {
  const { data } = await apiClient.get(ENDPOINTS.products.detail(productId));
  return unwrap(productDetailSchema, data);
}
