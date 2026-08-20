import { z } from 'zod';

import { platformSchema } from '@/api/searches/search.schema';

export const activityPlatformSchema = platformSchema;

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

export const platformRedirectSchema = z.object({
  platform: activityPlatformSchema,
  redirectUrl: z.url(),
  redirectedAt: z.iso.datetime({ offset: true }),
});

export type ActivityPlatform = z.infer<typeof activityPlatformSchema>;
export type RedirectHistory = z.infer<typeof redirectHistorySchema>;
export type PlatformRedirect = z.infer<typeof platformRedirectSchema>;
