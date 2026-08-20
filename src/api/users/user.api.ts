import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';
import { unwrap } from '../response';

import {
  meSchema,
  recentSearchSessionPageSchema,
  userDashboardSchema,
  type Me,
  type RecentSearch,
  type UpdateProfileRequest,
  type UserDashboard,
} from './user.schema';

export async function fetchMe(): Promise<Me> {
  const { data } = await apiClient.get(ENDPOINTS.users.me);
  return unwrap(meSchema, data);
}

export async function fetchRecentSearches(): Promise<RecentSearch[]> {
  const { data } = await apiClient.get(ENDPOINTS.searches.recent, {
    params: { page: 0, size: 3 },
  });
  return unwrap(recentSearchSessionPageSchema, data);
}

export async function fetchDashboard(): Promise<UserDashboard> {
  const { data } = await apiClient.get(ENDPOINTS.users.dashboard);
  return unwrap(userDashboardSchema, data);
}

export async function updateProfile(body: UpdateProfileRequest): Promise<Me> {
  const { data } = await apiClient.patch(ENDPOINTS.users.me, body);
  return unwrap(meSchema, data);
}

export async function withdraw(): Promise<void> {
  await apiClient.delete(ENDPOINTS.users.me);
}
