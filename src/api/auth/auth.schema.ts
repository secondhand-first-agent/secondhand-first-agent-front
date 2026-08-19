import { z } from 'zod';

/** 서버가 내려주는 사용자. API 확정되면 필드만 맞추면 됩니다. */
export const authUserSchema = z.object({
  id: z.coerce.string(),
  email: z.email(),
});

/** 로그인 응답. apiClient 가 localStorage 에 넣는 세 값과 짝이 맞습니다. */
/** GET /users/me 응답 */
export const meSchema = z.object({
  id: z.coerce.string(),
  email: z.email(),
  nickname: z.string().nullable().optional(),
  profileImageUrl: z.string().nullable().optional(),
});

export const loginResponseSchema = z.object({
  accessToken: z.string(),
  tokenType: z.string().optional(),
  userId: z.coerce.string().optional(),
});

const email = z.email('올바른 이메일 형식이 아닙니다').max(254);
/**
 * 비밀번호 규칙. zod 검증과 회원가입 화면의 체크리스트가 이 배열 하나를 같이 봅니다.
 * 규칙을 바꾸려면 여기만 고치면 양쪽이 함께 따라옵니다.
 */
export const PASSWORD_RULES = [
  { label: '8자 이상', message: '비밀번호는 8자 이상이어야 합니다', test: (v: string) => v.length >= 8 },
  { label: '영문자 포함', message: '영문자를 포함해야 합니다', test: (v: string) => /[A-Za-z]/.test(v) },
  { label: '숫자 포함', message: '숫자를 포함해야 합니다', test: (v: string) => /[0-9]/.test(v) },
] as const;

const password = z
  .string()
  .max(64, '비밀번호는 64자를 넘을 수 없습니다')
  .superRefine((value, ctx) => {
    // 어긋난 규칙 중 첫 번째만 알려줍니다. 한꺼번에 쏟아내면 읽기 어렵습니다.
    const broken = PASSWORD_RULES.find((rule) => !rule.test(value));
    if (broken) ctx.addIssue({ code: 'custom', message: broken.message });
  });

/** 화면에서 쓰는 폼 스키마 (비밀번호 확인 포함) */
export const signupFormSchema = z
  .object({
    email,
    password,
    passwordConfirm: z.string(),
  })
  .refine((values) => values.password === values.passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 일치하지 않습니다',
  });

export const loginFormSchema = z.object({
  email,
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

/** 서버로 실제 보내는 값 (passwordConfirm 제외) */
export const signupRequestSchema = z.object({ email, password });

export type AuthUser = z.infer<typeof authUserSchema>;
export type Me = z.infer<typeof meSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type SignupFormValues = z.infer<typeof signupFormSchema>;
export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type SignupRequest = z.infer<typeof signupRequestSchema>;
