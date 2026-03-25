"use client";

import Image from "next/image";
import type { IconType } from "react-icons";
import {
  HiDevicePhoneMobile,
  HiBell,
  HiClipboardDocumentCheck,
  HiComputerDesktop,
} from "react-icons/hi2";
import { Box, Flex, Text } from "@chakra-ui/react";
import {
  authColors,
  authRadius,
  authRegisterStepDescription,
  authRegisterStepTitle,
  authRegisterVertical,
} from "@/components/auth/authTokens";

type StepIcon = { kind: "icon"; stepIcon: IconType; title: string; description: string };
type StepQr = { kind: "qr"; title: string; description: string };
type StepDef = StepIcon | StepQr;

const STEPS: StepDef[] = [
  {
    kind: "qr",
    title: "Scan the QR Code",
    description: "Use your phone to scan the QR code on this screen.",
  },
  {
    kind: "icon",
    stepIcon: HiDevicePhoneMobile,
    title: "Download the App",
    description: "Install the FAB Corporate Banking mobile app.",
  },
  {
    kind: "icon",
    stepIcon: HiBell,
    title: "Enable Notifications",
    description: "Allow notifications for secure authentication.",
  },
  {
    kind: "icon",
    stepIcon: HiClipboardDocumentCheck,
    title: "Create Your Credentials",
    description: "Set your Corporate ID and User ID in the app.",
  },
  {
    kind: "icon",
    stepIcon: HiComputerDesktop,
    title: "Sign in on Desktop",
    description: "Return here and log in using your credentials.",
  },
];

/** Glass tile — identical for QR image and icons */
const ICON_BOX = { base: 76, sm: 82, md: 88 };
const ICON_SIZE = { base: 38, sm: 40, md: 42 };

const tileWh = {
  w: { base: `${ICON_BOX.base}px`, sm: `${ICON_BOX.sm}px`, md: `${ICON_BOX.md}px` },
  h: { base: `${ICON_BOX.base}px`, sm: `${ICON_BOX.sm}px`, md: `${ICON_BOX.md}px` },
};

const COL_W = { base: "184px", sm: "196px", lg: "192px" };

function StepVisual({ step }: { step: StepDef }) {
  const shellProps = {
    flexShrink: 0,
    borderRadius: authRadius.surface,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bg: authColors.glass.input,
    border: "1px solid",
    borderColor: authColors.border.default,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
  } as const;

  if (step.kind === "qr") {
    return (
      <Box {...shellProps} position="relative" overflow="hidden" p={0} {...tileWh}>
        <Image
          src="/assets/temp-qr.svg"
          alt="QR code to download FAB Corporate Banking app"
          fill
          sizes="(max-width: 480px) 76px, (max-width: 768px) 82px, 88px"
          style={{ objectFit: "cover" }}
          unoptimized
          priority={false}
        />
      </Box>
    );
  }

  const StepIcon = step.stepIcon;
  return (
    <Box {...shellProps} {...tileWh}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        lineHeight={1}
        fontSize={{ base: `${ICON_SIZE.base}px`, sm: `${ICON_SIZE.sm}px`, md: `${ICON_SIZE.md}px` }}
      >
        <StepIcon aria-hidden size="1em" color={authColors.text.primary} />
      </Box>
    </Box>
  );
}

/**
 * Five registration steps in a horizontal row (scroll on narrow viewports).
 */
export function RegisterDetailSteps() {
  return (
    <Box
      data-auth-allow-scroll-x
      w="full"
      overflowX={{ base: "auto", lg: "visible" }}
      pb={1}
      display="flex"
      justifyContent="center"
      sx={{
        touchAction: { base: "pan-x pinch-zoom", lg: "auto" },
        WebkitOverflowScrolling: "touch",
      }}
    >
      <Flex
        as="ol"
        role="list"
        aria-label="Registration steps"
        gap={{ base: 4, md: 5, lg: 6 }}
        py={2}
        justify="center"
        align="flex-start"
        minW={{ base: "max-content", lg: "full" }}
        w="full"
        listStyleType="none"
        pl={0}
        m={0}
        sx={{
          "&::-webkit-scrollbar": { height: "6px" },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255,255,255,0.16)",
            borderRadius: "full",
          },
        }}
      >
        {STEPS.map((step, i) => (
          <Flex
            key={step.title}
            as="li"
            role="listitem"
            direction="column"
            align="center"
            flex="0 0 auto"
            w={COL_W}
            minW={COL_W}
            maxW={COL_W}
            minH={authRegisterVertical.stepBlockMinH}
            justifyContent="flex-start"
            gap={0}
            textAlign="center"
          >
            <StepVisual step={step} />
            <Text
              fontFamily="var(--font-graphik)"
              {...authRegisterStepTitle}
              color={authColors.text.primary}
              mt={authRegisterVertical.stepIconToTitle}
            >
              {i + 1}. {step.title}
            </Text>
            <Text
              fontFamily="var(--font-graphik)"
              {...authRegisterStepDescription}
              color={authColors.text.tertiary}
              mt={authRegisterVertical.stepTitleToDescription}
            >
              {step.description}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}
