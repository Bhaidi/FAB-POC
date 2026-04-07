"use client";

import { Text } from "@chakra-ui/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import { PORTFOLIO_OPERATIONAL_SECTION_LABELS } from "@/data/portfolioOperationalSectionLabels";
import type { PortfolioModuleTab } from "@/data/portfolioSummaryTypes";

const EASE_OUT = [0, 0, 0.2, 1] as const;

type Props = {
  module: PortfolioModuleTab;
};

/** Directory title only — sits inside `PortfolioOperationalSurface` (shared glass with table). */
export function PortfolioOperationalSectionHeader({ module }: Props) {
  const { portfolioSectionHeadingSx } = useFabTokens();
  const reduceMotion = useReducedMotion() === true;
  const label = PORTFOLIO_OPERATIONAL_SECTION_LABELS[module];

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={module}
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.15, ease: EASE_OUT }}
        style={{ width: "100%" }}
      >
        <Text
          as="h2"
          {...portfolioSectionHeadingSx}
          px={{ base: 3, md: 4 }}
          pt={4}
          pb={3}
          mb={0}
        >
          {label}
        </Text>
      </motion.div>
    </AnimatePresence>
  );
}
