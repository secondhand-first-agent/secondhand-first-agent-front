/**
 * 중고로 사서 아낀 탄소량 추정.
 *
 * 중고 매물을 사면 새 제품을 한 대 더 만들지 않아도 되므로, 그 제품을 만들 때
 * 나오는 배출량(제조 단계 배출량)만큼을 아낀 것으로 봅니다.
 *
 * ⚠️ 아래 값은 제조사들이 공개하는 제품 환경 보고서의 대략적인 평균치입니다.
 *    같은 품목이라도 모델·용량·생산지에 따라 실제 값은 크게 달라지므로,
 *    화면에서는 반드시 "약"을 붙여 추정치임을 밝힙니다.
 *    서버가 품목별 정확한 값을 내려주게 되면 이 파일을 그 값으로 대체하면 됩니다.
 */

interface CarbonRule {
  /** 새로 만들 때 나오는 대략적인 배출량 (kg CO₂e). */
  kg: number;
  /** 제목에서 찾을 키워드. 모두 소문자로 적습니다. */
  keywords: string[];
}

/**
 * 위에서부터 먼저 걸리는 규칙이 이깁니다.
 * 배출량이 큰 품목을 앞에 두어, '아이패드 프로' 가 '프로' 같은 약한 단서로
 * 엉뚱한 품목에 걸리지 않게 합니다.
 */
const CARBON_RULES: CarbonRule[] = [
  { kg: 250, keywords: ['노트북', '맥북', '그램', 'macbook', 'laptop'] },
  { kg: 200, keywords: ['모니터', 'monitor'] },
  { kg: 100, keywords: ['아이패드', '태블릿', 'ipad', 'tablet'] },
  { kg: 90, keywords: ['닌텐도', '스위치', '플레이스테이션', 'ps5', 'xbox'] },
  { kg: 60, keywords: ['아이폰', 'iphone', '갤럭시 s', '갤럭시s', 'galaxy s'] },
  { kg: 35, keywords: ['워치', 'watch'] },
  { kg: 8, keywords: ['에어팟', '버즈', '이어폰', '헤드폰', 'airpods', 'buds', 'wf-', 'wh-'] },
];

/** 어느 규칙에도 걸리지 않는 전자기기의 평균값. */
const DEFAULT_CARBON_KG = 30;

export function estimateCarbonSavedKg(title: string): number {
  const normalized = title.toLowerCase();
  const rule = CARBON_RULES.find((candidate) => candidate.keywords.some((keyword) => normalized.includes(keyword)));
  return rule?.kg ?? DEFAULT_CARBON_KG;
}

/** 배지에 넣을 설명. 숫자만 보면 무슨 뜻인지 알기 어려워서 함께 붙입니다. */
export const CARBON_SAVED_HINT =
  '새 제품을 한 대 만들 때 나오는 배출량을 기준으로 한 추정치예요. 모델에 따라 달라질 수 있어요.';
