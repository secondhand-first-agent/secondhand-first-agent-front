import ky, { HTTPError } from 'ky';

/**
 * 모든 API 호출은 이 인스턴스를 통합니다.
 * 토큰 주입 / 에러 정규화를 여기 한 곳에만 둡니다.
 */
export const http = ky.create({
  // dev 는 Vite 프록시(/api)를 태우고, 테스트/배포에서는 env 로 절대 URL 을 넣습니다.
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api/',
  timeout: 10_000,
  retry: { limit: 1, methods: ['get'] },
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = localStorage.getItem('accessToken');
        if (token) request.headers.set('Authorization', `Bearer ${token}`);
      },
    ],
    beforeError: [
      ({ error }) => {
        // 서버가 내려주는 message 를 그대로 화면에서 쓸 수 있게 바꿔둡니다.
        if (error instanceof HTTPError) {
          const body = error.data as { message?: string } | undefined;
          if (body?.message) error.message = body.message;
        }
        return error;
      },
    ],
  },
});
