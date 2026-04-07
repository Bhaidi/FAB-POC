"use client";

import { Box, Button, Flex, Text, useColorMode } from "@chakra-ui/react";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import type { AiDecision } from "@/data/aiDecisionFeedTypes";

const HOVER_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function useFinePointerHover(): boolean | null {
  const [fine, setFine] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setFine(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return fine;
}

type Props = {
  decision: AiDecision;
  isTop?: boolean;
  index?: number;
  onPrimary: (id: string) => void;
  onSecondary?: (id: string) => void;
};

export function DecisionCard({ decision, isTop, index = 0, onPrimary, onSecondary }: Props) {
  const { corpTable } = useFabTokens();
  const { colorMode } = useColorMode();
  const reduceMotion = useReducedMotion() === true;
  const cardRef = useRef<HTMLDivElement>(null);
  const isDark = colorMode === "dark";

  const cardBg = isDark ? "rgba(10, 14, 28, 0.94)" : "#F7F7F8";
  const cardBorder = isDark ? "rgba(255, 255, 255, 0.07)" : "rgba(1, 5, 145, 0.08)";
  const cardBorderTop = isTop ? (isDark ? "rgba(255, 255, 255, 0.11)" : "rgba(1, 5, 145, 0.11)") : cardBorder;
  const innerGlow = isDark
    ? "radial-gradient(ellipse 95% 65% at 50% -5%, rgba(72, 120, 220, 0.16) 0%, transparent 52%), radial-gradient(ellipse 70% 50% at 100% 100%, rgba(40, 70, 140, 0.12) 0%, transparent 45%)"
    : "radial-gradient(ellipse 90% 55% at 50% 0%, rgba(0, 98, 255, 0.055) 0%, transparent 50%), linear-gradient(180deg, rgba(255,255,255,0.65) 0%, transparent 38%)";
  const meshSpot = isDark ? "rgba(100, 150, 255, 0.07)" : "rgba(0, 98, 255, 0.04)";
  const meshStreak = isDark ? "rgba(255, 255, 255, 0.035)" : "rgba(1, 5, 145, 0.03)";
  const shadowRest = isDark
    ? "0 1px 0 rgba(255,255,255,0.04) inset, 0 4px 24px rgba(0, 0, 0, 0.35)"
    : "0 1px 0 rgba(255,255,255,0.9) inset, 0 4px 20px rgba(1, 5, 145, 0.045)";
  const shadowHover = isDark
    ? "0 1px 0 rgba(255,255,255,0.06) inset, 0 20px 48px rgba(0, 0, 0, 0.45), 0 0 40px rgba(60, 100, 200, 0.12)"
    : "0 1px 0 rgba(255,255,255,0.95) inset, 0 16px 40px rgba(1, 5, 145, 0.08), 0 0 32px rgba(0, 98, 255, 0.06)";
  const focusRing = isDark ? "0 0 0 2px rgba(120, 160, 255, 0.35)" : "0 0 0 2px rgba(0, 98, 255, 0.2)";

  const [hovered, setHovered] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  const finePointer = useFinePointerHover();
  const showActions = finePointer === null ? true : !finePointer || hovered || focusInside;

  const onBlurCapture = useCallback((e: React.FocusEvent) => {
    const rt = e.relatedTarget as Node | null;
    if (!rt || !e.currentTarget.contains(rt)) setFocusInside(false);
  }, []);

  const descriptionText = [decision.context, decision.impact].filter(Boolean).join(" · ");

  const meshBg = useMemo(
    () =>
      `radial-gradient(ellipse 125% 100% at var(--intel-x, 50%) var(--intel-y, 38%), ${meshSpot} 0%, transparent 50%),
       linear-gradient(122deg, ${meshStreak} 0%, transparent 44%),
       linear-gradient(298deg, ${meshStreak} 0%, transparent 46%)`,
    [meshSpot, meshStreak],
  );

  const setPointerVars = useCallback((clientX: number, clientY: number) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((clientX - r.left) / Math.max(r.width, 1)) * 100;
    const y = ((clientY - r.top) / Math.max(r.height, 1)) * 100;
    el.style.setProperty("--intel-x", `${Math.round(x * 10) / 10}%`);
    el.style.setProperty("--intel-y", `${Math.round(y * 10) / 10}%`);
  }, []);

  const resetPointerVars = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--intel-x", "50%");
    el.style.setProperty("--intel-y", "36%");
  }, []);

  return (
    <motion.div
      style={{ width: "100%", minWidth: 0 }}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 0.4,
        delay: reduceMotion ? 0 : Math.min(index * 0.05, 0.3),
        ease: HOVER_EASE,
      }}
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -4,
              scale: 1.01,
              transition: { duration: 0.26, ease: HOVER_EASE },
            }
      }
      whileTap={reduceMotion ? undefined : { scale: 0.995, transition: { duration: 0.2, ease: HOVER_EASE } }}
    >
      <Box
        position="relative"
        borderRadius="md"
        borderWidth="1px"
        borderColor={cardBorderTop}
        boxShadow={hovered ? shadowHover : shadowRest}
        minW={0}
        overflow="visible"
        tabIndex={finePointer === true ? 0 : undefined}
        outline="none"
        sx={{
          transition: "box-shadow 0.26s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.26s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        _focusVisible={{ boxShadow: `${shadowRest}, ${focusRing}` }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          resetPointerVars();
        }}
        onMouseMove={(e) => setPointerVars(e.clientX, e.clientY)}
        onFocus={(e) => {
          if (e.target === e.currentTarget) setFocusInside(true);
        }}
        onFocusCapture={() => setFocusInside(true)}
        onBlurCapture={onBlurCapture}
        _hover={{ borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 98, 255, 0.14)" }}
      >
        <Box
          ref={cardRef}
          position="relative"
          overflow="hidden"
          borderRadius="md"
          sx={{
            "--intel-x": "50%",
            "--intel-y": "36%",
            isolation: "isolate",
          }}
        >
        <Box position="absolute" inset={0} zIndex={0} bg={cardBg} pointerEvents="none" />
        <Box
          aria-hidden
          position="absolute"
          inset={0}
          zIndex={1}
          pointerEvents="none"
          bgImage={innerGlow}
          opacity={isTop ? 1 : 0.92}
        />

        <Box
          aria-hidden
          position="absolute"
          inset="-24%"
          zIndex={2}
          pointerEvents="none"
          opacity={reduceMotion ? 0.4 : hovered ? 0.42 : 0.32}
          transition="opacity 0.35s ease"
          sx={{
            backgroundImage: meshBg,
            backgroundSize: "160% 160%",
            ...(reduceMotion
              ? {}
              : {
                  animation: "intelAmbient 10s ease-in-out infinite alternate",
                  "@keyframes intelAmbient": {
                    "0%": {
                      transform: "translate(-3%, -2%) scale(1.06)",
                      backgroundPosition: "0% 20%",
                    },
                    "100%": {
                      transform: "translate(4%, 3%) scale(1.1)",
                      backgroundPosition: "100% 80%",
                    },
                  },
                }),
          }}
        />

        <Box position="relative" zIndex={3} px={3.5} py={3}>
          <Text
            as="h3"
            fontFamily="var(--font-graphik)"
            fontSize="13px"
            fontWeight={600}
            letterSpacing="-0.01em"
            lineHeight={1.35}
            color={corpTable.bodyPrimary}
            mb={1.5}
            noOfLines={2}
          >
            {decision.title}
          </Text>

          <Text
            fontFamily="var(--font-graphik)"
            fontSize="11.5px"
            fontWeight={400}
            lineHeight={1.42}
            color={corpTable.chromeTextMuted}
            mb={0}
            noOfLines={2}
          >
            {descriptionText}
          </Text>

          <Box
            overflow="hidden"
            maxH={showActions ? "80px" : "0"}
            opacity={showActions ? 1 : 0}
            mt={3}
            pointerEvents={showActions ? "auto" : "none"}
            transition="opacity 0.24s cubic-bezier(0.16, 1, 0.3, 1), max-height 0.28s cubic-bezier(0.16, 1, 0.3, 1)"
            sx={{
              "@media (prefers-reduced-motion: reduce)": {
                transition: "none",
              },
            }}
          >
            <Flex gap={2} flexWrap="wrap" align="center" pt={0}>
              <Button
                size="xs"
                variant="outline"
                h="28px"
                minH="28px"
                fontSize="11px"
                px={2.5}
                borderColor={isDark ? "rgba(255,255,255,0.14)" : "rgba(1, 5, 145, 0.12)"}
                color={corpTable.bodyPrimary}
                bg={isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.85)"}
                _hover={{
                  bg: isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,1)",
                  borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0, 98, 255, 0.22)",
                }}
                tabIndex={showActions ? undefined : -1}
                onClick={() => onPrimary(decision.id)}
              >
                {decision.primaryAction}
              </Button>
              {decision.secondaryAction ? (
                <Button
                  size="xs"
                  variant="ghost"
                  color={corpTable.chromeTextMuted}
                  h="28px"
                  minH="28px"
                  fontSize="11px"
                  px={2.5}
                  tabIndex={showActions ? undefined : -1}
                  onClick={() => onSecondary?.(decision.id)}
                >
                  {decision.secondaryAction}
                </Button>
              ) : null}
            </Flex>
          </Box>
        </Box>
        </Box>
      </Box>
    </motion.div>
  );
}
