import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';
import { unwrap } from '../response';

import {
  searchMessageResponseSchema,
  searchResultsSchema,
  searchSessionSchema,
  type Platform,
  type SearchMessageResponse,
  type SearchResults,
  type SearchSession,
  type SearchSort,
} from './search.schema';

export async function createSearchSession(query: string): Promise<SearchSession> {
  const { data } = await apiClient.post(ENDPOINTS.searches.sessions, { query });
  return unwrap(searchSessionSchema, data);
}

export interface SearchResultsParams {
  platform?: 'ALL' | Platform;
  sort?: SearchSort;
  page?: number;
  size?: number;
}

export async function fetchSearchResults(sessionId: string, params: SearchResultsParams = {}): Promise<SearchResults> {
  const { data } = await apiClient.get(ENDPOINTS.searches.results(sessionId), { params });
  return unwrap(searchResultsSchema, data);
}

export async function sendSearchMessage(sessionId: string, message: string): Promise<SearchMessageResponse> {
  const { data } = await apiClient.post(ENDPOINTS.searches.messages(sessionId), { message });
  return unwrap(searchMessageResponseSchema, data);
}
