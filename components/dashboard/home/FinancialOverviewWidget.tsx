"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { animate, useReducedMotion } from "framer-motion";
import { Box, Button, Flex, Text, Tooltip } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useDashboardGlobal } from "@/components/dashboard/DashboardGlobalContext";
import {
  getDashboardHomeFinancialStub,
  type DashboardFinancialCurrencyRow,
} from "@/data/dashboardHomeFinancialStub";

const COUNT_UP_MS = 820;
const BAR_DURATION = 0.72;
const BAR_STAGGER_S = 0.05;

const tipProps = {
  placement: "top" as const,
  hasArrow: true,
  openDelay: 200,
  bg: "rgba(10, 14, 32, 0.97)",
  color: "white",
  px: 3,
  py: 2.5,
  borderRadius: "md",
  borderWidth: "1px",
  borderColor: "rgba(255,255,255,0.1)",
  fontFamily: "var(--font-graphik)",
  fontSize: "12px",
  lineHeight: 1.45,
  whiteSpace: "pre-line" as const,
};

const tabularProps = {
  fontVariantNumeric: "tabular-nums" as const,
  fontFeatureSettings: '"tnum"',
};

function formatHeroMillions(v: number): string {
  if (!Number.isFinite(v)) return "AED 0.0M";
  return `AED ${v.toFixed(1)}M`;
}

function SummaryLineItem({
  children,
  tooltip,
  href,
}: {
  children: ReactNode;
  tooltip: string;
  href?: string;
}) {
  const inner = (
    <Text
      as="span"
      fontWeight={500}
      fontSize="inherit"
      color="rgba(255,255,255,0.88)"
      cursor={href ? "pointer" : "help"}
      borderBottomWidth="1px"
      borderBottomStyle="solid"
      borderBottomColor="transparent"
      transition="color 0.18s ease, border-color 0.18s ease, filter 0.18s ease"
      _hover={{
        color: "rgba(255,255,255,0.98)",
        borderBottomColor: "rgba(255,255,255,0.28)",
        filter: "brightness(1.05)",
      }}
    >
      {children}
    </Text>
  );

  const trigger = href ? (
    <Link href={href} prefetch={false} style={{ textDecoration: "none", color: "inherit" }}>
      {inner}
    </Link>
  ) : (
    inner
  );

  return (
    <Tooltip label={tooltip} {...tipProps}>
      <Box as="span" display="inline-flex" flexShrink={0} whiteSpace="nowrap">
        {trigger}
      </Box>
    </Tooltip>
  );
}

