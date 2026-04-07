import { LIGHT_INK_PRIMARY, LIGHT_SURFACE } from "@/lib/fabTheme/lightModePrimitives";
import { getDsTextFieldStyles } from "@/lib/fabTheme/dsTextField";

/** Dashboard-only keys (merged with auth palette for `dashColors`). */

export const dashGradientsDark = {
  canvas:
    "linear-gradient(115deg, #000481 -55.63%, #00037F -17.24%, #000353 22.71%, #000107 100%)",
} as const;

export const dashGradientsLight = {
  /** Layered base → subtle band + cool ambient (lavender/blue), not flat grey */
  canvas: [
    `linear-gradient(180deg, ${LIGHT_SURFACE.base} 0%, ${LIGHT_SURFACE.subtle} 52%, ${LIGHT_SURFACE.base} 100%)`,
    "radial-gradient(ellipse 120% 80% at 50% -15%, rgba(0, 98, 255, 0.045), transparent 55%)",
    "radial-gradient(ellipse 70% 50% at 100% 0%, rgba(130, 110, 220, 0.035), transparent 50%)",
  ].join(", "),
} as const;

export const dashEffectsDark = {
  surfaceBlur: "blur(14.5px)",
  primaryNavBlur: "blur(16px) saturate(1.15)",
} as const;

export const dashEffectsLight = {
  surfaceBlur: "blur(14px) saturate(1.12)",
  /** Match glass-forward primary nav (Figma Dev Portal ~12px blur; slightly stronger on web) */
  primaryNavBlur: "blur(18px) saturate(1.2)",
} as const;

export const dashSurfaceDark = {
  surfaceBase: "#000107",
  surfaceElevated: "rgba(255, 255, 255, 0.06)",
  surfaceSubtle: "#000353",
  surfaceHover: "rgba(255, 255, 255, 0.08)",
  canvas: "#000107",
  canvasMid: "#000353",
  beam: "rgba(0, 98, 255, 0.22)",
  beamSoft: "rgba(0, 98, 255, 0.08)",
  sidebarBg: "rgba(0, 2, 39, 0.55)",
  sidebarGlass:
    "linear-gradient(165deg, rgba(8, 14, 42, 0.72) 0%, rgba(2, 6, 28, 0.78) 45%, rgba(0, 4, 24, 0.82) 100%)",
  sidebarInnerEdge: "inset 1px 0 0 rgba(255, 255, 255, 0.08)",
  sidebarBeam: "rgba(0, 120, 255, 0.92)",
  sidebarBeamSoft: "0 0 18px rgba(0, 98, 255, 0.35)",
  sidebarBorder: "rgba(255, 255, 255, 0.12)",
  homeRailDivider: "rgba(255, 255, 255, 0.13)",
  cardBg: "rgba(255, 255, 255, 0.05)",
  cardBgHover: "rgba(255, 255, 255, 0.08)",
  navActiveBg: "rgba(0, 72, 255, 0.18)",
  navActiveBorder: "rgba(255, 255, 255, 0.2)",
  navItemHoverBg: "rgba(255, 255, 255, 0.06)",
  navItemHoverBorder: "rgba(255, 255, 255, 0.08)",
  topbarBg: "rgba(0, 2, 39, 0.72)",
  primaryNavBg: "rgba(255, 255, 255, 0.12)",
  primaryNavBorder: "rgba(116, 116, 116, 0.2)",
  primaryNavInactive: "rgba(255, 255, 255, 0.4)",
  statusAvailable: "rgba(52, 211, 153, 0.95)",
  statusAttention: "rgba(251, 191, 36, 0.95)",
  statusRestricted: "rgba(248, 113, 113, 0.9)",
  pageTitle: "#ffffff",
  pageEyebrow: "rgba(255, 255, 255, 0.48)",
  pageSubtitle: "rgba(255, 255, 255, 0.55)",
  metaChipBorder: "rgba(255, 255, 255, 0.1)",
  metaChipBg: "rgba(255, 255, 255, 0.06)",
  metaChipText: "rgba(255, 255, 255, 0.78)",
  contextBarOuterBorder: "rgba(255, 255, 255, 0.1)",
  contextBarOuterBg: "rgba(255, 255, 255, 0.04)",
  cardBorder: "rgba(255, 255, 255, 0.1)",
  cardBorderHover: "rgba(255, 255, 255, 0.16)",
  mainWellInsetShadow: "none",
  sectionDivider: "rgba(255, 255, 255, 0.1)",
} as const;

