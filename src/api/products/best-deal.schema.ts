import { z } from 'zod';

import { conditionSchema, platformSchema } from '@/api/searches/search.schema';

export const bestDealCategorySchema = z.enum(['EARPHONES', 'LAPTOP', 'SMARTPHONE', 'SMARTWATCH', 'OTHER']);

export const bestDealSchema = z.object({
  productId: z.string(),
  rank: z.number().int().positive(),
  category: bestDealCategorySchema,
  platform: platformSchema,
  title: z.string(),
  price: z.number().int().nonnegative(),
  officialPrice: z.number().int().nonnegative(),
  savingsAmount: z.number().int().nonnegative(),
  savingsRate: z.number().nonnegative(),
  condition: conditionSchema,
  location: z.string(),
  recommendationReason: z.string(),
  recommendationScore: z.number().min(0).max(100),
  imageUrl: z.string().url().nullable(),
  isFavorite: z.boolean(),
});

export const bestDealListSchema = z.object({
  items: z.array(bestDealSchema),
  totalElements: z.number().int().nonnegative(),
});

export type BestDealCategory = z.infer<typeof bestDealCategorySchema>;
export type BestDeal = z.infer<typeof bestDealSchema>;
export type BestDealList = z.infer<typeof bestDealListSchema>;
