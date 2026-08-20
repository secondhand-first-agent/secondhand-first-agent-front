import { z } from 'zod';

import { conditionSchema, platformSchema } from '@/api/searches/search.schema';

/**
 * 서버 `ProductCategory` 와 같은 값입니다.
 * 서버가 카테고리를 늘려도 화면이 통째로 깨지지 않도록, 모르는 값은 OTHER 로 받습니다.
 */
export const bestDealCategorySchema = z
  .enum([
    'EARPHONES',
    'LAPTOP',
    'SMARTPHONE',
    'SMARTWATCH',
    'TABLET',
    'MONITOR',
    'GAME_CONSOLE',
    'CLOTHING',
    'BAG_SHOES',
    'FURNITURE',
    'SPORTS_TOYS',
    'BOOKS',
    'WATCH_JEWELRY',
    'OTHER',
  ])
  .catch('OTHER');

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
});

export const bestDealListSchema = z.object({
  items: z.array(bestDealSchema),
  totalElements: z.number().int().nonnegative(),
});

export const bestDealPageSchema = z
  .object({
    content: z.array(bestDealSchema),
    page: z.number().int().nonnegative(),
    size: z.number().int().positive(),
    totalElements: z.number().int().nonnegative(),
    hasNext: z.boolean(),
  })
  .transform(({ content, totalElements }) => ({ items: content, totalElements }));

export type BestDealCategory = z.infer<typeof bestDealCategorySchema>;
export type BestDeal = z.infer<typeof bestDealSchema>;
export type BestDealList = z.infer<typeof bestDealListSchema>;
export type BestDealPageResponse = z.input<typeof bestDealPageSchema>;
