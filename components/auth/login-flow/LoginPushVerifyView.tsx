"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AuthPrimaryCtaButton } from "@/components/auth/AuthPrimaryCtaButton";
import { authStepsSectionLabel, authVerifyScreenSpacing } from "@/components/auth/authTokens";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import { AuthRecoveryActions } from "@/components/auth/login-flow/AuthRecoveryActions";
import { ChallengeNumberCard, type VerifyCardPhase } from "@/components/auth/login-flow/ChallengeNumberCard";
import { VerifyCodeExpiryTimer } from "@/components/auth/login-flow/VerifyCodeExpiryTimer";
import { useVerificationCountdown } from "@/hooks/useVerificationCountdown";
import { VERIFICATION_COUNTDOWN_SECONDS } from "@/hooks/useLoginAuthFlow";

const verifySecondarySize = { base: "15px", md: "15px" } as const;
const verifyCaptionSize = { base: "14px", md: "15px" } as const;

const EASE_OUT = [0.33, 1, 0.68, 1] as const;
const EASE_IN_OUT = [0.42, 0, 0.58, 1] as const;

const STAGGER = {
  eyebrow: 0,
  title: 0.09,
  secondary: 0.17,
  card: 0.28,
  timer: 0.4,
} as const;

const RESEND_MIN_MS = 1500;

/** Full verify → success handoff (ms), aligned with card + copy motion */
const SUCCESS_SEQUENCE_MS = 1120;
const SUCCESS_SEQUENCE_MS_RM = 320;

const COPY_SWAP_MS = 320;
const CTA_IN_MS = 820;
const SUBTEXT_STAGGER_MS = 120;

export type LoginVerifyTimelinePhase = "verifyPending" | "verifyCompleting" | "verifyApproved";

export type LoginPushVerifyViewProps = {
  timelinePhase: LoginVerifyTimelinePhase;
  challengeNumber: string;
  countdownResetKey: number;
  onCountdownExpire: () => void;
  onResendRequest: () => Promise<boolean>;
  onCancel: () => void;
  /** After the in-place success sequence, advance flow to `verifyApproved`. */
  onSuccessSequenceComplete?: () => void;
  /** Continue CTA and auto-redirect — navigate to the app. */
  onContinueToDashboard: () => void;
};

/**
 * Approve Sign-In through You're signed in — single column; success is a continuation (no remount).
 */
