# secondhand-first-agent-front

React + TypeScript SPA. Vite / TanStack Query / Tailwind CSS.

## 시작하기

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

`.env.local` 의 `VITE_ENABLE_MSW=true` 면 백엔드 없이 MSW 목 데이터로 개발할 수 있습니다.
실서버를 붙이려면 이 값을 지우고 `vite.config.ts` 의 `server.proxy['/api'].target` 을 맞추세요.

## 스크립트

| 명령              | 설명                     |
| ----------------- | ------------------------ |
| `pnpm dev`        | 개발 서버 (5173)         |
| `pnpm build`      | 타입체크 + 프로덕션 빌드 |
| `pnpm preview`    | 빌드 결과 미리보기       |
| `pnpm typecheck`  | 타입 검사만              |
| `pnpm lint`       | oxlint                   |
| `pnpm format`     | Prettier 적용            |
| `pnpm test`       | Vitest 1회 실행          |
| `pnpm test:watch` | Vitest watch             |

## 구조

```
src/
  app/          # 앱 조립: 라우터, 프로바이더, QueryClient, 루트 레이아웃
  pages/        # 라우트가 직접 가리키는 화면
  features/     # 도메인 단위 슬라이스 (api / hooks / components)
  shared/       # 도메인 무관 공용 (api 클라이언트, ui, lib)
  mocks/        # MSW 핸들러 (브라우저 · 노드 공용)
  test/         # 테스트 셋업
```

`@/` 는 `src/` 별칭입니다.

### 규칙 몇 가지

- **서버 상태는 TanStack Query, 클라이언트 상태는 zustand.** 섞지 않습니다.
- **queryKey 는 항상 키 팩토리로** 만듭니다 (`features/*/hooks/*.queries.ts`). 문자열을 직접 쓰지 않습니다.
- **API 응답은 zod 로 파싱**한 뒤 반환합니다. 스키마가 어긋나면 화면이 아니라 API 계층에서 터집니다.
- **HTTP 호출은 `shared/api/http.ts` 의 ky 인스턴스만** 사용합니다. 토큰 주입과 에러 정규화가 여기 모여 있습니다.

## 알려진 제약

- 로컬 Node 가 20.20 이라 `jsdom` 을 26 으로 고정해 두었습니다. Node 22 LTS 로 올리면 `pnpm add -D jsdom@latest` 로 되돌릴 수 있습니다.
