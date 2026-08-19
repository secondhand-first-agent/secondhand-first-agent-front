import { Link } from 'react-router';

export function HomePage() {
  return (
    <section>
      <h1 className="text-2xl font-bold">중고 에이전트</h1>
      <p className="mt-2 text-gray-600">프론트 세팅 완료. 여기서부터 화면을 붙이면 됩니다.</p>
      <Link to="/products" className="mt-4 inline-block rounded bg-gray-900 px-4 py-2 text-sm text-white">
        매물 보러가기
      </Link>
    </section>
  );
}
