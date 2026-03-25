/**
 * Stubbed auth API — replace with fetch/GraphQL. Delays and outcomes are deterministic per session.
 *
 * Demo User IDs: letters/digits only, matched case-insensitively (UI stores UPPERCASE).
 * - success | ok        → push verify → at least 10s on Approve Sign-In, then approved on next status poll (happy stub)
 * - invalid             → INVALID_CREDENTIALS on initiate
 * - notregistered       → NOT_REGISTERED on initiate
 * - error               → ERROR on initiate
 * - reject              → verify then REJECTED on first status check
 * - expire              → verify then EXPIRED on first status check
 * - errpoll             → verify then ERROR on second poll
 * - pending             → verify stays PENDING (manual cancel / back)
 *
 * Sample rows for QA: `data/authStubTestAccounts.ts` (`AUTH_STUB_TEST_ACCOUNTS`).
 */
import type {
  CheckLoginStatusResult,
  InitiateLoginPayload,
  InitiateLoginResult,
} from "@/services/authTypes";

const INIT_MIN_MS = 800;
const INIT_MAX_MS = 1500;
const POLL_MIN_MS = 2000;
const POLL_MAX_MS = 2800;

/** Stub: minimum time from session start before happy path may return APPROVED (keeps Approve Sign-In visible). */
const STUB_MIN_VERIFY_UI_MS = 10_000;

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function randomDelay(min: number, max: number): Promise<void> {
  return sleep(min + Math.floor(Math.random() * (max - min + 1)));
}

export type DemoScenario =
  | "happy"
  | "invalid_credentials"
  | "not_registered"
  | "init_error"
  | "verify_reject"
  | "verify_expire"
  | "verify_error_poll"
  | "verify_pending_forever";

type TerminalResult =
  | { kind: "APPROVED" }
  | { kind: "REJECTED"; message: string }
  | { kind: "EXPIRED"; message: string }
  | { kind: "ERROR"; message: string };

type SessionRecord = {
  scenario: DemoScenario;
  pollCount: number;
  /** `Date.now()` when initiate succeeded — used for minimum verify-screen dwell (stub). */
  createdAt: number;
  /** Set once terminal — duplicate status calls (overlapping polls) return the same outcome. */
  terminal?: TerminalResult;
};

const sessions = new Map<string, SessionRecord>();

function parseDemoScenario(userId: string): DemoScenario {
  const u = userId.trim().toLowerCase();
  if (u === "invalid") return "invalid_credentials";
  if (u === "notregistered" || u === "notreg") return "not_registered";
  if (u === "error") return "init_error";
  if (u === "reject" || u === "declined") return "verify_reject";
  if (u === "expire" || u === "expired") return "verify_expire";
  if (u === "errpoll") return "verify_error_poll";
  if (u === "pending") return "verify_pending_forever";
  if (u === "success" || u === "ok") return "happy";
  return "happy";
}

export function resolveDemoScenarioForUserId(userId: string): DemoScenario {
  return parseDemoScenario(userId);
}

export const authMessages = {
  invalidCredentials: "Invalid Corporate ID or User ID.",
  notRegistered: "This user is not registered for mobile authentication.",
  initError: "We are unable to complete your request right now. Please try again.",
  verifyError: "We could not verify your login request. Please try again.",
  expired: "Your verification request has expired. Please start again.",
  rejected: "The request was declined from your mobile device.",
} as const;

export async function initiateLogin(payload: InitiateLoginPayload): Promise<InitiateLoginResult> {
  await randomDelay(INIT_MIN_MS, INIT_MAX_MS);

  const scenario = parseDemoScenario(payload.userId);

  if (scenario === "invalid_credentials") {
    return { status: "INVALID_CREDENTIALS", message: authMessages.invalidCredentials };
  }
  if (scenario === "not_registered") {
    return { status: "NOT_REGISTERED", message: authMessages.notRegistered };
  }
  if (scenario === "init_error") {
    return { status: "ERROR", message: authMessages.initError };
  }

  const sessionId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `sess_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

  const challengeNumber = String(Math.floor(10 + Math.random() * 89));

  sessions.set(sessionId, {
    scenario,
    pollCount: 0,
    createdAt: Date.now(),
  });

  return {
    status: "SUCCESS",
    challengeNumber,
    sessionId,
  };
}

function terminalToStatus(t: TerminalResult): CheckLoginStatusResult {
  switch (t.kind) {
    case "APPROVED":
      return { status: "APPROVED" };
    case "REJECTED":
      return { status: "REJECTED", message: t.message };
    case "EXPIRED":
      return { status: "EXPIRED", message: t.message };
    case "ERROR":
      return { status: "ERROR", message: t.message };
  }
}

export async function checkLoginStatus(sessionId: string): Promise<CheckLoginStatusResult> {
  await randomDelay(POLL_MIN_MS, POLL_MAX_MS);

  const rec = sessions.get(sessionId);
  if (!rec) {
    return { status: "ERROR", message: authMessages.verifyError };
  }

  if (rec.terminal) {
    return terminalToStatus(rec.terminal);
  }

  rec.pollCount += 1;
  const { scenario, pollCount } = rec;

  if (scenario === "verify_pending_forever") {
    return { status: "PENDING" };
  }
  if (scenario === "verify_reject" && pollCount >= 1) {
    rec.terminal = { kind: "REJECTED", message: authMessages.rejected };
    return { status: "REJECTED", message: authMessages.rejected };
  }
  if (scenario === "verify_expire" && pollCount >= 1) {
    rec.terminal = { kind: "EXPIRED", message: authMessages.expired };
    return { status: "EXPIRED", message: authMessages.expired };
  }
  if (scenario === "verify_error_poll" && pollCount >= 2) {
    rec.terminal = { kind: "ERROR", message: authMessages.verifyError };
    return { status: "ERROR", message: authMessages.verifyError };
  }

  if (scenario === "happy") {
    if (Date.now() - rec.createdAt < STUB_MIN_VERIFY_UI_MS) {
      return { status: "PENDING" };
    }
    rec.terminal = { kind: "APPROVED" };
    return { status: "APPROVED" };
  }

  if (scenario === "verify_error_poll" && pollCount < 2) {
    return { status: "PENDING" };
  }

  return { status: "PENDING" };
}

export function cancelLogin(sessionId: string | null): void {
  if (sessionId) sessions.delete(sessionId);
}
