import {
  LOGIN_GLASS_BORDER_BASE,
  LOGIN_GLASS_CORNER_BLEND_MED,
  LOGIN_GLASS_CORNER_BLEND_SOFT,
  LOGIN_GLASS_CORNER_STROKE,
} from "@/lib/fabTheme/authPalettes";

/** Chord-gradient stops for TL/BR glass rim accents (shared with login fields). */
export type GlassCornerRimPalette = {
  base: string;
  soft: string;
  med: string;
  peak: string;
};

/** Same ramp as login credential fields — toggles, cards, menus reuse this. */
export const glassCornerRimPaletteAuth: GlassCornerRimPalette = {
  base: LOGIN_GLASS_BORDER_BASE,
  soft: LOGIN_GLASS_CORNER_BLEND_SOFT,
  med: LOGIN_GLASS_CORNER_BLEND_MED,
  peak: LOGIN_GLASS_CORNER_STROKE,
};

export function parseGlassCornerRadiusPx(radius: string): number {
  const n = parseFloat(radius);
  return Number.isFinite(n) && n > 0 ? n : 24;
}
