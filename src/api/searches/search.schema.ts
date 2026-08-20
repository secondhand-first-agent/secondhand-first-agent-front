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
  recommendations: z.array(
    z.object({
      productId: z.string(),
      rank: z.number().int().positive(),
      platform: platformSchema,
      title: z.string(),
      price: z.number().int().nonnegative(),
      imageUrl: z.string().url().nullable(),
      recommendationScore: z.number().min(0).max(100).nullable(),
      recommendationReason: z.string(),
      carbonSaving: z.object({
        status: z.string(),
        co2eKg: z.number().nonnegative().nullable(),
        source: z.string().nullable(),
        reason: z.string().nullable(),
      }),
    })
  ),
});

export type Platform = z.infer<typeof platformSchema>;
export type Condition = z.infer<typeof conditionSchema>;
export type SearchSession = z.infer<typeof searchSessionSchema>;
export type SearchRecommendation = SearchSession['recommendations'][number];
