import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';
import { unwrap } from '../response';

import { productListSchema, type ProductList } from './product.schema';

export interface ProductListParams {
  keyword?: string;
  cursor?: string;
}

export async function fetchProducts(params: ProductListParams = {}): Promise<ProductList> {
  const { data } = await apiClient.get(ENDPOINTS.products.list, { params });
  // 서버 응답이 기대와 다르면 화면이 아니라 여기서 터지게 합니다.
  return unwrap(productListSchema, data);
}
