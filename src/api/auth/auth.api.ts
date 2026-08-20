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
