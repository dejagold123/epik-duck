import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      // Wait a frame so the target page has mounted before measuring/scrolling.
      const raf = window.requestAnimationFrame(() => {
        const target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return () => window.cancelAnimationFrame(raf);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    return undefined;
  }, [location.pathname, location.hash]);
}
