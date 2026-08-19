import { ArrowRight, Check, ExternalLink, MessageCircle, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Link } from 'react-router';

import { ROUTES } from '@/app/routes';
import { Reveal } from '@/components/Reveal';

const STEPS = [
  {
    number: '01',
    icon: MessageCircle,
    title: '원하는 조건을 말해요',
    description: '상품명만 적어도 괜찮아요. 예산, 상태, 용도처럼 생각나는 조건을 자연스럽게 덧붙여 주세요.',
    example: '“30만원으로 에어팟 사고 싶어”',
  },
  {
    number: '02',
    icon: SlidersHorizontal,
    title: '딱 맞는 매물을 비교해요',
    description: 'AI가 여러 중고 플랫폼의 매물을 살펴보고 가격, 상태, 거래 조건을 한눈에 비교해 드려요.',
    example: '가격 · 상태 · 판매자 정보 비교',
  },
  {
    number: '03',
    icon: ExternalLink,
    title: '마음에 드는 딜을 확인해요',
    description: '추천 이유를 확인한 뒤 원래 플랫폼으로 이동해 판매자에게 연락하고 거래를 시작하면 돼요.',
    example: '“이 매물을 추천한 이유가 뭐야?”',
  },
] as const;

const TIPS = [
  {
    title: '예산을 알려주세요',
    description: '“100만원 이하”, “조금 더 저렴하면 좋아”처럼 범위를 말해도 좋아요.',
  },
  {
    title: '상태를 구체적으로 말해요',
    description: '미개봉, 생활기스 없음, 배터리 90% 이상처럼 중요한 기준을 추가해 보세요.',
  },
  {
    title: '궁금한 점을 이어서 물어요',
    description: '추천 결과를 보고 가격이 괜찮은지, 어떤 점을 확인할지 다시 물어볼 수 있어요.',
  },
];

/**
 * 이용 방법 본문. 이용 방법 페이지와 홈이 같은 내용을 보여주므로 한 곳에서 관리한다.
 * 홈에서는 마지막 CTA가 자기 자신을 가리키게 되므로 withCallToAction 으로 끈다.
 */
