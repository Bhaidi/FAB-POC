"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { INTELLIGENCE_CONTENT_INDENT } from "@/components/account-services/portfolio/intelligence/intelligenceLayout";
import {
  IntelligenceSectionHeader,
  type IntelligenceHeaderVariant,
} from "@/components/account-services/portfolio/intelligence/IntelligenceSectionHeader";

const EASE = [0.33, 1, 0.68, 1] as const;

type IntelligenceListProps = {
  variant: Extract<IntelligenceHeaderVariant, "events" | "alerts">;
  title: string;
  children: ReactNode;
  /** Stagger delay before first child (handled by children typically) */
  delay?: number;
};

export function IntelligenceList({ variant, title, children, delay = 0 }: IntelligenceListProps) {
  const reduceMotion = useReducedMotion() === true;

  return (
    <motion.div
      className="min-w-0 border-t border-white/[0.06] pt-3.5"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reduceMotion ? 0 : delay, duration: 0.38, ease: EASE }}
    >
      <IntelligenceSectionHeader variant={variant} label={title} />
      <ul className={`m-0 space-y-0.5 p-0 ${INTELLIGENCE_CONTENT_INDENT}`}>{children}</ul>
    </motion.div>
  );
}
