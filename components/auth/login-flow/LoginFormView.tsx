"use client";

import type { FormEvent, ReactNode } from "react";
import { useMemo } from "react";
import NextLink from "next/link";
import { Box, Flex, Input, Text, useColorMode, VStack } from "@chakra-ui/react";
import { GlassCredentialFieldFrame } from "@/components/auth/GlassCredentialFieldFrame";
import { getAuthGlassCredentialInputStyles, getAuthInputFieldStyles } from "@/components/auth/authInputStyles";
import { AuthModeContentLayout } from "@/components/auth/AuthModeContentLayout";
import { AuthPrimaryCtaButton } from "@/components/auth/AuthPrimaryCtaButton";
import { authLoginFormVertical } from "@/components/auth/authTokens";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import type { FieldErrors } from "@/hooks/useLoginAuthFlow";
import { AuthStatusMessage } from "@/components/auth/login-flow/AuthStatusMessage";
import { InlineFieldError } from "@/components/auth/login-flow/InlineFieldError";

const fieldStackProps = {
  w: "full" as const,
  display: "flex" as const,
  flexDirection: "column" as const,
  alignItems: "stretch" as const,
  gap: 3,
  overflow: "visible" as const,
};

const inputPlaceholderSx = {
  textTransform: "uppercase" as const,
  "&::placeholder": {
    textTransform: "none" as const,
  },
};

function CredentialGlassShell({
  isDark,
  isDisabled,
  children,
}: {
  isDark: boolean;
  isDisabled: boolean;
  children: ReactNode;
}) {
  if (isDark) {
    return <GlassCredentialFieldFrame isDisabled={isDisabled}>{children}</GlassCredentialFieldFrame>;
  }
  return <>{children}</>;
}

export type LoginFormViewProps = {
  corporateId: string;
  userId: string;
  onCorporateIdChange: (v: string) => void;
  onUserIdChange: (v: string) => void;
  fieldErrors: FieldErrors;
  formLevelError: string | null;
  isSubmitting: boolean;
  onSubmit: () => void;
};

/**
 * Login credentials step — validations, stub submit, matches existing auth column layout.
 */
export function LoginFormView({
  corporateId,
  userId,
  onCorporateIdChange,
  onUserIdChange,
  fieldErrors,
  formLevelError,
  isSubmitting,
  onSubmit,
}: LoginFormViewProps) {
  const tokens = useFabTokens();
  const { authColors } = tokens;
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const credentialInputStyles = useMemo(
    () => (isDark ? getAuthGlassCredentialInputStyles() : getAuthInputFieldStyles(colorMode)),
    [colorMode, isDark],
  );

  const linkStyles = useMemo(
    () =>
      ({
        fontFamily: "var(--font-graphik)",
        fontSize: "13px",
        fontWeight: 500,
        color: authColors.text.tertiary,
        lineHeight: "1.4",
        textDecoration: "none",
        transition: "color 0.2s ease",
        _hover: { color: authColors.text.primary, textDecoration: "underline" },
      }) as const,
    [authColors],
  );

  return (
    <AuthModeContentLayout
      verticalProfile="loginForm"
      eyebrow="Secure sign in"
      title="Login to your Corporate Account"
      core={
        <Box
          as="form"
          w="full"
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!isSubmitting) onSubmit();
          }}
        >
          <VStack align="stretch" spacing={0} w="full" position="relative">
            <VStack align="stretch" spacing={authLoginFormVertical.betweenInputs} w="full" overflow="visible">
              <Box {...fieldStackProps}>
                <Text
                  fontFamily="var(--font-graphik)"
                  fontWeight={500}
                  fontSize="12px"
                  lineHeight="1.375"
                  color={authColors.text.secondary}
                  flexShrink={0}
                  as="label"
                  htmlFor="auth-corporate-id"
                  display="block"
                >
                  Corporate ID
                </Text>
                <CredentialGlassShell isDark={isDark} isDisabled={isSubmitting}>
                  <Input
                    id="auth-corporate-id"
                    name="corporateId"
                    autoComplete="username"
                    placeholder="Enter Corporate ID"
                    value={corporateId}
                    onChange={(e) => onCorporateIdChange(e.target.value)}
                    isDisabled={isSubmitting}
                    aria-invalid={Boolean(fieldErrors.corporateId)}
                    aria-describedby={
                      fieldErrors.corporateId ? "err-corporate-id" : formLevelError ? "form-level-err" : undefined
                    }
                    variant="unstyled"
                    {...credentialInputStyles}
                    sx={inputPlaceholderSx}
                  />
                </CredentialGlassShell>
                {fieldErrors.corporateId ? <InlineFieldError id="err-corporate-id" message={fieldErrors.corporateId} /> : null}
              </Box>
              <Box {...fieldStackProps}>
                <Text
                  fontFamily="var(--font-graphik)"
                  fontWeight={500}
                  fontSize="12px"
                  lineHeight="1.375"
                  color={authColors.text.secondary}
                  flexShrink={0}
                  as="label"
                  htmlFor="auth-user-id"
                  display="block"
                >
                  User ID
                </Text>
                <CredentialGlassShell isDark={isDark} isDisabled={isSubmitting}>
                  <Input
                    id="auth-user-id"
                    name="userId"
                    autoComplete="username"
                    placeholder="Enter User ID"
                    value={userId}
                    onChange={(e) => onUserIdChange(e.target.value)}
                    isDisabled={isSubmitting}
                    aria-invalid={Boolean(fieldErrors.userId)}
                    aria-describedby={
                      fieldErrors.userId ? "err-user-id" : formLevelError ? "form-level-err" : undefined
                    }
                    variant="unstyled"
                    {...credentialInputStyles}
                    sx={inputPlaceholderSx}
                  />
                </CredentialGlassShell>
                {fieldErrors.userId ? <InlineFieldError id="err-user-id" message={fieldErrors.userId} /> : null}
              </Box>
              {formLevelError ? (
                <Box id="form-level-err" mt={1}>
                  <AuthStatusMessage message={formLevelError} tone="error" />
                </Box>
              ) : null}
            </VStack>
            <Box
              as="button"
              type="submit"
              disabled={isSubmitting}
              position="absolute"
              w="1px"
              h="1px"
              p={0}
              m="-1px"
              overflow="hidden"
              clipPath="inset(50%)"
              border={0}
              aria-hidden
              tabIndex={-1}
            />
          </VStack>
        </Box>
      }
      primaryCta={
        <AuthPrimaryCtaButton
          type="button"
          stableMetrics
          isLoading={isSubmitting}
          isDisabled={isSubmitting}
          onClick={onSubmit}
        >
          {isSubmitting ? "Signing in..." : "Login"}
        </AuthPrimaryCtaButton>
      }
      secondaryActions={
        <Flex
          align="center"
          justify={{ base: "center", lg: "flex-start" }}
          flexWrap="wrap"
          gap={{ base: 2, sm: 3 }}
          w="full"
          columnGap={4}
          rowGap={2}
          opacity={isSubmitting ? 0.45 : 1}
          pointerEvents={isSubmitting ? "none" : "auto"}
        >
          <Text as={NextLink} href="#forgot-password" {...linkStyles}>
            Forgot Password
          </Text>
          <Text as="span" fontSize="11px" color={authColors.text.faint} userSelect="none" aria-hidden>
            ·
          </Text>
          <Text as={NextLink} href="#unlock-user-id" {...linkStyles}>
            Unlock User ID
          </Text>
        </Flex>
      }
    />
  );
}
