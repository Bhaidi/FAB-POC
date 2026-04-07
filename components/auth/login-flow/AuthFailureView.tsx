"use client";

import { useMemo } from "react";
import { Button, Text, VStack } from "@chakra-ui/react";
import { AuthPrimaryCtaButton } from "@/components/auth/AuthPrimaryCtaButton";
import { authStepsSectionLabel, authVerificationSpacing } from "@/components/auth/authTokens";
import { useFabTokens } from "@/components/theme/FabTokensContext";

export type AuthFailureVariant = "rejected" | "expired" | "error";

type FailureCopy = {
  eyebrow: string;
  heading: string;
  body: string;
  primaryCta: string;
  secondaryCta?: string;
};

const copy: Record<AuthFailureVariant, FailureCopy> = {
  rejected: {
    eyebrow: "AUTHENTICATION DECLINED",
    heading: "Approval declined on mobile",
    body: "The sign-in request was declined from your registered device.",
    primaryCta: "Try Again",
    secondaryCta: "Back to Login",
  },
  expired: {
    eyebrow: "SESSION EXPIRED",
    heading: "Verification request expired",
    body: "The sign-in request has expired. Please start again.",
    primaryCta: "Return to Login",
  },
  error: {
    eyebrow: "SOMETHING WENT WRONG",
    heading: "Unable to verify your request",
    body: "We could not complete the mobile verification. Please try again.",
    primaryCta: "Try Again",
    secondaryCta: "Back to Login",
  },
};

export type AuthFailureViewProps = {
  variant: AuthFailureVariant;
  messageOverride?: string | null;
  onPrimary: () => void;
  onSecondary?: () => void;
};

export function AuthFailureView({ variant, messageOverride, onPrimary, onSecondary }: AuthFailureViewProps) {
  const { authColors, authColumnTypography } = useFabTokens();
  const secondaryLinkStyles = useMemo(
    () =>
      ({
        fontFamily: "var(--font-graphik)",
        fontWeight: 500,
        fontSize: { base: "14px", md: "15px" },
        lineHeight: "1.5",
        color: authColors.text.secondary,
        h: "auto",
        minH: 0,
        py: 2,
        _hover: { color: authColors.text.primary, textDecoration: "underline" },
      }) as const,
    [authColors],
  );

  const c = copy[variant];
  const body = messageOverride?.trim() ? messageOverride : c.body;
  const showSecondary = Boolean(c.secondaryCta && onSecondary);

  return (
    <VStack align="stretch" spacing={0} w="full" maxW="min(520px, 100%)" mx="auto">
      <Text
        fontFamily="var(--font-graphik)"
        {...authStepsSectionLabel}
        letterSpacing="0.2em"
        color={authColors.text.muted}
        textAlign="center"
      >
        {c.eyebrow}
      </Text>
      <Text
        as="h1"
        fontFamily="var(--font-graphik)"
        {...authColumnTypography.title}
        color={authColors.text.primary}
        textAlign="center"
        mt={authVerificationSpacing.eyebrowToTitle}
      >
        {c.heading}
      </Text>
      <Text
        fontFamily="var(--font-graphik)"
        {...authColumnTypography.supporting}
        color={authColors.text.tertiary}
        textAlign="center"
        mt={authVerificationSpacing.titleToSupporting}
      >
        {body}
      </Text>
      <VStack mt={10} w="full" align="stretch" spacing={4}>
        <AuthPrimaryCtaButton onClick={onPrimary}>{c.primaryCta}</AuthPrimaryCtaButton>
        {showSecondary ? (
          <Button type="button" variant="link" w="full" onClick={onSecondary} {...secondaryLinkStyles}>
            {c.secondaryCta}
          </Button>
        ) : null}
      </VStack>
    </VStack>
  );
}
