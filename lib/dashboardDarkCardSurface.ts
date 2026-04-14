import { glassTokens } from "@/lib/glassTokens";

/**
 * Dark dashboard glass cards — aligned with {@link glassTokens} (non–home-tile grids).
 */
export const dashboardDarkCardSurface = {
  fill: glassTokens.fill.card,
  backdrop: glassTokens.blur.card,
  border: glassTokens.border.default,
  borderHover: glassTokens.border.active,
  radius: glassTokens.radius.card,
  title: glassTokens.text.cardTitle,
  body: glassTokens.text.secondary,
  bodySubtle: glassTokens.text.muted,
  iconBoxBg: "transparent",
  iconBoxBorder: glassTokens.border.default,
  hoverScrim: "rgba(0, 0, 0, 0.5)",
  motionRest: glassTokens.shadowStack.card,
  motionHover: glassTokens.shadowStack.cardHover,
  padComfortable: "32px",
} as const;
