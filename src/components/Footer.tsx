import { Link } from 'react-router';

import { ROUTES } from '@/app/routes';

const LINKS = [
  { to: ROUTES.bestDeal, label: 'Best Deal' },
  { to: ROUTES.howItWorks, label: '이용 방법' },
  { to: ROUTES.terms, label: '이용약관' },
  // 개인정보 처리방침은 관례상 다른 링크보다 강조해 표시한다.
  { to: ROUTES.privacy, label: '개인정보 처리방침', emphasized: true },
];

export function Footer() {
  return (
    <footer className="font-ds border-ds-border bg-ds-surface border-t">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-ds-text text-ds-body font-ds-bold">고르밍</p>
          <p className="text-ds-text-subtle text-ds-body-sm mt-1">중고 매물을 먼저 찾아보는 가장 빠른 방법</p>
        </div>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={[
                'text-ds-text-subtle hover:text-ds-text text-ds-body-sm transition-colors',
                link.emphasized ? 'font-ds-semibold' : '',
              ].join(' ')}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-ds-border border-t">
        <p className="text-ds-text-subtlest text-ds-body-sm mx-auto max-w-5xl px-4 py-4">
          © {new Date().getFullYear()} 고르밍
        </p>
      </div>
    </footer>
  );
}
