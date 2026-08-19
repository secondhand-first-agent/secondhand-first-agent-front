import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';
import { unwrap } from '../response';

import { bestDealListSchema, type BestDealList } from './best-deal.schema';

export async function fetchBestDeals(): Promise<BestDealList> {
  const { data } = await apiClient.get(ENDPOINTS.products.bestDeals);
  return unwrap(bestDealListSchema, data);
}
