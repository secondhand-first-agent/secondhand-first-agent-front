import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';
import { unwrap } from '../response';

import { redirectHistoryListSchema, type RedirectHistory } from './activity.schema';

export async function fetchRedirectHistories(): Promise<RedirectHistory[]> {
  const { data } = await apiClient.get(ENDPOINTS.activities.redirectHistories);
  return unwrap(redirectHistoryListSchema, data);
}
