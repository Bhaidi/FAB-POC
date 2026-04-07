"use client";

import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useDashboardGlobal } from "@/components/dashboard/DashboardGlobalContext";
import { useFabTokens } from "@/components/theme/FabTokensContext";

const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionBox = motion(Box);

const ease = [0.33, 1, 0.68, 1] as const;

export type WelcomeHeaderProps = {
  /** `wireframe` = launchpad home spec (44px title / 52px line-height, 14px supporting). */
  variant?: "default" | "launchpad" | "wireframe";
};

/**
 * Dashboard hero — real typography; dim/blur while loading (no skeleton blocks).
 * Subtitle is a single live line (no AnimatePresence swap flash).
 */
export function WelcomeHeader({ variant = "default" }: WelcomeHeaderProps) {
  const { dashColors } = useFabTokens();
  const { heroContextLine, userContextLoading, marketsLoading, marketDetailLoading } = useDashboardGlobal();
  const lp = variant === "launchpad" || variant === "wireframe";
  const wire = variant === "wireframe";

  const titleGhost = userContextLoading;
  const subLine =
    heroContextLine ??
    (userContextLoading
      ? "Establishing your secure session…"
      : marketDetailLoading || marketsLoading
        ? "Syncing your workspace…"
        : "");

  const subVisible = subLine.length > 0;
  const subIsLive = Boolean(heroContextLine);

  const stack = (
    <VStack align="stretch" spacing={wire ? 2 : lp ? 1 : { base: 2, md: 2.5 }} w="full">
        <MotionHeading
          as="h1"
          fontFamily="var(--font-graphik)"
          fontStyle="normal"
          fontWeight={wire ? 500 : 400}
          fontSize={
            wire
              ? { base: "32px", md: "44px" }
              : lp
                ? { base: "22px", sm: "26px", md: "30px" }
                : { base: "34px", sm: "44px", md: "54px" }
          }
          lineHeight={wire ? "52px" : lp ? 1.12 : "1.08"}
          letterSpacing="-0.02em"
          color={dashColors.text.primary}
          textAlign="left"
          w="full"
          initial={false}
          animate={{
            opacity: titleGhost ? 0.38 : 1,
            filter: titleGhost ? "blur(3px)" : "blur(0px)",
          }}
          transition={{ duration: 0.32, ease }}
        >
          Welcome to FABAccess
        </MotionHeading>

        {subVisible ? (
          <MotionText
            fontFamily="var(--font-graphik)"
            fontSize={wire ? "14px" : lp ? { base: "11px", md: "12px" } : { base: "12px", md: "13px" }}
            lineHeight="1.45"
            textAlign="left"
            fontWeight={400}
            w="full"
            mt={wire ? 0 : lp ? 0 : 0.5}
            noOfLines={lp && !wire ? 1 : undefined}
            initial={false}
            animate={{
              opacity: subIsLive ? 1 : 0.64,
              filter: subIsLive ? "blur(0px)" : "blur(1.25px)",
              color: wire
                ? subIsLive
                  ? dashColors.text.secondary
                  : dashColors.text.muted
                : subIsLive
                  ? dashColors.text.tertiary
                  : dashColors.text.muted,
            }}
            transition={{ duration: 0.32, ease }}
          >
            {subLine}
          </MotionText>
        ) : null}
    </VStack>
  );

  if (wire) {
    return (
      <MotionBox
        w="full"
        pt={0}
        pb={lp ? 1 : { base: 1, md: 1.5 }}
        position="relative"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease }}
      >
        {stack}
      </MotionBox>
    );
  }

  return (
    <Box w="full" pt={lp ? { base: 0, md: 0 } : { base: 1, md: 2, lg: 3 }} pb={lp ? 1 : { base: 1, md: 1.5 }} position="relative">
      {stack}
    </Box>
  );
}
