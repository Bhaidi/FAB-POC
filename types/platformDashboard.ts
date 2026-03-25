/**
 * GET /api/v1/platform/dashboard/widgets — persona-scoped dashboard payload.
 * UI renders from `widgets[]` + `kind`; do not branch on persona in components.
 */

import type { PlatformUserWorkflowRole } from "@/types/platformUserContext";

export type DashboardWidgetCta = {
  label: string;
  actionId?: string;
  href?: string;
};

export type DashboardWidget = {
  id: string;
  /** Stable presenter id — maps to a renderer registry entry. */
  kind: string;
  title: string;
  subtitle?: string;
  /** Visual hierarchy (e.g. checker “pending approvals” hero). */
  emphasis?: "primary" | "default";
  cta?: DashboardWidgetCta;
  data: Record<string, unknown>;
};

/** Persona-scoped counts for home Quick Actions — server-derived from the same stub as widgets. */
export type DashboardQuickActionsPayload =
  | { role: "MAKER"; draftCount: number }
  | {
      role: "CHECKER";
      pendingPayments: number;
      pendingPayroll: number;
      pendingTrade: number;
    }
  | {
      role: "ADMIN";
      draftCount: number;
      pendingPayments: number;
      pendingPayroll: number;
      pendingTrade: number;
    };

export type DashboardWidgetsResponse = {
  marketCode: string;
  refreshedAt: string;
  personaRole: PlatformUserWorkflowRole;
  /** Single-line hero context — copy from API, no persona conditionals in UI. */
  workspaceLine: string;
  widgets: DashboardWidget[];
  quickActions: DashboardQuickActionsPayload;
};
