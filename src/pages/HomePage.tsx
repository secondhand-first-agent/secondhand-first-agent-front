import { ArrowRight, Headphones, Laptop, Search, Smartphone, Watch } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';

import { ROUTES } from '@/app/routes';

const SUGGESTIONS = [
  { icon: Headphones, label: '에어팟 프로2' },
  { icon: Laptop, label: '맥북 에어 M2' },
  { icon: Smartphone, label: '아이폰 15' },
  { icon: Watch, label: '애플워치' },
];

/** 헤드라인에서 순환할 키워드. */
const ROTATING_KEYWORDS = ['에어팟', '닌텐도 스위치', '맥북', '아이폰 15', '다이슨 청소기', '캠핑 의자'];

const ROTATION_INTERVAL_MS = 2400;

/**
 * 목적격 조사를 고른다. 한글은 받침 유무로, 숫자는 읽었을 때의 받침으로 판단한다.
 * 예) '에어팟' → 을, '스위치' → 를, '아이폰 15' → 오 → 를
 */
function objectParticle(word: string) {
  const last = word.trimEnd().slice(-1);
  const code = last.charCodeAt(0);

  // 한글 음절: (코드 - 가) % 28 이 0이면 받침이 없다.
  if (code >= 0xac00 && code <= 0xd7a3) {
    return (code - 0xac00) % 28 === 0 ? '를' : '을';
  }
  // 0 영, 1 일, 3 삼, 6 육, 7 칠, 8 팔 은 받침이 있다.
  if (last >= '0' && last <= '9') {
    return '013678'.includes(last) ? '을' : '를';
  }
  return '를';
}

const ROTATING_PHRASES = ROTATING_KEYWORDS.map((keyword) => `${keyword}${objectParticle(keyword)}`);

export function HomePage() {
  const navigate = useNavigate();
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () => setPhraseIndex((current) => (current + 1) % ROTATING_PHRASES.length),
      ROTATION_INTERVAL_MS
    );
    return () => window.clearInterval(timer);
  }, []);

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
    <section className="font-ds bg-ds-surface-sunken">
      <div className="mx-auto max-w-2xl px-4 pt-20 pb-28 text-center">
        <h1 className="text-ds-text text-ds-h-2xl font-ds-bold">
          Secondhand First에서
          <br />
          <span className="inline-grid text-center align-bottom">
            {/* 가장 긴 문구로 폭을 잡아두어, 키워드가 바뀔 때 뒷문장이 밀리지 않게 한다. */}
            {ROTATING_PHRASES.map((phrase) => (
              <span key={phrase} aria-hidden className="invisible col-start-1 row-start-1 whitespace-nowrap">
                {phrase}
              </span>
            ))}
            <span
              key={phraseIndex}
              className="animate-ds-swap-in text-ds-brand col-start-1 row-start-1 whitespace-nowrap"
            >
              {ROTATING_PHRASES[phraseIndex]}
            </span>
          </span>{' '}
          찾고 계신가요?
        </h1>

        <p className="text-ds-text-subtle text-ds-body-lg mx-auto mt-3 max-w-xl">
          당근, 번개장터, 중고나라를 일일이 뒤질 필요 없어요. 원하는 조건을 말하면 AI가 최적의 딜을 찾아 이유와 함께
          추천해드려요.
        </p>

        <form onSubmit={onSubmit} className="mt-8">
          <div className="border-ds-border-input bg-ds-surface rounded-ds-sm focus-within:border-ds-border-focused focus-within:ring-ds-border-focused flex items-center gap-2 border p-1 transition-colors focus-within:ring-1">
            <Search className="text-ds-text-subtlest ml-2 size-4 shrink-0" aria-hidden />
            <input
              name="keyword"
              type="text"
              aria-label="찾고 싶은 물건"
              placeholder="예: 30만원으로 에어팟 사고 싶어, 중고 괜찮아"
              className="text-ds-text placeholder:text-ds-text-subtlest text-ds-body min-w-0 flex-1 bg-transparent py-1.5 outline-none"
            />
            <button
              type="submit"
              className="bg-ds-brand hover:bg-ds-brand-hovered active:bg-ds-brand-pressed rounded-ds-sm text-ds-body font-ds-medium text-ds-text-inverse focus-visible:outline-ds-border-focused inline-flex h-8 shrink-0 items-center gap-1.5 px-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              찾아줘
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        </form>

        <ul className="mt-4 flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map(({ icon: Icon, label }) => (
            <li key={label}>
              <button
                type="button"
                onClick={() => search(label)}
                className="border-ds-border bg-ds-surface text-ds-text-subtle hover:bg-ds-surface-hovered hover:text-ds-text rounded-ds-sm text-ds-body font-ds-medium focus-visible:outline-ds-border-focused inline-flex h-8 items-center gap-1.5 border px-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <Icon className="size-3.5" aria-hidden />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
