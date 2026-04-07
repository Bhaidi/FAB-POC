/**
 * Home launchpad service tiles — Figma Design System `570:41510` + iOS-style “liquid” glass.
 * Base fill from Figma: `rgba(255,255,255,0.05)`; blur/saturation/backdrop for frosted read.
 */
export const iosGlassHomeServiceCard = {
  fill: "rgba(255, 255, 255, 0.05)",
  /** Stronger frosted read (recent iOS control-center style) */
  backdrop: "blur(28px) saturate(200%)",
  border: "rgba(255, 255, 255, 0.22)",
  borderHover: "rgba(255, 255, 255, 0.38)",
  /** Hairline + top specular + soft ambient depth */
  shadowRest:
    "inset 0 1px 0 rgba(255, 255, 255, 0.42), inset 0 0 0 1px rgba(255, 255, 255, 0.1), 0 10px 36px rgba(0, 0, 0, 0.2)",
  shadowHover:
    "inset 0 1px 0 rgba(255, 255, 255, 0.55), inset 0 0 0 1px rgba(255, 255, 255, 0.16), 0 16px 48px rgba(0, 0, 0, 0.28)",
  iconChipBg: "rgba(255, 255, 255, 0.1)",
  iconChipBorder: "rgba(255, 255, 255, 0.2)",
} as const;

/**
 * Quick Actions — round icon buttons. Figma: fill **#FFFFFF @ 5%** + Effects **Glass** only
 * (no extra shadows / strokes in the DS panel).
 */
export const iosGlassQuickActionTile = {
  size: "90px",
  radius: "24px",
  /** Selection color: white @ 5% */
  fill: "rgba(255, 255, 255, 0.05)",
  /** Effects → Glass (backdrop frosted) */
  backdrop: "blur(24px) saturate(180%)",
} as const;
