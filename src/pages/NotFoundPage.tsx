import { Link } from 'react-router';

import { ROUTES } from '@/app/routes';

export function NotFoundPage() {
  return (
    <section className="font-ds mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-ds-text text-ds-h-md font-ds-bold">페이지를 찾을 수 없습니다</h1>
      <Link
        to={ROUTES.home}
        className="text-ds-brand-text hover:text-ds-brand-pressed text-ds-body mt-4 inline-block underline underline-offset-4"
      >
        홈으로
      </Link>
    </section>
  );
}
