import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';
import { unwrap } from '../response';

import { bestDealPageSchema, type BestDealCategory, type BestDealList } from './best-deal.schema';

export type BestDealCategoryFilter = 'ALL' | Exclude<BestDealCategory, 'OTHER'>;
export type BestDealSort = 'AI_RECOMMENDED' | 'PRICE_ASC' | 'SAVINGS_DESC';

export interface BestDealParams {
  category?: BestDealCategoryFilter;
  sort?: BestDealSort;
  page?: number;
  size?: number;
}

export async function fetchBestDeals(params: BestDealParams = {}): Promise<BestDealList> {
  const { data } = await apiClient.get(ENDPOINTS.products.bestDeals, { params });
  return unwrap(bestDealPageSchema, data);
}
