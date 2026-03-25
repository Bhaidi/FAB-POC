"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { authChallengeCard, authColors, authRadius } from "@/components/auth/authTokens";

const MotionBox = motion(Box);
const MotionSpan = motion.span;
const MotionCircle = motion.circle;
const MotionPath = motion.path;

/** Moonlight + deep slate — aligned with fab-login-bg (not electric UI blue) */
const CHALLENGE_GLOW =
  "0 0 22px rgba(255, 255, 255, 0.12), 0 0 48px rgba(32, 48, 92, 0.14), 0 0 72px rgba(32, 48, 92, 0.07)";
const CHALLENGE_GLOW_PEAK =
  "0 0 26px rgba(245, 246, 252, 0.18), 0 0 58px rgba(42, 58, 102, 0.16), 0 0 88px rgba(42, 58, 102, 0.09)";

const shadowLo = `${authChallengeCard.shadow}, ${authChallengeCard.insetHighlight}, 0 0 18px rgba(32, 52, 98, 0.09)`;
const shadowShimmer = `${authChallengeCard.shadow}, ${authChallengeCard.insetHighlight}, 0 0 40px rgba(42, 60, 108, 0.2), 0 0 56px rgba(255, 255, 255, 0.07)`;
const shadowSuccessHold = `${authChallengeCard.shadow}, ${authChallengeCard.insetHighlight}, 0 0 32px rgba(42, 60, 108, 0.16), 0 0 56px rgba(255, 255, 255, 0.08)`;
const shadowSuccessGlowPulse = `${authChallengeCard.shadow}, ${authChallengeCard.insetHighlight}, 0 0 44px rgba(48, 68, 118, 0.2), 0 0 72px rgba(240, 242, 252, 0.12), inset 0 0 28px rgba(255, 255, 255, 0.05)`;

const SHIMMER_DURATION_MS = 650;

/** Padding ring for animated perimeter sweep (inner radius = authRadius.surfaceLg). */
const OTP_BORDER_RING_PX = 2;
const OTP_BORDER_OUTER_RADIUS = "18px";

const EASE_OUT = [0.33, 1, 0.68, 1] as const;
const EASE_IN_OUT = [0.42, 0, 0.58, 1] as const;
/** OTP “alive” — smooth bank-grade easing, avoids snappy easeInOut */
const EASE_ALIVE = [0.4, 0, 0.2, 1] as const;

export type VerifyCardPhase = "challenge" | "successAnimating" | "successStill";

export type ChallengeNumberCardProps = {
  value: string;
  /** Increment (e.g. on resend) to play a short flash on the card. */
  shimmerNonce?: number;
  reduceMotion?: boolean | null;
  /** Lifecycle: challenge → animated success → static success (same card). */
  cardPhase?: VerifyCardPhase;
  /** @deprecated use `cardPhase` */
  successExit?: boolean;
  /** Code timer elapsed — dim / placeholder. */
  codeDisabled?: boolean;
  /** Approve Sign-In ambient: number pulse, shadow breath, periodic poll shimmer. */
  ambientActive?: boolean;
};

