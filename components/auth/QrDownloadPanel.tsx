"use client";

import Image from "next/image";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { SiAppstore, SiGoogleplay } from "react-icons/si";
import { AuthStoreBadge } from "@/components/auth/AuthStoreBadge";
import { authColors, authColumnTypography, authRadius, authShadow } from "@/components/auth/authTokens";

export type QrDownloadPanelProps = {
  variant?: "compact" | "onboarding";
  title?: string;
  description?: string;
};

const ONBOARDING_TITLE_DEFAULT = "Get the Mobile App";
const ONBOARDING_DESC_DEFAULT =
  "Scan the QR code to download the FAB Corporate Banking app and complete your registration securely.";

/**
 * Mobile app QR + store CTAs — panel typography matches login right column (authColumnTypography).
 */
export function QrDownloadPanel({
  variant = "compact",
  title,
  description,
}: QrDownloadPanelProps) {
  const onboarding = variant === "onboarding";

  const heading = onboarding ? (title ?? ONBOARDING_TITLE_DEFAULT) : "Need the mobile app?";
  const body = onboarding
    ? (description ?? ONBOARDING_DESC_DEFAULT)
    : "Scan the QR code to download the FAB Corporate Banking mobile app from the app store.";

  return (
    <Box
      w="full"
      p={onboarding ? { base: 6, md: 7 } : { base: 4, md: 5 }}
      borderRadius={authRadius.surfaceLg}
      bg={`linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%), ${authColors.glass.tint}`}
      border="1px solid"
      borderColor={authColors.border.default}
      boxShadow={authShadow.panel}
      backdropFilter="blur(14px) saturate(145%)"
    >
      <VStack align="stretch" spacing={onboarding ? 6 : 4}>
        <Box>
          <Text
            fontFamily="var(--font-graphik)"
            {...authColumnTypography.title}
            color={authColors.text.primary}
            mb={2}
          >
            {heading}
          </Text>
          <Text
            fontFamily="var(--font-graphik)"
            {...authColumnTypography.supporting}
            color={authColors.text.secondary}
          >
            {body}
          </Text>
        </Box>

        <Flex
          direction={onboarding ? "column" : { base: "column", sm: "row" }}
          gap={onboarding ? 5 : 4}
          align={onboarding ? "stretch" : { base: "center", sm: "flex-start" }}
        >
          <Box
            flexShrink={0}
            position="relative"
            alignSelf={onboarding ? "flex-start" : undefined}
            w={onboarding ? { base: "112px", md: "120px" } : "92px"}
            h={onboarding ? { base: "112px", md: "120px" } : "92px"}
            borderRadius={authRadius.surface}
          >
            <Box
              position="absolute"
              inset={onboarding ? "-10px" : "-8px"}
              borderRadius={authRadius.surfaceLg}
              sx={{
                background:
                  "radial-gradient(ellipse at center, rgba(0, 98, 255, 0.12) 0%, transparent 70%)",
              }}
            />
            <Box
              position="relative"
              w={onboarding ? { base: "112px", md: "120px" } : "92px"}
              h={onboarding ? { base: "112px", md: "120px" } : "92px"}
              borderRadius={authRadius.surface}
              overflow="hidden"
              border="1px solid"
              borderColor={authColors.border.default}
              boxShadow={authShadow.qr}
            >
              <Image
                src="/assets/temp-qr.svg"
                alt="Scan to download FAB Corporate Banking app"
                fill
                sizes={onboarding ? "120px" : "92px"}
                style={{ objectFit: "cover" }}
                unoptimized
              />
            </Box>
          </Box>

          <VStack align="stretch" spacing={3} flex={1} w="full" minW={0} justify="center">
            <Flex gap={2} w="full" direction="column">
              <AuthStoreBadge href="#app-store" icon={SiAppstore} line1="Download on the" line2="App Store" />
              <AuthStoreBadge href="#google-play" icon={SiGoogleplay} line1="Get it on" line2="Google Play" />
            </Flex>
          </VStack>
        </Flex>
      </VStack>
    </Box>
  );
}
