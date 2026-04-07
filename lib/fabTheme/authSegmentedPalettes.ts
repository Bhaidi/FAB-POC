import { dsGlassFieldDark } from "@/lib/fabTheme/dsTextField";

/**
 * Segmented control chrome — frosted glass track + floating pill (auth, toolbar, canvas).
 * Dark: deep indigo/navy slab, cool blue–violet light. Light: off-white frost, lavender/blue tint.
 */

const lightTrackRim =
  "linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 248, 255, 0.35) 32%, transparent 58%)";
const lightTrackFloor =
  "linear-gradient(180deg, transparent 45%, rgba(230, 232, 248, 0.45) 82%, rgba(210, 218, 245, 0.28) 100%)";

/**
 * Dark — FAB DS (`558:17091` outer, `558:17093` thumb, `558:17095` inactive label).
 * Track **outer** matches Text field Glass (`558:17083`): same fill, blur, border + four-edge inset as {@link dsGlassFieldDark}.
 */
export const authSegmentedControlThemeDark = {
  track: {
    background: dsGlassFieldDark.fill,
    backdropFilter: dsGlassFieldDark.backdrop,
    WebkitBackdropFilter: dsGlassFieldDark.backdrop,
    border: `1px solid ${dsGlassFieldDark.border}`,
    boxShadow: `${dsGlassFieldDark.inset}, 0 2px 16px rgba(0, 0, 0, 0.14)`,
  },
  trackSheen: "",
  trackRimGradient: "",
  trackFloorGradient: "",
  trackInnerWellShadow: "none",
  thumbAura: "",
  /** `558:17093` — selected cell */
  thumb: {
    background: "rgba(67, 83, 255, 0.4)",
    border: "1px solid #3645E2",
    boxShadow: "0 0 40px 0 #1428D4",
  },
  /** Same chrome while dragging — no extra “lift” styling */
  thumbDragging: {
    background: "rgba(67, 83, 255, 0.4)",
    border: "1px solid #3645E2",
    boxShadow: "0 0 40px 0 #1428D4",
  },
  thumbDraggingAura: "",
  label: {
    active: "#FFFFFF",
    inactive: "#9B9C9F",
    inactiveHover: "#9B9C9F",
  },
} as const;

export const authSegmentedControlThemeLight = {
  track: {
    background:
      "linear-gradient(165deg, rgba(255, 255, 255, 0.72) 0%, rgba(248, 249, 255, 0.58) 50%, rgba(242, 244, 252, 0.52) 100%)",
    backdropFilter: "blur(24px) saturate(170%)",
    WebkitBackdropFilter: "blur(24px) saturate(170%)",
    border: "1px solid rgba(255, 255, 255, 0.92)",
    boxShadow: [
      "inset 0 1px 0 rgba(255, 255, 255, 1)",
      "inset 0 -1px 0 rgba(180, 190, 230, 0.25)",
      "0 1px 0 rgba(255, 255, 255, 0.8)",
      "0 8px 28px rgba(80, 90, 140, 0.06)",
      "0 2px 8px rgba(100, 110, 180, 0.04)",
      "0 0 0 1px rgba(200, 210, 240, 0.35)",
    ].join(", "),
  },
  trackSheen:
    "linear-gradient(120deg, rgba(255, 255, 255, 0.5) 0%, rgba(230, 235, 255, 0.2) 40%, rgba(220, 230, 255, 0.12) 100%)",
  trackRimGradient: lightTrackRim,
  trackFloorGradient: lightTrackFloor,
  trackInnerWellShadow:
    "inset 0 2px 5px rgba(255, 255, 255, 0.85), inset 0 -2px 6px rgba(160, 170, 210, 0.12)",
  thumbAura: "0 0 0 1px rgba(255, 255, 255, 0.9), 0 6px 20px rgba(70, 80, 130, 0.08), 0 0 24px rgba(0, 98, 255, 0.06)",
  thumb: {
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(252, 253, 255, 0.88) 45%, rgba(248, 250, 255, 0.82) 100%)",
    backdropFilter: "blur(26px) saturate(190%)",
    WebkitBackdropFilter: "blur(26px) saturate(190%)",
    border: "1px solid rgba(255, 255, 255, 0.98)",
    boxShadow: [
      "inset 0 1px 0 rgba(255, 255, 255, 1)",
      "inset 0 -1px 0 rgba(200, 210, 235, 0.35)",
      "inset 0 0 0 1px rgba(230, 235, 255, 0.8)",
      "0 3px 14px rgba(60, 70, 120, 0.07)",
      "0 1px 4px rgba(0, 98, 255, 0.05)",
      "0 0 20px rgba(0, 98, 255, 0.06)",
    ].join(", "),
  },
  thumbDragging: {
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(252, 253, 255, 0.95) 50%, rgba(248, 250, 255, 0.9) 100%)",
    backdropFilter: "blur(34px) saturate(200%)",
    WebkitBackdropFilter: "blur(34px) saturate(200%)",
    border: "1px solid rgba(0, 98, 255, 0.22)",
    boxShadow: [
      "inset 0 1px 0 rgba(255, 255, 255, 1)",
      "inset 0 -1px 0 rgba(200, 210, 235, 0.4)",
      "inset 0 0 0 1px rgba(220, 230, 255, 0.95)",
      "0 6px 22px rgba(60, 80, 140, 0.1)",
      "0 0 28px rgba(0, 98, 255, 0.1)",
    ].join(", "),
  },
  thumbDraggingAura: "0 0 0 1px rgba(0, 98, 255, 0.12), 0 10px 28px rgba(70, 90, 150, 0.1), 0 0 32px rgba(0, 98, 255, 0.08)",
  label: {
    active: "#050a45",
    inactive: "rgba(72, 82, 94, 0.45)",
    inactiveHover: "rgba(5, 10, 90, 0.72)",
  },
} as const;

/** In-page (account services) — same DS dark tokens as auth */
export const authSegmentedControlCanvasDark = {
  track: {
    ...authSegmentedControlThemeDark.track,
  },
  trackSheen: authSegmentedControlThemeDark.trackSheen,
  trackRimGradient: authSegmentedControlThemeDark.trackRimGradient,
  trackFloorGradient: authSegmentedControlThemeDark.trackFloorGradient,
  trackInnerWellShadow: authSegmentedControlThemeDark.trackInnerWellShadow,
  thumbAura: authSegmentedControlThemeDark.thumbAura,
  thumb: authSegmentedControlThemeDark.thumb,
  thumbDragging: authSegmentedControlThemeDark.thumbDragging,
  thumbDraggingAura: authSegmentedControlThemeDark.thumbDraggingAura,
  label: authSegmentedControlThemeDark.label,
} as const;
