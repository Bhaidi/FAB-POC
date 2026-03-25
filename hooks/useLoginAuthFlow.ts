"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AUTH_ID_MIN_LENGTH, sanitizeAuthIdInput } from "@/lib/authIdInput";
import { persistStubAuthSession } from "@/lib/authStubSession";
import { cancelLogin, checkLoginStatus, initiateLogin } from "@/services/authService";
import type { InitiateLoginFailure } from "@/services/authTypes";

const POLL_MS = 2600;

/** Visible code expiry on Approve Sign-In (must match UI timer). */
export const VERIFICATION_COUNTDOWN_SECONDS = 60;

export type LoginFlowPhase =
  | "loginForm"
  | "initiatingLogin"
  | "verifyPending"
  | "verifyCompleting"
  | "verifyApproved"
  | "verifyRejected"
  | "verifyExpired"
  | "verifyError";

export type FieldErrors = {
  corporateId?: string;
  userId?: string;
};

function validateFields(corporateId: string, userId: string): FieldErrors {
  const c = sanitizeAuthIdInput(corporateId);
  const u = sanitizeAuthIdInput(userId);
  const errors: FieldErrors = {};
  if (!c) {
    errors.corporateId = "Corporate ID is required. Use letters and numbers only (no spaces or symbols).";
  } else if (c.length < AUTH_ID_MIN_LENGTH) {
    errors.corporateId = `Corporate ID must be at least ${AUTH_ID_MIN_LENGTH} characters.`;
  }
  if (!u) {
    errors.userId = "User ID is required. Use letters and numbers only (no spaces or symbols).";
  } else if (u.length < AUTH_ID_MIN_LENGTH) {
    errors.userId = `User ID must be at least ${AUTH_ID_MIN_LENGTH} characters.`;
  }
  return errors;
}

