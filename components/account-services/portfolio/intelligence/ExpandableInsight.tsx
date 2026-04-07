"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useState } from "react";
import type { IntelligenceInsightContent } from "@/data/treasurySummaryTypes";

const EASE = [0.33, 1, 0.68, 1] as const;

type ExpandableInsightProps = {
  insight: IntelligenceInsightContent;
  /** Fade-in on mount (module switch) */
  showIntro?: boolean;
};

export function ExpandableInsight({ insight, showIntro = true }: ExpandableInsightProps) {
  const reduceMotion = useReducedMotion() === true;
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <motion.div
      initial={showIntro && !reduceMotion ? { opacity: 0, y: 6 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.4, ease: EASE }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        className="group relative w-full cursor-pointer border-0 bg-transparent p-0 text-left outline-none transition-[color] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        onClick={() => setOpen((v) => !v)}
      >
        <span
          className={`relative block w-full max-w-[520px] pl-3 pb-0.5 font-[family-name:var(--font-graphik)] text-[10px] font-semibold leading-[1.45] tracking-[-0.01em] transition-[color] duration-150 ease-out after:absolute after:bottom-0 after:left-3 after:right-0 after:h-px after:origin-left after:bg-[rgba(255,255,255,0.45)] after:transition-transform after:duration-150 after:ease-out sm:text-[11px] ${
            open
              ? "text-[rgba(255,255,255,0.92)] after:scale-x-100"
              : "text-[rgba(255,255,255,0.78)] after:scale-x-0 group-hover:text-[rgba(255,255,255,0.92)] group-hover:after:scale-x-100 group-focus-visible:text-[rgba(255,255,255,0.92)] group-focus-visible:after:scale-x-100"
          }`}
        >
          {insight.headline}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            key="expanded"
            initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={
              reduceMotion
                ? { opacity: 1 }
                : { height: "auto", opacity: 1, transition: { height: { duration: 0.38, ease: EASE }, opacity: { duration: 0.28 } } }
            }
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { height: 0, opacity: 0, transition: { height: { duration: 0.32, ease: EASE }, opacity: { duration: 0.2 } } }
            }
            className="overflow-hidden"
          >
            <ul className="mt-2 max-w-[520px] list-none space-y-1 pl-3 font-[family-name:var(--font-graphik)] text-[10px] font-medium leading-[1.45] text-[rgba(255,255,255,0.75)] sm:text-[11px]">
              {insight.drivers.map((d, i) => (
                <motion.li
                  key={i}
                  className="min-w-0"
                  initial={reduceMotion ? false : { opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: reduceMotion ? 0 : 0.04 + i * 0.05, duration: 0.3, ease: EASE }}
                >
                  {d}
                </motion.li>
              ))}
            </ul>
            {insight.recommendation ? (
              <motion.p
                className="mt-2 max-w-[520px] pl-3 font-[family-name:var(--font-graphik)] text-[10px] font-medium leading-[1.45] text-[rgba(255,255,255,0.55)] sm:text-[11px]"
                initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduceMotion ? 0 : 0.12, duration: 0.3, ease: EASE }}
              >
                <span className="text-[rgba(255,255,255,0.45)]">Recommendation · </span>
                {insight.recommendation}
              </motion.p>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
