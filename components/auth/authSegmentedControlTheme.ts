/**
 * Login / Register segmented control — subtle outer capsule + translucent glass thumb.
 * Active state reads as edge, blur, and glow — not a solid fill.
 */
export const authSegmentedControlTheme = {
  track: {
    background: "rgba(20, 24, 38, 0.18)",
    backdropFilter: "blur(20px) saturate(150%)",
    WebkitBackdropFilter: "blur(20px) saturate(150%)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    boxShadow: [
      "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
      "inset 0 -1px 0 rgba(255, 255, 255, 0.04)",
      "0 8px 28px rgba(0, 0, 0, 0.14)",
    ].join(", "),
  },
  trackSheen:
    "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 32%, transparent 62%)",
  /** Raised glass layer — low-opacity tint + blur; visibility from rim + glow */
  thumb: {
    background: "rgba(255, 255, 255, 0.06)",
    backdropFilter: "blur(28px) saturate(180%)",
    WebkitBackdropFilter: "blur(28px) saturate(180%)",
    border: "1px solid rgba(255, 255, 255, 0.22)",
    boxShadow: [
      "inset 0 1px 0 rgba(255, 255, 255, 0.35)",
      "inset 0 -1px 0 rgba(255, 255, 255, 0.08)",
      "0 2px 8px rgba(0, 0, 0, 0.25)",
      "0 0 12px rgba(120, 160, 255, 0.12)",
    ].join(", "),
  },
  /** While dragging — denser frost, brighter rim, stronger glow; still translucent */
  thumbDragging: {
    background: "rgba(255, 255, 255, 0.11)",
    backdropFilter: "blur(38px) saturate(200%)",
    WebkitBackdropFilter: "blur(38px) saturate(200%)",
    border: "1px solid rgba(255, 255, 255, 0.42)",
    boxShadow: [
      "inset 0 1px 0 rgba(255, 255, 255, 0.52)",
      "inset 0 -1px 0 rgba(255, 255, 255, 0.12)",
      "0 6px 18px rgba(0, 0, 0, 0.36)",
      "0 0 26px rgba(120, 160, 255, 0.32)",
    ].join(", "),
  },
  label: {
    active: "rgba(255, 255, 255, 0.95)",
    inactive: "rgba(255, 255, 255, 0.6)",
    inactiveHover: "rgba(255, 255, 255, 0.78)",
  },
} as const;
