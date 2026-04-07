import type { AiDecision } from "@/data/aiDecisionFeedTypes";

/** Initial feed — sample set from product spec */
export const AI_DECISION_SEED: AiDecision[] = [
  {
    id: "1",
    priority: "high",
    title: "Reduce Dormant Account Exposure",
    context: "124 accounts inactive for 90+ days",
    impact: "AED 2.3M idle liquidity",
    confidence: 94,
    primaryAction: "Review Accounts",
    secondaryAction: "Auto Sweep",
    reasoning:
      "Pattern analysis shows balances stable but zero payment activity. Consolidating sweep rules for dormant buckets typically recovers 12–18% of idle cash within 30 days without closing accounts.",
  },
  {
    id: "2",
    priority: "high",
    title: "Prevent Compliance SLA Breach",
    context: "3 statements pending release",
    impact: "SLA breach in 4 days",
    confidence: 91,
    primaryAction: "Release Now",
    reasoning:
      "Regulatory calendar aligns with quarter-end filing. Releasing now preserves the 5-day buffer required under your internal policy tier.",
  },
  {
    id: "3",
    priority: "medium",
    title: "Resolve KYC Gaps",
    context: "21 accounts missing documentation",
    impact: "Regulatory risk",
    confidence: 89,
    primaryAction: "Fix in Batch",
    secondaryAction: "Export list",
    reasoning:
      "Batch remediation workflows reduce exception handling time by routing documents to the same reviewer cohort already assigned to similar entities.",
  },
];

/** Rotated in during live simulation */
export const AI_DECISION_INJECTION_POOL: AiDecision[] = [
  {
    id: "inj-1",
    priority: "medium",
    title: "Optimize FX Settlement Window",
    context: "USD leg settling T+1 vs AED T+0",
    impact: "~AED 180K timing drag / week",
    confidence: 87,
    primaryAction: "Align Windows",
    reasoning: "Aligning settlement windows reduces intraday overdraft exposure on the AED nostro.",
  },
  {
    id: "inj-2",
    priority: "low",
    title: "Refresh Beneficiary Screening",
    context: "8 beneficiaries due for periodic review",
    impact: "Operational hygiene",
    confidence: 82,
    primaryAction: "Run screening",
    secondaryAction: "Defer 7d",
    reasoning: "Low-risk counterparties; batch refresh satisfies policy without interrupting payments.",
  },
  {
    id: "inj-3",
    priority: "high",
    title: "Escalate Large Wire Cluster",
    context: "5 wires > AED 5M in 20 minutes",
    impact: "Fraud / operational signal",
    confidence: 88,
    primaryAction: "Review cluster",
    reasoning: "Velocity spike exceeds your configured treasury threshold for same-day outbound wires.",
  },
];

const PRIORITY_WEIGHT: Record<AiDecision["priority"], number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export function sortAiDecisions(list: AiDecision[]): AiDecision[] {
  return [...list].sort((a, b) => {
    const d = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
    if (d !== 0) return d;
    return b.confidence - a.confidence;
  });
}
