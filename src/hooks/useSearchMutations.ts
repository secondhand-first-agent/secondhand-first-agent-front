import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createSearchSession } from '@/api/searches/search.api';
import { queryKeys } from '@/queryFactory';

/**
 * 검색 세션을 만든다.
 *
 * 상품 목록은 이 응답에만 들어 있고 다시 조회할 방법이 없어서, 검색 화면이 읽을 수
 * 있도록 캐시에 심어 둔다. 대화·조건은 검색 화면이 세션 상세를 GET 해서 받는다.
 */
export function useCreateSearchSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSearchSession,
    onSuccess: (session) => {
      queryClient.setQueryData(queryKeys.searches.recommendations(session.sessionId), session.recommendations);
      // 방금 만든 세션이 마이페이지 최근 검색에도 나타나야 한다.
      void queryClient.invalidateQueries({ queryKey: queryKeys.users.recentSearches() });
    },
  });
}
