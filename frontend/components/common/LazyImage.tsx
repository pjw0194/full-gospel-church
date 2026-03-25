"use client";

import React, { useEffect, useRef, useState } from "react";
import { ImageOff } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const MAX_RETRIES = 2;
const RETRY_DELAYS_MS = [1000, 2500];

interface LazyImageProps {
  src: string;
  alt: string;
  /** Classes applied to the <img> element. */
  className?: string;
  /** Classes applied to the outer wrapper div. */
  wrapperClassName?: string;
  /**
   * Compact mode: hides the error label text.
   * Suited for small thumbnails where there is not enough space for text.
   */
  compact?: boolean;
  /**
   * Skip the Intersection Observer and load immediately.
   * Use this for above-the-fold or priority images.
   */
  eager?: boolean;
  /**
   * Custom scroll container to use as the IO root.
   * Pass the modal's scroll container ref to get accurate in-container detection.
   */
  root?: Element | null;
}

/**
 * Drop-in replacement for <img> with:
 * - Intersection-Observer–based lazy loading (preloads 300px before viewport entry)
 * - `eager` mode to bypass IO and load immediately
 * - Shimmer skeleton while loading
 * - Smooth opacity fade-in on load
 * - Auto-retry on error (up to MAX_RETRIES times, with increasing delays)
 * - Error fallback with ImageOff icon after all retries fail
 * - State reset when `src` prop changes
 */
export default function LazyImage({
  src,
  alt,
  className = "",
  wrapperClassName = "",
  compact = false,
  eager = false,
  root,
}: LazyImageProps) {
  const { ref, isVisible } = useIntersectionObserver({
    rootMargin: "300px",
    root,
    disabled: eager,
  });

  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset all state whenever src changes (e.g., bulletin tab switch)
  const prevSrcRef = useRef(src);
  useEffect(() => {
    if (prevSrcRef.current === src) return;
    prevSrcRef.current = src;
    if (retryTimer.current) clearTimeout(retryTimer.current);
    setLoaded(false);
    setError(false);
    setRetryCount(0);
  }, [src]);

  useEffect(() => {
    return () => {
      if (retryTimer.current) clearTimeout(retryTimer.current);
    };
  }, []);

  const handleError = () => {
    if (retryCount < MAX_RETRIES) {
      const delay = RETRY_DELAYS_MS[retryCount] ?? 2500;
      retryTimer.current = setTimeout(() => {
        setRetryCount((c) => c + 1);
      }, delay);
    } else {
      setError(true);
    }
  };

  const shouldLoad = eager || isVisible;

  return (
    <div
      ref={eager ? undefined : (ref as React.RefObject<HTMLDivElement>)}
      className={`relative ${!loaded && !error ? "min-h-[120px]" : ""} ${wrapperClassName}`}
    >
      {/* Shimmer skeleton — shown until image loads or all retries fail */}
      {!loaded && !error && (
        <div className="absolute inset-0 overflow-hidden rounded-[inherit] bg-stone-200">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        </div>
      )}

      {/* Error state after all retries fail */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 rounded-[inherit] bg-stone-100 text-stone-400">
          <ImageOff size={compact ? 14 : 20} />
          {!compact && (
            <span className="text-xs">이미지를 불러올 수 없습니다</span>
          )}
        </div>
      )}

      {/* Image — rendered once in viewport (or immediately when eager) */}
      {shouldLoad && !error && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={retryCount} // remount on each retry to force a fresh network request
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
          onLoad={() => setLoaded(true)}
          onError={handleError}
        />
      )}
    </div>
  );
}
