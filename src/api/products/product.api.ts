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
  return unwrap(productListSchema, data);
}
