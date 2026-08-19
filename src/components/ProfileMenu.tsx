import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { clearSession } from '@/api/session';
import { ROUTES } from '@/app/routes';
import { queryFactory } from '@/queryFactory';

const MENU_ITEMS = [
  { to: ROUTES.profile, label: '내 프로필' },
  { to: ROUTES.wishlist, label: '찜 목록' },
  { to: ROUTES.history, label: '이동 내역' },
  { to: ROUTES.settings, label: '설정' },
];

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { data: me } = useQuery(queryFactory.auth.me());

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const displayName = me?.nickname || me?.email?.split('@')[0] || '';
  const initial = displayName.charAt(0).toUpperCase();

  const onLogout = () => {
    setOpen(false);
    clearSession();
    navigate(ROUTES.home, { replace: true });
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="내 프로필 메뉴"
        className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-gray-900 text-sm font-medium text-white"
      >
        {me?.profileImageUrl ? <img src={me.profileImageUrl} alt="" className="size-full object-cover" /> : initial}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
        >
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="truncate text-sm font-semibold text-gray-900">{displayName}</p>
            <p className="mt-0.5 truncate text-xs text-gray-500">{me?.email}</p>
          </div>

          <div className="py-1">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-100 py-1">
            <button
              type="button"
              role="menuitem"
              onClick={onLogout}
              className="block w-full px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              로그아웃
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
