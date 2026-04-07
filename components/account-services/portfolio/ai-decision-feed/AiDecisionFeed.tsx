"use client";

import { Box, Flex, useColorMode } from "@chakra-ui/react";
import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { DecisionCard } from "@/components/account-services/portfolio/ai-decision-feed/DecisionCard";
import { playAiActionSound } from "@/components/account-services/portfolio/ai-decision-feed/playAiActionSound";
import { AI_DECISION_INJECTION_POOL, AI_DECISION_SEED, sortAiDecisions } from "@/data/aiDecisionFeedSeed";
import type { AiDecision } from "@/data/aiDecisionFeedTypes";

type Props = {
  resetKey?: string;
};

function injectReplacement(): AiDecision {
  const pick = AI_DECISION_INJECTION_POOL[Math.floor(Math.random() * AI_DECISION_INJECTION_POOL.length)];
  return { ...pick, id: `${pick.id}-${Date.now()}` };
}

export function AiDecisionFeed({ resetKey = "default" }: Props) {
  const { colorMode } = useColorMode();
  const reduceMotion = useReducedMotion() === true;
  const isDark = colorMode === "dark";

  const [decisions, setDecisions] = useState<AiDecision[]>(() => sortAiDecisions([...AI_DECISION_SEED]));

  useEffect(() => {
    setDecisions(sortAiDecisions([...AI_DECISION_SEED]));
  }, [resetKey]);

  const topId = decisions[0]?.id;
  const decisionsRef = useRef(decisions);
  decisionsRef.current = decisions;

  const consumeAndRefill = useCallback((id: string) => {
    playAiActionSound();
    setDecisions((prev) => {
      const rest = prev.filter((d) => d.id !== id);
      return sortAiDecisions([...rest, injectReplacement()]);
    });
  }, []);

  const onSecondary = useCallback((id: string) => {
    if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log("[ai-decision-feed] secondary action", id);
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.closest("input, textarea, select, [contenteditable=true]") || t.isContentEditable)) return;
      if (e.key !== "a" && e.key !== "A") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      e.preventDefault();
      const first = decisionsRef.current[0];
      if (first) consumeAndRefill(first.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [consumeAndRefill]);

  const sharedGlowBg = isDark
    ? "radial-gradient(ellipse 95% 70% at 50% -15%, rgba(70, 110, 210, 0.14) 0%, transparent 48%), radial-gradient(ellipse 80% 55% at 10% 95%, rgba(40, 70, 150, 0.1) 0%, transparent 42%), radial-gradient(ellipse 70% 50% at 92% 60%, rgba(50, 90, 180, 0.08) 0%, transparent 40%)"
    : "radial-gradient(ellipse 100% 75% at 45% 0%, rgba(0, 98, 255, 0.055) 0%, transparent 50%), radial-gradient(ellipse 85% 60% at 85% 100%, rgba(1, 5, 145, 0.04) 0%, transparent 48%)";

  return (
    <Box
      minW={0}
      maxH={{ xl: "min(52vh, 520px)" }}
      overflowY="auto"
      overflowX="hidden"
      px={1.5}
      py={3.5}
      sx={{ scrollbarWidth: "thin" }}
      role="region"
      aria-label="Suggested actions"
    >
      <Box position="relative" borderRadius="xl" overflow="visible" mx={0}>
        <Box
          aria-hidden
          position="absolute"
          inset={0}
          borderRadius="xl"
          bgImage={sharedGlowBg}
          opacity={isDark ? 0.95 : 1}
          pointerEvents="none"
          sx={
            reduceMotion
              ? undefined
              : {
                  animation: "intelFeedGlow 12s ease-in-out infinite alternate",
                  "@keyframes intelFeedGlow": {
                    "0%": { opacity: 0.9, transform: "scale(1)" },
                    "100%": { opacity: 1, transform: "scale(1.012)" },
                  },
                }
          }
        />
        <Flex position="relative" zIndex={1} direction="column" gap={3} py={1.5} px={0.5}>
          {decisions.map((d, i) => (
            <DecisionCard
              key={d.id}
              decision={d}
              index={i}
              isTop={d.id === topId}
              onPrimary={consumeAndRefill}
              onSecondary={onSecondary}
            />
          ))}
        </Flex>
      </Box>
    </Box>
  );
}
