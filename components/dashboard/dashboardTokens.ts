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
  sidebarWidthCollapsed: "72px",
  primaryNavMinH: "72px",
  primaryNavFloatInset: "8px",
  primaryNavFloatBottom: "8px",
  primaryNavLayoutReserve: "88px",
  contentMaxW: "1536px",
  dashboardHomeMaxW: "1536px",
} as const;

/**
 * Figma DS `570:41510` / `558:17644` — home launchpad service tiles (dark).
 * Grid: 24px gap between cards; tile padding 24px; 40px icon→copy; inner title→body 12px (`VStack` 3).
 */
export const figmaHomeServiceCard = {
  width: "232px",
  /** Taller than legacy 176px so 24px pad + 40px gap + 24/12 type fits like Figma */
  height: "200px",
  padding: "24px",
  radius: "24px",
  fill: "rgba(255, 255, 255, 0.05)",
  /** Chakra `10` → 40px — icon block → title stack (Figma `gap-[40px]`) */
  gapIconToText: 10,
  /** Chakra `3` → 12px — title → description inside stack */
  gapTitleToBody: 3,
  /** Chakra `6` → 24px — column + row gap between service cards */
  gridGap: 6,
} as const;

/**
 * Dark home layout redlines — welcome → grid, shell inset, quick actions rail.
 */
export const figmaHomeLayoutDark = {
  /** Welcome / subtitle block → first row of cards (lg ≈48px in Figma) */
  headerMarginBottom: { base: "32px", md: "38px", lg: "48px" } as const,
  /** Main content horizontal padding (lg) — aligns grid to sidebar */
  contentPaddingXLg: "48px",
  /** “QUICK ACTIONS” header → icon row */
  quickActionsTitleToTiles: 8,
  /** Between quick-action icon tiles */
  quickActionsTileGap: 3,
  /** Currency rows in Total Balance (tight list) */
  currencyRowGap: 3,
} as const;
