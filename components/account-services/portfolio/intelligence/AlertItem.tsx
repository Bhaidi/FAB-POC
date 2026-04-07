"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { IntelligenceAlertItem } from "@/data/treasurySummaryTypes";

const ROW_MS = "duration-[160ms]";

const SEVERITY = {
  high: {
    rest: "border-l-[2px] border-transparent pl-0",
    hoverLift: "hover:-translate-y-[2px] focus-visible:-translate-y-[2px]",
    hover:
      "hover:border-l-red-400/70 hover:shadow-[0_2px_22px_-6px_rgba(239,68,68,0.4),0_0_24px_-8px_rgba(239,68,68,0.15)] focus-visible:border-l-red-400/70 focus-visible:shadow-[0_2px_22px_-6px_rgba(239,68,68,0.4)]",
  },
  medium: {
    rest: "border-l-[2px] border-transparent pl-0",
    hoverLift: "hover:-translate-y-[2px] focus-visible:-translate-y-[2px]",
    hover:
      "hover:border-l-amber-300/75 hover:shadow-[0_2px_20px_-6px_rgba(251,191,36,0.32),0_0_22px_-8px_rgba(251,191,36,0.12)] focus-visible:border-l-amber-300/75 focus-visible:shadow-[0_2px_20px_-6px_rgba(251,191,36,0.32)]",
  },
  low: {
    rest: "border-l-[2px] border-transparent pl-0",
    hoverLift: "hover:-translate-y-[2px] focus-visible:-translate-y-[2px]",
    hover:
      "hover:border-l-sky-400/65 hover:shadow-[0_2px_18px_-6px_rgba(56,189,248,0.28),0_0_20px_-8px_rgba(56,189,248,0.1)] focus-visible:border-l-sky-400/65 focus-visible:shadow-[0_2px_18px_-6px_rgba(56,189,248,0.28)]",
  },
} as const;

type AlertItemProps = {
  alert: IntelligenceAlertItem;
  index: number;
  onSelect: (alert: IntelligenceAlertItem) => void;
};

export function AlertItem({ alert, index, onSelect }: AlertItemProps) {
  const reduceMotion = useReducedMotion() === true;
  const s = SEVERITY[alert.severity];
  const lift = reduceMotion ? "" : s.hoverLift;

  return (
    <motion.li
      className="list-none"
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reduceMotion ? 0 : 0.05 + index * 0.05, duration: 0.32, ease: [0.33, 1, 0.68, 1] }}
    >
      <button
        type="button"
        className={`group flex w-full items-start rounded-md border-0 bg-transparent py-1.5 pr-1 text-left transition-[transform,box-shadow,border-color,background-color] ease-out ${ROW_MS} ${s.rest} ${lift} ${s.hover} hover:bg-white/[0.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/15`}
        onClick={() => onSelect(alert)}
      >
        <p className="min-w-0 flex-1 font-[family-name:var(--font-graphik)] text-[10px] font-medium leading-[1.4] tracking-[-0.01em] text-[rgba(255,255,255,0.82)] transition-[color] duration-150 ease-out group-hover:text-[rgba(255,255,255,0.92)] sm:text-[11px]">
          {alert.label}
        </p>
      </button>
    </motion.li>
  );
}
