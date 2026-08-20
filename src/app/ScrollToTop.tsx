import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router';

export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === 'POP' || hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash, navigationType]);

  return null;
}
