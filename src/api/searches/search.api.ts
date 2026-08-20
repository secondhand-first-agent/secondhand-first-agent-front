import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';
import { unwrap } from '../response';

import { searchSessionSchema, type SearchSession } from './search.schema';

export async function createSearchSession(query: string): Promise<SearchSession> {
  const { data } = await apiClient.post(ENDPOINTS.searches.sessions, { query });
  return unwrap(searchSessionSchema, data);
}
