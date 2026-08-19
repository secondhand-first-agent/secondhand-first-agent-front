import { ArrowRight, Headphones, Laptop, Smartphone, Watch, Zap } from 'lucide-react';
import { useNavigate } from 'react-router';
import type { FormEvent } from 'react';

import { ROUTES } from '@/app/routes';

const SUGGESTIONS = [
  { icon: Headphones, label: '에어팟 프로2' },
  { icon: Laptop, label: '맥북 에어 M2' },
  { icon: Smartphone, label: '아이폰 15' },
  { icon: Watch, label: '애플워치' },
];

export function HomePage() {
  const navigate = useNavigate();

  const search = (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;
    navigate(`${ROUTES.search}?q=${encodeURIComponent(trimmed)}`);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem('keyword') as HTMLInputElement;
    search(input.value);
  };

  return (
    <section className="mx-auto max-w-3xl px-4 pt-20 pb-28 text-center">
      <h1 className="text-4xl leading-tight font-bold tracking-tight text-gray-900 sm:text-5xl sm:leading-tight">
        새것을 사기 전에,
        <br />
        <span className="text-brand">중고 시장부터</span> 물어보세요
      </h1>

      <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-gray-500">
        당근, 번개장터, 중고나라를 일일이 뒤질 필요 없어요. 원하는 조건을 말하면 AI가 최적의 딜을 찾아 이유와 함께
        추천해드려요.
      </p>

      <form onSubmit={onSubmit} className="mt-10">
        <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white p-2 shadow-sm focus-within:border-gray-400">
          <span className="bg-brand flex size-10 shrink-0 items-center justify-center rounded-full text-white">
            <Zap className="size-4.5" aria-hidden />
          </span>
          <input
            name="keyword"
            type="text"
            aria-label="찾고 싶은 물건"
            placeholder="예: 30만원으로 에어팟 사고 싶어, 중고 괜찮아"
            className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />
          <button
            type="submit"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700"
          >
            찾아줘
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </form>

      <ul className="mt-5 flex flex-wrap justify-center gap-2">
        {SUGGESTIONS.map(({ icon: Icon, label }) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => search(label)}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-900"
            >
              <Icon className="size-3.5" aria-hidden />
              {label}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
