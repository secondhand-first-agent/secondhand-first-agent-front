import { z } from 'zod';

import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';
import { unwrap } from '../response';

import { meSchema, recentSearchSchema, type Me, type RecentSearch, type UpdateProfileRequest } from './user.schema';

export async function fetchMe(): Promise<Me> {
  const { data } = await apiClient.get(ENDPOINTS.users.me);
  return unwrap(meSchema, data);
}

export async function fetchRecentSearches(): Promise<RecentSearch[]> {
  const { data } = await apiClient.get(ENDPOINTS.users.recentSearches);
  return unwrap(z.array(recentSearchSchema), data);
}

export async function updateProfile(body: UpdateProfileRequest): Promise<Me> {
  const { data } = await apiClient.patch(ENDPOINTS.users.me, body);
  return unwrap(meSchema, data);
}

export async function withdraw(): Promise<void> {
  await apiClient.delete(ENDPOINTS.users.me);
}
