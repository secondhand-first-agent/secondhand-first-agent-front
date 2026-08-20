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

const EMPTY_STATS = { favoriteCount: 0, platformRedirectCount: 0, aiSearchCount: 0 };

/**
 * 서버 응답(`GET /users/me`)을 화면이 쓰는 형태로 변환합니다.
 * `region` / `stats` 는 아직 서버에 없어서 기본값으로 채웁니다.
 */
export const meSchema = z
  .object({
    userId: z.coerce.string(),
    name: z.string(),
    email: z.email(),
    profileImageUrl: z.string().nullable().optional(),
    createdAt: z.string(),
    region: regionSchema.nullable().optional(),
    stats: userStatsSchema.optional(),
  })
  .transform((user) => ({
    id: user.userId,
    name: user.name,
    email: user.email,
    profileImageUrl: user.profileImageUrl ?? null,
    region: user.region ?? null,
    joinedAt: user.createdAt.slice(0, 10),
    stats: user.stats ?? EMPTY_STATS,
  }));

export const recentSearchSchema = z.object({
  id: z.coerce.string(),
  keyword: z.string(),
  searchedAt: z.iso.datetime(),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, '이름을 입력해주세요').max(20, '이름은 20자를 넘을 수 없습니다'),
  profileImageUrl: z.string().nullable().optional(),
});

export type Region = z.infer<typeof regionSchema>;
export type UserStats = z.infer<typeof userStatsSchema>;
export type Me = z.infer<typeof meSchema>;
export type RecentSearch = z.infer<typeof recentSearchSchema>;
export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>;
