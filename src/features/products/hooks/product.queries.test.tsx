import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { expect, test } from 'vitest';

import { productListQuery } from './product.queries';

function wrapper({ children }: PropsWithChildren) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

test('매물 목록을 불러오고 스키마를 검증한다', async () => {
  const { result } = renderHook(() => useQuery(productListQuery()), { wrapper });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data?.items).toHaveLength(3);
  expect(result.current.data?.items[0]?.title).toContain('아이폰');
});
