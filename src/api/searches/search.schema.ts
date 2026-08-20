import { z } from 'zod';

// 크롤러 통합 스키마와 동일하게 맞춘다.
// 정의 원본: data-analysis/docs/통합_스키마_정의.md
// 앞의 셋은 중고, ELEVENST는 새상품 비교 기준. 당근마켓은 수집 대상이 아니다.
export const platformSchema = z.enum(['BUNJANG', 'JOONGNA', 'NAVER_FLEAMARKET', 'ELEVENST']);

// UNSPECIFIED는 판매자가 상태를 안 적은 것, UNKNOWN은 우리가 해석하지 못한 것이다.
// 둘 다 "상태가 나쁘다"는 뜻이 아니므로 USED로 묶지 않는다.
export const conditionSchema = z.enum([
  'NEW',
  'LIKE_NEW',
  'LIGHTLY_USED',
  'USED',
  'UNSPECIFIED',
  'UNKNOWN',
]);
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
