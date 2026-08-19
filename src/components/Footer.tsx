import { Link } from 'react-router';

import { ROUTES } from '@/app/routes';

const LINKS = [
  { to: ROUTES.bestDeal, label: 'Best Deal' },
  { to: ROUTES.howItWorks, label: '이용 방법' },
];

export function Footer() {
  return (
    <footer className="font-ds border-ds-border bg-ds-surface border-t">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-ds-text text-ds-body font-ds-bold">Secondhand First</p>
          <p className="text-ds-text-subtle text-ds-body-sm mt-1">중고 매물을 먼저 찾아보는 가장 빠른 방법</p>
        </div>

        <nav className="flex items-center gap-5">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-ds-text-subtle hover:text-ds-text text-ds-body-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-ds-border border-t">
        <p className="text-ds-text-subtlest text-ds-body-sm mx-auto max-w-5xl px-4 py-4">
          © {new Date().getFullYear()} Secondhand First
        </p>
      </div>
    </footer>
  );
}
