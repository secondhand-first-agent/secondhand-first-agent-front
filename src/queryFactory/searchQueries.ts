import { queryOptions } from '@tanstack/react-query';

import { fetchSearchSession } from '@/api/searches/search.api';
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
   * 서버에서 다시 가져올 수 없다 — 목록을 주는 API 는 `POST /search-sessions` 하나뿐이라
   * 검색을 만든 뮤테이션이 캐시에 심어 둔 값만 읽는다. 그래서 `enabled: false` 로 두고
   * 절대 fetch 하지 않는다. 새로고침 등으로 캐시가 비면 `data` 가 `undefined` 이고,
   * 화면은 그때 "다시 검색해달라"고 안내한다.
   */
  recommendations: (sessionId: string) =>
    queryOptions({
      queryKey: searchQueryKeys.recommendations(sessionId),
      queryFn: (): Promise<SearchRecommendation[]> => {
        throw new Error('검색 결과를 다시 불러오는 API 가 없습니다.');
      },
      enabled: false,
      staleTime: Infinity,
      gcTime: Infinity,
    }),
};
