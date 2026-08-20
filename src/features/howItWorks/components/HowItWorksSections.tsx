import { ArrowRight, Check, ExternalLink, Headphones, MessageCircle, Send, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router';

import assistantAvatarUrl from '@/assets/image/cat-avatar.png';
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

/** 아래 미리보기에 쓰는 값들. 실제 검색 화면이 보여주는 것과 같은 형태로 맞춰 둔다. */
const PREVIEW_CONDITIONS = ['에어팟 프로', '30만원 이하', '중고 OK', '최고 가성비'];
const PREVIEW_QUESTIONS = ['미개봉만 보여줘', '더 저렴한 것도', '판교 근처만'];

/** 검색 화면과 같은 어시스턴트 아바타. 이미지에 원형 배경이 그려져 있어 원으로 잘라낸다. */
function AssistantAvatar({ small = false }: { small?: boolean }) {
  return (
    <img
      src={assistantAvatarUrl}
      alt=""
      className={`shrink-0 rounded-full object-cover ${small ? 'size-8' : 'size-10'}`}
    />
  );
}

/** 검색 화면의 조건 태그와 같은 모양. */
function PreviewTag({ children }: { children: string }) {
  return (
    <span className="border-ds-border bg-ds-surface text-ds-text-subtle rounded-ds-sm text-ds-body font-ds-medium inline-flex items-center border px-2 py-1">
      {children}
    </span>
  );
}

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

          {/* 실제 검색 화면의 어시스턴트 패널을 그대로 축소해 보여준다. */}
          <Reveal delay={150} className="rounded-ds-lg bg-ds-surface shadow-ds-overlay overflow-hidden">
            <div className="border-ds-border flex items-center gap-3 border-b px-4 py-4">
              <AssistantAvatar />
              <div>
                <p className="text-ds-text text-ds-h-sm font-ds-bold">AI 구매 어시스턴스 고르밍</p>
                <p className="text-ds-success-text text-ds-body-sm font-ds-medium mt-0.5 flex items-center gap-1.5">
                  <span className="bg-ds-success-border size-1.5 rounded-full" aria-hidden />
                  3개 플랫폼 실시간 탐색 중
                </p>
              </div>
            </div>

            <div className="space-y-4 px-4 py-5">
              <div className="flex justify-end">
                <div className="bg-ds-neutral-bold text-ds-text-inverse rounded-ds-lg text-ds-body max-w-[88%] px-3.5 py-2.5">
                  30만원으로 에어팟 프로 사고 싶어. 중고 괜찮아.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AssistantAvatar small />
                <div className="bg-ds-surface-hovered rounded-ds-lg min-w-0 flex-1 px-3.5 py-3">
                  <p className="text-ds-text text-ds-body font-ds-semibold">요청을 이렇게 이해했어요</p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {PREVIEW_CONDITIONS.map((condition) => (
                      <PreviewTag key={condition}>{condition}</PreviewTag>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AssistantAvatar small />
                <div className="bg-ds-surface-hovered text-ds-text text-ds-body rounded-ds-lg min-w-0 flex-1 px-3.5 py-3 leading-6">
                  <p>
                    당근·번개장터·중고나라에서 <strong className="font-ds-bold">3개</strong> 매물을 찾았어요. Apple 공식
                    정가(₩299,000) 대비 최대{' '}
                    <strong className="text-ds-success-text font-ds-bold">38% 저렴해요.</strong>
                  </p>
                  <div className="border-ds-border bg-ds-surface rounded-ds-md mt-3 flex items-center gap-3 border p-2.5">
                    <div className="bg-ds-surface-hovered rounded-ds-md flex size-14 shrink-0 items-center justify-center">
                      <Headphones className="text-ds-text-subtlest size-7" strokeWidth={1.2} aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <p className="text-ds-text text-ds-body font-ds-bold truncate">에어팟 프로 2세대</p>
                      <p className="text-ds-text-subtle text-ds-body-sm mt-0.5">당근마켓 · 거의 새것</p>
                    </div>
                    <span className="text-ds-text text-ds-body font-ds-bold ml-auto shrink-0">₩185,000</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pl-11">
                {PREVIEW_QUESTIONS.map((question) => (
                  <span
                    key={question}
                    className="border-ds-border text-ds-text-subtle rounded-ds-sm text-ds-body font-ds-medium inline-flex h-8 items-center border px-3"
                  >
                    {question}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-ds-border border-t p-3">
              <div className="border-ds-border-input rounded-ds-sm flex items-center gap-2 border p-1">
                <span className="text-ds-text-subtlest text-ds-body min-w-0 flex-1 px-2 py-1.5">
                  AI에게 더 물어보세요
                </span>
                <span className="bg-ds-brand text-ds-text-inverse rounded-ds-sm inline-flex size-8 shrink-0 items-center justify-center">
                  <Send className="size-4" aria-hidden />
                </span>
              </div>
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
