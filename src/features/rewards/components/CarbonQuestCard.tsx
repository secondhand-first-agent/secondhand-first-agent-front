import { Check, Info, Leaf } from 'lucide-react';

import { PURCHASE_REWARD_POINT, VIEW_REWARD_POINT } from '@/features/rewards/carbonQuest';
import { useCarbonQuest } from '@/hooks/useCarbonQuest';

function formatPoint(point: number) {
  return `${point.toLocaleString('ko-KR')}P`;
}

/** 목표 개수만큼 칸을 그려서, 오늘 몇 개를 채웠는지 한눈에 보이게 한다. */
function ProgressSteps({ viewed, goal }: { viewed: number; goal: number }) {
  return (
    <div className="mt-4 flex gap-1.5" role="img" aria-label={`${goal}개 중 ${viewed}개 조회함`}>
      {Array.from({ length: goal }, (_, index) => (
        <div
          key={index}
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            index < viewed ? 'bg-ds-success-bold' : 'bg-ds-neutral-hovered'
          }`}
        />
      ))}
    </div>
  );
}

export function CarbonQuestCard() {
  const { viewed, goal, completed } = useCarbonQuest();
  const remaining = Math.max(goal - viewed, 0);

  return (
    <section className="rounded-ds-lg border-ds-border bg-ds-surface border px-6 py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="bg-ds-success-bg text-ds-success-text flex size-9 shrink-0 items-center justify-center rounded-full">
            <Leaf className="size-4.5" aria-hidden />
          </span>
          <div>
            <h2 className="text-ds-body font-ds-semibold text-ds-text">탄소 절감 미션</h2>
            <p className="text-ds-body-sm text-ds-text-subtlest mt-0.5">매일 자정에 초기화돼요</p>
          </div>
        </div>

        <span
          className={`rounded-ds-sm text-ds-body font-ds-semibold shrink-0 px-2.5 py-1 ${
            completed ? 'bg-ds-success-bg text-ds-success-text' : 'bg-ds-neutral text-ds-text-subtle'
          }`}
        >
          오늘 {viewed}/{goal}
        </span>
      </div>

      <ProgressSteps viewed={viewed} goal={goal} />

      <p className="text-ds-body text-ds-text-subtle mt-3">
        {completed ? (
          <span className="text-ds-success-text font-ds-semibold inline-flex items-center gap-1.5">
            <Check className="size-4" strokeWidth={2.5} aria-hidden />
            오늘 미션을 다 채웠어요. {formatPoint(VIEW_REWARD_POINT)}를 받았어요.
          </span>
        ) : (
          <>
            탄소 절감 상품을 <strong className="text-ds-text font-ds-semibold">{remaining}개</strong> 더 보면{' '}
            <strong className="text-ds-text font-ds-semibold">{formatPoint(VIEW_REWARD_POINT)}</strong>를 받아요.
          </>
        )}
      </p>

      <div className="rounded-ds-md bg-ds-surface-sunken mt-4 flex gap-2.5 px-4 py-3.5">
        <Info className="text-ds-text-subtlest mt-0.5 size-4 shrink-0" aria-hidden />
        <div className="text-ds-body-sm text-ds-text-subtle space-y-1.5 leading-5">
          <p>
            하루에 3번 <strong className="font-ds-semibold">탄소 배출 절약 태그</strong>가 있는 상품을 조회하면 포인트
            일부를 드려요.
          </p>
          <p>
            추후 탄소 배출 절약 태그가 있는 상품을 실제로 구매했는지 인증하는 기능이 준비되면, 인증하실 때 남은
            포인트까지 <strong className="font-ds-semibold">전체 {formatPoint(PURCHASE_REWARD_POINT)}</strong>를 모두
            드릴 예정이에요.
          </p>
        </div>
      </div>
    </section>
  );
}
