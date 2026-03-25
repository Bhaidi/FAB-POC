import type { Variants } from "framer-motion";

/** Matches login ↔ register mode cross-fade (see `app/(auth)/login/page.tsx`). */
export const AUTH_CONTENT_EASE_OUT = [0.33, 1, 0.68, 1] as const;

/** Key for dashboard market transition before `marketCode` is known — exit is instant (no flash on first load). */
export const AUTH_MARKET_TRANSITION_PENDING_KEY = "__fab_market_pending__";

/**
 * Login / Register content swap — opacity + 12px vertical slide, same timings as auth page.
 */
export function authContentModeVariants(reduceMotion: boolean | null | undefined): Variants {
  const rm = reduceMotion === true;
  return {
    initial: {
      opacity: 0,
      y: rm ? 0 : 12,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: rm ? { duration: 0.12 } : { duration: 0.28, ease: AUTH_CONTENT_EASE_OUT },
    },
    exit: {
      opacity: 0,
      y: rm ? 0 : 12,
      transition: rm ? { duration: 0.1 } : { duration: 0.22, ease: AUTH_CONTENT_EASE_OUT },
    },
  };
}

/**
 * Operating-market change on dashboard — same motion as auth modes; pending→first market skips exit animation.
 */
export function authMarketContentVariants(reduceMotion: boolean | null | undefined): Variants {
  const rm = reduceMotion === true;
  return {
    initial: {
      opacity: 0,
      y: rm ? 0 : 12,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: rm ? { duration: 0.12 } : { duration: 0.28, ease: AUTH_CONTENT_EASE_OUT },
    },
    exit: (segment) => {
      const key = typeof segment === "string" ? segment : "";
      if (key === AUTH_MARKET_TRANSITION_PENDING_KEY) {
        return { opacity: 1, y: 0, transition: { duration: 0 } };
      }
      return {
        opacity: 0,
        y: rm ? 0 : 12,
        transition: rm ? { duration: 0.1 } : { duration: 0.22, ease: AUTH_CONTENT_EASE_OUT },
      };
    },
  };
}
