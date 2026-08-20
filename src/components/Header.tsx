import { Link, NavLink } from 'react-router';

import logo from '@/assets/image/face.png';
import { ROUTES } from '@/app/routes';
import { ProfileMenu } from '@/components/ProfileMenu';
import { useSession } from '@/hooks/useSession';

const NAV_ITEMS = [
  { to: ROUTES.home, label: '홈', end: true },
  { to: ROUTES.bestDeal, label: 'Best Deal', end: false },
  { to: ROUTES.howItWorks, label: '이용 방법', end: false },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'text-ds-body whitespace-nowrap transition-colors',
    isActive ? 'text-ds-text font-ds-semibold' : 'text-ds-text-subtle hover:text-ds-text',
  ].join(' ');

export function Header() {
  const { isLoggedIn } = useSession();

  return (
    <header className="font-ds border-ds-border bg-ds-surface sticky top-0 z-10 border-b">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
        <Link to={ROUTES.home} className="flex min-w-0 items-center gap-2">
          <img src={logo} alt="" aria-hidden className="size-7 shrink-0 object-contain" />
          <span className="text-ds-text text-ds-h-sm font-ds-bold truncate">고르밍</span>
        </Link>

        {/* 좁은 화면에서는 아래 줄로 내려간다. */}
        <nav className="hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="shrink-0">
          {isLoggedIn ? (
            <ProfileMenu />
          ) : (
            <Link
              to={ROUTES.login}
              className="bg-ds-brand hover:bg-ds-brand-hovered active:bg-ds-brand-pressed text-ds-text-inverse rounded-ds-sm text-ds-body font-ds-medium focus-visible:outline-ds-border-focused inline-flex h-8 items-center px-3 whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              로그인하기
            </Link>
          )}
        </div>
      </div>

      <nav className="border-ds-border flex items-center gap-6 overflow-x-auto border-t px-4 py-2 md:hidden">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
