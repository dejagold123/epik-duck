import { useEffect, useState } from 'react';

export function useRevealOnView(threshold = 0.16) {
  const [element, setElement] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!element) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold });

    observer.observe(element);
    return () => observer.disconnect();
  }, [element, threshold]);

  return [setElement, isVisible];
}
