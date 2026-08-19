import { http } from '@/shared/api/http';

import { productListSchema, type ProductList } from './product.schema';

export interface ProductListParams {
  keyword?: string;
  cursor?: string;
}

export async function fetchProducts(params: ProductListParams = {}): Promise<ProductList> {
  const json = await http.get('products', { searchParams: { ...params } }).json();
  // 서버 응답이 기대와 다르면 화면이 아니라 여기서 터지게 합니다.
  return productListSchema.parse(json);
}
