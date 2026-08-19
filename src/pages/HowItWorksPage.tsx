import { ArrowRight, Check, ExternalLink, MessageCircle, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Link } from 'react-router';

import { ROUTES } from '@/app/routes';

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

export function HowItWorksPage() {
  return (
    <div>
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-5xl px-4 pt-14 pb-16 text-center sm:pt-20 sm:pb-20">
          <p className="text-brand text-xs font-semibold tracking-[0.18em] uppercase">How it works</p>
          <h1 className="mt-4 text-3xl leading-tight font-bold tracking-tight text-gray-900 sm:text-5xl sm:leading-tight">
            새것을 사기 전에,
            <br />
            <span className="text-brand">중고 시장부터</span> 확인해 보세요
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
            여러 플랫폼을 일일이 찾아보지 않아도 괜찮아요.
            <br className="hidden sm:block" />
            원하는 조건을 말하면 가장 좋은 선택지를 함께 찾아드릴게요.
          </p>

          <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center gap-3 sm:flex-row sm:items-start sm:gap-0">
            {STEPS.map(({ number, icon: Icon, title }, index) => (
              <div key={number} className="flex w-full items-center sm:flex-1">
                <div className="flex min-w-0 flex-1 flex-col items-center">
                  <span className="bg-brand/10 text-brand flex size-12 items-center justify-center rounded-2xl">
                    <Icon className="size-5" strokeWidth={1.8} aria-hidden />
                  </span>
                  <span className="mt-3 text-xs font-medium text-gray-400">{number}</span>
                  <span className="mt-1 text-sm font-semibold text-gray-900">{title}</span>
                </div>
                {index < STEPS.length - 1 ? (
                  <ArrowRight className="hidden size-4 shrink-0 text-gray-300 sm:block" aria-hidden />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20" aria-labelledby="steps-heading">
        <div className="text-center">
          <p className="text-brand text-sm font-semibold">이렇게 이용해 보세요</p>
          <h2 id="steps-heading" className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            복잡한 검색은 AI에게 맡기고
            <br className="sm:hidden" /> 결과만 비교하세요
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {STEPS.map(({ number, icon: Icon, title, description, example }) => (
            <article key={number} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-300">{number}</span>
                <span className="bg-brand/10 text-brand flex size-10 items-center justify-center rounded-xl">
                  <Icon className="size-5" strokeWidth={1.8} aria-hidden />
                </span>
              </div>
              <h3 className="mt-7 text-lg font-bold text-gray-900">{title}</h3>
              <p className="mt-3 min-h-20 text-sm leading-6 text-gray-500">{description}</p>
              <div className="mt-6 rounded-xl bg-gray-50 px-4 py-3.5 text-xs leading-5 text-gray-600">
                <span className="text-brand mr-1.5 font-semibold">예시</span>
                {example}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-gray-900" aria-labelledby="conversation-heading">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-emerald-400">대화하듯 검색하세요</p>
            <h2
              id="conversation-heading"
              className="mt-3 text-2xl leading-tight font-bold tracking-tight text-white sm:text-3xl"
            >
              검색어를 잘 써야 한다는
              <br />
              부담은 내려놓으세요
            </h2>
            <p className="mt-5 text-sm leading-7 text-gray-400">
              원하는 물건과 조건을 평소 말투로 적어 주세요. 결과를 받은 뒤에는 더 좋은 조건이 있는지 이어서 물어볼 수
              있어요.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-2xl sm:p-5">
            <div className="flex items-center gap-2 border-b border-gray-100 px-2 pb-4">
              <span className="bg-brand flex size-8 items-center justify-center rounded-full text-white">
                <Sparkles className="size-4" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Secondhand First</p>
                <p className="text-xs text-gray-400">중고 딜 어시스턴트</p>
              </div>
            </div>

            <div className="space-y-3 px-2 py-5">
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-gray-100 px-4 py-3 text-sm leading-6 text-gray-700">
                30만원으로 에어팟 프로 사고 싶어. 중고 괜찮아.
              </div>
              <div className="max-w-[92%] rounded-2xl rounded-tl-sm bg-emerald-50 px-4 py-3.5 text-sm leading-6 text-gray-700">
                <p>예산에 맞는 매물 3개를 찾았어요.</p>
                <div className="mt-3 space-y-2">
                  {[
                    '에어팟 프로 2세대 · 185,000원',
                    '에어팟 프로 2 USB-C · 230,000원',
                    '에어팟 프로 2 미개봉 · 295,000원',
                  ].map((item, index) => (
                    <div key={item} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2.5 text-xs">
                      <span className="bg-brand flex size-4 shrink-0 items-center justify-center rounded-full text-white">
                        <Check className="size-2.5" strokeWidth={3} aria-hidden />
                      </span>
                      <span className="text-gray-700">{item}</span>
                      {index === 0 ? <span className="text-brand ml-auto shrink-0 font-semibold">추천</span> : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-xs text-gray-400">
              <Search className="size-3.5" aria-hidden />
              <span>궁금한 조건을 더 물어보세요</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:py-20" aria-labelledby="tips-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-brand text-sm font-semibold">더 좋은 결과를 위한 팁</p>
            <h2 id="tips-heading" className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
              이런 정보를 함께 알려주면 좋아요
            </h2>
          </div>
          <p className="text-sm text-gray-400">처음부터 완벽하게 적지 않아도 괜찮아요.</p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {TIPS.map(({ title, description }) => (
            <article key={title} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="bg-brand/10 text-brand flex size-7 items-center justify-center rounded-full">
                <Check className="size-4" strokeWidth={2.5} aria-hidden />
              </div>
              <h3 className="mt-4 text-sm font-bold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 pb-16 sm:pb-20">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 rounded-2xl bg-emerald-50 px-6 py-8 sm:flex-row sm:items-center sm:px-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">찾고 있던 물건, 지금 물어보세요</h2>
            <p className="mt-2 text-sm text-gray-500">새것을 사기 전, 중고 시장에서 더 좋은 딜을 찾아볼 수 있어요.</p>
          </div>
          <Link
            to={ROUTES.home}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gray-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700"
          >
            검색 시작하기
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>
    </div>
  );
}
