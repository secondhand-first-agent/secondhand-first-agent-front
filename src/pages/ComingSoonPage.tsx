export function ComingSoonPage({ title }: { title: string }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      <p className="mt-6 text-sm text-gray-400">이 화면은 아직 만들지 않았습니다.</p>
    </section>
  );
}
