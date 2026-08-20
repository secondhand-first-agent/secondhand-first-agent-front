import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';
import { unwrap } from '../response';

import {
  searchSessionDetailSchema,
  searchSessionSchema,
  type SearchSession,
  type SearchSessionDetail,
} from './search.schema';

/**
 * 검색 세션을 만든다. 백엔드가 AI 서버를 부르고 결과까지 저장한 뒤 돌려주므로
 * 응답까지 수 초가 걸린다.
 *
 * 상품 목록(`recommendations`)은 이 응답에만 실려 온다. 다시 조회하는 API 가
 * 백엔드에 없어서, 놓치면 같은 세션의 결과를 되살릴 수 없다.
 */
export async function createSearchSession(query: string): Promise<SearchSession> {
  const { data } = await apiClient.post(ENDPOINTS.searches.sessions, { query });
  return unwrap(searchSessionSchema, data);
}

/** 세션의 원문 질문·해석된 조건·대화 메시지를 가져온다. 상품 목록은 오지 않는다. */
export async function fetchSearchSession(sessionId: string): Promise<SearchSessionDetail> {
  const { data } = await apiClient.get(ENDPOINTS.searches.session(sessionId));
  return unwrap(searchSessionDetailSchema, data);
}
