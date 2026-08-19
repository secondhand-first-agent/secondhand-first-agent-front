import { AxiosError } from 'axios';
import { z } from 'zod';

const envelopeSchema = z.object({ data: z.unknown() });

export function unwrap<T>(schema: z.ZodType<T>, payload: unknown): T {
  const { data } = envelopeSchema.parse(payload);
  return schema.parse(data);
}

const FALLBACK_MESSAGE = '문제가 발생했습니다. 잠시 후 다시 시도해주세요.';

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const body = error.response?.data as { message?: string } | undefined;
    if (body?.message) return body.message;
    if (error.code === AxiosError.ECONNABORTED) return '요청 시간이 초과되었습니다.';
    if (!error.response) return '서버에 연결할 수 없습니다.';
    return FALLBACK_MESSAGE;
  }
  if (error instanceof z.ZodError) return '서버 응답 형식이 올바르지 않습니다.';
  if (error instanceof Error && error.message) return error.message;
  return FALLBACK_MESSAGE;
}
