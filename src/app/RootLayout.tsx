import { Link, Outlet } from 'react-router';

export function RootLayout() {
  return (
    <div className="min-h-dvh">
      <header className="border-b border-gray-200">
        <nav className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3">
          <Link to="/" className="font-semibold">
            중고 에이전트
          </Link>
          <Link to="/products" className="text-sm text-gray-600 hover:text-gray-900">
            매물
          </Link>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