function CurrencyAllocationList({
  homeRail,
  compact,
  dense,
  balances,
}: {
  homeRail?: boolean;
  compact?: boolean;
  dense?: boolean;
  balances: DashboardFinancialCurrencyRow[];
}) {
  const reduceMotion = useReducedMotion();
  const rm = reduceMotion === true;
  const [expanded, setExpanded] = useState(false);
  const rail = homeRail === true;
  const d = rail || (dense === true && compact === true);

  useEffect(() => {
    setExpanded(false);
  }, [balances]);

  const sorted = useMemo(() => [...balances].sort((a, b) => b.scale - a.scale), [balances]);
  const maxValue = useMemo(() => Math.max(...sorted.map((r) => r.scale), 1e-9), [sorted]);
  const totalScale = useMemo(() => sorted.reduce((s, r) => s + r.scale, 0), [sorted]);
  const topN = 4;
  const hasMore = sorted.length > topN;
  const rows = expanded || !hasMore ? sorted : sorted.slice(0, topN);
  const hiddenCount = hasMore ? sorted.length - topN : 0;

  const rowGap = rail || d ? "12px" : compact ? "12px" : "14px";
  const fontSummary = rail ? "13px" : d ? "12px" : compact ? "13px" : "14px";

  return (
    <Box w="full" sx={tabularProps}>
      <Box
        w="full"
        maxH={expanded && hasMore ? (rail ? "min(220px, 38vh)" : "240px") : undefined}
        overflowY={expanded && hasMore ? "auto" : "visible"}
        overflowX="hidden"
        sx={
          expanded && hasMore
            ? {
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(255,255,255,0.2) transparent",
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": {
                  background: "rgba(255,255,255,0.22)",
                  borderRadius: "999px",
                },
              }
            : undefined
        }
      >
        <Flex direction="column" gap={rowGap} w="full">
          {rows.map((row, index) => {
          const barPct = Math.min(100, (row.scale / maxValue) * 100);
          const sharePct = Math.round((row.scale / totalScale) * 100);
          const isTop = index === 0;
          const rowKey = `${row.code}-${index}`;
          const fillGradient = isTop
            ? "linear-gradient(90deg, #3D7AFF 0%, #62A6FF 55%, #7EB8FF 100%)"
            : "linear-gradient(90deg, rgba(61,122,255,0.82) 0%, rgba(98,166,255,0.68) 100%)";

          return (
            <Box key={rowKey} w="full" minW={0}>
              <Flex
                align="baseline"
                justify="space-between"
                gap={3}
                w="full"
                minW={0}
                mb="6px"
                cursor="default"
                borderRadius="md"
                mx={-1}
                px={1}
                py={0.5}
                transition="background 0.2s ease"
                _hover={{ bg: "rgba(255,255,255,0.04)" }}
              >
                <Text
                  flexShrink={0}
                  fontFamily="var(--font-graphik)"
                  fontSize="12px"
                  fontWeight={500}
                  letterSpacing="0.06em"
                  textTransform="uppercase"
                  color="rgba(255,255,255,0.62)"
                  lineHeight={1.2}
                  minW="44px"
                >
                  {row.code}
                </Text>
                <Flex align="baseline" justify="flex-end" gap={3} minW={0} flex="1">
                  <Text
                    fontFamily="var(--font-graphik)"
                    fontSize={fontSummary}
                    fontWeight={500}
                    letterSpacing="-0.02em"
                    color="rgba(255,255,255,0.94)"
                    lineHeight={1.2}
                    textAlign="right"
                    sx={tabularProps}
                  >
                    {row.displayAmount}
                  </Text>
                  <Text
                    w="36px"
                    flexShrink={0}
                    fontFamily="var(--font-graphik)"
                    fontSize="12px"
                    fontWeight={500}
                    letterSpacing="-0.01em"
                    color="rgba(255,255,255,0.52)"
                    lineHeight={1.2}
                    textAlign="right"
                    sx={tabularProps}
                  >
                    {sharePct}%
                  </Text>
                </Flex>
              </Flex>
              <Box
                w="100%"
                h="4px"
                borderRadius="9999px"
                bg="rgba(255,255,255,0.08)"
                overflow="hidden"
                position="relative"
              >
                <motion.div
                  initial={rm ? { width: `${barPct}%` } : { width: "0%" }}
                  animate={{ width: `${barPct}%` }}
                  transition={
                    rm
                      ? { duration: 0 }
                      : {
                          duration: BAR_DURATION,
                          ease: [0.16, 1, 0.3, 1],
                          delay: index * BAR_STAGGER_S,
                        }
                  }
                  style={{
                    height: 4,
                    borderRadius: 9999,
                    background: fillGradient,
                    minWidth: barPct > 0 ? 2 : 0,
                    boxShadow: isTop ? "0 0 14px rgba(61, 122, 255, 0.35)" : "none",
                  }}
                />
              </Box>
            </Box>
          );
        })}
        </Flex>
      </Box>

      {hasMore ? (
        <Button
          type="button"
          variant="unstyled"
          mt="12px"
          px={0}
          h="auto"
          minH={0}
          fontFamily="var(--font-graphik)"
          fontSize="12px"
          fontWeight={500}
          letterSpacing="0.02em"
          color="rgba(255,255,255,0.52)"
          textDecor="none"
          borderBottomWidth="1px"
          borderBottomColor="transparent"
          w="fit-content"
          _hover={{
            color: "rgba(255,255,255,0.88)",
            borderBottomColor: "rgba(255,255,255,0.25)",
          }}
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded ? "Show fewer currencies" : `+${hiddenCount} more currencies`}
        </Button>
      ) : null}
    </Box>
  );
}

/**
 * Executive financial snapshot — treasury-style clarity, quiet motion, scannable hierarchy.
 */
