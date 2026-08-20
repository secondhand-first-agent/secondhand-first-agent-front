import { z } from 'zod';

export const activityPlatformSchema = z.enum(['NAVER_FLEAMARKET', 'BUNJANG', 'JOONGNA']);

export const redirectHistorySchema = z.object({
  id: z.string(),
  productId: z.string(),
  title: z.string(),
  price: z.number().int().nonnegative(),
  platform: activityPlatformSchema,
  thumbnailUrl: z.string().url().nullable(),
  redirectedAt: z.iso.datetime(),
  platformUrl: z.string().url(),
});

export const redirectHistoryListSchema = z.array(redirectHistorySchema);

export type ActivityPlatform = z.infer<typeof activityPlatformSchema>;
export type RedirectHistory = z.infer<typeof redirectHistorySchema>;
