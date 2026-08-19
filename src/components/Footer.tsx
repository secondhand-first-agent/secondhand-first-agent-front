import { Link } from 'react-router';

import { ROUTES } from '@/app/routes';

const LINKS = [
  { to: ROUTES.bestDeal, label: 'Best Deal' },
  { to: ROUTES.howItWorks, label: '이용 방법' },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-gray-900">Secondhand First</p>
          <p className="mt-1 text-xs text-gray-500">중고 매물을 먼저 찾아보는 가장 빠른 방법</p>
        </div>

        <nav className="flex items-center gap-5">
          {LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="text-xs text-gray-500 transition-colors hover:text-gray-900">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-gray-100">
        <p className="mx-auto max-w-5xl px-4 py-4 text-xs text-gray-400">
          © {new Date().getFullYear()} Secondhand First
        </p>
      </div>
    </footer>
  );
}
