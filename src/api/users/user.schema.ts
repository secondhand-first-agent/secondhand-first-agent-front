import { z } from 'zod';

export const userStatsSchema = z.object({
  platformRedirectCount: z.number().int().nonnegative(),
  aiSearchCount: z.number().int().nonnegative(),
});

export const carbonQuestSchema = z.object({
  date: z.iso.date(),
  viewedCount: z.number().int().nonnegative(),
  goal: z.number().int().positive(),
  completed: z.boolean(),
  earnedPoints: z.number().int().nonnegative(),
});

export const userDashboardSchema = z.object({
  stats: userStatsSchema,
  carbonQuest: carbonQuestSchema,
});

export const meSchema = z
  .object({
    userId: z.coerce.string(),
    name: z.string(),
    email: z.email(),
    profileImageUrl: z.string().nullable().optional(),
    createdAt: z.string(),
    region: z.string().nullable().optional(),
  })
  .transform((user) => ({
    id: user.userId,
    name: user.name,
    email: user.email,
    profileImageUrl: user.profileImageUrl ?? null,
    region: user.region ?? null,
    joinedAt: user.createdAt.slice(0, 10),
  }));

const recentSearchSessionSchema = z.object({
  sessionId: z.string(),
  keyword: z.string(),
  querySummary: z.string().nullable().optional(),
  lastMessage: z.string().nullable().optional(),
  resultCount: z.number().int().nonnegative(),
  updatedAt: z.iso.datetime({ offset: true }),
});

export const recentSearchSessionPageSchema = z
  .object({
    content: z.array(recentSearchSessionSchema),
    page: z.number().int().nonnegative(),
    size: z.number().int().positive(),
    totalElements: z.number().int().nonnegative(),
    hasNext: z.boolean(),
  })
  .transform((page) =>
    page.content.map((session) => ({
      id: session.sessionId,
      keyword: session.querySummary || session.keyword,
      searchedAt: session.updatedAt,
    }))
  );

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, '이름을 입력해주세요').max(20, '이름은 20자를 넘을 수 없습니다'),
  profileImageUrl: z.string().nullable().optional(),
});

export type UserStats = z.infer<typeof userStatsSchema>;
export type CarbonQuest = z.infer<typeof carbonQuestSchema>;
export type UserDashboard = z.infer<typeof userDashboardSchema>;
export type RecentSearchSessionPageResponse = z.input<typeof recentSearchSessionPageSchema>;
export type Me = z.infer<typeof meSchema>;
export type RecentSearch = z.infer<typeof recentSearchSessionPageSchema>[number];
export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>;
