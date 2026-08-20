import { ArrowLeft } from 'lucide-react';
import { Link, Outlet } from 'react-router';

import { ROUTES } from './routes';
import { ScrollToTop } from './ScrollToTop';

export function AuthLayout() {
  return (
    <div className="font-ds bg-ds-surface flex min-h-dvh flex-col">
      <ScrollToTop />
      <header className="border-ds-border border-b">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-4">
          <Link
            to={ROUTES.home}
            className="text-ds-text-subtle hover:bg-ds-neutral hover:text-ds-text rounded-ds-sm text-ds-body -ml-1.5 inline-flex items-center gap-1.5 px-1.5 py-1 transition-colors"
          >
            <ArrowLeft className="size-4" aria-hidden />
            홈으로
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-sm flex-1 px-4 pt-16 pb-12">
        <Outlet />
      </main>
    </div>
  );
}
