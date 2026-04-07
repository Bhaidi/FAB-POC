"use client";

import { useMemo, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  authMarketContentVariants,
  AUTH_MARKET_TRANSITION_PENDING_KEY,
} from "@/lib/motion/authContentTransition";
import { useDashboardGlobal } from "@/components/dashboard/DashboardGlobalContext";

/** Fills `<main>` flex host — same flex contract as auth mode `motion.div`. */
const MARKET_CONTENT_MOTION_STYLE = {
  width: "100%",
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  display: "flex",
  flexDirection: "column" as const,
};

export function DashboardMarketContentTransition({ children }: { children: ReactNode }) {
  const { marketCode } = useDashboardGlobal();
  const reduceMotion = useReducedMotion();
  const variants = useMemo(() => authMarketContentVariants(reduceMotion), [reduceMotion]);
  const segment = marketCode ?? AUTH_MARKET_TRANSITION_PENDING_KEY;

  return (
    <AnimatePresence mode="wait" initial>
      <motion.div
        key={segment}
        custom={segment}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={MARKET_CONTENT_MOTION_STYLE}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