export const dashSurfaceLight = {
  /** Explicit surface ramp (design system) */
  surfaceBase: LIGHT_SURFACE.base,
  surfaceElevated: LIGHT_SURFACE.elevated,
  surfaceSubtle: LIGHT_SURFACE.subtle,
  surfaceHover: LIGHT_SURFACE.hover,
  canvas: LIGHT_SURFACE.base,
  canvasMid: LIGHT_SURFACE.subtle,
  beam: "rgba(0, 98, 255, 0.1)",
  beamSoft: "rgba(0, 98, 255, 0.05)",
  sidebarBg: "rgba(255, 255, 255, 0.78)",
  sidebarGlass: `linear-gradient(165deg, rgba(255, 255, 255, 0.94) 0%, rgba(252, 253, 255, 0.88) 42%, rgba(245, 248, 252, 0.82) 100%)`,
  sidebarInnerEdge: "inset 1px 0 0 rgba(1, 5, 145, 0.08)",
  sidebarBeam: "rgba(0, 98, 255, 0.88)",
  sidebarBeamSoft: "0 0 20px rgba(0, 98, 255, 0.14)",
  sidebarBorder: "rgba(1, 5, 145, 0.11)",
  homeRailDivider: "rgba(1, 5, 145, 0.12)",
  /** Elevated cards — solid white + token borders/shadows (see dashShadow.cardGlow) */
  cardBg: LIGHT_SURFACE.elevated,
  cardBgHover: LIGHT_SURFACE.hover,
  cardBorder: "rgba(1, 5, 145, 0.11)",
  cardBorderHover: "rgba(0, 98, 255, 0.22)",
  navActiveBg: "rgba(0, 98, 255, 0.12)",
  navActiveBorder: "rgba(0, 98, 255, 0.32)",
  navItemHoverBg: LIGHT_SURFACE.hover,
  navItemHoverBorder: "rgba(1, 5, 145, 0.12)",
  topbarBg: "rgba(255, 255, 255, 0.88)",
  primaryNavBg: "rgba(255, 255, 255, 0.72)",
  primaryNavBorder: "rgba(1, 5, 145, 0.1)",
  primaryNavInactive: "rgba(58, 69, 86, 0.52)",
  statusAvailable: "rgba(52, 211, 153, 0.95)",
  statusAttention: "rgba(251, 191, 36, 0.95)",
  statusRestricted: "rgba(248, 113, 113, 0.9)",
  pageTitle: LIGHT_INK_PRIMARY,
  pageEyebrow: "rgba(58, 69, 86, 0.58)",
  pageSubtitle: "#3A4556",
  metaChipBorder: "rgba(1, 5, 145, 0.12)",
  metaChipBg: LIGHT_SURFACE.elevated,
  metaChipText: "#3A4556",
  contextBarOuterBorder: "rgba(1, 5, 145, 0.12)",
  contextBarOuterBg: "rgba(255, 255, 255, 0.82)",
  /** Main column: subtle separation from canvas */
  mainWellInsetShadow:
    "inset 0 1px 0 rgba(255, 255, 255, 0.95), inset 0 0 120px rgba(0, 72, 180, 0.025)",
  sectionDivider: "rgba(1, 5, 145, 0.1)",
} as const;

export const dashShadowExtensionDark = {
  cardGlow:
    "0 0 0 1px rgba(255,255,255,0.06), 0 12px 40px rgba(0, 0, 0, 0.45), 0 0 48px rgba(0, 98, 255, 0.06)",
  cardGlowHover:
    "0 0 0 1px rgba(0, 98, 255, 0.2), 0 16px 48px rgba(0, 0, 0, 0.5), 0 0 56px rgba(0, 98, 255, 0.12)",
  sidebar: "4px 0 32px rgba(0, 0, 0, 0.35)",
  sidebarCapability:
    "4px 0 40px rgba(0, 0, 0, 0.42), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.06)",
  primaryNavFloat: "0 8px 32px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255,255,255,0.06)",
} as const;

