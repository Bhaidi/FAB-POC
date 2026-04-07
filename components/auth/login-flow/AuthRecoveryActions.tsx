"use client";

import { useMemo } from "react";
import { Button, VStack } from "@chakra-ui/react";
import { useFabTokens } from "@/components/theme/FabTokensContext";

export type AuthRecoveryActionsProps = {
  onResend: () => void | Promise<void>;
  onCancel: () => void;
  isResending?: boolean;
  /** Shown while resend is in progress (default: Sending…). */
  resendLoadingText?: string;
};

/** Minimal verify recovery — secondary (Resend) + tertiary (Cancel). */
export function AuthRecoveryActions({
  onResend,
  onCancel,
  isResending,
  resendLoadingText = "Sending…",
}: AuthRecoveryActionsProps) {
  const { authColors } = useFabTokens();

  const secondaryStyles = useMemo(
    () =>
      ({
        fontFamily: "var(--font-graphik)",
        fontWeight: 500,
        fontSize: { base: "15px", md: "15px" },
        lineHeight: "1.5",
        color: authColors.accentSoft,
        h: "auto",
        minH: 0,
        p: 0,
        _hover: { color: authColors.accent, textDecoration: "underline" },
        _disabled: { opacity: 0.45, cursor: "not-allowed" },
      }) as const,
    [authColors],
  );

  const tertiaryStyles = useMemo(
    () =>
      ({
        ...secondaryStyles,
        color: authColors.text.muted,
        fontWeight: 400,
        _hover: { color: authColors.text.secondary, textDecoration: "underline" },
      }) as const,
    [authColors, secondaryStyles],
  );

  return (
    <VStack spacing={4} align="center" w="full">
      <Button
        type="button"
        variant="link"
        {...secondaryStyles}
        isDisabled={isResending}
        onClick={() => void onResend()}
      >
        {isResending ? resendLoadingText : "Resend request"}
      </Button>
      <Button type="button" variant="link" {...tertiaryStyles} onClick={onCancel}>
        Cancel
      </Button>
    </VStack>
  );
}
