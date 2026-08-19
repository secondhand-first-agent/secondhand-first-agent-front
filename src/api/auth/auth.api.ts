import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';
import { unwrap } from '../response';

import {
  authUserSchema,
  loginResponseSchema,
  type AuthUser,
  type LoginFormValues,
  type LoginResponse,
  type SignupRequest,
} from './auth.schema';

/** 이메일 인증번호 단계는 아직 없습니다. */
export async function signup(body: SignupRequest): Promise<AuthUser> {
  const { data } = await apiClient.post(ENDPOINTS.auth.signup, body);
  return unwrap(authUserSchema, data);
}

export async function login(body: LoginFormValues): Promise<LoginResponse> {
  const { data } = await apiClient.post(ENDPOINTS.auth.login, body);
  return unwrap(loginResponseSchema, data);
}
