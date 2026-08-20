import { z } from 'zod';

export const authUserSchema = z.object({
  id: z.coerce.string(),
  name: z.string(),
  email: z.email(),
  profileImageUrl: z.string().nullable().optional(),
});

export const loginResponseSchema = z.object({
  accessToken: z.string(),
  tokenType: z.string().optional(),
  expiresIn: z.number().optional(),
  user: authUserSchema,
});

const email = z.email('올바른 이메일 형식이 아닙니다').max(254);
const name = z.string().trim().min(1, '이름을 입력해주세요').max(20, '이름은 20자를 넘을 수 없습니다');

export const PASSWORD_RULES = [
  { label: '8자 이상', message: '비밀번호는 8자 이상이어야 합니다', test: (v: string) => v.length >= 8 },
  { label: '영문자 포함', message: '영문자를 포함해야 합니다', test: (v: string) => /[A-Za-z]/.test(v) },
  { label: '숫자 포함', message: '숫자를 포함해야 합니다', test: (v: string) => /[0-9]/.test(v) },
] as const;

const password = z
  .string()
  .max(64, '비밀번호는 64자를 넘을 수 없습니다')
  .superRefine((value, ctx) => {
    const broken = PASSWORD_RULES.find((rule) => !rule.test(value));
    if (broken) ctx.addIssue({ code: 'custom', message: broken.message });
  });

export const signupFormSchema = z
  .object({
    name,
    email,
    password,
    passwordConfirm: z.string(),
    termsAgreed: z.boolean(),
  })
  .refine((values) => values.password === values.passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 일치하지 않습니다',
  })
  .refine((values) => values.termsAgreed, {
    path: ['termsAgreed'],
    message: '이용약관과 개인정보 처리방침에 동의해주세요',
  });

export const loginFormSchema = z.object({
  email,
  password: z.string().min(1, '비밀번호를 입력해주세요'),
  rememberMe: z.boolean(),
});

export const signupRequestSchema = z.object({
  name,
  email,
  password,
  termsAgreed: z.boolean(),
  profileImageUrl: z.string().nullable().optional(),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, '현재 비밀번호를 입력해주세요'),
    newPassword: password,
    newPasswordConfirm: z.string(),
  })
  .refine((values) => values.newPassword === values.newPasswordConfirm, {
    path: ['newPasswordConfirm'],
    message: '비밀번호가 일치하지 않습니다',
  })
  .refine((values) => values.currentPassword !== values.newPassword, {
    path: ['newPassword'],
    message: '새 비밀번호는 현재 비밀번호와 달라야 합니다',
  });

export type AuthUser = z.infer<typeof authUserSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type SignupFormValues = z.infer<typeof signupFormSchema>;
export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type SignupRequest = z.infer<typeof signupRequestSchema>;
export type LoginRequest = LoginFormValues;
export type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;
export type PasswordChangeRequest = Pick<PasswordChangeFormValues, 'currentPassword' | 'newPassword'>;
