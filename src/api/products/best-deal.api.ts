import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';
import { unwrap } from '../response';

import { bestDealPageSchema, type BestDealList } from './best-deal.schema';

export async function fetchBestDeals(): Promise<BestDealList> {
  const { data } = await apiClient.get(ENDPOINTS.products.bestDeals);
  return unwrap(bestDealPageSchema, data);
}
