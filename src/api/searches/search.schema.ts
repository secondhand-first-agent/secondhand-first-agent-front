import { z } from 'zod';

export const platformSchema = z.enum(['DAANGN', 'BUNGJANG', 'JOONGGONARA']);
export const conditionSchema = z.enum(['UNOPENED', 'LIKE_NEW', 'GOOD', 'USED']);
export const searchSortSchema = z.enum(['AI_RECOMMENDED', 'PRICE_ASC', 'DISTANCE_ASC']);

export const parsedConditionsSchema = z.object({
  keyword: z.string(),
  maxPrice: z.number().int().nonnegative().nullable().optional(),
  condition: z.array(conditionSchema),
  priority: z.string(),
});

export const searchSessionSchema = z.object({
  sessionId: z.string(),
  status: z.string(),
  parsedConditions: parsedConditionsSchema,
  assistantMessage: z.string(),
  resultCount: z.number().int().nonnegative(),
});

export const officialProductSchema = z.object({
  name: z.string(),
  officialStore: z.string(),
  officialPrice: z.number().int().nonnegative(),
  officialUrl: z.string().url(),
});

export const searchResultProductSchema = z.object({
  productId: z.string(),
  rank: z.number().int().positive(),
  platform: platformSchema,
  title: z.string(),
  price: z.number().int().nonnegative(),
  officialPrice: z.number().int().nonnegative(),
  savingsAmount: z.number().int().nonnegative(),
  savingsRate: z.number().nonnegative(),
  distanceKm: z.number().nonnegative().nullable().optional(),
  condition: conditionSchema,
  tradeType: z.array(z.string()),
  sellerTrustScore: z.number().min(0).max(100),
  recommendationScore: z.number().min(0).max(100),
  recommendationReason: z.string(),
  imageUrl: z.string().url().nullable().optional(),
  isFavorite: z.boolean(),
  changedSinceLastViewed: z.boolean(),
});

export const searchResultsSchema = z.object({
  officialProduct: officialProductSchema,
  content: z.array(searchResultProductSchema),
  page: z.number().int().nonnegative(),
  size: z.number().int().positive(),
  totalElements: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  hasNext: z.boolean(),
});

export const searchMessageResponseSchema = z.object({
  messageId: z.string(),
  assistantMessage: z.string(),
  parsedConditions: parsedConditionsSchema,
  resultCount: z.number().int().nonnegative(),
});

export type Platform = z.infer<typeof platformSchema>;
export type Condition = z.infer<typeof conditionSchema>;
export type SearchSort = z.infer<typeof searchSortSchema>;
export type SearchSession = z.infer<typeof searchSessionSchema>;
export type OfficialProduct = z.infer<typeof officialProductSchema>;
export type SearchResults = z.infer<typeof searchResultsSchema>;
export type SearchResultProduct = z.infer<typeof searchResultProductSchema>;
export type SearchMessageResponse = z.infer<typeof searchMessageResponseSchema>;