export function LoginPushVerifyView({
  timelinePhase,
  challengeNumber,
  countdownResetKey,
  onCountdownExpire,
  onResendRequest,
  onCancel,
  onSuccessSequenceComplete,
  onContinueToDashboard,
}: LoginPushVerifyViewProps) {
  const reduceMotion = useReducedMotion();
  const rm = reduceMotion === true;
  const { authColors, authColumnTypography } = useFabTokens();
  const [resendBusy, setResendBusy] = useState(false);
  const [shimmerNonce, setShimmerNonce] = useState(0);
  const [codeExpired, setCodeExpired] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [uiSuccess, setUiSuccess] = useState(false);
  const [ctaReady, setCtaReady] = useState(false);
  const [showRedirecting, setShowRedirecting] = useState(false);
  const exitTimerRef = useRef<number | null>(null);
  const sequenceTimersRef = useRef<number[]>([]);
  const redirectTimersRef = useRef<number[]>([]);

  const handleTimerExpire = useCallback(() => {
    setCodeExpired(true);
    onCountdownExpire();
  }, [onCountdownExpire]);

  const countdown = useVerificationCountdown(
    VERIFICATION_COUNTDOWN_SECONDS,
    countdownResetKey,
    handleTimerExpire
  );

  useEffect(() => {
    setCodeExpired(false);
  }, [countdownResetKey]);

  const clearSequenceTimers = useCallback(() => {
    sequenceTimersRef.current.forEach((id) => window.clearTimeout(id));
    sequenceTimersRef.current = [];
  }, []);

  const clearRedirectTimers = useCallback(() => {
    redirectTimersRef.current.forEach((id) => window.clearTimeout(id));
    redirectTimersRef.current = [];
  }, []);

  useEffect(() => {
    clearSequenceTimers();
    clearRedirectTimers();

    if (timelinePhase === "verifyPending") {
      setUiSuccess(false);
      setCtaReady(false);
      setShowRedirecting(false);
      return;
    }

    if (timelinePhase === "verifyApproved") {
      setUiSuccess(true);
      setCtaReady(true);
      const t1 = window.setTimeout(() => setShowRedirecting(true), 2000) as unknown as number;
      const t2 = window.setTimeout(() => {
        onContinueToDashboard();
      }, 4000) as unknown as number;
      redirectTimersRef.current = [t1, t2];
      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
      };
    }

    if (timelinePhase === "verifyCompleting") {
      setUiSuccess(false);
      setCtaReady(false);
      setShowRedirecting(false);

      const q = (ms: number, fn: () => void) => {
        sequenceTimersRef.current.push(window.setTimeout(fn, ms) as unknown as number);
      };

      const seqMs = rm ? SUCCESS_SEQUENCE_MS_RM : SUCCESS_SEQUENCE_MS;
      const swapMs = rm ? 80 : COPY_SWAP_MS;
      const ctaMs = rm ? 180 : CTA_IN_MS;

      q(swapMs, () => setUiSuccess(true));
      q(ctaMs, () => setCtaReady(true));
      q(seqMs, () => {
        onSuccessSequenceComplete?.();
      });

      return clearSequenceTimers;
    }

    return undefined;
  }, [timelinePhase, rm, onSuccessSequenceComplete, onContinueToDashboard, clearSequenceTimers, clearRedirectTimers]);

  const handleResend = async () => {
    if (resendBusy || timelinePhase !== "verifyPending") return;
    setResendBusy(true);
    setShimmerNonce((n) => n + 1);
    const started = Date.now();
    try {
      await onResendRequest();
    } finally {
      const elapsed = Date.now() - started;
      const rest = Math.max(0, RESEND_MIN_MS - elapsed);
      window.setTimeout(() => setResendBusy(false), rest);
    }
  };

  const handleCancel = useCallback(() => {
    if (isExiting || timelinePhase !== "verifyPending") return;
    setIsExiting(true);
    if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current);
    exitTimerRef.current = window.setTimeout(() => {
      exitTimerRef.current = null;
      onCancel();
    }, 260) as unknown as number;
  }, [isExiting, timelinePhase, onCancel]);

  const handleContinue = useCallback(() => {
    clearRedirectTimers();
    clearSequenceTimers();
    onSuccessSequenceComplete?.();
    onContinueToDashboard();
  }, [clearRedirectTimers, clearSequenceTimers, onSuccessSequenceComplete, onContinueToDashboard]);

  useEffect(() => {
    return () => {
      if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current);
      clearSequenceTimers();
      clearRedirectTimers();
    };
  }, [clearSequenceTimers, clearRedirectTimers]);

  const s = authVerifyScreenSpacing;
  const codeDisabled = codeExpired || challengeNumber.length === 0;
  const isPendingOnly = timelinePhase === "verifyPending";
  const ambientOn = isPendingOnly && !codeExpired;

  const cardPhase: VerifyCardPhase =
    timelinePhase === "verifyPending"
      ? "challenge"
      : timelinePhase === "verifyCompleting"
        ? "successAnimating"
        : "successStill";

  const fadeUp = (delay: number) =>
    rm
      ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
      : {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.42, delay, ease: EASE_OUT },
        };

  const titleCrossfade = (delay: number) =>
    rm
      ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
      : {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.44, delay, ease: EASE_IN_OUT },
        };

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={isExiting ? { opacity: 0, y: 12 } : { opacity: 1, y: 0 }}
      transition={
        reduceMotion ? { duration: 0 } : { duration: isExiting ? 0.25 : 0.3, ease: EASE_OUT }
      }
      style={{ width: "100%" }}
    >
      <VStack
        align="center"
        spacing={0}
        w="full"
        maxW="min(520px, 100%)"
        mx="auto"
        pt={2}
        pb={{ base: 10, md: 12, lg: 14 }}
      >
        {isPendingOnly ? (
          <motion.div {...fadeUp(STAGGER.eyebrow)} style={{ width: "100%" }}>
            <Text
              fontFamily="var(--font-graphik)"
              {...authStepsSectionLabel}
              letterSpacing="0.2em"
              color={authColors.text.muted}
              textAlign="center"
            >
              VERIFYING ACCESS
            </Text>
          </motion.div>
        ) : (
          <Box w="full" position="relative" minH="1.25em">
            <AnimatePresence mode="wait" initial={false}>
              {!uiSuccess ? (
                <motion.div
                  key="eyebrow-verify"
                  initial={{ opacity: 1, y: 0 }}
                  exit={rm ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={{ duration: rm ? 0 : 0.34, ease: EASE_IN_OUT }}
                  style={{ position: "absolute", width: "100%", left: 0, top: 0 }}
                >
                  <Text
                    fontFamily="var(--font-graphik)"
                    {...authStepsSectionLabel}
                    letterSpacing="0.2em"
                    color={authColors.text.muted}
                    textAlign="center"
                  >
                    VERIFYING ACCESS
                  </Text>
                </motion.div>
              ) : (
                <motion.div
                  key="eyebrow-success"
                  {...titleCrossfade(0.02)}
                  style={{ width: "100%" }}
                >
                  <Text
                    fontFamily="var(--font-graphik)"
                    {...authStepsSectionLabel}
                    letterSpacing="0.2em"
                    color={authColors.text.muted}
                    textAlign="center"
                  >
                    ACCESS CONFIRMED
                  </Text>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        )}

        {isPendingOnly ? (
          <motion.div {...fadeUp(STAGGER.title)} style={{ width: "100%" }}>
            <Text
              as="h1"
              fontFamily="var(--font-graphik)"
              {...authColumnTypography.title}
              color={authColors.text.primary}
              textAlign="center"
              mt={s.eyebrowToTitle}
            >
              Approve Sign-In
            </Text>
          </motion.div>
        ) : (
          <Box w="full" position="relative" minH={{ base: "2.6rem", md: "2.85rem" }} mt={s.eyebrowToTitle}>
            <AnimatePresence mode="wait" initial={false}>
              {!uiSuccess ? (
                <motion.div
                  key="title-verify"
                  initial={{ opacity: 1, y: 0 }}
                  exit={rm ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: rm ? 0 : 0.36, ease: EASE_IN_OUT }}
                  style={{ position: "absolute", width: "100%", left: 0, top: 0 }}
                >
                  <Text
                    as="h1"
                    fontFamily="var(--font-graphik)"
                    {...authColumnTypography.title}
                    color={authColors.text.primary}
                    textAlign="center"
                  >
                    Approve Sign-In
                  </Text>
                </motion.div>
              ) : (
                <motion.div key="title-success" {...titleCrossfade(0.04)} style={{ width: "100%" }}>
                  <Text
                    as="h1"
                    fontFamily="var(--font-graphik)"
                    {...authColumnTypography.title}
                    color={authColors.text.primary}
                    textAlign="center"
                  >
                    You&apos;re signed in
                  </Text>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        )}

        {isPendingOnly ? (
          <motion.div {...fadeUp(STAGGER.secondary)} style={{ width: "100%" }}>
            <Text
              fontFamily="var(--font-graphik)"
              fontSize={verifySecondarySize}
              lineHeight="1.5"
              fontWeight={400}
              color={authColors.text.secondary}
              textAlign="center"
              mt={s.titleToSecondary}
              px={{ base: 2, md: 0 }}
            >
              Open your FAB Corporate Mobile App and approve the request. Enter the number if prompted.
            </Text>
          </motion.div>
        ) : (
          <Box w="full" position="relative" minH={{ base: "4.75rem", md: "4.5rem" }} mt={s.titleToSecondary}>
            <AnimatePresence mode="wait" initial={false}>
              {!uiSuccess ? (
                <motion.div
                  key="sub-verify"
                  initial={{ opacity: 1, y: 0 }}
                  exit={rm ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={{ duration: rm ? 0 : 0.32, ease: EASE_IN_OUT }}
                  style={{ position: "absolute", width: "100%", left: 0, top: 0 }}
                >
                  <Text
                    fontFamily="var(--font-graphik)"
                    fontSize={verifySecondarySize}
                    lineHeight="1.5"
                    fontWeight={400}
                    color={authColors.text.secondary}
                    textAlign="center"
                    px={{ base: 2, md: 0 }}
                  >
                    Open your FAB Corporate Mobile App and approve the request. Enter the number if prompted.
                  </Text>
                </motion.div>
              ) : (
                <motion.div
                  key="sub-success"
                  initial={rm ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: rm ? 0 : 0.42,
                    delay: rm ? 0 : SUBTEXT_STAGGER_MS / 1000,
                    ease: EASE_IN_OUT,
                  }}
                  style={{ width: "100%" }}
                >
                  <Text
                    fontFamily="var(--font-graphik)"
                    fontSize={verifySecondarySize}
                    lineHeight="1.5"
                    fontWeight={400}
                    color={authColors.text.secondary}
                    textAlign="center"
                    px={{ base: 2, md: 0 }}
                  >
                    Your identity has been securely verified. You can now continue to Corporate Banking.
                  </Text>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        )}

        <motion.div {...fadeUp(isPendingOnly ? STAGGER.card : 0)} style={{ width: "100%" }}>
          <Box w="full" mt={s.secondaryToChallengeCard}>
            <ChallengeNumberCard
              value={challengeNumber}
              shimmerNonce={shimmerNonce}
              reduceMotion={reduceMotion}
              cardPhase={cardPhase}
              codeDisabled={codeDisabled}
              ambientActive={ambientOn}
            />
          </Box>
        </motion.div>

        {isPendingOnly ? (
          <>
            <motion.div {...fadeUp(STAGGER.timer)} style={{ width: "100%" }}>
              <Box w="full" mt={s.cardToTimer}>
                <VerifyCodeExpiryTimer
                  mmSs={countdown.mmSs}
                  expired={countdown.expired}
                  urgent={countdown.urgent}
                />
              </Box>
            </motion.div>
            {!codeExpired ? (
              <Flex
                align="center"
                justify="center"
                gap={2}
                mt={`calc(${s.timerToInstruction} + ${s.instructionToStatus})`}
                aria-live="polite"
              >
                <motion.div
                  animate={
                    rm ? { opacity: 0.65 } : { opacity: [0.38, 0.95, 0.38], scale: [1, 1.08, 1] }
                  }
                  transition={
                    rm ? { duration: 0 } : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
                  }
                >
                  <Box
                    w="6px"
                    h="6px"
                    borderRadius="full"
                    bg={authColors.accentSoft}
                    flexShrink={0}
                    aria-hidden
                  />
                </motion.div>
                <motion.div
                  animate={rm ? { opacity: 1 } : { opacity: [0.78, 1, 0.78] }}
                  transition={
                    rm ? { duration: 0 } : { duration: 5.2, repeat: Infinity, ease: "easeInOut" }
                  }
                  style={{ flex: 1, minWidth: 0, maxWidth: "100%" }}
                >
                  <Text
                    fontFamily="var(--font-graphik)"
                    fontSize={verifyCaptionSize}
                    lineHeight="1.5"
                    fontWeight={400}
                    color={authColors.text.muted}
                    textAlign="center"
                  >
                    Waiting for approval…
                  </Text>
                </motion.div>
              </Flex>
            ) : null}
            <Box
              w="full"
              mt={
                codeExpired
                  ? `calc(${s.timerToInstruction} + ${s.instructionToStatus})`
                  : s.statusToActions
              }
            >
              <AuthRecoveryActions
                onResend={handleResend}
                onCancel={handleCancel}
                isResending={resendBusy}
                resendLoadingText="Resending…"
              />
            </Box>
          </>
        ) : (
          <>
            <Box mt={s.cardToTimer} w="full" minH="22px" aria-hidden />
            <Box mt={`calc(${s.timerToInstruction} + ${s.instructionToStatus})`} w="full" minH="24px" aria-hidden />
            <VStack spacing={3} w="full" align="center" mt={s.statusToActions}>
              {ctaReady ? (
                <motion.div
                  initial={rm ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: rm ? 0 : 0.48, ease: EASE_IN_OUT }}
                  style={{ width: "100%", display: "flex", justifyContent: "center" }}
                >
                  <AuthPrimaryCtaButton
                    type="button"
                    stableMetrics
                    align="center"
                    onClick={handleContinue}
                  >
                    Continue
                  </AuthPrimaryCtaButton>
                </motion.div>
              ) : null}
              <Text
                fontFamily="var(--font-graphik)"
                fontSize="13px"
                fontWeight={400}
                lineHeight="1.4"
                color={authColors.text.muted}
                textAlign="center"
                minH="1.4em"
                opacity={showRedirecting ? 1 : 0}
                transition="opacity 0.35s cubic-bezier(0.42, 0, 0.58, 1)"
                aria-live="polite"
              >
                {showRedirecting ? "Redirecting…" : "\u00a0"}
              </Text>
            </VStack>
          </>
        )}
      </VStack>
    </motion.div>
  );
}
