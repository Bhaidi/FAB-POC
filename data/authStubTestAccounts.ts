/**
 * Sample credentials for manual QA of the stubbed login / push-verify flow.
 *
 * **Rules (enforced in UI):** Corporate ID and User ID are **letters and digits only**,
 * stored and shown in **UPPERCASE**. Special characters and spaces are stripped as you type.
 *
 * Behaviour is driven by **User ID** (matched case-insensitively against these keywords).
 *
 * @see `services/authService.ts` — `parseDemoScenario`
 * @see `lib/authIdInput.ts` — `sanitizeAuthIdInput`
 */
export type AuthStubTestAccount = {
  id: string;
  label: string;
  corporateId: string;
  userId: string;
  expectedOutcome: string;
};

/**
 * Copy these into the login form (you may type lower case — fields will show capitals).
 */
export const AUTH_STUB_TEST_ACCOUNTS: AuthStubTestAccount[] = [
  {
    id: "happy",
    label: "Success → dashboard",
    corporateId: "FABCORP01",
    userId: "SUCCESS",
    expectedOutcome:
      "Initiate succeeds → Approve Sign-In for at least ~10s → next poll returns approved → success screen → /dashboard (default stub org).",
  },
  {
    id: "default-happy",
    label: "Success (any other User ID)",
    corporateId: "FABCORP01",
    userId: "JDOE",
    expectedOutcome: "No keyword match → happy path. Maps to default org unless using a persona pair below.",
  },
  {
    id: "invalid",
    label: "Invalid credentials (initiate)",
    corporateId: "FABCORP01",
    userId: "INVALID",
    expectedOutcome: "Banner on login form: incorrect Corporate ID or User ID.",
  },
  {
    id: "reject",
    label: "Declined on device (verify)",
    corporateId: "FABCORP01",
    userId: "REJECT",
    expectedOutcome: "Verify screen → first poll rejected → Try Again.",
  },
  {
    id: "stub-max",
    label: "Stub — max data persona",
    corporateId: "FABMAX1",
    userId: "MAXUSER1",
    expectedOutcome:
      "Happy path → org-9001 (ADMIN). All markets, full L1 access, rich balances & widgets. See `docs/PLATFORM_TEST_PERSONAS.md`.",
  },
  {
    id: "stub-min",
    label: "Stub — minimal persona",
    corporateId: "FABMIN1",
    userId: "MINUSER1",
    expectedOutcome:
      "Happy path → org-9002 (MAKER). UAE only, four home tiles, single account/currency. See `docs/PLATFORM_TEST_PERSONAS.md`.",
  },
  {
    id: "stub-checker",
    label: "Stub — checker / approver",
    corporateId: "FABCHK1",
    userId: "CHKUSER1",
    expectedOutcome:
      "Happy path → org-9003 (CHECKER). UAE, UK, SG; approval widgets + queue counts in Quick Actions. See `docs/PLATFORM_TEST_PERSONAS.md`.",
  },
];

export function formatAuthStubTestAccountsForDisplay(): string {
  return AUTH_STUB_TEST_ACCOUNTS.map(
    (a) =>
      `• ${a.label}\n  Corporate ID: ${a.corporateId}\n  User ID: ${a.userId}\n  → ${a.expectedOutcome}\n`
  ).join("\n");
}
