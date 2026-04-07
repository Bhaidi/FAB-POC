import type { IntelligenceEventItem } from "@/data/treasurySummaryTypes";

/** Compact chip: "Today" | "4d" | "2h" — uses optional `hoursUntil` when same-day. */
export function formatEventUrgencyChip(event: IntelligenceEventItem): string {
  if (event.hoursUntil != null && event.daysUntil <= 0) {
    return `${event.hoursUntil}h`;
  }
  if (event.daysUntil <= 0) return "Today";
  if (event.daysUntil === 1) return "1d";
  return `${event.daysUntil}d`;
}
