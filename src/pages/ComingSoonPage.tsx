export function ComingSoonPage({ title }: { title: string }) {
  return (
    <section className="font-ds mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-ds-text text-ds-h-md font-ds-bold">{title}</h1>
      <p className="text-ds-text-subtle text-ds-body mt-4">이 화면은 아직 만들지 않았습니다.</p>
    </section>
  );
}
