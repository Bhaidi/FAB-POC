/** GET /api/v1/platform/user-context — organization & multi-market eligibility. */

/** Machine workflow role from platform — drives dashboard widgets (not a job title). */
export type PlatformUserWorkflowRole = "MAKER" | "CHECKER" | "ADMIN";

export type PlatformUserContext = {
  userId: string;
  userName: string;
  /** Workflow persona for operational surfaces (widgets, approvals UX). */
  userRole: PlatformUserWorkflowRole;
  /** Human-readable job title for profile / nav. */
  roleTitle?: string;
  organizationId: string;
  organizationName: string;
  organizationType: string;
  isGlobalClient: boolean;
  homeMarket: string;
  defaultMarket: string;
  accessibleMarkets: string[];
  /** Reserved for future entitlement payloads */
  entitlementProfileId?: string;
};

export type PlatformUserContextResponse = PlatformUserContext;

/** Alias — same contract as `PlatformUserContext`. */
export type UserContext = PlatformUserContext;
