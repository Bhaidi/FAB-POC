"use client";

import { Button, Icon, Spinner } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { HiChevronRight } from "react-icons/hi";
import { authColors, authRadius, authShadow } from "@/components/auth/authTokens";

const MotionButton = motion(Button);

const SUCCESS_CTA_SHADOW = "0 8px 24px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.12)";
const SUCCESS_CTA_SHADOW_HOVER = "0 8px 28px rgba(255, 255, 255, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.14)";

export type AuthPrimaryCtaButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  isDisabled?: boolean;
  isLoading?: boolean;
  /**
   * Fixed min height / width so label + icon swaps (e.g. Login → Signing in…) do not shift layout.
   * Use on the login CTA only.
   */
  stableMetrics?: boolean;
  /** Softer white glow — e.g. success “Continue” on dark hero. */
  visualTone?: "default" | "success";
  /** `center` — horizontal center in a column (e.g. confirmation screen). */
  align?: "start" | "center";
};

/**
 * Shared primary CTA — same alignment, motion, and chrome on Login and Register.
 */
export function AuthPrimaryCtaButton({
  children,
  onClick,
  type = "button",
  isDisabled,
  isLoading,
  stableMetrics = false,
  visualTone = "default",
  align = "start",
}: AuthPrimaryCtaButtonProps) {
  const busy = Boolean(isLoading);
  const disabled = Boolean(isDisabled || busy);
  const successTone = visualTone === "success";
  const alignSelf =
    align === "center" ? ("center" as const) : ({ base: "stretch", lg: "flex-start" } as const);

  const thinSpinner = (
    <Spinner
      boxSize="18px"
      thickness="2px"
      speed="0.7s"
      color={authColors.accent}
      emptyColor="rgba(0, 98, 255, 0.14)"
    />
  );

  return (
    <MotionButton
      type={type}
      alignSelf={alignSelf}
      w={{ base: "full", lg: "auto" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      gap={0}
      minW={stableMetrics ? { base: "100%", lg: "232px" } : undefined}
      bg="white"
      color="#000245"
      fontFamily="var(--font-graphik)"
      fontWeight={500}
      fontSize={{ base: "15px", md: "16px" }}
      lineHeight="1.35"
      py={stableMetrics ? 0 : { base: 3, md: 4 }}
      px={7}
      h={stableMetrics ? { base: "48px", md: "52px" } : "auto"}
      whiteSpace="nowrap"
      textAlign="center"
      borderRadius={authRadius.pill}
      border="1px solid"
      borderColor="rgba(255,255,255,0.14)"
      leftIcon={busy ? thinSpinner : undefined}
      rightIcon={busy ? undefined : <Icon as={HiChevronRight} boxSize={5} />}
      iconSpacing={3}
      boxShadow={successTone ? SUCCESS_CTA_SHADOW : authShadow.primaryCta}
      isDisabled={disabled}
      opacity={busy ? 0.9 : 1}
      whileHover={
        disabled
          ? undefined
          : successTone
            ? {
                y: -2,
                boxShadow: "0 10px 32px rgba(255, 255, 255, 0.16), 0 0 24px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.14)",
              }
            : {
                scale: 1.02,
                boxShadow: "0 12px 32px rgba(255, 255, 255, 0.18)",
              }
      }
      whileTap={disabled ? undefined : successTone ? { scale: 0.99 } : { scale: 0.98 }}
      transition={
        successTone
          ? { type: "tween", duration: 0.22, ease: [0.42, 0, 0.58, 1] }
          : { type: "spring", stiffness: 420, damping: 28 }
      }
      _hover={{ bg: disabled ? undefined : "white" }}
      _disabled={
        busy
          ? {
              opacity: 0.9,
              cursor: "not-allowed",
              boxShadow: successTone ? SUCCESS_CTA_SHADOW : authShadow.primaryCta,
            }
          : { opacity: 0.72, cursor: "not-allowed", boxShadow: successTone ? SUCCESS_CTA_SHADOW : "none" }
      }
      sx={{
        ...(successTone && !busy
          ? {
              position: "relative",
              overflow: "hidden",
              "@keyframes authSuccessCtaShimmer": {
                "0%, 92%": { transform: "translateX(-140%) skewX(-12deg)", opacity: 0 },
                "93%": { opacity: 0.22 },
                "96%": { opacity: 0.08 },
                "100%": { transform: "translateX(140%) skewX(-12deg)", opacity: 0 },
              },
              _before: {
                content: '""',
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background:
                  "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.5) 48%, rgba(255,255,255,0.15) 50%, transparent 72%)",
                animation: "authSuccessCtaShimmer 7s cubic-bezier(0.42, 0, 0.58, 1) infinite",
              },
            }
          : {}),
        ...(busy
          ? {}
          : {
              "& .chakra-button__icon": { transition: "transform 0.24s cubic-bezier(0.42, 0, 0.58, 1)" },
              "&:hover .chakra-button__icon": { transform: "translateX(3px)" },
            }),
      }}
      onClick={onClick}
    >
      {children}
    </MotionButton>
  );
}
