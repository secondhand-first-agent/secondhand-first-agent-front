import { ArrowRight, ChevronDown, Headphones, Laptop, LoaderCircle, Search, Smartphone, Watch } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';

import { getErrorMessage } from '@/api/response';
import { ROUTES } from '@/app/routes';
import { HowItWorksSections } from '@/features/howItWorks/components/HowItWorksSections';
import { useCreateSearchSessionMutation } from '@/hooks/useSearchMutations';
import { useSession } from '@/hooks/useSession';

const SUGGESTIONS = [
  { icon: Headphones, label: '에어팟 프로2' },
  { icon: Laptop, label: '맥북 에어 M2' },
  { icon: Smartphone, label: '아이폰 15' },
  { icon: Watch, label: '애플워치' },
];

/** 헤드라인에서 순환할 키워드. */
const ROTATING_KEYWORDS = ['에어팟', '닌텐도 스위치', '맥북', '아이폰 15', '다이슨 청소기', '캠핑 의자'];

const ROTATION_INTERVAL_MS = 10_000;

/** 히어로 높이의 이 비율을 넘겨야 다음 섹션으로 넘어간다. 못 넘기면 제자리로 돌아온다. */
const SNAP_THRESHOLD = 0.5;
/** 다음 섹션으로 넘어갈 때 / 제자리로 돌아올 때의 시간(ms). 돌아오는 쪽을 더 느리게 둔다. */
const SNAP_FORWARD_MS = 1100;
const SNAP_RETURN_MS = 1100;
/** 스크롤이 멎었다고 판단하기까지 기다리는 시간(ms). */
const SETTLE_DELAY_MS = 150;

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const easeOutCubic = (progress: number) => 1 - Math.pow(1 - progress, 3);

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
  const { isLoggedIn } = useSession();
  const createSearchSession = useCreateSearchSessionMutation();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [slotWidth, setSlotWidth] = useState<number>();

  // 문구 폭에 맞춰 자리를 잡아두고, 바뀔 때는 폭을 부드럽게 이어준다.
  // ResizeObserver 를 쓰면 웹폰트가 늦게 로드되거나 창 크기가 바뀌어도 다시 맞춰진다.
  useLayoutEffect(() => {
    const element = measureRef.current;
    if (!element) return;

    const update = () => setSlotWidth(element.getBoundingClientRect().width);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [phraseIndex]);

  /*
   * CSS scroll-snap 은 임계점도, 되돌아오는 속도도 지정할 수 없어서 직접 처리한다.
   * 스크롤이 멎으면 히어로를 얼마나 지나왔는지 보고 넘길지 되돌릴지 정한다.
   */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

    let settleTimer = 0;
    let animationFrame = 0;

    const cancelAnimation = () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    };

    const animateTo = (targetY: number, duration: number) => {
      cancelAnimation();
      const startY = window.scrollY;
      const distance = targetY - startY;
      if (Math.abs(distance) < 1) return;

      const startedAt = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        // html 의 smooth 동작이 겹치지 않도록 매 프레임 즉시 이동시킨다.
        window.scrollTo({ top: startY + distance * easeOutCubic(progress), behavior: 'instant' });
        animationFrame = progress < 1 ? window.requestAnimationFrame(step) : 0;
      };
      animationFrame = window.requestAnimationFrame(step);
    };

    const settle = () => {
      if (animationFrame) return;

      const boundary = hero.offsetTop + hero.offsetHeight;
      const scrolled = window.scrollY;
      // 히어로 구간을 벗어났으면 평범하게 스크롤되게 둔다.
      if (scrolled <= 0 || scrolled >= boundary) return;

      if (scrolled >= boundary * SNAP_THRESHOLD) animateTo(boundary, SNAP_FORWARD_MS);
      else animateTo(0, SNAP_RETURN_MS);
    };

    const onScroll = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, SETTLE_DELAY_MS);
    };

    // 사용자가 다시 스크롤을 시작하면 우리 애니메이션은 즉시 물러난다.
    const onUserInput = () => cancelAnimation();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onUserInput, { passive: true });
    window.addEventListener('touchstart', onUserInput, { passive: true });
    window.addEventListener('keydown', onUserInput);

    return () => {
      window.clearTimeout(settleTimer);
      cancelAnimation();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onUserInput);
      window.removeEventListener('touchstart', onUserInput);
      window.removeEventListener('keydown', onUserInput);
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(
      () => setPhraseIndex((current) => (current + 1) % ROTATING_PHRASES.length),
      ROTATION_INTERVAL_MS
    );
    return () => window.clearInterval(timer);
  }, []);

  /**
   * 검색 세션을 만들고 그 세션의 검색 화면으로 넘어간다.
   *
   * 백엔드가 AI 서버를 부르고 결과까지 저장한 뒤 응답하므로 여기서 수 초를 기다린다.
   * 세션 생성은 로그인이 필요해서, 비로그인 상태면 요청 대신 로그인으로 보낸다.
   */
  const search = (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed || createSearchSession.isPending) return;

    if (!isLoggedIn) {
      navigate(ROUTES.login);
      return;
    }

    createSearchSession.mutate(trimmed, {
      onSuccess: (session) => {
        navigate(`${ROUTES.search}?sessionId=${encodeURIComponent(session.sessionId)}`);
      },
    });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem('keyword') as HTMLInputElement;
    search(input.value);
  };

  return (
    <div className="font-ds">
      <section ref={heroRef} className="bg-ds-surface-sunken relative flex min-h-[calc(100dvh-3.5rem)] items-center">
        <div className="mx-auto w-full max-w-4xl px-4 pt-16 pb-28 text-center">
          <h1 className="text-ds-text text-ds-h-2xl font-ds-bold relative">
            고르밍에서{' '}
            <span
              className="relative -mb-1 inline-block overflow-hidden pb-1 align-bottom transition-[width] duration-300 ease-out motion-reduce:transition-none"
              style={slotWidth === undefined ? undefined : { width: slotWidth }}
            >
              <span key={phraseIndex} className="animate-ds-swap-in text-ds-brand block whitespace-nowrap">
                {ROTATING_PHRASES[phraseIndex]}
              </span>
            </span>{' '}
            찾고 계신가요?
            {/*
              폭 측정용. 슬롯 안에 두면 슬롯의 고정 폭에 갇힌 값이 측정되므로,
              흐름 밖(absolute)에 두어 문구의 실제 폭을 재게 한다.
            */}
            <span ref={measureRef} aria-hidden className="invisible absolute top-0 left-0 whitespace-nowrap">
              {ROTATING_PHRASES[phraseIndex]}
            </span>
          </h1>

          <p className="text-ds-text-subtle text-ds-body-lg mx-auto mt-3 max-w-xl">
            원하는 조건을 적어주세요. AI가 최적의 딜을 찾아 이유와 함께 추천해드려요.
          </p>

          <form onSubmit={onSubmit} className="mx-auto mt-10 max-w-3xl">
            <div className="border-ds-border-input bg-ds-surface rounded-ds-md focus-within:border-ds-border-focused focus-within:ring-ds-border-focused flex items-center gap-2.5 border p-1.5 transition-colors focus-within:ring-1">
              <Search className="text-ds-text-subtlest ml-2 size-5 shrink-0" aria-hidden />
              <input
                name="keyword"
                type="text"
                aria-label="찾고 싶은 물건"
                placeholder="예: 30만원으로 에어팟 사고 싶어, 중고 괜찮아"
                className="text-ds-text placeholder:text-ds-text-subtlest text-ds-body-lg min-w-0 flex-1 bg-transparent py-2 outline-none"
              />
              <button
                type="submit"
                aria-label="찾아줘"
                disabled={createSearchSession.isPending}
                className="bg-ds-brand hover:bg-ds-brand-hovered active:bg-ds-brand-pressed rounded-ds-sm text-ds-body-lg font-ds-medium text-ds-text-inverse focus-visible:outline-ds-border-focused disabled:bg-ds-neutral disabled:text-ds-text-disabled inline-flex h-10 shrink-0 items-center gap-1.5 px-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed sm:px-4"
              >
                {/* 좁은 화면에서는 입력 영역을 넓히기 위해 아이콘만 남긴다. */}
                <span className="hidden sm:inline">{createSearchSession.isPending ? '찾는 중' : '찾아줘'}</span>
                {createSearchSession.isPending ? (
                  <LoaderCircle className="size-4 animate-spin" aria-hidden />
                ) : (
                  <ArrowRight className="size-4" aria-hidden />
                )}
              </button>
            </div>

            <p aria-live="polite" className="text-ds-body mt-3 min-h-5">
              {createSearchSession.isPending ? (
                <span className="text-ds-text-subtle">
                  AI가 번개장터·중고나라·N플리마켓을 살펴보고 있어요. 잠시만 기다려주세요.
                </span>
              ) : null}
              {createSearchSession.isError ? (
                <span className="text-ds-danger-text">{getErrorMessage(createSearchSession.error)}</span>
              ) : null}
            </p>
          </form>

          <ul className="mt-5 flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map(({ icon: Icon, label }) => (
              <li key={label}>
                <button
                  type="button"
                  onClick={() => search(label)}
                  disabled={createSearchSession.isPending}
                  className="border-ds-border bg-ds-surface text-ds-text-subtle hover:bg-ds-surface-hovered hover:text-ds-text rounded-ds-sm text-ds-body font-ds-medium focus-visible:outline-ds-border-focused disabled:text-ds-text-disabled inline-flex h-9 items-center gap-1.5 border px-3.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed"
                >
                  <Icon className="size-3.5" aria-hidden />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <a
          href="#how-it-works"
          className="text-ds-text-subtle hover:text-ds-text focus-visible:outline-ds-border-focused rounded-ds-sm text-ds-body font-ds-medium absolute inset-x-0 bottom-6 mx-auto flex w-fit items-center gap-1.5 px-3 py-1.5 transition-colors focus-visible:outline-2"
        >
          이용 방법 보기
          <ChevronDown className="size-4" aria-hidden />
        </a>
      </section>

      <HowItWorksSections withCallToAction={false} />
    </div>
  );
}
