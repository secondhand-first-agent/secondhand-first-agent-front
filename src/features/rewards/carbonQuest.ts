/**
 * 탄소 절감 상품 조회 미션.
 *
 * 하루에 탄소 절감 태그가 붙은 상품을 정해진 수만큼 보면 포인트의 일부를 받고,
 * 나중에 실제 구매를 인증하면 나머지까지 받는 구조입니다.
 *
 * ⚠️ 아직 서버에 미션·포인트 API 가 없어서 진행 상황을 브라우저(localStorage)에만
 *    기록합니다. 그래서 기기나 브라우저를 바꾸면 진행도가 따라오지 않고,
 *    사용자가 직접 값을 고칠 수도 있습니다. 실제 포인트를 지급하려면 반드시
 *    서버가 조회 기록을 판단하도록 옮겨야 합니다.
 */

/** 하루에 이만큼 조회하면 미션 완료. */
export const DAILY_VIEW_GOAL = 3;

/** 조회 미션을 채우면 주는 포인트. 전체 보상 중 일부입니다. */
export const VIEW_REWARD_POINT = 100;

/** 구매를 인증하면 받는 전체 보상. 인증 기능은 아직 준비 중입니다. */
export const PURCHASE_REWARD_POINT = 1_000;

const STORAGE_KEY = 'carbonQuest';

interface QuestRecord {
  /** 로컬 기준 YYYY-MM-DD. 날짜가 바뀌면 진행도를 처음부터 다시 셉니다. */
  date: string;
  /** 같은 상품을 여러 번 봐도 한 번만 세도록 상품 id 로 모읍니다. */
  productIds: string[];
}

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function subscribeCarbonQuest(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function todayKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

/** 저장된 값이 없거나 깨졌거나 어제 것이면 오늘의 빈 기록으로 시작합니다. */
function read(): QuestRecord {
  const date = todayKey();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date, productIds: [] };

    const parsed = JSON.parse(raw) as Partial<QuestRecord>;
    if (parsed.date !== date || !Array.isArray(parsed.productIds)) return { date, productIds: [] };

    return { date, productIds: parsed.productIds };
  } catch {
    return { date, productIds: [] };
  }
}

/** 오늘 조회한 탄소 절감 상품 수. `useSyncExternalStore` 가 쓰도록 원시값을 돌려줍니다. */
export function getViewedCount(): number {
  return read().productIds.length;
}

export function recordCarbonProductView(productId: string) {
  const record = read();

  // 같은 상품을 다시 봐도 세지 않고, 이미 다 채웠으면 더 쌓지 않습니다.
  if (record.productIds.includes(productId) || record.productIds.length >= DAILY_VIEW_GOAL) return;

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ date: record.date, productIds: [...record.productIds, productId] })
    );
  } catch {
    // 저장할 수 없는 환경(시크릿 모드 등)에서는 미션만 진행되지 않고, 화면은 그대로 동작합니다.
    return;
  }

  emit();
}
