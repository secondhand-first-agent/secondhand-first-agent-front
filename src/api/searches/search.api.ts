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
 * 상품 목록(`recommendations`)이 실려 오지만, 여기서만 받을 수 있는 것은 아니다.
 * 같은 목록을 `fetchSearchResults` 로 다시 받을 수 있다.
 */
export async function createSearchSession(query: string): Promise<SearchSession> {
  const { data } = await apiClient.post(ENDPOINTS.searches.sessions, { query });
  return unwrap(searchSessionSchema, data);
}

/**
 * 세션에 저장된 추천 상품 목록을 다시 받아온다.
 *
 * `POST /search-sessions` 와 **같은 모양**이라 스키마를 그대로 쓴다. 새로고침·뒤로가기·
 * 최근 검색 재진입처럼 뮤테이션 캐시가 비어 있는 경로에서 목록을 되살리는 길이다.
 */
export async function fetchSearchResults(sessionId: string): Promise<SearchSession> {
  const { data } = await apiClient.get(ENDPOINTS.searches.results(sessionId));
  return unwrap(searchSessionSchema, data);
}

/** 세션의 원문 질문·해석된 조건·대화 메시지를 가져온다. 상품 목록은 오지 않는다. */
export async function fetchSearchSession(sessionId: string): Promise<SearchSessionDetail> {
  const { data } = await apiClient.get(ENDPOINTS.searches.session(sessionId));
  return unwrap(searchSessionDetailSchema, data);
}
