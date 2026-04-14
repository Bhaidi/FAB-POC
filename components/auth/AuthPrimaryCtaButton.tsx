"use client";

import { Button, Icon, Spinner, useColorMode } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { authRadius } from "@/components/auth/authTokens";
import { useFabTokens } from "@/components/theme/FabTokensContext";

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
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { authColors, authShadow } = useFabTokens();
  const busy = Boolean(isLoading);
  const disabled = Boolean(isDisabled || busy);
  const successTone = visualTone === "success";
  const alignSelf =
    align === "center" ? ("center" as const) : ({ base: "stretch", lg: "flex-start" } as const);

  /** Figma `558:17096` light — same metrics as dark login CTA: #0062FF, 46×434, radius 24px */
  const loginLightCta = !successTone && !isDark && stableMetrics;
  const solidPrimaryCta = (!successTone && isDark) || loginLightCta;

  const thinSpinner = (
    <Spinner
      boxSize="18px"
      thickness="2px"
      speed="0.7s"
      color={solidPrimaryCta && !successTone ? "white" : authColors.accent}
      emptyColor={solidPrimaryCta && !successTone ? "rgba(255, 255, 255, 0.22)" : "rgba(0, 98, 255, 0.14)"}
    />
  );
  /**
   * FAB DS 558:17087 — flat only: 434×46, padding 24px (horizontal; vertical centering in 46px),
   * gap 12px, radius 24px, #0062FF. No shadow, blur, or extra border.
   */
  const ctaBg = solidPrimaryCta ? "#0062FF" : "white";
  const ctaColor = solidPrimaryCta ? "#FFFFFF" : "#000245";
  const ctaBorder = solidPrimaryCta ? "none" : "1px solid";
  const ctaBorderColor = solidPrimaryCta ? undefined : "rgba(255,255,255,0.14)";
  const ctaRadius = solidPrimaryCta ? "24px" : authRadius.pill;
  const ctaHeight =
    stableMetrics && solidPrimaryCta
      ? { base: "46px", md: "46px" }
      : stableMetrics
        ? { base: "48px", md: "52px" }
        : undefined;
  const ctaPy = stableMetrics && solidPrimaryCta ? 0 : stableMetrics ? 0 : { base: 3, md: 4 };
  const ctaPx = solidPrimaryCta ? 6 : 7;
  const ctaFontWeight = solidPrimaryCta ? 400 : 500;
  const ctaLineHeight = solidPrimaryCta ? "24px" : "1.35";
  const ctaWidth = solidPrimaryCta && stableMetrics ? { base: "full", lg: "434px" } : { base: "full", lg: "auto" };
  const ctaMinW = stableMetrics
    ? solidPrimaryCta
      ? undefined
      : { base: "100%", lg: "232px" }
    : undefined;
  const ctaBoxShadow = successTone ? SUCCESS_CTA_SHADOW : solidPrimaryCta ? "none" : authShadow.primaryCta;

  return (
    <MotionButton
      type={type}
      alignSelf={alignSelf}
      w={ctaWidth}
      display="flex"
      alignItems="center"
      justifyContent="center"
      gap={0}
      minW={ctaMinW}
      bg={ctaBg}
      color={ctaColor}
      fontFamily="var(--font-graphik)"
      fontWeight={ctaFontWeight}
      fontSize={{ base: "15px", md: "16px" }}
      lineHeight={ctaLineHeight}
      py={ctaPy}
      px={ctaPx}
      h={ctaHeight ?? "auto"}
      whiteSpace="nowrap"
      textAlign="center"
      borderRadius={ctaRadius}
      border={ctaBorder}
      borderColor={ctaBorderColor}
      leftIcon={busy ? thinSpinner : undefined}
      rightIcon={busy ? undefined : <Icon as={ArrowRight} boxSize={6} strokeWidth={2} aria-hidden />}
      iconSpacing={3}
      boxShadow={ctaBoxShadow}
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
            : solidPrimaryCta
              ? undefined
              : {
                  scale: 1.02,
                  boxShadow: "0 12px 32px rgba(255, 255, 255, 0.18)",
                }
      }
      whileTap={
        disabled ? undefined : successTone ? { scale: 0.99 } : solidPrimaryCta ? undefined : { scale: 0.98 }
      }
      transition={
        successTone
          ? { type: "tween", duration: 0.22, ease: [0.42, 0, 0.58, 1] }
          : { type: "spring", stiffness: 420, damping: 28 }
      }
      _hover={{
        bg: disabled ? undefined : solidPrimaryCta ? "#0058E6" : "white",
      }}
      _disabled={
        busy
          ? {
              opacity: 0.9,
              cursor: "not-allowed",
              boxShadow: successTone ? SUCCESS_CTA_SHADOW : solidPrimaryCta ? "none" : authShadow.primaryCta,
            }
          : {
              opacity: 0.72,
              cursor: "not-allowed",
              boxShadow: successTone ? SUCCESS_CTA_SHADOW : solidPrimaryCta ? "none" : "none",
            }
      }
      sx={{
        ...(solidPrimaryCta
          ? {
              boxSizing: "border-box",
              backdropFilter: "none",
              WebkitBackdropFilter: "none",
              filter: "none",
            }
          : {}),
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
