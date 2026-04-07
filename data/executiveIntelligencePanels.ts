import type { ExecutiveIntelligencePanel } from "@/data/treasurySummaryTypes";
import type { PortfolioModuleTab } from "@/data/portfolioSummaryTypes";

/** Context-aware intelligence payloads for the executive summary column 3. */
export const INTELLIGENCE_PANEL_BY_MODULE: Record<PortfolioModuleTab, ExecutiveIntelligencePanel> = {
  portfolio: {
    insight: {
      headline: "Top 3 currencies represent 81% of group liquidity — concentration is intentional but monitor tail risk.",
      drivers: [
        "AED and USD together fund 70% of operating cash across 76 accounts.",
        "EUR and regional CCYs spike on quarter-end repatriation windows.",
        "Idle balances in non-core CCYs are trending down after last sweep cycle.",
      ],
      recommendation: "Consider a 48-hour liquidity stress view before the next board pack.",
    },
    events: [
      { id: "pf-ev-1", label: "8 deposits maturing — largest tranche AED 120B (FAB Treasury SPV)", daysUntil: 0 },
      { id: "pf-ev-2", label: "4 loan repayments due — aggregate AED 45M across facilities", daysUntil: 4 },
    ],
    alerts: [
      { id: "pf-al-1", label: "AED operating cash above 45% internal guideline for 12 consecutive days", severity: "high" },
      { id: "pf-al-2", label: "2 large idle balances flagged for sweep review (UAE pool)", severity: "medium" },
    ],
  },
  accounts: {
    insight: {
      headline: "12% of operating accounts show no material movement in 90+ days — worth a hygiene pass.",
      drivers: [
        "32 accounts sit below minimum activity thresholds but still incur service tiers.",
        "Cross-border pairs (UAE↔KSA) drive most of the unexplained balance drift.",
        "New onboardings this quarter are concentrated in two entity codes.",
      ],
      recommendation: "Route dormant list to entity owners before the next fee cycle.",
    },
    events: [
      { id: "ac-ev-1", label: "3 statements pending release — compliance SLA in 5 days", daysUntil: 4 },
      { id: "ac-ev-2", label: "Overnight sweep batch completed — 14 exceptions need manual match", daysUntil: 0, hoursUntil: 2 },
    ],
    alerts: [
      { id: "ac-al-1", label: "21 accounts require attention (KYC / limits / signatory)", severity: "high" },
      { id: "ac-al-2", label: "5 accounts near dormant policy threshold (60-day rule)", severity: "low" },
    ],
  },
  deposits: {
    insight: {
      headline: "40% of book matures inside 30 days — reinvestment window overlaps with rate volatility.",
      drivers: [
        "Short-dated AED placements dominate the next two roll weeks.",
        "Two counterparties represent a third of maturing notional.",
        "Internal hurdle rates moved up 15 bps since last ladder review.",
      ],
      recommendation: "Pre-allocate alternative tenors before the weekly ALCO slot.",
    },
    events: [
      { id: "dp-ev-1", label: "12 deposits mature in the next 7 days", daysUntil: 5 },
      { id: "dp-ev-2", label: "48 additional maturities in the next 30 days", daysUntil: 18 },
    ],
    alerts: [
      { id: "dp-al-1", label: "High concentration in the 1–3 month bucket vs policy mix", severity: "medium" },
      { id: "dp-al-2", label: "3 low-yield deposits below internal hurdle after last curve move", severity: "low" },
    ],
  },
  loans: {
    insight: {
      headline: "Utilisation above 70% on committed lines — headroom is adequate but tightening on revolvers.",
      drivers: [
        "Term book is stable; revolving utilisation skews two facilities.",
        "Next 30 days include bullet repayments on three material tranches.",
        "Covenant headroom is widest on AED facilities, narrowest on USD trade lines.",
      ],
      recommendation: "Refresh facility A cash sweep assumptions before the utilisation spike week.",
    },
    events: [
      { id: "ln-ev-1", label: "Next repayment AED 45M — Facility Orion term (4 Apr)", daysUntil: 6 },
      { id: "ln-ev-2", label: "2 additional repayments due within 14 days", daysUntil: 12 },
    ],
    alerts: [
      { id: "ln-al-1", label: "Revolving facility A utilisation at 88% of committed limit", severity: "high" },
      { id: "ln-al-2", label: "3 facilities within 10% of limit after last drawdown cycle", severity: "medium" },
    ],
  },
};
