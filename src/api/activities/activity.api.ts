import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';
import { unwrap } from '../response';

import {
  platformRedirectSchema,
  redirectHistoryListSchema,
  type PlatformRedirect,
  type RedirectHistory,
} from './activity.schema';

export async function fetchRedirectHistories(): Promise<RedirectHistory[]> {
  const { data } = await apiClient.get(ENDPOINTS.activities.redirectHistories);
  return unwrap(redirectHistoryListSchema, data);
}

export async function recordProductView(productId: string): Promise<void> {
  await apiClient.post(ENDPOINTS.products.view(productId));
}

export async function recordPlatformRedirect(productId: string): Promise<PlatformRedirect> {
  const { data } = await apiClient.post(ENDPOINTS.products.redirect(productId));
  return unwrap(platformRedirectSchema, data);
}
