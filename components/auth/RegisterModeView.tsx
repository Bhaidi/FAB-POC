"use client";

import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { AuthPrimaryCtaButton } from "@/components/auth/AuthPrimaryCtaButton";
import { RegisterDetailSteps } from "@/components/auth/RegisterDetailSteps";
import { AuthParallaxLayer } from "@/components/auth/AuthStageMotion";
import { authColors, authHeroTypography, authLayout, authRegisterVertical } from "@/components/auth/authTokens";

export type RegisterModeViewProps = {
  onLoginNow: () => void;
};

/** Wide enough for hero-style headline + horizontal step row */
const REGISTER_CONTENT_MAX_W = "min(1100px, 100%)";

/**
 * Register — single centered task flow (no split hero); same min-height zone as login split layout.
 */
export function RegisterModeView({ onLoginNow }: RegisterModeViewProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="stretch"
      justifyContent="flex-start"
      w="full"
      flex="1"
      minH={{ base: "auto", lg: "100%" }}
      overflow="hidden"
      maxW={authLayout.splitMaxW}
      mx="auto"
    >
      <AuthParallaxLayer role="right" idleFloat>
        <VStack
          w="full"
          maxW={REGISTER_CONTENT_MAX_W}
          mx="auto"
          align="stretch"
          spacing={0}
          px={0}
          flex="1"
          minH={0}
        >
          <Box w="full" display="flex" flexDirection="column" alignItems="center">
            <Text
              as="h1"
              fontFamily="var(--font-graphik)"
              fontWeight={authHeroTypography.headline.fontWeight}
              lineHeight={authHeroTypography.headline.lineHeight}
              letterSpacing={authHeroTypography.headline.letterSpacing}
              color={authColors.text.primary}
              textAlign="center"
              maxW="100%"
              w="full"
              sx={{
                textWrap: "balance",
                fontSize: {
                  base: "clamp(1.2rem, 2.8vw + 0.65rem, 2.65rem)",
                  sm: "clamp(1.65rem, 2.2vw + 0.85rem, 3.35rem)",
                  md: "clamp(2.35rem, 2.5vw + 1.25rem, 3.875rem)",
                  lg: "76px",
                },
              }}
            >
              Complete your registration in 5 simple steps
            </Text>
          </Box>

          <Box
            flex="1"
            display="flex"
            flexDirection="column"
            minH={0}
            w="full"
            mt={authRegisterVertical.headingToStepsBlock}
          >
            {/* Upper half — pushes the rule toward vertical center of main content */}
            <Box flex="1" minH={authRegisterVertical.ruleBandSpacerMinH} aria-hidden />
            <Box
              as="hr"
              aria-orientation="horizontal"
              w="full"
              border="none"
              borderTop="1px solid"
              borderColor={authColors.border.subtle}
              flexShrink={0}
            />
            <Box
              flex="1"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              minH={0}
              w="full"
              py={authRegisterVertical.stepsSectionPy}
            >
              <RegisterDetailSteps />
            </Box>
          </Box>

          <Flex
            alignSelf="stretch"
            w="full"
            justify="center"
            pt={authRegisterVertical.stepsBlockToCta}
            pb={authRegisterVertical.ctaToFooterMin}
          >
            <AuthPrimaryCtaButton onClick={onLoginNow}>Already set up? Login to your account</AuthPrimaryCtaButton>
          </Flex>
        </VStack>
      </AuthParallaxLayer>
    </Box>
  );
}
