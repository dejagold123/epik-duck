import { useEffect, useState } from 'react';

// Matches the `@media (max-width: 720px)` breakpoint used throughout styles.css
const QUERY = '(max-width: 720px)';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(QUERY).matches
      : false
  );

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const mql = window.matchMedia(QUERY);
    const handleChange = (event) => setIsMobile(event.matches);
    mql.addEventListener('change', handleChange);
    setIsMobile(mql.matches);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  return isMobile;
}
