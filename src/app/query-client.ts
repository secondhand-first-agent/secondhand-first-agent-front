import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 중고 매물처럼 자주 바뀌는 데이터라도 1분 정도는 재요청하지 않습니다.
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // 4xx 는 재시도해도 결과가 같습니다. 401 은 apiClient 가 토큰 재발급으로 이미 처리합니다.
        const status = error instanceof AxiosError ? error.response?.status : undefined;
        if (status && status < 500) return false;
        return failureCount < 2;
      },
    },
    mutations: {
      retry: 0,
    },
  },
});
