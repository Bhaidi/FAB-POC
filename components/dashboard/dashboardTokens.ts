/**
 * Dashboard layout tokens — mode-independent (radii, spacing, structure).
 * Colors, gradients, shadows: use `useFabTokens()` from `@/components/theme/FabTokensContext`.
 */
import { authRadius } from "@/components/auth/authTokens";

export const dashRadius = {
  ...authRadius,
  canvas: "10px",
  panel: "10px",
} as const;

export const dashSpace = {
  xs: "8px",
  sm: "16px",
  md: "24px",
  lg: "32px",
} as const;

export const dashLayout = {
  sidebarWidthExpanded: "288px",
  /** Inner rail width (icons column) */
  sidebarWidthCollapsed: "72px",
  /**
   * Figma `558:17725` — collapsed nav floats with `sidebarCollapsedFloatInset` on left/right
   * and the same inset top/bottom (`72 + 24 + 24` horizontal).
   */
  sidebarCollapsedFloatInset: "24px",
  /** Vertical capsule / pill rail — full rounded ends (ref command centre) */
  sidebarCollapsedOuterRadius: "24px",
  primaryNavMinH: "72px",
  /** Figma `558:17874` — light top bar content row */
  primaryNavMinHLight: "82px",
  primaryNavFloatInset: "8px",
  primaryNavFloatBottom: "8px",
  /** Dark: float + {@link primaryNavMinH} + float */
  primaryNavLayoutReserve: "88px",
  /** Light Figma `558:17874` — taller bar ({@link primaryNavMinHLight}) */
  primaryNavLayoutReserveLight: "100px",
  /** Figma frames (e.g. `558:17644`) are 1920px — cap was 1536px and read as “zoomed” vs design */
  contentMaxW: "1920px",
  dashboardHomeMaxW: "1920px",
} as const;

/**
 * Home launchpad service tiles (dark) — compact vs original Figma 264×200.
 * Grid gap / padding scale with the smaller footprint.
 */
export const figmaHomeServiceCard = {
  width: "232px",
  height: "176px",
  padding: "20px",
  radius: "20px",
  fill: "rgba(255, 255, 255, 0.05)",
  /** Chakra `8` → 32px — icon row → title stack */
  gapIconToText: 8,
  /** Chakra `3` → 12px — title → description */
  gapTitleToBody: 3,
  /** Chakra `5` → 20px — gap between cards */
  gridGap: 5,
} as const;

/**
 * Dark home layout redlines — welcome → grid, shell inset, quick actions rail.
 */
export const figmaHomeLayoutDark = {
  /** Welcome / subtitle block → first row of cards (lg ≈48px in Figma) */
  headerMarginBottom: { base: "32px", md: "38px", lg: "48px" } as const,
  /** “QUICK ACTIONS” header → icon row */
  quickActionsTitleToTiles: 8,
  /** Between quick-action icon tiles */
  quickActionsTileGap: 3,
  /** Currency rows in Total Balance (tight list) */
  currencyRowGap: 3,
} as const;