export function useLoginAuthFlow() {
  const [phase, setPhase] = useState<LoginFlowPhase>("loginForm");
  const [corporateId, setCorporateIdRaw] = useState("");
  const [userId, setUserIdRaw] = useState("");

  const setCorporateId = useCallback((v: string) => {
    setCorporateIdRaw(sanitizeAuthIdInput(v));
  }, []);

  const setUserId = useCallback((v: string) => {
    setUserIdRaw(sanitizeAuthIdInput(v));
  }, []);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formLevelError, setFormLevelError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const sessionRef = useRef<string | null>(null);
  const [challengeNumber, setChallengeNumber] = useState<string>("");
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);
  /** Bumps when entering verify or after resend so countdown UI resets. */
  const [verificationResetKey, setVerificationResetKey] = useState(0);

  const pollTimeoutRef = useRef<number | null>(null);
  /** Bumped when a poll generation is aborted — in-flight `checkLoginStatus` results are ignored. */
  const statusPollIdRef = useRef(0);
  const phaseRef = useRef<LoginFlowPhase>(phase);
  phaseRef.current = phase;

  const clearScheduledPoll = useCallback(() => {
    if (pollTimeoutRef.current !== null) {
      window.clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
  }, []);

  /** Cancel next scheduled tick and invalidate any in-flight poll (resend / reset / unmount). */
  const abortStatusPolling = useCallback(() => {
    clearScheduledPoll();
    statusPollIdRef.current += 1;
  }, [clearScheduledPoll]);

  const resetToLogin = useCallback(
    (opts?: { clearFields?: boolean }) => {
      abortStatusPolling();
      cancelLogin(sessionRef.current);
      sessionRef.current = null;
      setSessionId(null);
      setChallengeNumber("");
      setVerifyMessage(null);
      setFormLevelError(null);
      setFieldErrors({});
      if (opts?.clearFields) {
        setCorporateIdRaw("");
        setUserIdRaw("");
      }
      setPhase("loginForm");
    },
    [abortStatusPolling]
  );

  const runStatusPoll = useCallback(
    (sid: string, creds: { corporateId: string; userId: string }) => {
      abortStatusPolling();
      const pollId = statusPollIdRef.current;

      const scheduleNext = (delayMs: number) => {
        clearScheduledPoll();
        pollTimeoutRef.current = window.setTimeout(() => {
          void runTick();
        }, delayMs) as unknown as number;
      };

      const runTick = async () => {
        pollTimeoutRef.current = null;
        try {
          const res = await checkLoginStatus(sid);
          if (pollId !== statusPollIdRef.current) return;

          /** Drop stale completions (e.g. slow network) once user left Approve Sign-In. */
          if (phaseRef.current !== "verifyPending") {
            return;
          }

          if (res.status === "PENDING") {
            setPhase("verifyPending");
            if (pollId !== statusPollIdRef.current) return;
            scheduleNext(POLL_MS);
            return;
          }

          clearScheduledPoll();

          if (pollId !== statusPollIdRef.current) return;

          if (res.status === "APPROVED") {
            persistStubAuthSession({ corporateId: creds.corporateId, userId: creds.userId });
            /** Invalidate any other in-flight tick so it cannot flip phase after success. */
            statusPollIdRef.current += 1;
            setPhase("verifyCompleting");
            return;
          }
          if (res.status === "REJECTED") {
            setVerifyMessage(res.message);
            setPhase("verifyRejected");
            return;
          }
          if (res.status === "EXPIRED") {
            setVerifyMessage(res.message);
            setPhase("verifyExpired");
            return;
          }
          setVerifyMessage(res.message);
          setPhase("verifyError");
        } catch {
          if (pollId !== statusPollIdRef.current) return;
          if (phaseRef.current !== "verifyPending") return;
          clearScheduledPoll();
          setVerifyMessage("We could not verify your login request. Please try again.");
          setPhase("verifyError");
        }
      };

      scheduleNext(0);
    },
    [abortStatusPolling, clearScheduledPoll]
  );

  useEffect(() => {
    sessionRef.current = sessionId;
  }, [sessionId]);

  useEffect(() => {
    return () => {
      abortStatusPolling();
      cancelLogin(sessionRef.current);
    };
  }, [abortStatusPolling]);

  const submitLogin = useCallback(async () => {
    setFormLevelError(null);
    const c = sanitizeAuthIdInput(corporateId);
    const u = sanitizeAuthIdInput(userId);
    const errs = validateFields(corporateId, userId);
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setPhase("initiatingLogin");
    try {
      const result = await initiateLogin({ corporateId: c, userId: u });
      if (result.status !== "SUCCESS") {
        const fail = result as InitiateLoginFailure;
        setFormLevelError(fail.message);
        setPhase("loginForm");
        return;
      }
      setCorporateId(c);
      setUserId(u);
      sessionRef.current = result.sessionId;
      setSessionId(result.sessionId);
      setChallengeNumber(result.challengeNumber);
      setVerificationResetKey((k) => k + 1);
      setPhase("verifyPending");
      runStatusPoll(result.sessionId, { corporateId: c, userId: u });
    } catch {
      setFormLevelError("We are unable to complete your request right now. Please try again.");
      setPhase("loginForm");
    }
  }, [corporateId, userId, runStatusPoll]);

  const cancelVerification = useCallback(() => {
    resetToLogin();
  }, [resetToLogin]);

  /**
   * Code timer hit 0 — stop polling, clear stub session, stay on Approve Sign-In
   * so the user can Resend (does not navigate to the full-page expired screen).
   */
  const expireVerificationCode = useCallback(() => {
    if (phaseRef.current !== "verifyPending") return;
    abortStatusPolling();
    cancelLogin(sessionRef.current);
    sessionRef.current = null;
    setSessionId(null);
    setChallengeNumber("");
    setVerifyMessage(null);
  }, [abortStatusPolling]);

  const completeVerificationSuccess = useCallback(() => {
    setPhase((p) => (p === "verifyCompleting" ? "verifyApproved" : p));
  }, []);

  const resendVerificationRequest = useCallback(async (): Promise<boolean> => {
    const c = sanitizeAuthIdInput(corporateId);
    const u = sanitizeAuthIdInput(userId);
    if (!c || !u) return false;
    abortStatusPolling();
    const prev = sessionRef.current;
    if (prev) cancelLogin(prev);
    try {
      const result = await initiateLogin({ corporateId: c, userId: u });
      if (result.status !== "SUCCESS") {
        setVerifyMessage(
          (result as InitiateLoginFailure).message ?? "We could not resend the verification request."
        );
        setPhase("verifyError");
        return false;
      }
      sessionRef.current = result.sessionId;
      setSessionId(result.sessionId);
      setChallengeNumber(result.challengeNumber);
      setVerifyMessage(null);
      setVerificationResetKey((k) => k + 1);
      setPhase("verifyPending");
      runStatusPoll(result.sessionId, { corporateId: c, userId: u });
      return true;
    } catch {
      setVerifyMessage("We could not resend the verification request. Please try again.");
      setPhase("verifyError");
      return false;
    }
  }, [corporateId, userId, abortStatusPolling, runStatusPoll]);

  return {
    phase,
    corporateId,
    userId,
    setCorporateId,
    setUserId,
    fieldErrors,
    formLevelError,
    challengeNumber,
    verifyMessage,
    verificationResetKey,
    submitLogin,
    resetToLogin,
    cancelVerification,
    expireVerificationCode,
    resendVerificationRequest,
    completeVerificationSuccess,
  };
}