export const dashShadowExtensionLight = {
  /** Tighter lift, blue-tinted (not diffuse grey) */
  cardGlow:
    "0 0 0 1px rgba(1, 5, 145, 0.11), 0 2px 8px rgba(1, 5, 145, 0.05), 0 6px 20px rgba(0, 98, 255, 0.06)",
  cardGlowHover:
    "0 0 0 1px rgba(0, 98, 255, 0.2), 0 4px 12px rgba(1, 5, 145, 0.07), 0 10px 28px rgba(0, 98, 255, 0.09)",
  sidebar: "4px 0 20px rgba(1, 5, 145, 0.07)",
  sidebarCapability:
    "4px 0 28px rgba(1, 5, 145, 0.08), 0 0 0 1px rgba(1, 5, 145, 0.09), inset 0 1px 0 rgba(255, 255, 255, 0.92)",
  primaryNavFloat:
    "0 8px 28px rgba(1, 5, 145, 0.08), 0 0 0 1px rgba(1, 5, 145, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.88)",
} as const;

const dashNavSearchDark = {
  ...getDsTextFieldStyles({ colorMode: "dark", height: "40px", paddingX: false }),
  pl: 10,
  pr: { base: 4, md: "7.5rem" },
} as const;

const dashNavSearchLight = {
  ...getDsTextFieldStyles({ colorMode: "light", height: "40px", paddingX: false }),
  pl: 10,
  pr: { base: 4, md: "7.5rem" },
} as const;

export const dashPrimaryNavChromeDark = {
  brandWordmark: "#ffffff",
  search: dashNavSearchDark,
  searchIcon: "rgba(255,255,255,0.45)",
  kbd: {
    bg: "rgba(0, 0, 0, 0.22)",
    borderColor: "rgba(255, 255, 255, 0.14)",
    color: "rgba(255, 255, 255, 0.48)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
  },
  iconButton: {
    variant: "ghost" as const,
    size: "sm" as const,
    borderRadius: "full",
    color: "white",
    w: "40px",
    h: "40px",
    minW: "40px",
    transition: "background 0.22s ease-in-out, transform 0.22s ease-in-out",
    _hover: { bg: "rgba(255, 255, 255, 0.12)", transform: "scale(1.04)" },
    _active: { bg: "rgba(255, 255, 255, 0.16)" },
  },
  divider: "rgba(255,255,255,0.14)",
  notifDotBorder: "rgba(12, 16, 28, 0.95)",
} as const;

export const dashPrimaryNavChromeLight = {
  brandWordmark: LIGHT_INK_PRIMARY,
  search: dashNavSearchLight,
  searchIcon: "rgba(58, 69, 86, 0.48)",
  kbd: {
    bg: LIGHT_SURFACE.subtle,
    borderColor: "rgba(1, 5, 145, 0.12)",
    color: "rgba(58, 69, 86, 0.58)",
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.9)",
  },
  iconButton: {
    variant: "ghost" as const,
    size: "sm" as const,
    borderRadius: "full",
    color: "#3A4556",
    w: "40px",
    h: "40px",
    minW: "40px",
    transition: "background 0.22s ease-in-out, transform 0.22s ease-in-out",
    _hover: { bg: LIGHT_SURFACE.hover, transform: "scale(1.04)" },
    _active: { bg: "rgba(0, 98, 255, 0.08)" },
  },
  divider: "rgba(1, 5, 145, 0.12)",
  notifDotBorder: "rgba(255, 255, 255, 0.95)",
} as const;

export const sidebarNavTooltipDark = {
  SIDEBAR_NAV_TOOLTIP_PROPS: {
    bg: "rgba(12, 16, 32, 0.97)",
    color: "rgba(255, 255, 255, 0.96)",
    borderWidth: "1px",
    borderColor: "rgba(255, 255, 255, 0.14)",
    fontSize: "12px",
    lineHeight: 1.45,
    fontFamily: "var(--font-graphik)",
    boxShadow: "0 10px 32px rgba(0, 0, 0, 0.5)",
  },
  SIDEBAR_NAV_TOOLTIP_LABEL_COLOR: "rgba(255, 255, 255, 0.96)",
} as const;

export const sidebarNavTooltipLight = {
  SIDEBAR_NAV_TOOLTIP_PROPS: {
    bg: LIGHT_SURFACE.elevated,
    color: "#3A4556",
    borderWidth: "1px",
    borderColor: "rgba(1, 5, 145, 0.12)",
    fontSize: "12px",
    lineHeight: 1.45,
    fontFamily: "var(--font-graphik)",
    boxShadow: "0 0 0 1px rgba(1, 5, 145, 0.06), 0 8px 24px rgba(1, 5, 145, 0.08), 0 4px 12px rgba(0, 98, 255, 0.05)",
  },
  SIDEBAR_NAV_TOOLTIP_LABEL_COLOR: "#3A4556",
} as const;

export const documentCanvasBg = {
  dark: "#000107",
  light: LIGHT_SURFACE.base,
} as const;
