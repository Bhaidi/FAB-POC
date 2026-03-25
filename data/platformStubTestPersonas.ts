/**
 * Stub login → platform `organizationId` for `/api/v1/platform/*`.
 * Login IDs are normalized with `sanitizeAuthIdInput` (uppercase, A–Z / 0–9 only).
 *
 * @see docs/PLATFORM_TEST_PERSONAS.md — login table for QA
 */
import { sanitizeAuthIdInput } from "@/lib/authIdInput";

export type PlatformTestPersona = {
  organizationId: string;
  corporateId: string;
  userId: string;
  displayName: string;
  role: string;
  /** Mirrors GET /api/v1/platform/user-context `userRole`. */
  workflowRole: "MAKER" | "CHECKER" | "ADMIN";
  organizationName: string;
  isGlobalClient: boolean;
  marketsNarrative: string;
  accessNarrative: string;
};

const PAIR_TO_ORG = new Map<string, string>();

function reg(corporateId: string, userId: string, organizationId: string) {
  const c = sanitizeAuthIdInput(corporateId);
  const u = sanitizeAuthIdInput(userId);
  PAIR_TO_ORG.set(`${c}|${u}`, organizationId);
}

reg("FABMAX1", "MAXUSER1", "org-9001");
reg("FABMIN1", "MINUSER1", "org-9002");
reg("FABCHK1", "CHKUSER1", "org-9003");

export function resolveStubPlatformOrganizationId(corporateId: string, userId: string): string | undefined {
  const key = `${sanitizeAuthIdInput(corporateId)}|${sanitizeAuthIdInput(userId)}`;
  return PAIR_TO_ORG.get(key);
}

export const PLATFORM_TEST_PERSONAS: PlatformTestPersona[] = [
  {
    organizationId: "org-9001",
    corporateId: "FABMAX1",
    userId: "MAXUSER1",
    displayName: "Jordan Maxwell",
    role: "Group Chief Operating Officer",
    workflowRole: "ADMIN",
    organizationName: "Apex Continental Holdings Ltd",
    isGlobalClient: true,
    marketsNarrative: "UAE, UK, Singapore, Hong Kong, France (all active)",
    accessNarrative:
      "Full L1 access in every market slice. Max balances: 128 accounts, 10 currencies, 5 countries. Dashboard widgets show heavy workload.",
  },
  {
    organizationId: "org-9002",
    corporateId: "FABMIN1",
    userId: "MINUSER1",
    displayName: "Sam Rivera",
    role: "Treasury Analyst",
    workflowRole: "MAKER",
    organizationName: "Rivera Trading FZ-LLC",
    isGlobalClient: false,
    marketsNarrative: "UAE only",
    accessNarrative:
      "Single market; home shows four tiles (Accounts, Payments, Liquidity, Collections). One account, one currency; sparse dashboard widgets.",
  },
  {
    organizationId: "org-9003",
    corporateId: "FABCHK1",
    userId: "CHKUSER1",
    displayName: "Elena Vasquez",
    role: "Regional Payments Approver",
    workflowRole: "CHECKER",
    organizationName: "Horizon Payments Cooperative Ltd",
    isGlobalClient: true,
    marketsNarrative: "UAE, UK, Singapore",
    accessNarrative:
      "CHECKER workflow: dashboard shows approval widgets and Quick Actions with payment / payroll / trade pending counts. Balances stub: 56 accounts, 5 currencies, 3 countries.",
  },
];
