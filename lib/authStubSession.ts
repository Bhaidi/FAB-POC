/**
 * Frontend-only “logged in” flag for the stub flow. Replace with real session / cookies when integrating APIs.
 */
export const STUB_AUTH_STORAGE_KEY = "fab_stub_auth_v1";

export type StubAuthSession = {
  corporateId: string;
  userId: string;
  verifiedAt: number;
};

export function persistStubAuthSession(
  payload: Pick<StubAuthSession, "corporateId" | "userId"> & { verifiedAt?: number }
): void {
  if (typeof window === "undefined") return;
  const data: StubAuthSession = {
    corporateId: payload.corporateId,
    userId: payload.userId,
    verifiedAt: payload.verifiedAt ?? Date.now(),
  };
  try {
    sessionStorage.setItem(STUB_AUTH_STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* quota / private mode */
  }
}

export function readStubAuthSession(): StubAuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STUB_AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StubAuthSession;
    if (
      typeof parsed?.corporateId === "string" &&
      typeof parsed?.userId === "string" &&
      typeof parsed?.verifiedAt === "number"
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function clearStubAuthSession(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STUB_AUTH_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function isStubAuthenticated(): boolean {
  return readStubAuthSession() !== null;
}
