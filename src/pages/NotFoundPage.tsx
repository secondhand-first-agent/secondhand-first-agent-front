import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <section>
      <h1 className="text-xl font-bold">페이지를 찾을 수 없습니다</h1>
      <Link to="/" className="mt-2 inline-block text-sm text-gray-600 underline">
        홈으로
      </Link>
    </section>
  );
}
