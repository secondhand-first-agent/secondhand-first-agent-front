import { Link } from 'react-router';

import { ROUTES } from '@/app/routes';

export function NotFoundPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-xl font-bold text-gray-900">페이지를 찾을 수 없습니다</h1>
      <Link to={ROUTES.home} className="mt-4 inline-block text-sm text-gray-600 underline underline-offset-4">
        홈으로
      </Link>
    </section>
  );
}
