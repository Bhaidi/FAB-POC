"use client";

import { Box, Text, useColorMode, VStack } from "@chakra-ui/react";
import { authLayout, authLoginFormVertical, authSpacing } from "@/components/auth/authTokens";
import { useFabTokens } from "@/components/theme/FabTokensContext";

export type AuthModeContentLayoutProps = {
  eyebrow: string;
  title: React.ReactNode;
  secondary?: string;
  tertiary?: string;
  /** Form, steps, or other primary block */
  core: React.ReactNode;
  /** Main action (e.g. Login) */
  primaryCta?: React.ReactNode;
  /** Links or auxiliary actions below the primary CTA */
  secondaryActions?: React.ReactNode;
  /** Login right column — fixed px vertical rhythm per spec */
  verticalProfile?: "default" | "loginForm";
};

/**
 * Shared instructional column hierarchy for Login (right) and Register (left):
 * eyebrow → H1 → secondary → optional tertiary → core → primary CTA → secondary actions.
 */
export function AuthModeContentLayout({
  eyebrow,
  title,
  secondary,
  tertiary,
  core,
  primaryCta,
  secondaryActions,
  verticalProfile = "default",
}: AuthModeContentLayoutProps) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { authColors, authColumnTypography, authHeroTypography } = useFabTokens();
  const eyebrowColor = isDark ? authColors.text.muted : authColors.accent;
  const titleColor = isDark ? authColors.text.primary : authColors.text.formTitle;
  const hasIntroSupporting = Boolean(secondary || tertiary);
  const isLoginForm = verticalProfile === "loginForm";

  const corePt = isLoginForm
    ? authLoginFormVertical.titleToFirstInput
    : hasIntroSupporting
      ? authSpacing.rightColumnBeforeControls
      : authSpacing.rightColumnIntroStack;

  const introStackSpacing = isLoginForm
    ? authLoginFormVertical.eyebrowToTitle
    : authSpacing.rightColumnIntroStack;

  const coreToCtaPt = isLoginForm ? authLoginFormVertical.lastInputToCta : authSpacing.modeCoreToPrimaryCta;

  const ctaToSecondaryPt = isLoginForm
    ? authLoginFormVertical.ctaToHelperLinks
    : authSpacing.modePrimaryToSecondaryActions;

  return (
    <VStack
      align="stretch"
      spacing={0}
      w="full"
      maxW={{ base: "100%", lg: authLayout.rightColumnMaxW }}
      pb={isLoginForm ? authLoginFormVertical.helpersBottomBreath : undefined}
    >
      <VStack
        align={{ base: "center", lg: "flex-start" }}
        spacing={introStackSpacing}
        w="full"
        textAlign={{ base: "center", lg: "left" }}
      >
        <Text
          fontFamily="var(--font-graphik)"
          {...authHeroTypography.overline}
          color={eyebrowColor}
        >
          {eyebrow}
        </Text>
        <Text
          as="h1"
          fontFamily="var(--font-graphik)"
          {...authColumnTypography.title}
          color={titleColor}
        >
          {title}
        </Text>
        {secondary ? (
          <Text
            fontFamily="var(--font-graphik)"
            {...authColumnTypography.supporting}
            color={authColors.text.tertiary}
            maxW="100%"
          >
            {secondary}
          </Text>
        ) : null}
        {tertiary ? (
          <Text
            fontFamily="var(--font-graphik)"
            {...authColumnTypography.supporting}
            color={authColors.text.muted}
            maxW="100%"
          >
            {tertiary}
          </Text>
        ) : null}
      </VStack>

      <Box w="full" pt={corePt}>
        {core}
      </Box>

      {primaryCta ? (
        <Box w="full" pt={coreToCtaPt}>
          {primaryCta}
        </Box>
      ) : null}

      {secondaryActions ? (
        <Box w="full" pt={ctaToSecondaryPt}>
          {secondaryActions}
        </Box>
      ) : null}
    </VStack>
  );
}
