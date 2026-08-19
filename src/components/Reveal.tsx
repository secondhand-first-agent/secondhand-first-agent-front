import { useEffect, useRef, useState, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  /** 같은 묶음 안에서 순서대로 떠오르게 할 때 쓰는 지연(ms). */
  delay?: number;
  className?: string;
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/** 화면 아래쪽 이 지점까지 올라오면 나타난다. 바닥에 걸치자마자 뜨면 너무 이르다. */
const REVEAL_RATIO = 0.88;

/**
 * 화면에 들어올 때 살짝 떠오르며 나타난다. 한 번 나타나면 관찰을 끊어서,
 * 위로 다시 스크롤해도 사라졌다 나타나지 않는다.
 *
 * 감지는 IntersectionObserver 로 하되 스크롤 이벤트도 함께 듣는다.
 * 관찰자가 어떤 이유로든 콜백을 주지 않으면 내용이 영영 보이지 않게 되는데,
 * 그건 애니메이션이 없는 것보다 훨씬 나쁘기 때문이다.
 */
export function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // 모션을 줄이기로 한 사용자에게는 애니메이션 없이 바로 보여준다.
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
      setIsShown(true);
      return;
    }

    const hasReachedViewport = () => {
      const rect = element.getBoundingClientRect();
      return rect.top < window.innerHeight * REVEAL_RATIO && rect.bottom > 0;
    };

    // 이미 화면에 있으면 관찰할 것 없이 바로 보여준다.
    if (hasReachedViewport()) {
      setIsShown(true);
      return;
    }

    const onScroll = () => {
      if (hasReachedViewport()) setIsShown(true);
    };

    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(
            (entries) => {
              if (entries.some((entry) => entry.isIntersecting)) setIsShown(true);
            },
            { rootMargin: `0px 0px -${Math.round((1 - REVEAL_RATIO) * 100)}% 0px` }
          );

    observer?.observe(element);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      ref={elementRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-[opacity,translate] duration-700 ease-out motion-reduce:transition-none ${
        isShown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
}
