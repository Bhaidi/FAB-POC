"use client";

import { AlertTriangle, Clock, Sparkles, type LucideIcon } from "lucide-react";

const HEADER_ICONS = {
  insight: Sparkles,
  events: Clock,
  alerts: AlertTriangle,
} as const satisfies Record<string, LucideIcon>;

export type IntelligenceHeaderVariant = keyof typeof HEADER_ICONS;

type IntelligenceSectionHeaderProps = {
  variant: IntelligenceHeaderVariant;
  label: string;
};

/** 14px icon + 11–12px uppercase label @ 60% white — matches executive summary chrome. */
export function IntelligenceSectionHeader({ variant, label }: IntelligenceSectionHeaderProps) {
  const Icon = HEADER_ICONS[variant];

  return (
    <div className="mb-2 flex items-center gap-2">
      <Icon className="h-[14px] w-[14px] shrink-0 text-[rgba(255,255,255,0.6)]" strokeWidth={2} aria-hidden />
      <span className="font-[family-name:var(--font-graphik)] text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgba(255,255,255,0.6)] sm:text-[12px]">
        {label}
      </span>
    </div>
  );
}
