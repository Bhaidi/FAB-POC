"use client";

import { motion, useReducedMotion } from "framer-motion";
import { formatEventUrgencyChip } from "@/components/account-services/portfolio/intelligence/eventChip";
import type { IntelligenceEventItem } from "@/data/treasurySummaryTypes";

const ROW_MS = "duration-150";

function urgencyTone(daysUntil: number): { chip: string; accent: string } {
  if (daysUntil < 3) {
    return {
      chip: "bg-red-500/[0.14] text-red-200/95 ring-1 ring-inset ring-red-400/20",
      accent: "bg-red-400/80",
    };
  }
  if (daysUntil < 7) {
    return {
      chip: "bg-amber-400/[0.12] text-amber-100/95 ring-1 ring-inset ring-amber-300/18",
      accent: "bg-amber-300/80",
    };
  }
  return {
    chip: "bg-white/[0.06] text-white/[0.55] ring-1 ring-inset ring-white/[0.08]",
    accent: "bg-white/45",
  };
}

type EventItemProps = {
  event: IntelligenceEventItem;
  index: number;
  onSelect: (event: IntelligenceEventItem) => void;
};

export function EventItem({ event, index, onSelect }: EventItemProps) {
  const reduceMotion = useReducedMotion() === true;
  const tone = urgencyTone(event.daysUntil);
  const chip = formatEventUrgencyChip(event);
  const lift = reduceMotion ? "" : "hover:-translate-y-px focus-visible:-translate-y-px";

  return (
    <motion.li
      className="list-none"
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reduceMotion ? 0 : 0.05 + index * 0.05, duration: 0.32, ease: [0.33, 1, 0.68, 1] }}
    >
      <button
        type="button"
        className={`group relative flex w-full items-center gap-2 overflow-hidden rounded-md border-0 py-1.5 pl-0 pr-1 text-left transition-[transform,background-color,color] ease-out ${ROW_MS} ${lift} hover:bg-white/[0.035] focus-visible:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20`}
        onClick={() => onSelect(event)}
      >
        <span
          className={`absolute left-0 top-1 bottom-1 w-px origin-top scale-y-0 rounded-full opacity-0 transition-all ease-out ${ROW_MS} group-hover:scale-y-100 group-hover:opacity-100 group-focus-visible:scale-y-100 group-focus-visible:opacity-100 ${tone.accent}`}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p className="font-[family-name:var(--font-graphik)] text-[10px] font-medium leading-[1.4] tracking-[-0.01em] text-[rgba(255,255,255,0.82)] transition-[color] ease-out group-hover:text-[rgba(255,255,255,0.92)] sm:text-[11px]">
            {event.label}
          </p>
        </div>
        <span
          className={`shrink-0 rounded px-1 py-0.5 font-[family-name:var(--font-graphik)] text-[9px] font-semibold tabular-nums tracking-wide sm:text-[10px] ${tone.chip}`}
        >
          {chip}
        </span>
      </button>
    </motion.li>
  );
}
