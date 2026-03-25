import { useEffect, useRef, useState } from "react";

interface Options {
  threshold?: number;
  rootMargin?: string;
  /** Custom scroll container to use as the IO root (default: viewport). */
  root?: Element | Document | null;
  /** When true, the observer is not set up and isVisible stays false. */
  disabled?: boolean;
}

export function useIntersectionObserver({
  threshold = 0.1,
  rootMargin = "0px",
  root,
  disabled = false,
}: Options = {}) {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // once visible, no need to keep observing
        }
      },
      { threshold, rootMargin, root: root ?? null }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, root, disabled]);

  return { ref, isVisible };
}
