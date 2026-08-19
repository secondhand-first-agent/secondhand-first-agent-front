import { Recycle } from 'lucide-react';
import { Link, NavLink } from 'react-router';

import { ROUTES } from '@/app/routes';
import { ProfileMenu } from '@/components/ProfileMenu';
import { useSession } from '@/hooks/useSession';

const NAV_ITEMS = [
  { to: ROUTES.home, label: '홈', end: true },
  { to: ROUTES.bestDeal, label: 'Best Deal', end: false },
  { to: ROUTES.howItWorks, label: '이용 방법', end: false },
];

export function Header() {
  const { isLoggedIn } = useSession();

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4">
        <Link to={ROUTES.home} className="flex items-center gap-2 justify-self-start">
          <Recycle className="text-brand size-5" aria-hidden />
          <span className="text-base font-bold tracking-tight whitespace-nowrap text-gray-900">Secondhand First</span>
        </Link>

        <nav className="flex items-center gap-7">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  'text-sm whitespace-nowrap transition-colors',
                  isActive ? 'font-semibold text-gray-900' : 'text-gray-500 hover:text-gray-900',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="justify-self-end">
          {isLoggedIn ? (
            <ProfileMenu />
          ) : (
            <Link
              to={ROUTES.login}
              className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-gray-700"
            >
              로그인하기
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
