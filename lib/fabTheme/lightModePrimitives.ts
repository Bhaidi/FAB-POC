/**
 * Canonical light-mode surface ramp — structured, crisp, premium (not flat white).
 * Consumed by dashboard + auth palettes; keeps FAB deep blue ink + cool ambient tint.
 */
export const LIGHT_SURFACE = {
  base: "#F5F7FB",
  elevated: "#FFFFFF",
  subtle: "#EEF2F8",
  hover: "#E6EBF5",
} as const;

/** Primary reading ink — deep FAB blue (not neutral black). */
export const LIGHT_INK_PRIMARY = "#010591";

/** Secondary body ink — blue-grey for hierarchy under primary. */
export const LIGHT_INK_SECONDARY = "#3A4556";
