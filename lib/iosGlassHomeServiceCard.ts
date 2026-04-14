import { glassTokens } from "@/lib/glassTokens";

/**
 * Home launchpad service tiles — “liquid glass” reference:
 * heavy backdrop blur, TL→BR internal gradient, inset rim (light top/left, recessed BR),
 * soft tinted bloom (not a flat black drop shadow).
 */

/** Color comes only from the canvas behind — no painted fill. */
const BACKDROP_LIQUID = "blur(52px) saturate(195%)";

const FILL_LIQUID = "transparent";

const SHADOW_REST = "none";
const SHADOW_HOVER = "none";

export const iosGlassHomeServiceCard = {
  fill: FILL_LIQUID,
  backdrop: BACKDROP_LIQUID,
  /** Legacy border tokens — home tile uses rim via `boxShadow`; chip/hover may still reference */
  border: "transparent",
  borderHover: "transparent",
  shadowRest: SHADOW_REST,
  shadowHover: SHADOW_HOVER,
  iconChipBg: "transparent",
  iconChipBorder: "transparent",
} as const;

/**
 * Quick Actions — round icon buttons: transparent fill, blur samples background.
 */
export const iosGlassQuickActionTile = {
  size: "90px",
  radius: glassTokens.radius.button,
  fill: "transparent",
  backdrop: "blur(44px) saturate(195%)",
} as const;
