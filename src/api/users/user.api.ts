import { z } from 'zod';

import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';
import { unwrap } from '../response';

import {
  meSchema,
  recentSearchSchema,
  regionSchema,
  type Me,
  type RecentSearch,
  type Region,
  type UpdateProfileRequest,
} from './user.schema';

/** GET /users/me — 프로필 · 지역 · 활동 통계를 한 번에 받습니다. */
export async function fetchMe(): Promise<Me> {
  const { data } = await apiClient.get(ENDPOINTS.users.me);
  return unwrap(meSchema, data);
}

/** 아래 셋은 명세 미확정 상태입니다. */
export async function fetchRegions(): Promise<Region[]> {
  const { data } = await apiClient.get(ENDPOINTS.users.regions);
  return unwrap(z.array(regionSchema), data);
}

export async function fetchRecentSearches(): Promise<RecentSearch[]> {
  const { data } = await apiClient.get(ENDPOINTS.users.recentSearches);
  return unwrap(z.array(recentSearchSchema), data);
}

export async function updateProfile(body: UpdateProfileRequest): Promise<Me> {
  const { data } = await apiClient.patch(ENDPOINTS.users.me, body);
  return unwrap(meSchema, data);
}

/** 회원 탈퇴. 되돌릴 수 없습니다. */
export async function withdraw(): Promise<void> {
  await apiClient.delete(ENDPOINTS.users.me);
}
