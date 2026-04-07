import { LIGHT_INK_PRIMARY, LIGHT_INK_SECONDARY, LIGHT_SURFACE } from "@/lib/fabTheme/lightModePrimitives";

/** Dark auth — original FAB Access glass-on-gradient (unchanged). */
export const authColorsDark = {
  text: {
    primary: "rgba(255, 255, 255, 0.96)",
    secondary: "rgba(255, 255, 255, 0.76)",
    tertiary: "rgba(255, 255, 255, 0.58)",
    muted: "rgba(255, 255, 255, 0.42)",
    faint: "rgba(255, 255, 255, 0.32)",
  },
  border: {
    subtle: "rgba(255, 255, 255, 0.09)",
    default: "rgba(255, 255, 255, 0.12)",
    strong: "rgba(255, 255, 255, 0.18)",
  },
  glass: {
    tint: "rgba(12, 18, 38, 0.26)",
    tintHover: "rgba(255, 255, 255, 0.075)",
    input: "rgba(255, 255, 255, 0.085)",
    inputHover: "rgba(255, 255, 255, 0.11)",
    inputFocus: "rgba(255, 255, 255, 0.12)",
  },
  accent: "#0062FF",
  accentSoft: "rgba(0, 98, 255, 0.88)",
  warning: "rgba(255, 200, 140, 0.98)",
  warningSoft: "rgba(255, 200, 140, 0.78)",
} as const;

export const authShadowDark = {
  focusRing: "0 0 0 2px rgba(0, 98, 255, 0.28), 0 0 20px rgba(0, 98, 255, 0.12)",
  inputFocus: "0 0 0 2px rgba(0, 98, 255, 0.25)",
  qr: "0 2px 16px rgba(0, 0, 0, 0.2)",
  panel: "0 4px 28px rgba(0, 0, 0, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
  panelHover: "0 8px 36px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
  primaryCta: "0 8px 28px rgba(0, 50, 140, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
  primaryCtaHover: "0 12px 36px rgba(0, 70, 180, 0.36), inset 0 1px 0 rgba(255, 255, 255, 0.14)",
} as const;

export const authChallengeCardDark = {
  bg: "rgba(255, 255, 255, 0.055)",
  border: "rgba(255, 255, 255, 0.12)",
  insetHighlight: "inset 0 1px 0 rgba(255, 255, 255, 0.09)",
  shadow: "0 8px 40px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
} as const;

export const authHeroTypographyDark = {
  overline: {
    fontWeight: 500,
    fontSize: "11px",
    lineHeight: "1",
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
  },
  headline: {
    fontWeight: 300,
    fontSize: { base: "40px", sm: "54px", md: "62px", lg: "76px" },
    lineHeight: "1.14",
    letterSpacing: "-0.03em",
  },
  subtitle: {
    fontWeight: 400,
    fontSize: { base: "15px", md: "16px" },
    lineHeight: "1.65",
  },
} as const;

export const authColumnTypographyDark = {
  title: {
    fontWeight: 400,
    fontSize: { base: "26px", md: "32px" },
    lineHeight: "1.12",
    letterSpacing: "-0.03em",
  },
  supporting: {
    fontWeight: 400,
    fontSize: { base: "14px", md: "15px" },
    lineHeight: "1.6",
  },
} as const;

/** Light auth — structured surfaces + deep blue ink (not washed grey). */
export const authColorsLight = {
  text: {
    primary: LIGHT_INK_PRIMARY,
    secondary: LIGHT_INK_SECONDARY,
    tertiary: "rgba(58, 69, 86, 0.88)",
    muted: "rgba(58, 69, 86, 0.65)",
    faint: "rgba(58, 69, 86, 0.48)",
  },
  border: {
    subtle: "rgba(1, 5, 145, 0.1)",
    default: "rgba(1, 5, 145, 0.14)",
    strong: "rgba(1, 5, 145, 0.22)",
  },
  glass: {
    tint: "rgba(255, 255, 255, 0.88)",
    tintHover: LIGHT_SURFACE.hover,
    input: LIGHT_SURFACE.elevated,
    inputHover: LIGHT_SURFACE.hover,
    inputFocus: LIGHT_SURFACE.elevated,
  },
  accent: "#0062FF",
  accentSoft: "rgba(0, 98, 255, 0.88)",
  warning: "rgba(255, 200, 140, 0.98)",
  warningSoft: "rgba(255, 200, 140, 0.78)",
} as const;

export const authShadowLight = {
  focusRing: "0 0 0 2px rgba(0, 98, 255, 0.38), 0 0 20px rgba(0, 98, 255, 0.12)",
  inputFocus: "0 0 0 2px rgba(0, 98, 255, 0.32)",
  qr: "0 2px 14px rgba(1, 5, 145, 0.07), 0 0 0 1px rgba(1, 5, 145, 0.06)",
  panel:
    "0 0 0 1px rgba(1, 5, 145, 0.1), 0 4px 20px rgba(1, 5, 145, 0.06), 0 8px 28px rgba(0, 98, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.95)",
  panelHover:
    "0 0 0 1px rgba(0, 98, 255, 0.14), 0 8px 28px rgba(1, 5, 145, 0.08), 0 12px 36px rgba(0, 98, 255, 0.07), inset 0 1px 0 rgba(255, 255, 255, 1)",
  primaryCta: "0 8px 28px rgba(0, 50, 140, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
  primaryCtaHover: "0 12px 36px rgba(0, 70, 180, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.45)",
} as const;

export const authChallengeCardLight = {
  bg: LIGHT_SURFACE.elevated,
  border: "rgba(1, 5, 145, 0.12)",
  insetHighlight: "inset 0 1px 0 rgba(255, 255, 255, 0.98)",
  shadow:
    "0 0 0 1px rgba(1, 5, 145, 0.1), 0 4px 16px rgba(1, 5, 145, 0.06), 0 10px 32px rgba(0, 98, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.95)",
} as const;

/**
 * Light mode reuses the approved dark typographic scale (sizes, weights, spacing).
 * Only `authColorsLight` / surfaces change ink; do not diverge these from dark.
 */
export const authHeroTypographyLight = authHeroTypographyDark;
export const authColumnTypographyLight = authColumnTypographyDark;
