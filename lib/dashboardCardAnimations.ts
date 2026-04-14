import type { Variants } from "framer-motion";

import { dashboardDarkCardSurface } from "@/lib/dashboardDarkCardSurface";
import { iosGlassHomeServiceCard } from "@/lib/iosGlassHomeServiceCard";

const easePremium: [number, number, number, number] = [0.22, 1, 0.36, 1];
const easeInOut: [number, number, number, number] = [0.42, 0, 0.58, 1];

/** Framer Motion — card lift (enterprise, no flashy glow). */
export const cardHover = {
  y: -4,
  transition: { duration: 0.28, ease: easeInOut },
};

export const cardRest = {
  y: 0,
  transition: { duration: 0.28, ease: easeInOut },
};

/** Chakra transition string for border/shadow on the card surface. */
export const cardTransition = "border-color 0.28s ease, box-shadow 0.28s ease";

/** Dark glass tiles — reference-matched soft lift + inset sheen (see `dashboardDarkCardSurface`). */
export function makeDashboardGlassCardHover(): Variants {
  return {
    rest: {
      y: 0,
      scale: 1,
      boxShadow: dashboardDarkCardSurface.motionRest,
      transition: { duration: 0.22, ease: easePremium },
    },
    hover: {
      y: -2,
      scale: 1,
      boxShadow: dashboardDarkCardSurface.motionHover,
      transition: { duration: 0.22, ease: easePremium },
    },
  };
}

/** Figma DS `570:41510` + iOS frosted tile — lift with specular-friendly shadows. */
export function makeIosGlassHomeTileHover(): Variants {
  return {
    rest: {
      y: 0,
      scale: 1,
      boxShadow: iosGlassHomeServiceCard.shadowRest,
      transition: { duration: 0.22, ease: easePremium },
    },
    hover: {
      y: -2,
      scale: 1,
      boxShadow: iosGlassHomeServiceCard.shadowHover,
      transition: { duration: 0.22, ease: easePremium },
    },
  };
}

/**
 * Home launchpad glass — **shadow only** (no `y` / transform on the same node as `backdrop-filter`).
 * Browsers often drop or flatten backdrop blur when the same element is transformed by Framer Motion.
 * Pair with an outer wrapper that handles lift via `translateY` in Chakra `sx`.
 */
export function makeIosGlassHomeTileShadowOnly(): Variants {
  return {
    rest: {
      boxShadow: iosGlassHomeServiceCard.shadowRest,
      transition: { duration: 0.22, ease: easePremium },
    },
    hover: {
      boxShadow: iosGlassHomeServiceCard.shadowHover,
      transition: { duration: 0.22, ease: easePremium },
    },
  };
}

/** White service tiles — lift + glow (shadow strings from `useFabTokens().dashShadow`). */
export function makeDashboardCardHover(cardGlow: string, cardGlowHover: string): Variants {
  return {
    rest: {
      y: 0,
      scale: 1,
      boxShadow: cardGlow,
      transition: { duration: 0.22, ease: easePremium },
    },
    hover: {
      y: -2,
      scale: 1,
      boxShadow: cardGlowHover,
      transition: { duration: 0.22, ease: easePremium },
    },
  };
}

/** Launch-module tiles — calmer 200ms motion (wireframe spec 180–220ms). */
export function makeDashboardLaunchModuleHover(cardGlow: string, cardGlowHover: string): Variants {
  return {
    rest: {
      y: 0,
      scale: 1,
      boxShadow: cardGlow,
      transition: { duration: 0.22, ease: easePremium },
    },
    hover: {
      y: -2,
      scale: 1,
      boxShadow: cardGlowHover,
      transition: { duration: 0.22, ease: easePremium },
    },
  };
}

/** Home L1 tiles — secondary to widgets; softer elevation, 0.25s lift. */
export const dashboardBankHomeHover: Variants = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
    transition: { duration: 0.22, ease: easePremium },
  },
  hover: {
    y: -2,
    scale: 1,
    boxShadow: "0 12px 28px rgba(0, 0, 0, 0.28)",
    transition: { duration: 0.22, ease: easePremium },
  },
};

/** Hover CTA pill — slide up + fade. */
export const dashboardCardCtaSlide: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: easeInOut },
  },
};
