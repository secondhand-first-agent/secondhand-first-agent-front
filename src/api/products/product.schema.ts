import { z } from 'zod';

import { conditionSchema, platformSchema } from '@/api/searches/search.schema';

export const productSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number().int().nonnegative(),
  status: z.enum(['selling', 'reserved', 'sold']),
  thumbnailUrl: z.string().url().nullable(),
  createdAt: z.iso.datetime(),
});

export const productListSchema = z.object({
  items: z.array(productSchema),
  nextCursor: z.string().nullable(),
});

export const productCategorySchema = z.enum([
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
]);

export const productDetailSchema = z.object({
  id: z.string(),
  platform: platformSchema,
  platformProductId: z.string(),
  title: z.string(),
  price: z.number().int().nonnegative(),
  officialPrice: z.number().int().nonnegative(),
  savingsAmount: z.number().int().nonnegative(),
  savingsRate: z.number().nonnegative(),
  images: z.array(z.string().url()),
  description: z.string().nullable(),
  category: productCategorySchema,
  condition: conditionSchema,
  tradeTypes: z.array(z.string()),
  location: z.string().nullable(),
  distanceKm: z.number().nonnegative().nullable(),
  viewCount: z.number().int().nonnegative().nullable(),
  seller: z.object({
    tradeCount: z.number().int().nonnegative(),
    temperature: z.number().nonnegative(),
  }),
  rank: z.number().int().positive().nullable(),
  recommendationReason: z.string().nullable(),
  externalUrl: z.string().url(),
  changedSinceLastViewed: z.boolean(),
  updatedAt: z.iso.datetime({ offset: true }),
});

export type Product = z.infer<typeof productSchema>;
export type ProductList = z.infer<typeof productListSchema>;
export type ProductCategory = z.infer<typeof productCategorySchema>;
export type ProductDetail = z.infer<typeof productDetailSchema>;
