import { LIGHT_INK_PRIMARY, LIGHT_SURFACE } from "@/lib/fabTheme/lightModePrimitives";
import { getDsTextFieldStyles } from "@/lib/fabTheme/dsTextField";
import { glassTokens } from "@/lib/glassTokens";

/** Dashboard-only keys (merged with auth palette for `dashColors`). */

export const dashGradientsDark = {
  canvas:
    "linear-gradient(115deg, #000481 -55.63%, #00037F -17.24%, #000353 22.71%, #000107 100%)",
} as const;

export const dashGradientsLight = {
  /** Figma launch `558:17874` — cool canvas + soft blue wash (see also `lightbackground.png` layer) */
  canvas: [
    "linear-gradient(125deg, rgba(95, 145, 224, 0.08) 0%, transparent 42%)",
    `linear-gradient(180deg, #eef2fb 0%, ${LIGHT_SURFACE.base} 52%, #fafbff 100%)`,
  ].join(", "),
} as const;

export const dashEffectsDark = {
  /** Sidebar / wide shells — aligned with {@link glassTokens.blur.shell} */
  surfaceBlur: glassTokens.blur.shell,
  /** Header chrome — slightly tighter read than shell */
  primaryNavBlur: glassTokens.blur.card,
} as const;

export const dashEffectsLight = {
  surfaceBlur: "blur(14px) saturate(1.12)",
  /** Launch `558:17874` — flat white top bar (no frosted nav) */
  primaryNavBlur: "none",
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
  sidebarRailSolid: "rgba(0, 2, 39, 0.55)",
  sidebarGlass: glassTokens.fill.shell,
  sidebarInnerEdge: "inset 1px 0 0 rgba(255, 255, 255, 0.08)",
  sidebarBeam: "rgba(0, 120, 255, 0.92)",
  sidebarBeamSoft: "0 0 18px rgba(0, 98, 255, 0.35)",
  sidebarBorder: glassTokens.border.default,
  homeRailDivider: "rgba(255, 255, 255, 0.13)",
  cardBg: "rgba(255, 255, 255, 0.05)",
  cardBgHover: "rgba(255, 255, 255, 0.08)",
  navActiveBg: "rgba(0, 72, 255, 0.18)",
  navActiveBorder: "rgba(255, 255, 255, 0.2)",
  navItemHoverBg: "rgba(255, 255, 255, 0.06)",
  navItemHoverBorder: "rgba(255, 255, 255, 0.08)",
  topbarBg: glassTokens.fill.shell,
  primaryNavBg: glassTokens.fill.shell,
  primaryNavBorder: glassTokens.border.default,
  primaryNavInactive: "rgba(255, 255, 255, 0.4)",
  statusAvailable: "rgba(52, 211, 153, 0.95)",
  statusAttention: "rgba(251, 191, 36, 0.95)",
  statusRestricted: "rgba(248, 113, 113, 0.9)",
  pageTitle: "#ffffff",
  pageEyebrow: "rgba(255, 255, 255, 0.48)",
  pageSubtitle: "rgba(255, 255, 255, 0.55)",
  homeWelcomeAccent: "#ffffff",
  homeWelcomeMuted: "rgba(255, 255, 255, 0.55)",
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
  /** Expanded sidebar panel — readable tree on white */
  sidebarGlass: `linear-gradient(165deg, rgba(255, 255, 255, 0.94) 0%, rgba(252, 253, 255, 0.88) 42%, rgba(245, 248, 252, 0.82) 100%)`,
  /** Figma `558:17874` — primary-blue/400 collapsed rail */
  sidebarRailSolid: "#40639E",
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
  /** Solid page surface / white header */
  primaryNavBg: "#FFFFFF",
  primaryNavBorder: "rgba(155, 156, 159, 0.35)",
  primaryNavInactive: "rgba(58, 69, 86, 0.52)",
  statusAvailable: "rgba(52, 211, 153, 0.95)",
  statusAttention: "rgba(251, 191, 36, 0.95)",
  statusRestricted: "rgba(248, 113, 113, 0.9)",
  pageTitle: LIGHT_INK_PRIMARY,
  pageEyebrow: "rgba(58, 69, 86, 0.58)",
  /** DS body secondary */
  pageSubtitle: "#6A6C6F",
  /** Home hero — Figma `558:17874` */
  homeWelcomeAccent: "#0062FF",
  homeWelcomeMuted: "#6A6C6F",
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
  cardGlow: glassTokens.shadowStack.card,
  cardGlowHover: glassTokens.shadowStack.cardHover,
  sidebar: "4px 0 32px rgba(0, 0, 0, 0.35)",
  sidebarCapability: `${glassTokens.shadow.medium}, 0 0 0 1px ${glassTokens.border.default}, ${glassTokens.shadow.insetTopSheen}, inset 1px 0 0 rgba(255,255,255,0.05)`,
  primaryNavFloat: `${glassTokens.shadow.soft}, 0 0 0 1px ${glassTokens.border.default}, ${glassTokens.shadow.insetTopSheen}`,
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

/** Primary nav search (light) — DS text field. Dark nav uses layered {@link GlassCredentialFieldFrame} in `DashboardPrimaryNav`. */
const dashNavSearchDark = {
  ...getDsTextFieldStyles({ colorMode: "dark", height: "40px", paddingX: false }),
  pl: 10,
  pr: { base: 4, md: "7.5rem" },
} as const;

/** Figma `558:17874` — 496×46 pill, neutral/300 border, DS placeholder */
const dashNavSearchLight = {
  ...getDsTextFieldStyles({
    colorMode: "light",
    height: "46px",
    paddingX: "24px",
    surface: "authLoginLight",
  }),
  pl: "48px",
  pr: { base: "16px", md: "7.5rem" },
} as const;

export const dashPrimaryNavChromeDark = {
  brandWordmark: glassTokens.text.primary,
  search: dashNavSearchDark,
  searchIcon: glassTokens.search.icon,
  kbd: {
    bg: "rgba(12, 16, 40, 0.55)",
    borderColor: glassTokens.border.default,
    color: glassTokens.text.muted,
    boxShadow: `${glassTokens.shadow.insetTopSheen}`,
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
  commandCenterBorder: "rgba(255,255,255,0.22)",
} as const;

export const dashPrimaryNavChromeLight = {
  /** Figma text/heading */
  brandWordmark: "#383A3F",
  commandCenterBorder: "#9B9C9F",
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
