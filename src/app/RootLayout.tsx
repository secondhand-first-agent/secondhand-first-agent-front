import { Link, Outlet } from 'react-router';

import { ROUTES } from './routes';

export function RootLayout() {
  return (
    <div className="min-h-dvh bg-white">
      <header className="border-b border-gray-200">
        <nav className="mx-auto flex h-14 max-w-5xl items-center gap-5 px-4">
          <Link to={ROUTES.home} className="font-semibold text-gray-900">
            중고 에이전트
          </Link>
          <Link to={ROUTES.products} className="text-sm text-gray-600 hover:text-gray-900">
            매물
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <Link to={ROUTES.login} className="text-sm text-gray-600 hover:text-gray-900">
              로그인
            </Link>
            <Link
              to={ROUTES.signup}
              className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700"
            >
              회원가입
            </Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