export function HowItWorksSections({ withCallToAction = true }: { withCallToAction?: boolean }) {
  return (
    <>
      <section id="how-it-works" className="border-ds-border bg-ds-surface scroll-mt-14 border-b">
        <div className="mx-auto max-w-5xl px-4 pt-14 pb-16 text-center sm:pt-20 sm:pb-20">
          <Reveal>
            <p className="text-ds-brand text-ds-body-sm font-ds-semibold tracking-[0.18em] uppercase">How it works</p>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="text-ds-h-xl font-ds-bold text-ds-text sm:text-ds-h-2xl mt-4 leading-tight sm:leading-tight">
              새것을 사기 전에,
              <br />
              <span className="text-ds-brand">중고 시장부터</span> 확인해 보세요
            </h2>
          </Reveal>
          <Reveal delay={240}>
            <p className="text-ds-body text-ds-text-subtle sm:text-ds-body-lg mx-auto mt-5 max-w-xl leading-7">
              여러 플랫폼을 일일이 찾아보지 않아도 괜찮아요.
              <br className="hidden sm:block" />
              원하는 조건을 말하면 가장 좋은 선택지를 함께 찾아드릴게요.
            </p>
          </Reveal>

          <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center gap-3 sm:flex-row sm:items-start sm:gap-0">
            {STEPS.map(({ number, icon: Icon, title }, index) => (
              // 앞의 문구 다음에 단계가 하나씩 이어지도록 지연을 누적한다.
              <Reveal key={number} delay={360 + index * 120} className="flex w-full items-center sm:flex-1">
                <div className="flex min-w-0 flex-1 flex-col items-center">
                  <span className="bg-ds-brand-subtlest text-ds-brand rounded-ds-lg flex size-12 items-center justify-center">
                    <Icon className="size-5" strokeWidth={1.8} aria-hidden />
                  </span>
                  <span className="text-ds-body-sm font-ds-medium text-ds-text-subtlest mt-3">{number}</span>
                  <span className="text-ds-body font-ds-semibold text-ds-text mt-1">{title}</span>
                </div>
                {index < STEPS.length - 1 ? (
                  <ArrowRight className="text-ds-text-subtlest hidden size-4 shrink-0 sm:block" aria-hidden />
                ) : null}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20" aria-labelledby="steps-heading">
        <Reveal className="text-center">
          <p className="text-ds-brand text-ds-body font-ds-semibold">이렇게 이용해 보세요</p>
          <h2 id="steps-heading" className="text-ds-h-lg font-ds-bold text-ds-text sm:text-ds-h-xl mt-2 scroll-mt-24">
            복잡한 검색은 AI에게 맡기고
            <br className="sm:hidden" /> 결과만 비교하세요
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {STEPS.map(({ number, icon: Icon, title, description, example }, index) => (
            <Reveal key={number} delay={index * 120}>
              <article className="rounded-ds-lg border-ds-border bg-ds-surface shadow-ds-raised h-full border p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="text-ds-body font-ds-bold text-ds-text-subtlest">{number}</span>
                  <span className="bg-ds-brand-subtlest text-ds-brand rounded-ds-lg flex size-10 items-center justify-center">
                    <Icon className="size-5" strokeWidth={1.8} aria-hidden />
                  </span>
                </div>
                <h3 className="text-ds-h-sm font-ds-bold text-ds-text mt-7">{title}</h3>
                <p className="text-ds-body text-ds-text-subtle mt-3 min-h-20 leading-6">{description}</p>
                <div className="rounded-ds-lg bg-ds-surface-sunken text-ds-body-sm text-ds-text-subtle mt-6 px-4 py-3.5 leading-5">
                  <span className="text-ds-brand font-ds-semibold mr-1.5">예시</span>
                  {example}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-ds-neutral-bold" aria-labelledby="conversation-heading">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <Reveal>
            <p className="text-ds-body font-ds-semibold text-ds-success-border">대화하듯 검색하세요</p>
            <h2
              id="conversation-heading"
              className="text-ds-h-lg font-ds-bold text-ds-text-inverse sm:text-ds-h-xl mt-3 leading-tight"
            >
              검색어를 잘 써야 한다는
              <br />
              부담은 내려놓으세요
            </h2>
            <p className="text-ds-body text-ds-text-subtlest mt-5 leading-7">
              원하는 물건과 조건을 평소 말투로 적어 주세요. 결과를 받은 뒤에는 더 좋은 조건이 있는지 이어서 물어볼 수
              있어요.
            </p>
          </Reveal>

          <Reveal delay={150} className="rounded-ds-lg bg-ds-surface shadow-ds-overlay p-4 sm:p-5">
            <div className="border-ds-border flex items-center gap-2 border-b px-2 pb-4">
              <span className="bg-ds-brand text-ds-text-inverse flex size-8 items-center justify-center rounded-full">
                <Sparkles className="size-4" aria-hidden />
              </span>
              <div>
                <p className="text-ds-body font-ds-semibold text-ds-text">Secondhand First</p>
                <p className="text-ds-body-sm text-ds-text-subtlest">중고 딜 어시스턴트</p>
              </div>
            </div>

            <div className="space-y-3 px-2 py-5">
              <div className="rounded-ds-lg bg-ds-surface-hovered text-ds-body text-ds-text-subtle ml-auto max-w-[85%] rounded-tr-sm px-4 py-3 leading-6">
                30만원으로 에어팟 프로 사고 싶어. 중고 괜찮아.
              </div>
              <div className="rounded-ds-lg bg-ds-success-bg text-ds-body text-ds-text-subtle max-w-[92%] rounded-tl-sm px-4 py-3.5 leading-6">
                <p>예산에 맞는 매물 3개를 찾았어요.</p>
                <div className="mt-3 space-y-2">
                  {[
                    '에어팟 프로 2세대 · 185,000원',
                    '에어팟 프로 2 USB-C · 230,000원',
                    '에어팟 프로 2 미개봉 · 295,000원',
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="rounded-ds-md bg-ds-surface text-ds-body-sm flex items-center gap-2 px-3 py-2.5"
                    >
                      <span className="bg-ds-brand text-ds-text-inverse flex size-4 shrink-0 items-center justify-center rounded-full">
                        <Check className="size-2.5" strokeWidth={3} aria-hidden />
                      </span>
                      <span className="text-ds-text-subtle">{item}</span>
                      {index === 0 ? (
                        <span className="text-ds-brand font-ds-semibold ml-auto shrink-0">추천</span>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-ds-lg border-ds-border text-ds-body-sm text-ds-text-subtlest flex items-center gap-2 border px-3 py-2.5">
              <Search className="size-3.5" aria-hidden />
              <span>궁금한 조건을 더 물어보세요</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:py-20" aria-labelledby="tips-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-ds-brand text-ds-body font-ds-semibold">더 좋은 결과를 위한 팁</p>
            <h2 id="tips-heading" className="text-ds-h-lg font-ds-bold text-ds-text mt-2">
              이런 정보를 함께 알려주면 좋아요
            </h2>
          </div>
          <p className="text-ds-body text-ds-text-subtlest">처음부터 완벽하게 적지 않아도 괜찮아요.</p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {TIPS.map(({ title, description }, index) => (
            <Reveal key={title} delay={index * 120}>
              <article className="rounded-ds-lg border-ds-border bg-ds-surface h-full border p-5">
                <div className="bg-ds-brand-subtlest text-ds-brand flex size-7 items-center justify-center rounded-full">
                  <Check className="size-4" strokeWidth={2.5} aria-hidden />
                </div>
                <h3 className="text-ds-body font-ds-bold text-ds-text mt-4">{title}</h3>
                <p className="text-ds-body text-ds-text-subtle mt-2 leading-6">{description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {withCallToAction ? (
        <section className="px-4 pb-16 sm:pb-20">
          <div className="rounded-ds-lg bg-ds-success-bg mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 px-6 py-8 sm:flex-row sm:items-center sm:px-10">
            <div>
              <h2 className="text-ds-h-md font-ds-bold text-ds-text">찾고 있던 물건, 지금 물어보세요</h2>
              <p className="text-ds-body text-ds-text-subtle mt-2">
                새것을 사기 전, 중고 시장에서 더 좋은 딜을 찾아볼 수 있어요.
              </p>
            </div>
            <Link
              to={ROUTES.home}
              className="bg-ds-neutral-bold text-ds-body font-ds-medium text-ds-text-inverse hover:bg-ds-neutral-bold-hovered inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-3 transition-colors"
            >
              검색 시작하기
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </section>
      ) : null}
    </>
  );
}
