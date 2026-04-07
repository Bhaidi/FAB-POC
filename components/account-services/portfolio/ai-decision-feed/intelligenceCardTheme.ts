import type { AiDecision } from "@/data/aiDecisionFeedTypes";

export type PriorityVisual = {
  pillBg: string;
  pillText: string;
  pillBorder: string;
};

/** Soft fintech cues — low saturation, readable on light off-white and deep navy */
export const PRIORITY_VISUAL_LIGHT: Record<AiDecision["priority"], PriorityVisual> = {
  high: {
    pillBg: "rgba(185, 60, 60, 0.08)",
    pillText: "rgba(130, 42, 42, 0.92)",
    pillBorder: "rgba(185, 60, 60, 0.14)",
  },
  medium: {
    pillBg: "rgba(180, 120, 40, 0.09)",
    pillText: "rgba(120, 85, 28, 0.92)",
    pillBorder: "rgba(180, 120, 40, 0.16)",
  },
  low: {
    pillBg: "rgba(0, 98, 255, 0.06)",
    pillText: "rgba(1, 5, 145, 0.72)",
    pillBorder: "rgba(0, 98, 255, 0.12)",
  },
};

export const PRIORITY_VISUAL_DARK: Record<AiDecision["priority"], PriorityVisual> = {
  high: {
    pillBg: "rgba(255, 120, 120, 0.1)",
    pillText: "rgba(255, 200, 200, 0.88)",
    pillBorder: "rgba(255, 140, 140, 0.18)",
  },
  medium: {
    pillBg: "rgba(255, 200, 120, 0.09)",
    pillText: "rgba(255, 220, 170, 0.85)",
    pillBorder: "rgba(255, 200, 120, 0.16)",
  },
  low: {
    pillBg: "rgba(120, 170, 255, 0.1)",
    pillText: "rgba(190, 210, 255, 0.88)",
    pillBorder: "rgba(100, 150, 255, 0.2)",
  },
};
