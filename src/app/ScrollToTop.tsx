import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router';

/**
 * 페이지를 옮기면 맨 위에서 시작하게 합니다.
 *
 * - 뒤로/앞으로 가기(POP)는 브라우저가 복원한 위치를 그대로 둡니다.
 * - 해시가 있으면 그 요소로 가야 하므로 건드리지 않습니다.
 * - `html` 에 `scroll-behavior: smooth` 가 걸려 있어서, 여기서는 'instant' 로
 *   즉시 이동시킵니다. 아니면 새 페이지가 아래에서 위로 스르륵 올라옵니다.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === 'POP' || hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash, navigationType]);

  return null;
}
