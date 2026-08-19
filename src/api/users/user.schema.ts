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

export const meSchema = z.object({
  id: z.coerce.string(),
  name: z.string(),
  email: z.email(),
  profileImageUrl: z.string().nullable(),
  region: regionSchema.nullable(),
  joinedAt: z.iso.date(),
  stats: userStatsSchema,
});

export const recentSearchSchema = z.object({
  id: z.coerce.string(),
  keyword: z.string(),
  searchedAt: z.iso.datetime(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요').max(20, '이름은 20자를 넘을 수 없습니다').optional(),
  regionId: z.string().optional(),
  profileImageUrl: z.string().nullable().optional(),
});

export type Region = z.infer<typeof regionSchema>;
export type UserStats = z.infer<typeof userStatsSchema>;
export type Me = z.infer<typeof meSchema>;
export type RecentSearch = z.infer<typeof recentSearchSchema>;
export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>;
