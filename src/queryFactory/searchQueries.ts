import { queryOptions } from '@tanstack/react-query';

import { fetchSearchResults, fetchSearchSession } from '@/api/searches/search.api';
import type { SearchRecommendation } from '@/api/searches/search.schema';

export const searchQueryKeys = {
  all: ['searches'] as const,
  sessions: () => [...searchQueryKeys.all, 'session'] as const,
  session: (sessionId: string) => [...searchQueryKeys.sessions(), sessionId] as const,
  recommendations: (sessionId: string) => [...searchQueryKeys.session(sessionId), 'recommendations'] as const,
};

export const searchQueries = {
  session: (sessionId: string) =>
    queryOptions({
      queryKey: searchQueryKeys.session(sessionId),
      queryFn: () => fetchSearchSession(sessionId),
      enabled: sessionId.length > 0,
    }),

  /**
   * 세션의 추천 상품 목록.
   *
   * 검색을 만든 뮤테이션이 캐시에 심어 두지만, 그 캐시에만 기대지 않는다. 새로고침·
   * 뒤로가기·최근 검색 재진입에서는 캐시가 비어 있고, 그때도 목록은 그대로 있어야 한다.
   * 서버에 저장된 결과를 `GET /search-sessions/{sessionId}/results` 로 다시 받는다.
   *
   * 뮤테이션이 심어 둔 값이 있으면 `staleTime` 때문에 다시 부르지 않는다 — 방금 받은
   * 목록을 한 번 더 받아오는 낭비는 없다.
   */
  recommendations: (sessionId: string) =>
    queryOptions({
      queryKey: searchQueryKeys.recommendations(sessionId),
      queryFn: async (): Promise<SearchRecommendation[]> => {
        const { recommendations } = await fetchSearchResults(sessionId);
        return recommendations;
      },
      enabled: sessionId.length > 0,
      staleTime: Infinity,
      gcTime: Infinity,
    }),
};
