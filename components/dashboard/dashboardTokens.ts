/**
 * Dashboard surface tokens — aligned with auth `authTokens` + Developer Portal (Figma) canvas spec.
 */
import { authColors, authRadius, authShadow } from "@/components/auth/authTokens";

/** Full dashboard canvas — matches Dev Portal frame (linear gradient + blur + 10px radius). */
export const dashGradients = {
  canvas:
    "linear-gradient(115deg, #000481 -55.63%, #00037F -17.24%, #000353 22.71%, #000107 100%)",
} as const;

export const dashEffects = {
  /** Figma: backdrop-filter: blur(14.5px) */
  surfaceBlur: "blur(14.5px)",
  /** Primary nav bar — slightly stronger glass for platform header */
  primaryNavBlur: "blur(16px) saturate(1.15)",
} as const;

export const dashColors = {
  ...authColors,
  /** Gradient end / body fallback */
  canvas: "#000107",
  canvasMid: "#000353",
  beam: "rgba(0, 98, 255, 0.22)",
  beamSoft: "rgba(0, 98, 255, 0.08)",
  sidebarBg: "rgba(0, 2, 39, 0.55)",
  /** Capability sidebar — deeper glass (login-adjacent premium) */
  sidebarGlass: "linear-gradient(165deg, rgba(8, 14, 42, 0.72) 0%, rgba(2, 6, 28, 0.78) 45%, rgba(0, 4, 24, 0.82) 100%)",
  sidebarInnerEdge: "inset 1px 0 0 rgba(255, 255, 255, 0.08)",
  sidebarBeam: "rgba(0, 120, 255, 0.92)",
  sidebarBeamSoft: "0 0 18px rgba(0, 98, 255, 0.35)",
  sidebarBorder: "rgba(255, 255, 255, 0.12)",
  /**
   * Home launchpad — vertical rule between tile grid and right rail.
   * Slightly above `authColors.border.subtle` so it reads on the live canvas gradient.
   */
  homeRailDivider: "rgba(255, 255, 255, 0.13)",
  cardBg: "rgba(255, 255, 255, 0.05)",
  cardBgHover: "rgba(255, 255, 255, 0.08)",
  navActiveBg: "rgba(0, 72, 255, 0.18)",
  navActiveBorder: "rgba(255, 255, 255, 0.2)",
  topbarBg: "rgba(0, 2, 39, 0.72)",
  /** Developer Portal primary nav (Figma 1:13081) */
  primaryNavBg: "rgba(255, 255, 255, 0.12)",
  primaryNavBorder: "rgba(116, 116, 116, 0.2)",
  primaryNavInactive: "rgba(255, 255, 255, 0.4)",
  /** Service availability — minimal status dots */
  statusAvailable: "rgba(52, 211, 153, 0.95)",
  statusAttention: "rgba(251, 191, 36, 0.95)",
  statusRestricted: "rgba(248, 113, 113, 0.9)",
} as const;

export const dashRadius = {
  ...authRadius,
  /** Figma dashboard frame */
  canvas: "10px",
  /** Glass panels / tiles */
  panel: "10px",
} as const;

export const dashShadow = {
  ...authShadow,
  cardGlow: "0 0 0 1px rgba(255,255,255,0.06), 0 12px 40px rgba(0, 0, 0, 0.45), 0 0 48px rgba(0, 98, 255, 0.06)",
  cardGlowHover: "0 0 0 1px rgba(0, 98, 255, 0.2), 0 16px 48px rgba(0, 0, 0, 0.5), 0 0 56px rgba(0, 98, 255, 0.12)",
  sidebar: "4px 0 32px rgba(0, 0, 0, 0.35)",
  sidebarCapability: "4px 0 40px rgba(0, 0, 0, 0.42), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.06)",
  /** Floating primary nav — soft lift off canvas */
  primaryNavFloat: "0 8px 32px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255,255,255,0.06)",
} as const;

/** 8pt spacing rhythm — 8, 16, 24, 32px */
export const dashSpace = {
  xs: "8px",
  sm: "16px",
  md: "24px",
  lg: "32px",
} as const;

export const dashLayout = {
  /** Expanded capability sidebar — extra width for labels + nested nav */
  sidebarWidthExpanded: "288px",
  sidebarWidthCollapsed: "72px",
  primaryNavMinH: "72px",
  /** Inset from viewport top / sides — Dev Mode float spec */
  primaryNavFloatInset: "8px",
  /** Gap below floating bar before page content */
  primaryNavFloatBottom: "8px",
  /** Top inset + bar + bottom gap — sticky sidebar offset & min-height math */
  primaryNavLayoutReserve: "88px",
  contentMaxW: "1536px",
  /** Structured home column — widgets + L1 grid share this width and horizontal padding rhythm. */
  dashboardHomeMaxW: "1536px",
} as const;
