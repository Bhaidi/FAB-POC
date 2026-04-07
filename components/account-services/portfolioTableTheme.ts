import { LIGHT_INK_PRIMARY, LIGHT_SURFACE } from "@/lib/fabTheme/lightModePrimitives";

/**
 * Stub portfolio table on workspace — light uses the same surface ramp as corporate tables.
 * Dark variant matches the glass workspace chrome.
 */
export const portfolioTableThemeLight = {
  surface: LIGHT_SURFACE.elevated,
  surfaceBorder: "rgba(1, 5, 145, 0.12)",
  headerBg: "rgba(1, 5, 145, 0.045)",
  headerText: "rgba(1, 5, 145, 0.52)",
  headerRule: "rgba(1, 5, 145, 0.13)",
  rowRule: "rgba(1, 5, 145, 0.095)",
  rowHover: LIGHT_SURFACE.hover,
  title: LIGHT_INK_PRIMARY,
  bodyMuted: "rgba(58, 69, 86, 0.68)",
  balance: "rgba(1, 5, 145, 0.88)",
  subtle: "rgba(1, 5, 145, 0.48)",
  chevron: "rgba(1, 5, 145, 0.38)",
  badgeAccountFg: "#0b3d91",
  badgeAccountBg: "rgba(15, 98, 254, 0.14)",
  badgeDepositFg: "#047857",
  badgeDepositBg: "rgba(16, 185, 129, 0.14)",
  badgeLoanFg: "#b45309",
  badgeLoanBg: "rgba(245, 158, 11, 0.18)",
  progressTrack: "rgba(1, 5, 145, 0.085)",
  progressFillDeposit: "rgba(15, 98, 254, 0.5)",
  progressFillLoan: "rgba(0, 72, 255, 0.42)",
  emDash: "rgba(1, 5, 145, 0.32)",
} as const;

export const portfolioTableThemeDark = {
  surface: "rgba(255, 255, 255, 0.06)",
  surfaceBorder: "rgba(255, 255, 255, 0.1)",
  headerBg: "rgba(255, 255, 255, 0.05)",
  headerText: "rgba(255, 255, 255, 0.48)",
  headerRule: "rgba(255, 255, 255, 0.12)",
  rowRule: "rgba(255, 255, 255, 0.08)",
  rowHover: "rgba(0, 98, 255, 0.14)",
  title: "rgba(255, 255, 255, 0.94)",
  bodyMuted: "rgba(255, 255, 255, 0.55)",
  balance: "rgba(255, 255, 255, 0.92)",
  subtle: "rgba(255, 255, 255, 0.45)",
  chevron: "rgba(255, 255, 255, 0.42)",
  badgeAccountFg: "rgba(165, 198, 255, 0.95)",
  badgeAccountBg: "rgba(0, 98, 255, 0.22)",
  badgeDepositFg: "rgba(52, 211, 153, 0.95)",
  badgeDepositBg: "rgba(16, 185, 129, 0.2)",
  badgeLoanFg: "rgba(251, 191, 36, 0.95)",
  badgeLoanBg: "rgba(245, 158, 11, 0.22)",
  progressTrack: "rgba(255, 255, 255, 0.1)",
  progressFillDeposit: "rgba(15, 98, 254, 0.55)",
  progressFillLoan: "rgba(0, 72, 255, 0.5)",
  emDash: "rgba(255, 255, 255, 0.38)",
} as const;

export type PortfolioStubTableTheme = typeof portfolioTableThemeLight | typeof portfolioTableThemeDark;

/** @deprecated Prefer `portfolioTableThemeLight` or `portfolioTableThemeForMode`. */
export const portfolioTableTheme = portfolioTableThemeLight;

export function portfolioTableThemeForMode(colorMode: string | undefined): PortfolioStubTableTheme {
  if (colorMode === "dark") return portfolioTableThemeDark;
  return portfolioTableThemeLight;
}
