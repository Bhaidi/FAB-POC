/** Dark glass tooltips on the capability sidebar — always light text (avoids theme body color on custom `label` nodes). */
export const SIDEBAR_NAV_TOOLTIP_PROPS = {
  bg: "rgba(12, 16, 32, 0.97)",
  color: "rgba(255, 255, 255, 0.96)",
  borderWidth: "1px",
  borderColor: "rgba(255, 255, 255, 0.14)",
  fontSize: "12px",
  lineHeight: 1.45,
  fontFamily: "var(--font-graphik)",
  boxShadow: "0 10px 32px rgba(0, 0, 0, 0.5)",
};

/** Use inside tooltip `label` when passing custom JSX so Chakra `Text` does not inherit global dark copy. */
export const SIDEBAR_NAV_TOOLTIP_LABEL_COLOR = "rgba(255, 255, 255, 0.96)";

/** Shared expand-row metrics — L1 / L2 headers use the same hit target and chevron. */
export const SIDEBAR_EXPAND_CHEVRON_SIZE = 18;
export const SIDEBAR_EXPAND_CHEVRON_CELL = "32px";

/** Chevron rotate — ease-out, matches enterprise nav polish. */
export const SIDEBAR_CHEVRON_TRANSITION = "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)";

/** L1 left accent width (px). */
export const SIDEBAR_L1_ACCENT_W = "2px";

/** L2 content inset from L1 inner edge (12–16px). */
export const SIDEBAR_L2_STACK_INSET = { pl: "14px" } as const;

/** L3 group: extra margin so actions sit ~24–28px deeper than L2 label start. */
export const SIDEBAR_L3_GROUP_MARGIN = { ml: "10px", mr: 0 } as const;

/** L3 list rhythm — tighter inside the tinted shell. */
export const SIDEBAR_L3_INNER_GAP = 1 as const;
