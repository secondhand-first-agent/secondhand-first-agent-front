import { useSearchParams } from 'react-router';

/** TODO: AI 어시스턴트 + 매물 목록 화면. 지금은 라우팅과 검색어 전달만 확인합니다. */
export function SearchPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('q') ?? '';

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-xl font-bold text-gray-900">검색 결과</h1>
      <p className="mt-2 text-sm text-gray-500">
        검색어: <span className="font-medium text-gray-900">{keyword}</span>
      </p>
      <p className="mt-6 text-sm text-gray-400">이 화면은 아직 만들지 않았습니다.</p>
    </section>
  );
}
