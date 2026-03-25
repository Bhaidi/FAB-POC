/**
 * Stub builder for GET /api/v1/platform/dashboard/widgets.
 * Persona and widget set are decided server-side from user-context + market.
 */
import {
  canLoadOperationalMarketData,
  getUserContext,
  normalizeMarketCode,
} from "@/lib/server/platformStubRepository";
import type {
  DashboardQuickActionsPayload,
  DashboardWidgetsResponse,
  DashboardWidget,
} from "@/types/platformDashboard";
import type { PlatformUserWorkflowRole } from "@/types/platformUserContext";

function isMinStubOrg(organizationId: string): boolean {
  return organizationId === "org-9002";
}

function isMaxStubOrg(organizationId: string): boolean {
  return organizationId === "org-9001";
}

function isCheckerDemoOrg(organizationId: string): boolean {
  return organizationId === "org-9003";
}

function checkerPendingCounts(
  organizationId: string,
  _marketCode: string
): { pendingPayments: number; pendingPayroll: number; pendingTrade: number } {
  if (isMinStubOrg(organizationId)) {
    return { pendingPayments: 0, pendingPayroll: 0, pendingTrade: 0 };
  }
  if (isMaxStubOrg(organizationId)) {
    return { pendingPayments: 38, pendingPayroll: 15, pendingTrade: 22 };
  }
  if (isCheckerDemoOrg(organizationId)) {
    return { pendingPayments: 22, pendingPayroll: 11, pendingTrade: 14 };
  }
  return { pendingPayments: 6, pendingPayroll: 3, pendingTrade: 5 };
}

function makerDraftCountStub(organizationId: string, _marketCode: string): number {
  if (isMinStubOrg(organizationId)) return 0;
  if (isMaxStubOrg(organizationId)) return 18;
  return 3;
}

function buildQuickActionsPayload(
  personaRole: PlatformUserWorkflowRole,
  organizationId: string,
  marketCode: string
): DashboardQuickActionsPayload {
  const drafts = makerDraftCountStub(organizationId, marketCode);
  if (personaRole === "CHECKER") {
    return { role: "CHECKER", ...checkerPendingCounts(organizationId, marketCode) };
  }
  if (personaRole === "ADMIN") {
    return {
      role: "ADMIN",
      draftCount: drafts,
      ...checkerPendingCounts(organizationId, marketCode),
    };
  }
  return { role: "MAKER", draftCount: drafts };
}

function baseMeta(marketCode: string, personaRole: PlatformUserWorkflowRole): Pick<DashboardWidgetsResponse, "marketCode" | "refreshedAt" | "personaRole" | "workspaceLine"> {
  const refreshedAt = new Date().toISOString();
  const workspaceLine =
    personaRole === "CHECKER"
      ? `Approval workload and exceptions for ${marketCode} — prioritize by value and age.`
      : personaRole === "ADMIN"
        ? `Full operational workspace for ${marketCode} — drafts, submissions, and approval queues.`
        : `Creation and tracking for ${marketCode} — submissions, drafts, and recent movement.`;
  return { marketCode, refreshedAt, personaRole, workspaceLine };
}

function makerWidgets(marketCode: string, orgSuffix: string, organizationId: string): DashboardWidget[] {
  const m = marketCode;
  const draftCount = makerDraftCountStub(organizationId, marketCode);
  const min = isMinStubOrg(organizationId);
  const max = isMaxStubOrg(organizationId);

  return [
    {
      id: `maker-submitted-${orgSuffix}-${m}`,
      kind: "maker_submitted_items",
      title: "My submitted items",
      subtitle: "Pipeline by status",
      data: min
        ? { awaitingApproval: 0, rejected: 0, processed: 1 }
        : max
          ? { awaitingApproval: 52, rejected: 4, processed: 1840 }
          : { awaitingApproval: 5, rejected: 1, processed: 42 },
      cta: { label: "View pipeline", actionId: "maker.open.submissions" },
    },
    {
      id: `maker-attn-${orgSuffix}-${m}`,
      kind: "maker_needs_attention",
      title: "Needs attention",
      subtitle: "Items requiring action",
      data: min
        ? { rejectedItems: 0, failedTransactions: 0 }
        : max
          ? { rejectedItems: 7, failedTransactions: 14 }
          : { rejectedItems: 1, failedTransactions: 2 },
      cta: { label: "Resolve issues", actionId: "maker.open.attention" },
    },
    {
      id: `maker-recent-${orgSuffix}-${m}`,
      kind: "maker_recent_activity",
      title: "Recent activity",
      subtitle: "Latest created transactions",
      data: {
        transactions: min
          ? [
              {
                id: "TX-1001",
                type: "Internal transfer",
                status: "Processed",
                createdAt: "2025-03-20T11:00:00Z",
              },
            ]
          : max
            ? [
                { id: "TX-9821", type: "Cross-border payment", status: "Submitted", createdAt: "2025-03-23T09:12:00Z" },
                { id: "TX-9814", type: "Liquidity transfer", status: "Pending release", createdAt: "2025-03-23T08:40:00Z" },
                { id: "TX-9802", type: "FX request", status: "Draft saved", createdAt: "2025-03-22T16:05:00Z" },
                { id: "TX-9788", type: "Collection file", status: "Processed", createdAt: "2025-03-22T11:22:00Z" },
                { id: "TX-9771", type: "SCF drawdown", status: "Submitted", createdAt: "2025-03-22T09:18:00Z" },
                { id: "TX-9760", type: "Payroll batch", status: "Processed", createdAt: "2025-03-21T17:40:00Z" },
              ]
            : [
                { id: "TX-9821", type: "Cross-border payment", status: "Submitted", createdAt: "2025-03-23T09:12:00Z" },
                { id: "TX-9814", type: "Liquidity transfer", status: "Pending release", createdAt: "2025-03-23T08:40:00Z" },
                { id: "TX-9802", type: "FX request", status: "Draft saved", createdAt: "2025-03-22T16:05:00Z" },
                { id: "TX-9788", type: "Collection file", status: "Processed", createdAt: "2025-03-22T11:22:00Z" },
              ],
      },
      cta: { label: "Full activity", actionId: "maker.open.activity" },
    },
    {
      id: `maker-drafts-${orgSuffix}-${m}`,
      kind: "maker_drafts",
      title: "Drafts",
      subtitle: "Saved items",
      data: {
        count: draftCount,
        lastEdited: min ? "—" : "2025-03-23T07:55:00Z",
      },
      cta: { label: "Continue draft", actionId: "maker.open.drafts" },
    },
  ];
}

