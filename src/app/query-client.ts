import { QueryClient } from '@tanstack/react-query';
import { HTTPError } from 'ky';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 중고 매물처럼 자주 바뀌는 데이터라도 1분 정도는 재요청하지 않습니다.
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // 4xx 는 재시도해도 결과가 같습니다.
        if (error instanceof HTTPError && error.response.status < 500) return false;
        return failureCount < 2;
      },
    },
    mutations: {
      retry: 0,
    },
  },
});