export function FinancialOverviewWidget({
  accountsHref,
  compactLayout,
  denseSidebar,
  homeRail,
  fillCell,
}: {
  accountsHref?: string;
  /** Tighter padding and type for home sidebar / one-page layouts. */
  compactLayout?: boolean;
  /** Extra-tight home right rail (pair with asymmetric widget rows). */
  denseSidebar?: boolean;
  /** Dashboard home right column: fixed ~200px shell, spec spacing. */
  homeRail?: boolean;
  /** Fill parent grid cell (home: split with Quick Actions). */
  fillCell?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const rm = reduceMotion === true;
  const rail = homeRail === true;
  const compact = compactLayout === true;
  const dense = denseSidebar === true && compactLayout === true;
  const fill = fillCell === true;

  const railFill = rail && fill;

  const { organizationId } = useDashboardGlobal();
  const financialStub = useMemo(
    () => getDashboardHomeFinancialStub(organizationId ?? undefined),
    [organizationId]
  );
  const currenciesTooltip = useMemo(
    () => financialStub.currencyRows.map((c) => `${c.code} ${c.displayAmount}`).join("\n"),
    [financialStub.currencyRows]
  );

  const heroTarget = financialStub.heroMillions;
  const [heroM, setHeroM] = useState(rm ? heroTarget : 0);

  useEffect(() => {
    const target = financialStub.heroMillions;
    if (rm) {
      setHeroM(target);
      return;
    }
    setHeroM(0);
    const c = animate(0, target, {
      duration: COUNT_UP_MS / 1000,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setHeroM(v),
    });
    return () => c.stop();
  }, [rm, financialStub.heroMillions]);

  const summaryFontSize = rail ? "12px" : dense ? "12px" : compact ? "13px" : "14px";

  return (
    <Box
      position="relative"
      overflow="hidden"
      borderRadius="18px"
      h={railFill ? "100%" : rail ? "200px" : fill ? "100%" : undefined}
      minH={railFill ? 0 : rail ? "200px" : fill ? 0 : undefined}
      maxH={rail && !fill ? "200px" : undefined}
      flex={railFill ? "1" : undefined}
      minW={0}
      display="flex"
      flexDirection="column"
      px={
        rail
          ? "18px"
          : dense
            ? { base: "12px", md: "12px" }
            : compact
              ? { base: "14px", md: "16px" }
              : { base: "28px", md: "32px" }
      }
      py={
        rail
          ? "18px"
          : dense
            ? { base: "10px", md: "10px" }
            : compact
              ? { base: "12px", md: "14px" }
              : { base: "28px", md: "32px" }
      }
      borderWidth="1px"
      borderColor="rgba(255,255,255,0.1)"
      backdropFilter="blur(20px)"
      sx={{
        ...(rail && !railFill ? { overflowY: "auto", overflowX: "hidden" } : {}),
        WebkitBackdropFilter: "blur(20px)",
        backgroundImage: `
          linear-gradient(168deg, rgba(14, 20, 52, 0.92) 0%, rgba(10, 16, 42, 0.82) 48%, rgba(8, 12, 36, 0.94) 100%),
          linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 36%, rgba(95, 85, 180, 0.055) 100%)
        `,
        boxShadow:
          "0 20px 50px rgba(0, 0, 0, 0.42), 0 0 0 1px rgba(255,255,255,0.09), inset 0 1px 0 rgba(255,255,255,0.16), inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 0 72px rgba(40, 60, 140, 0.06)",
      }}
      transition="transform 0.28s cubic-bezier(0.33, 1, 0.68, 1), box-shadow 0.32s ease, border-color 0.28s ease"
      _hover={
        rm
          ? {}
          : {
              transform: "translateY(-2px)",
              borderColor: "rgba(255,255,255,0.17)",
              boxShadow:
                "0 26px 58px rgba(0, 0, 0, 0.48), 0 0 0 1px rgba(255,255,255,0.11), 0 0 36px rgba(45, 107, 255, 0.14), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 0 80px rgba(50, 75, 160, 0.09)",
            }
      }
    >
      <Box
        position="absolute"
        pointerEvents="none"
        inset={0}
        borderRadius="inherit"
        overflow="hidden"
        aria-hidden
      >
        <Box
          position="absolute"
          top="-28%"
          left="-15%"
          w="88%"
          h="72%"
          bg="radial-gradient(ellipse at 30% 40%, rgba(80, 110, 220, 0.22) 0%, rgba(40, 55, 130, 0.08) 45%, transparent 70%)"
          opacity={0.85}
        />
        <Box
          position="absolute"
          top="2%"
          left="-8%"
          w="92%"
          h="58%"
          className="fin-overview-amount-breathe"
          bg="radial-gradient(ellipse 80% 55% at 28% 46%, rgba(120, 155, 255, 0.35) 0%, transparent 62%)"
          filter="blur(28px)"
        />
      </Box>

      <Box
        position="relative"
        zIndex={1}
        flex={fill || railFill ? "1" : undefined}
        display="flex"
        flexDirection="column"
        minH={fill || railFill ? 0 : undefined}
      >
        <Text
          fontFamily="var(--font-graphik)"
          fontSize={rail ? "11px" : { base: "11px", md: "12px" }}
          fontWeight={600}
          letterSpacing="0.14em"
          textTransform="uppercase"
          color={rail ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.48)"}
          mb={rail ? "10px" : dense ? "4px" : compact ? "6px" : "10px"}
        >
          Total Balance
        </Text>

        <Box position="relative" display="inline-block" w="fit-content" maxW="100%">
          {!rm ? (
            <motion.div
              aria-hidden
              initial={{ opacity: 0, scale: 0.92, x: "-50%", y: "-50%" }}
              animate={{
                opacity: [0, 0.55, 0.18],
                scale: [0.92, 1.05, 1],
                x: "-50%",
                y: "-50%",
              }}
              transition={{
                duration: 1.05,
                times: [0, 0.35, 1],
                ease: ["easeOut", "easeInOut"],
              }}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "140%",
                height: "120%",
                pointerEvents: "none",
                background:
                  "radial-gradient(ellipse 65% 70% at 50% 45%, rgba(100, 160, 255, 0.42) 0%, rgba(45, 107, 255, 0.12) 42%, transparent 72%)",
                filter: "blur(22px)",
                zIndex: 0,
              }}
            />
          ) : null}
          <Text
            position="relative"
            zIndex={1}
            fontFamily="var(--font-graphik)"
            fontSize={
              rail
                ? { base: "30px", md: "32px" }
                : dense
                  ? { base: "24px", md: "26px" }
                  : compact
                    ? { base: "28px", md: "30px" }
                    : { base: "40px", md: "48px" }
            }
            fontWeight={500}
            letterSpacing="-0.035em"
            lineHeight={rail ? 1.08 : 1.02}
            color="#FFF"
            textShadow="0 2px 28px rgba(0, 0, 0, 0.25)"
            sx={tabularProps}
          >
            {formatHeroMillions(heroM)}
          </Text>
        </Box>

        <Flex
          align="center"
          gap={rail ? 2 : 3}
          flexWrap="nowrap"
          w="full"
          minW={0}
          overflow="hidden"
          fontFamily="var(--font-graphik)"
          fontSize={summaryFontSize}
          lineHeight={1.35}
          color="rgba(255,255,255,0.72)"
          mt={rail ? "14px" : dense ? "8px" : compact ? "10px" : "14px"}
          sx={{ ...tabularProps, whiteSpace: "nowrap" }}
        >
          <SummaryLineItem
            tooltip={`${financialStub.accountCount} operational accounts in your organization.`}
            href={accountsHref}
          >
            {financialStub.accountCount} Accounts
          </SummaryLineItem>
          <Text as="span" color="rgba(255,255,255,0.42)" fontWeight={400} userSelect="none" flexShrink={0}>
            |
          </Text>
          <SummaryLineItem tooltip={currenciesTooltip}>
            {financialStub.currencyRows.length} Currencies
          </SummaryLineItem>
          <Text as="span" color="rgba(255,255,255,0.42)" fontWeight={400} userSelect="none" flexShrink={0}>
            |
          </Text>
          <SummaryLineItem tooltip={financialStub.countriesTooltip}>
            {financialStub.countryCount} Countries
          </SummaryLineItem>
        </Flex>

        <Box
          flex={railFill || (fill && !rail) ? "1" : undefined}
          minH={railFill || (fill && !rail) ? 0 : undefined}
          display="flex"
          flexDirection="column"
          mt={rail ? "18px" : dense ? "10px" : compact ? "14px" : "18px"}
          overflowY={railFill ? "auto" : undefined}
        >
          <CurrencyAllocationList
            compact={compact}
            dense={dense}
            homeRail={rail}
            balances={financialStub.currencyRows}
          />
        </Box>

        <Flex
          align="center"
          gap={1.5}
          flexWrap="nowrap"
          flexShrink={0}
          mt={rail ? "12px" : fill ? "auto" : dense ? "6px" : compact ? "8px" : "12px"}
          minW={0}
          w="full"
        >
          <Text
            as="span"
            flex="1"
            minW={0}
            fontFamily="var(--font-graphik)"
            fontSize={rail ? "10px" : dense ? "10px" : compact ? "10px" : "11px"}
            color={rail ? "rgba(255,255,255,0.48)" : "rgba(255,255,255,0.38)"}
            letterSpacing="0.01em"
            lineHeight={1.35}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            Converted at latest FX rates • Updated 2 mins ago
          </Text>
          <Tooltip label="Balances refresh on a short interval." {...tipProps} placement="top" openDelay={150}>
            <Flex as="span" align="center" flexShrink={0} aria-label="Live balance indicator">
              <Box
                w="4px"
                h="4px"
                borderRadius="full"
                bg="rgba(96, 165, 250, 0.88)"
                boxShadow="0 0 0 2px rgba(0,0,0,0.25), 0 0 8px rgba(96, 165, 250, 0.28)"
              />
            </Flex>
          </Tooltip>
        </Flex>
      </Box>
    </Box>
  );
}
