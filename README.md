# secondhand-first-agent-front

React + TypeScript SPA. Vite / TanStack Query / Tailwind CSS.

## 시작하기

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

`VITE_API_BASE_URL`을 실행할 백엔드 주소로 맞추세요. 기본 로컬 주소는 `http://localhost:8080`입니다.

## 스크립트

| 명령             | 설명                     |
| ---------------- | ------------------------ |
| `pnpm dev`       | 개발 서버 (5173)         |
| `pnpm build`     | 타입체크 + 프로덕션 빌드 |
| `pnpm preview`   | 빌드 결과 미리보기       |
| `pnpm typecheck` | 타입 검사만              |
| `pnpm format`    | Prettier 적용            |

## 구조

```
src/
  api/          # API 레이어 전부
    apiClient.ts    # axios 인스턴스 + JWT 토큰 재발급 인터셉터
    session.ts      # accessToken / tokenType / userId (localStorage)
    endpoints.ts    # 서버 경로 상수
    response.ts     # { data } 봉투 해제 + 에러 메시지 정규화
    auth/           # 도메인별 요청 함수 + zod 스키마
    products/
  queryFactory.ts # 모든 queryKey 와 쿼리 정의
  hooks/        # 뮤테이션 훅 (useAuthMutations.ts 처럼 도메인별 파일)
  app/          # 앱 조립: 라우터, 경로 상수, 프로바이더, QueryClient, 레이아웃
  pages/        # 라우트가 직접 가리키는 화면
  features/     # 도메인 컴포넌트 (API · 훅 은 여기 두지 않습니다)
  components/   # 도메인 무관 공용 컴포넌트
```

`@/` 는 `src/` 별칭입니다.

### 규칙 몇 가지

- **API 호출 코드는 `src/api/` 에만** 둡니다. `features/` 에는 훅과 컴포넌트만 남깁니다.
- **쿼리와 queryKey 는 `src/queryFactory.ts` 에서만** 정의하고, **뮤테이션은 `src/hooks/` 에** 도메인별 파일로 둡니다. 화면에서 배열 리터럴을 직접 쓰지 않습니다.
  무효화는 `queryKeys`, 조회는 `queryFactory` 를 씁니다.
- **API 응답은 zod 로 파싱**한 뒤 반환합니다. 스키마가 어긋나면 화면이 아니라 API 계층에서 터집니다.
- **HTTP 는 `api/apiClient.ts` 만** 사용합니다. 토큰 주입과 401 재발급이 여기 모여 있습니다.
- **에러 메시지는 `getErrorMessage()`** 로 정규화해서 화면에 넘깁니다.
- **서버 상태는 TanStack Query, 클라이언트 상태는 zustand.** 섞지 않습니다.

## 인증

JWT 기반입니다. `apiClient` 가 요청마다 `Authorization: Bearer` 를 붙이고,
401 이 나면 `/auth/token/refresh` 로 액세스 토큰을 재발급받아 원래 요청을 한 번 재시도합니다.
동시에 여러 401 이 나도 재발급 요청은 하나로 묶입니다. 재발급까지 실패하면 세션을 지우고 `/login` 으로 보냅니다.

- 회원가입은 이메일 + 비밀번호만 받습니다. **이메일 인증번호 단계는 아직 없습니다.**
- 로그인 화면에 **"로그인 유지" 체크박스는 없습니다.** 다만 토큰이 localStorage 에 있어 새로고침해도 세션은 살아 있습니다.

## 알려진 제약

- `api/endpoints.ts` 에서 확정된 경로는 `/users/token/refresh` 뿐입니다. 가입/로그인 경로는 백엔드와 맞춰야 합니다.
- 응답 봉투를 `{ data: ... }` 로 가정하고 있습니다 (`api/response.ts`). 실제 응답에 `code` / `message` 등이 더 있어도 통과합니다.