function checkerWidgets(marketCode: string, orgSuffix: string, organizationId: string): DashboardWidget[] {
  const m = marketCode;
  const { pendingPayments, pendingPayroll, pendingTrade } = checkerPendingCounts(organizationId, marketCode);
  const total = pendingPayments + pendingPayroll + pendingTrade;
  return [
    {
      id: `chk-pending-${orgSuffix}-${m}`,
      kind: "checker_pending_approvals",
      title: "Pending approvals",
      subtitle: "Awaiting your decision",
      emphasis: "primary",
      data: {
        total,
        breakdown: [
          { label: "Payments", count: pendingPayments },
          { label: "Payroll", count: pendingPayroll },
          { label: "Trade", count: pendingTrade },
        ],
      },
      cta: { label: "Open queue", actionId: "checker.open.queue" },
    },
    {
      id: `chk-hv-${orgSuffix}-${m}`,
      kind: "checker_high_value_queue",
      title: "High value items",
      subtitle: "Top attention by amount",
      data: {
        items: [
          { id: "APP-4412", label: "Vendor payment — APAC", amount: "4.2M", currency: "USD" },
          { id: "APP-4401", label: "Treasury sweep — London", amount: "2.8M", currency: "GBP" },
          { id: "APP-4388", label: "LC amendment", amount: "1.1M", currency: "EUR" },
        ],
      },
      cta: { label: "Review high value", actionId: "checker.open.highValue" },
    },
    {
      id: `chk-aging-${orgSuffix}-${m}`,
      kind: "checker_aging_approvals",
      title: "Aging approvals",
      subtitle: "Beyond service threshold",
      data: {
        countOver24h: 4,
        oldestPendingLabel: "APP-4290 · Inward remittance",
        oldestPendingHours: 38,
      },
      cta: { label: "Age report", actionId: "checker.open.aging" },
    },
    {
      id: `chk-alerts-${orgSuffix}-${m}`,
      kind: "checker_alerts_exceptions",
      title: "Alerts & exceptions",
      subtitle: "Flagged and risk signals",
      data: {
        items: [
          { id: "ALT-901", severity: "high", label: "Velocity breach — beneficiary change" },
          { id: "ALT-898", severity: "medium", label: "Sanctions re-screen queued" },
          { id: "ALT-887", severity: "low", label: "Threshold policy exception" },
        ],
      },
      cta: { label: "Exception inbox", actionId: "checker.open.alerts" },
    },
  ];
}

export function getDashboardWidgetsPayload(organizationId: string, marketCodeRaw: string): DashboardWidgetsResponse | null {
  const marketCode = normalizeMarketCode(marketCodeRaw);
  if (!canLoadOperationalMarketData(organizationId, marketCode)) {
    return null;
  }
  const personaRole = getUserContext(organizationId).userRole;
  const orgKey = organizationId.replace(/[^a-z0-9]/gi, "");
  const widgets =
    personaRole === "CHECKER"
      ? checkerWidgets(marketCode, orgKey, organizationId)
      : makerWidgets(marketCode, orgKey, organizationId);
  const capped = widgets.slice(0, 4);
  const quickActions = buildQuickActionsPayload(personaRole, organizationId, marketCode);
  return {
    ...baseMeta(marketCode, personaRole),
    widgets: capped,
    quickActions,
  };
}
