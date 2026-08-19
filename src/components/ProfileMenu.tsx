import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { clearSession } from '@/api/session';
import { Avatar } from '@/components/Avatar';
import { ROUTES } from '@/app/routes';
import { queryFactory } from '@/queryFactory';

const MENU_ITEMS = [
  { to: ROUTES.profile, label: '마이페이지' },
  { to: ROUTES.wishlist, label: '찜 목록' },
  { to: ROUTES.history, label: '이동 내역' },
  { to: ROUTES.settings, label: '설정' },
];

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { data: me } = useQuery(queryFactory.users.me());

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

  const displayName = me?.name || me?.email?.split('@')[0] || '';

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
        className="focus-visible:outline-ds-border-focused block rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <Avatar name={displayName} imageUrl={me?.profileImageUrl} />
      </button>

      {open ? (
        <div
          role="menu"
          className="font-ds border-ds-border bg-ds-surface shadow-ds-overlay rounded-ds-sm absolute right-0 z-20 mt-1 w-56 overflow-hidden border py-1"
        >
          <div className="border-ds-border border-b px-3 py-2.5">
            <p className="text-ds-text text-ds-body font-ds-semibold truncate">{displayName}</p>
            <p className="text-ds-text-subtle text-ds-body-sm mt-0.5 truncate">{me?.email}</p>
          </div>

          <div className="py-1">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="text-ds-text-subtle hover:bg-ds-neutral hover:text-ds-text text-ds-body block px-3 py-1.5 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="border-ds-border border-t py-1">
            <button
              type="button"
              role="menuitem"
              onClick={onLogout}
              className="text-ds-danger-text hover:bg-ds-danger-bg text-ds-body block w-full px-3 py-1.5 text-left transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