export function ChallengeNumberCard({
  value,
  shimmerNonce = 0,
  reduceMotion = false,
  cardPhase: cardPhaseProp,
  successExit = false,
  codeDisabled = false,
  ambientActive = false,
}: ChallengeNumberCardProps) {
  const rm = reduceMotion === true;
  const cardPhase: VerifyCardPhase =
    cardPhaseProp ?? (successExit ? "successAnimating" : "challenge");

  const [nonceShimmer, setNonceShimmer] = useState(false);

  /** Inner success sequence: number → ring → check → one glow pulse */
  const [successStep, setSuccessStep] = useState<"number" | "mark" | "done">("number");
  const [glowPulse, setGlowPulse] = useState(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    if (shimmerNonce <= 0) return;
    setNonceShimmer(true);
    const t = window.setTimeout(() => setNonceShimmer(false), SHIMMER_DURATION_MS);
    return () => window.clearTimeout(t);
  }, [shimmerNonce]);

  useEffect(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];

    if (cardPhase === "challenge") {
      setSuccessStep("number");
      setGlowPulse(false);
      return;
    }

    if (cardPhase === "successStill") {
      setSuccessStep("done");
      setGlowPulse(false);
      return;
    }

    // successAnimating
    if (rm) {
      setSuccessStep("done");
      setGlowPulse(false);
      return;
    }

    setSuccessStep("number");
    setGlowPulse(false);

    const q = (ms: number, fn: () => void) => {
      timersRef.current.push(window.setTimeout(fn, ms) as unknown as number);
    };

    /* OTP fades (MotionSpan) ~260ms; ring 300ms; check 200ms; glow once; total within ~800–1100ms */
    q(260, () => setSuccessStep("mark"));
    q(780, () => {
      setGlowPulse(true);
      q(400, () => setGlowPulse(false));
    });
    q(820, () => setSuccessStep("done"));

    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };
  }, [cardPhase, rm]);

  const shimmerActive = nonceShimmer;

  const display = codeDisabled ? "—" : value;

  const showNumberPulse =
    !rm && ambientActive && !codeDisabled && cardPhase === "challenge";

  /** Subtle luminosity + micro letter-spacing — no scale pop (feels steadier / more premium). */
  const numberAlive = showNumberPulse
    ? {
        textShadow: [CHALLENGE_GLOW, CHALLENGE_GLOW_PEAK, CHALLENGE_GLOW],
        opacity: [0.92, 1, 0.92],
        letterSpacing: ["0.03em", "0.045em", "0.03em"],
      }
    : false;

  const isSuccess = cardPhase !== "challenge";
  const showOtpText = cardPhase === "challenge" || (cardPhase === "successAnimating" && successStep === "number");
  const showMark = isSuccess && successStep !== "number";

  const cardScale = isSuccess ? 1.02 : 1;
  const cardShadow = glowPulse
    ? shadowSuccessGlowPulse
    : isSuccess
      ? shadowSuccessHold
      : shimmerActive
        ? shadowShimmer
        : showNumberPulse && !shimmerActive
          ? undefined
          : shadowLo;

  const showOtpBorderSweep = cardPhase === "challenge" && !codeDisabled && !rm;

  const motionCard = (
    <MotionBox
      w="full"
      maxW={showOtpBorderSweep ? "100%" : { base: "min(100%, 400px)", md: "440px" }}
      mx={showOtpBorderSweep ? 0 : "auto"}
      py={{ base: 11, md: 14 }}
      px={{ base: 9, md: 11 }}
      borderRadius={authRadius.surfaceLg}
      bg={authChallengeCard.bg}
      border="1px solid"
      borderColor={showOtpBorderSweep ? "rgba(255, 255, 255, 0.08)" : authChallengeCard.border}
      textAlign="center"
      backdropFilter="blur(22px)"
      style={{ transformOrigin: "center center" }}
      position="relative"
      zIndex={showOtpBorderSweep ? 1 : undefined}
      boxShadow={cardShadow}
      initial={rm || isSuccess ? false : { scale: 0.95, opacity: 0.88 }}
      animate={{
        scale: cardScale,
        opacity: codeDisabled && cardPhase === "challenge" ? 0.42 : 1,
      }}
      transition={
        isSuccess
          ? { duration: rm ? 0 : 0.38, ease: EASE_IN_OUT }
          : { duration: rm ? 0 : 0.3, ease: EASE_OUT }
      }
      sx={{
        WebkitBackdropFilter: "blur(22px)",
        ...(shimmerActive && cardPhase === "challenge"
          ? { transition: "box-shadow 0.55s cubic-bezier(0.33, 1, 0.68, 1)" }
          : {}),
        ...(glowPulse
          ? { transition: "box-shadow 0.45s cubic-bezier(0.42, 0, 0.58, 1)" }
          : {}),
        "@keyframes authSuccessInnerPulseOnce": {
          "0%": { opacity: 0.35 },
          "55%": { opacity: 0.62 },
          "100%": { opacity: 0.42 },
        },
        ...(showNumberPulse && !shimmerActive ? { position: "relative" } : {}),
        ...(isSuccess
          ? {
              position: "relative",
              _before: {
                content: '""',
                position: "absolute",
                inset: "1px",
                borderRadius: authRadius.surfaceLg,
                pointerEvents: "none",
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, transparent 45%, rgba(38,54,98,0.14) 100%)",
                opacity: glowPulse ? 0.55 : 0.42,
                transition: "opacity 0.5s cubic-bezier(0.42, 0, 0.58, 1)",
                animation: glowPulse ? "authSuccessInnerPulseOnce 0.42s cubic-bezier(0.42, 0, 0.58, 1) forwards" : undefined,
              },
            }
          : {}),
      }}
    >
      <Box position="relative" zIndex={1} minH={{ base: "84px", sm: "97px", md: "114px" }} display="flex" alignItems="center" justifyContent="center">
        {showOtpText ? (
          <Text
            fontFamily="var(--font-graphik)"
            fontWeight={300}
            fontSize={{ base: "84px", sm: "97px", md: "114px" }}
            lineHeight={1}
            letterSpacing="0.03em"
            color={codeDisabled ? authColors.text.muted : authColors.text.primary}
            userSelect="none"
            sx={{
              textShadow: showNumberPulse ? "none" : codeDisabled ? "none" : CHALLENGE_GLOW,
            }}
          >
            <MotionSpan
              style={{
                display: "inline-block",
                willChange: numberAlive ? "opacity, letter-spacing, text-shadow" : undefined,
              }}
              animate={
                cardPhase === "successAnimating" && !rm
                  ? { opacity: 0, scale: 0.97, filter: "blur(4px)" }
                  : numberAlive || { scale: 1, opacity: 1, letterSpacing: "0.03em" }
              }
              transition={
                cardPhase === "successAnimating" && !rm
                  ? { duration: 0.32, ease: EASE_IN_OUT, delay: 0.02 }
                  : numberAlive
                    ? { duration: 3.2, repeat: Infinity, ease: EASE_ALIVE }
                    : { duration: 0.2 }
              }
            >
              {display}
            </MotionSpan>
          </Text>
        ) : null}

        {showMark ? (
          <Box
            as="svg"
            viewBox="0 0 72 72"
            width="100%"
            maxW={{ base: "88px", md: "100px" }}
            height="auto"
            display="block"
            aria-hidden
          >
            <MotionCircle
              cx={36}
              cy={36}
              r={22}
              fill="none"
              stroke="rgba(255,255,255,0.92)"
              strokeWidth={2}
              strokeLinecap="round"
              initial={rm || cardPhase === "successStill" ? false : { pathLength: 0, opacity: 1 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: {
                  duration: rm || cardPhase === "successStill" ? 0 : 0.3,
                  ease: EASE_IN_OUT,
                  delay: 0,
                },
                opacity: { duration: 0.12 },
              }}
            />
            <MotionPath
              d="M22 38 L32 48 L52 26"
              fill="none"
              stroke="rgba(255,255,255,0.95)"
              strokeWidth={2.25}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={rm || cardPhase === "successStill" ? false : { pathLength: 0, opacity: 1 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: {
                  duration: rm || cardPhase === "successStill" ? 0 : 0.2,
                  ease: EASE_IN_OUT,
                  delay: rm || cardPhase === "successStill" ? 0 : 0.32,
                },
                opacity: { duration: 0.1, delay: rm || cardPhase === "successStill" ? 0 : 0.3 },
              }}
            />
          </Box>
        ) : null}
      </Box>
    </MotionBox>
  );

  if (!showOtpBorderSweep) {
    return motionCard;
  }

  return (
    <Box
      w="full"
      maxW={{ base: "min(100%, 400px)", md: "440px" }}
      mx="auto"
      position="relative"
      p={`${OTP_BORDER_RING_PX}px`}
      borderRadius={OTP_BORDER_OUTER_RADIUS}
      overflow="hidden"
    >
      <Box className="auth-otp-border-sweep-wrap" aria-hidden>
        <Box className="auth-otp-border-sweep" />
      </Box>
      {motionCard}
    </Box>
  );
}
