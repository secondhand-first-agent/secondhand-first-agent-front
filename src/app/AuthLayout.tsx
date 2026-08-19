import { ArrowLeft } from 'lucide-react';
import { Link, Outlet } from 'react-router';

import { ROUTES } from './routes';

export function AuthLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <header className="border-b border-gray-200">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-4">
          <Link
            to={ROUTES.home}
            className="-ml-1.5 inline-flex items-center gap-1.5 rounded px-1.5 py-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="size-4" aria-hidden />
            홈으로
          </Link>
        </div>
      </header>
      {/* 세로 가운데 정렬을 쓰면 에러 문구가 늘어날 때마다 전체가 다시 가운데로 밀립니다.
          위에 고정해 두어야 제목이 제자리에 있습니다. */}
      <main className="mx-auto w-full max-w-sm flex-1 px-4 pt-16 pb-12">
        <Outlet />
      </main>
    </div>
  );
}
