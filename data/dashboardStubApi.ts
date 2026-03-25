/**
 * Stub payloads for `/api/user/entitlements` and `/api/platform/status`.
 */

import type { UserEntitlementsPayload } from "@/data/dashboardTypes";

export type PlatformHealth = "operational" | "degraded" | "unavailable";

/** Demo entitlements — replace with SSO / BFF integration. */
export const stubUserEntitlements: UserEntitlementsPayload = {
  enabledPlatformIds: [
    "account-services",
    "payments",
    "liquidity-management",
    "trade-finance",
    "supply-chain-finance",
    "virtual-accounts",
    "reports-insights",
    "administration",
  ],
  /** Example: `{ "payments-payroll-upload": "locked" }` to model leaf-level controls. */
};

/** @deprecated use stubUserEntitlements.enabledPlatformIds */
export const stubEnabledPlatformIds: string[] = stubUserEntitlements.enabledPlatformIds;

export const stubPlatformStatuses: Record<string, PlatformHealth> = {
  "account-services": "operational",
  payments: "operational",
  "liquidity-management": "degraded",
  "trade-finance": "operational",
  "supply-chain-finance": "operational",
  "receivables-collections": "operational",
  "cheque-services": "unavailable",
  "virtual-accounts": "operational",
  "reports-insights": "operational",
  administration: "operational",
};
