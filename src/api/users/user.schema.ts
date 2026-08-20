import { z } from 'zod';

export const userStatsSchema = z.object({
  platformRedirectCount: z.number().int().nonnegative(),
  aiSearchCount: z.number().int().nonnegative(),
});

const EMPTY_STATS = { platformRedirectCount: 0, aiSearchCount: 0 };

export const meSchema = z
  .object({
    userId: z.coerce.string(),
    name: z.string(),
    email: z.email(),
    profileImageUrl: z.string().nullable().optional(),
    createdAt: z.string(),
    region: z.string().nullable().optional(),
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

export type UserStats = z.infer<typeof userStatsSchema>;
export type Me = z.infer<typeof meSchema>;
export type RecentSearch = z.infer<typeof recentSearchSchema>;
export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>;
