import type { Variants } from "framer-motion";
import { dashShadow } from "@/components/dashboard/dashboardTokens";

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
export const cardTransition =
  "border-color 0.28s ease, box-shadow 0.28s ease";

/** White service tiles — lift + FABAccess API-style glow (ServiceTile / PlatformCard). */
export const dashboardCardHover: Variants = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow: dashShadow.cardGlow,
    transition: { duration: 0.28, ease: easeInOut },
  },
  hover: {
    y: -4,
    scale: 1,
    boxShadow: dashShadow.cardGlowHover,
    transition: { duration: 0.28, ease: easeInOut },
  },
};

/** Launch-module tiles — calmer 200ms motion (wireframe spec 180–220ms). */
export const dashboardLaunchModuleHover: Variants = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow: dashShadow.cardGlow,
    transition: { duration: 0.2, ease: easeInOut },
  },
  hover: {
    y: -4,
    scale: 1,
    boxShadow: dashShadow.cardGlowHover,
    transition: { duration: 0.2, ease: easeInOut },
  },
};

/** Home L1 tiles — secondary to widgets; softer elevation, 0.25s lift. */
export const dashboardBankHomeHover: Variants = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
    transition: { duration: 0.25, ease: easeInOut },
  },
  hover: {
    y: -4,
    scale: 1,
    boxShadow: "0 12px 28px rgba(0, 0, 0, 0.28)",
    transition: { duration: 0.25, ease: easeInOut },
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
