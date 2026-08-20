import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';
import { unwrap } from '../response';

import {
  authUserSchema,
  loginResponseSchema,
  type AuthUser,
  type LoginRequest,
  type LoginResponse,
  type PasswordChangeRequest,
  type SignupRequest,
} from './auth.schema';

/**
 * 서버 DTO(`SignupRequest`)가 `marketingConsent` 를 원시 boolean 으로 받습니다.
 * 이 값이 본문에 없으면 역직렬화 단계에서 실패하므로 반드시 함께 보내야 합니다.
 *
 * 화면에서는 마케팅 수신 동의를 받지 않으므로 항상 `false` 입니다.
 * 서버가 이 필드를 선택값으로 바꾸면 여기도 지우면 됩니다.
 */
export async function signup(body: SignupRequest): Promise<AuthUser> {
  const { data } = await apiClient.post(ENDPOINTS.auth.signup, { ...body, marketingConsent: false });
  return unwrap(authUserSchema, data);
}

export async function login(body: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post(ENDPOINTS.auth.login, body);
  return unwrap(loginResponseSchema, data);
}

export async function logout(): Promise<void> {
  await apiClient.post(ENDPOINTS.auth.logout);
}

export async function changePassword(body: PasswordChangeRequest): Promise<void> {
  await apiClient.patch(ENDPOINTS.auth.password, body);
}
