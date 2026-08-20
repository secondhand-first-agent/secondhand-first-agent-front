import { z } from 'zod';

// 크롤러 통합 스키마와 동일하게 맞춘다.
// 정의 원본: data-analysis/docs/통합_스키마_정의.md
// 앞의 셋은 중고, ELEVENST는 새상품 비교 기준. 당근마켓은 수집 대상이 아니다.
export const platformSchema = z.enum(['BUNJANG', 'JOONGNA', 'NAVER_FLEAMARKET', 'ELEVENST']);

// UNSPECIFIED는 판매자가 상태를 안 적은 것, UNKNOWN은 우리가 해석하지 못한 것이다.
// 둘 다 "상태가 나쁘다"는 뜻이 아니므로 USED로 묶지 않는다.
export const conditionSchema = z.enum(['NEW', 'LIKE_NEW', 'LIGHTLY_USED', 'USED', 'UNSPECIFIED', 'UNKNOWN']);

/** 서버 `SearchPriority`. AI가 해석한 사용자의 우선순위다. */
export const searchPrioritySchema = z.enum(['BEST_VALUE', 'LOWEST_PRICE', 'BEST_CONDITION', 'NEAREST']);

/** 서버 `SearchSessionStatus`. */
export const searchSessionStatusSchema = z.enum(['PROCESSING', 'COMPLETED', 'FAILED']);

/**
 * 정렬 기준. 서버가 정렬해 주지 않아 화면에서 정렬한다.
 * 거리는 검색 응답에 없으므로 거리순은 두지 않는다.
 */
export const searchSortSchema = z.enum(['AI_RECOMMENDED', 'PRICE_ASC']);

export const parsedConditionsSchema = z.object({
  keyword: z.string(),
  maxPrice: z.number().int().nonnegative().nullable(),
  condition: z.array(conditionSchema),
  priority: searchPrioritySchema,
});

/** 서버 `CarbonSavingResult`. 값을 못 구하면 co2eKg 가 null 이고 reason 에 이유가 온다. */
export const carbonSavingSchema = z.object({
  status: z.enum(['AVAILABLE', 'NOT_AVAILABLE', 'NOT_APPLICABLE']),
  co2eKg: z.number().nullable(),
  source: z.string().nullable(),
  reason: z.string().nullable(),
});

/**
 * 서버 `SearchResultItemResponse`.
 *
 * 화면이 쓰고 싶어 하던 정가·절약액·상품상태·거리·거래방식·판매자 신뢰도는
 * 이 응답에 없다. 없는 값을 지어내지 않고 있는 것만 그린다.
 */
export const searchRecommendationSchema = z.object({
  // 서버가 저장 전 상품에 대해 null 을 줄 수 있다.
  productId: z.string().nullable(),
  rank: z.number().int().positive(),
  platform: platformSchema,
  title: z.string(),
  price: z.number().int().nonnegative(),
  imageUrl: z.string().nullable(),
  recommendationScore: z.number().nullable(),
  recommendationReason: z.string().nullable(),
  carbonSaving: carbonSavingSchema.nullable(),
});

/** `POST /search-sessions` 응답. 상품 목록은 이 응답에만 실려 온다. */
export const searchSessionSchema = z.object({
  sessionId: z.string(),
  status: searchSessionStatusSchema,
  parsedConditions: parsedConditionsSchema,
  assistantMessage: z.string(),
  resultCount: z.number().int().nonnegative(),
  recommendations: z.array(searchRecommendationSchema),
});

/**
 * `GET /search-sessions/{sessionId}` 응답.
 *
 * 메시지에 발신 주체(role)가 없다. 서버는 세션을 만들 때 AI 답변 하나만 저장하므로
 * 여기 오는 메시지는 모두 AI 쪽이고, 사용자 발화는 `originalQuery` 다.
 */
export const searchMessageSchema = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.iso.datetime({ offset: true }),
});

export const searchSessionDetailSchema = z.object({
  sessionId: z.string(),
  originalQuery: z.string(),
  parsedConditions: parsedConditionsSchema,
  messages: z.array(searchMessageSchema),
});

export type Platform = z.infer<typeof platformSchema>;
export type Condition = z.infer<typeof conditionSchema>;
export type SearchPriority = z.infer<typeof searchPrioritySchema>;
export type SearchSort = z.infer<typeof searchSortSchema>;
export type ParsedConditions = z.infer<typeof parsedConditionsSchema>;
export type CarbonSaving = z.infer<typeof carbonSavingSchema>;
export type SearchRecommendation = z.infer<typeof searchRecommendationSchema>;
export type SearchSession = z.infer<typeof searchSessionSchema>;
export type SearchMessage = z.infer<typeof searchMessageSchema>;
export type SearchSessionDetail = z.infer<typeof searchSessionDetailSchema>;
