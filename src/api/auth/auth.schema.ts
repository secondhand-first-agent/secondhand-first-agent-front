import { z } from 'zod';

export const authUserSchema = z.object({
  id: z.coerce.string(),
  email: z.email(),
});

export const loginResponseSchema = z.object({
  accessToken: z.string(),
  tokenType: z.string().optional(),
  userId: z.coerce.string().optional(),
});

const email = z.email('올바른 이메일 형식이 아닙니다').max(254);
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

export const signupRequestSchema = z.object({
  email,
  password,
  profileImageUrl: z.string().nullable().optional(),
});

export type AuthUser = z.infer<typeof authUserSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type SignupFormValues = z.infer<typeof signupFormSchema>;
export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type SignupRequest = z.infer<typeof signupRequestSchema>;
