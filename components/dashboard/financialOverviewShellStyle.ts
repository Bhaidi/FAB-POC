/**
 * Panel shell matching `FinancialOverviewWidget` — light canvas (#F2F2F3 family) for balance-adjacent surfaces.
 */
export const financialOverviewShellBorder = "rgba(1, 5, 145, 0.1)";

export const financialOverviewShellSx = {
  position: "relative" as const,
  overflow: "hidden" as const,
  borderWidth: "1px",
  borderColor: financialOverviewShellBorder,
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  backgroundImage: `
    linear-gradient(168deg, #FFFFFF 0%, #F7F7F8 48%, #F2F2F3 100%),
    linear-gradient(180deg, rgba(255,255,255,0.9) 0%, transparent 40%, rgba(0, 98, 255, 0.03) 100%)
  `,
  boxShadow:
    "0 16px 40px rgba(1, 5, 145, 0.06), 0 0 0 1px rgba(1, 5, 145, 0.06), inset 0 1px 0 rgba(255,255,255,0.95)",
};
