import { z } from 'zod';

export const regionSchema = z.object({
  id: z.coerce.string(),
  name: z.string(),
  district: z.string(),
});

export const userStatsSchema = z.object({
  favoriteCount: z.number().int().nonnegative(),
  platformRedirectCount: z.number().int().nonnegative(),
  aiSearchCount: z.number().int().nonnegative(),
});

/** GET /users/me — 명세서의 응답 형태 그대로입니다. */
export const meSchema = z.object({
  id: z.coerce.string(),
  name: z.string(),
  email: z.email(),
  profileImageUrl: z.string().nullable(),
  region: regionSchema.nullable(),
  joinedAt: z.iso.date(),
  stats: userStatsSchema,
});

/** 아래 셋은 아직 명세가 없어 프론트가 임의로 정한 형태입니다. 확정되면 맞춰야 합니다. */
export const recentSearchSchema = z.object({
  id: z.coerce.string(),
  keyword: z.string(),
  searchedAt: z.iso.datetime(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요').max(20, '이름은 20자를 넘을 수 없습니다').optional(),
  regionId: z.string().optional(),
});

export type Region = z.infer<typeof regionSchema>;
export type UserStats = z.infer<typeof userStatsSchema>;
export type Me = z.infer<typeof meSchema>;
export type RecentSearch = z.infer<typeof recentSearchSchema>;
export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>;
