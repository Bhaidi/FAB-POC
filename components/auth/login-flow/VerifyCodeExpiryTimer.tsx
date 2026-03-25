"use client";

import { Text } from "@chakra-ui/react";
import { motion, useReducedMotion } from "framer-motion";
import { authColors } from "@/components/auth/authTokens";

const EASE_OUT = [0.33, 1, 0.68, 1] as const;

const MotionSpan = motion.span;

export type VerifyCodeExpiryTimerProps = {
  /** Pre-formatted mm:ss from `useVerificationCountdown`. */
  mmSs: string;
  expired: boolean;
  urgent: boolean;
};

/**
 * Code expiry line — pairs with `useVerificationCountdown` for smooth ring + calm digit transitions.
 */
export function VerifyCodeExpiryTimer({ mmSs, expired, urgent }: VerifyCodeExpiryTimerProps) {
  const reduceMotion = useReducedMotion();
  const rm = reduceMotion === true;

  const color = expired
    ? authColors.text.muted
    : urgent
      ? authColors.warningSoft
      : authColors.text.secondary;

  const line = expired ? (
    "Code expired. Resend to continue."
  ) : (
    <>
      Code expires in{" "}
      {rm ? (
        mmSs
      ) : (
        <MotionSpan
          key={mmSs}
          style={{ display: "inline" }}
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 0.78, 1] }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        >
          {mmSs}
        </MotionSpan>
      )}
    </>
  );

  return (
    <Text
      fontFamily="var(--font-graphik)"
      fontSize={{ base: "14px", md: "15px" }}
      fontWeight={500}
      lineHeight="1.45"
      letterSpacing="0.02em"
      color={color}
      textAlign="center"
      aria-live="polite"
    >
      {line}
    </Text>
  );
}
