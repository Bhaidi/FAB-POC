"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { animate, useReducedMotion } from "framer-motion";
import { Box, Button, Flex, Text, Tooltip, useColorMode } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useDashboardGlobal } from "@/components/dashboard/DashboardGlobalContext";
import { figmaHomeLayoutDark } from "@/components/dashboard/dashboardTokens";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import { glassTokens } from "@/lib/glassTokens";
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
  bg: "rgba(255, 255, 255, 0.98)",
  color: "#48525E",
  px: 3,
  py: 2.5,
  borderRadius: "md",
  borderWidth: "1px",
  borderColor: "rgba(1, 5, 145, 0.1)",
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
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { dashColors } = useFabTokens();
  const summaryTipOverrides = isDark
    ? {
        bg: "rgba(12, 16, 32, 0.97)",
        color: "rgba(255, 255, 255, 0.96)",
        borderColor: "rgba(255, 255, 255, 0.14)",
      }
    : {};

  const inner = (
    <Text
      as="span"
      fontWeight={500}
      fontSize="inherit"
      color={dashColors.text.secondary}
      cursor={href ? "pointer" : "help"}
      borderBottomWidth="1px"
      borderBottomStyle="solid"
      borderBottomColor="transparent"
      transition="color 0.18s ease, border-color 0.18s ease, filter 0.18s ease"
      _hover={{
        color: dashColors.text.primary,
        borderBottomColor: "rgba(0, 98, 255, 0.45)",
        filter: "none",
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
    <Tooltip label={tooltip} {...tipProps} {...summaryTipOverrides}>
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
  suppressBarMotion,
}: {
  homeRail?: boolean;
  compact?: boolean;
  dense?: boolean;
  balances: DashboardFinancialCurrencyRow[];
  /** When true, bars render at target width (no grow-in). Stays off after first deferred load. */
  suppressBarMotion?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const rm = reduceMotion === true;
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { dashColors } = useFabTokens();
  const [expanded, setExpanded] = useState(false);
  const rail = homeRail === true;
  const figmaDarkRail = rail && isDark;
  const d = rail || (dense === true && compact === true);
  const deferredBarsRef = useRef(false);
  if (suppressBarMotion) deferredBarsRef.current = true;
  const growBars = !suppressBarMotion && !deferredBarsRef.current;

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

  const rowGap = figmaDarkRail
    ? figmaHomeLayoutDark.currencyRowGap
    : rail || d
      ? "12px"
      : compact
        ? "12px"
        : "14px";
  const fontSummary = figmaDarkRail ? "12px" : rail ? "13px" : d ? "12px" : compact ? "13px" : "14px";

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
                scrollbarColor: isDark
                  ? "rgba(255, 255, 255, 0.22) transparent"
                  : "rgba(1, 5, 145, 0.2) transparent",
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": {
                  background: isDark ? "rgba(255, 255, 255, 0.18)" : "rgba(1, 5, 145, 0.15)",
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

          if (figmaDarkRail) {
            return (
              <Box key={rowKey} w="full" minW={0}>
                <Flex
                  align="flex-start"
                  justify="space-between"
                  gap={1}
                  w="full"
                  minW={0}
                  mb="4px"
                  fontFamily="var(--font-graphik)"
                  fontSize={fontSummary}
                  fontWeight={400}
                  lineHeight={1.35}
                  color="#ffffff"
                >
                  <Text flex="1" minW={0} noOfLines={1} sx={{ color: "#ffffff !important" }}>
                    {row.code}
                  </Text>
                  <Flex align="center" gap={6} flexShrink={0}>
                    <Text sx={{ ...tabularProps, color: "#ffffff !important" }}>{row.displayAmount}</Text>
                    <Text sx={{ ...tabularProps, color: "#ffffff !important" }}>
                      {sharePct}%
                    </Text>
                  </Flex>
                </Flex>
                <Flex h="20px" align="center" w="full">
                  <Box
                    w="100%"
                    h="6px"
                    borderRadius="40px"
                    bg={glassTokens.progress.trackRail}
                    overflow="hidden"
                    position="relative"
                    boxShadow={`inset 0 1px 2px rgba(0,0,0,0.35)`}
                  >
                    <motion.div
                      initial={rm || !growBars ? { width: `${barPct}%` } : { width: "0%" }}
                      animate={{ width: `${barPct}%` }}
                      transition={
                        rm || !growBars
                          ? { duration: 0 }
                          : {
                              duration: BAR_DURATION,
                              ease: [0.16, 1, 0.3, 1],
                              delay: index * BAR_STAGGER_S,
                            }
                      }
                      style={{
                        height: 6,
                        borderRadius: 40,
                        background: glassTokens.progress.fill,
                        minWidth: barPct > 0 ? 2 : 0,
                        boxShadow: isTop ? glassTokens.progress.fillGlow : undefined,
                      }}
                    />
                  </Box>
                </Flex>
              </Box>
            );
          }

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
                _hover={{ bg: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(1, 5, 145, 0.04)" }}
              >
                <Text
                  flexShrink={0}
                  fontFamily="var(--font-graphik)"
                  fontSize="12px"
                  fontWeight={500}
                  letterSpacing="0.06em"
                  textTransform="uppercase"
                  color={dashColors.text.tertiary}
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
                    color={dashColors.text.secondary}
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
                    color={dashColors.text.muted}
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
                bg={isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(1, 5, 145, 0.08)"}
                overflow="hidden"
                position="relative"
              >
                <motion.div
                  initial={rm || !growBars ? { width: `${barPct}%` } : { width: "0%" }}
                  animate={{ width: `${barPct}%` }}
                  transition={
                    rm || !growBars
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
          mt={figmaDarkRail ? "24px" : "12px"}
          px={0}
          h="auto"
          minH={0}
          fontFamily="var(--font-graphik)"
          fontSize="12px"
          fontWeight={figmaDarkRail ? 400 : 500}
          letterSpacing={figmaDarkRail ? "normal" : "0.02em"}
          color={figmaDarkRail ? "#ffffff" : dashColors.text.muted}
          textDecor="none"
          borderBottomWidth={figmaDarkRail ? 0 : "1px"}
          borderBottomColor="transparent"
          w="fit-content"
          textAlign="left"
          _hover={
            figmaDarkRail
              ? { opacity: 0.85 }
              : {
                  color: dashColors.text.primary,
                  borderBottomColor: "rgba(0, 98, 255, 0.3)",
                }
          }
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
  deferRichMotion = false,
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
  /**
   * While dashboard taxonomy / context is still loading, skip hero count-up and bar grow-in
   * so motion stays aligned with `PlatformCard` ghost / surface-ready timing.
   */
  deferRichMotion?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const rm = reduceMotion === true;
  const deferredHeroRef = useRef(false);
  if (deferRichMotion) deferredHeroRef.current = true;
  const rail = homeRail === true;
  const compact = compactLayout === true;
  const dense = denseSidebar === true && compactLayout === true;
  const fill = fillCell === true;

  const railFill = rail && fill;

  const { organizationId } = useDashboardGlobal();
  const { financialOverviewShell, dashColors } = useFabTokens();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const financialStub = useMemo(
    () => getDashboardHomeFinancialStub(organizationId ?? undefined),
    [organizationId]
  );
  const currenciesTooltip = useMemo(
    () => financialStub.currencyRows.map((c) => `${c.code} ${c.displayAmount}`).join("\n"),
    [financialStub.currencyRows]
  );

  const heroTarget = financialStub.heroMillions;
  const [heroM, setHeroM] = useState(rm || deferRichMotion ? heroTarget : 0);

  useEffect(() => {
    const target = financialStub.heroMillions;
    if (rm) {
      setHeroM(target);
      return;
    }
    if (deferRichMotion) {
      setHeroM(target);
      return;
    }
    if (deferredHeroRef.current) {
      deferredHeroRef.current = false;
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
  }, [rm, deferRichMotion, financialStub.heroMillions]);

  const railFigmaDark = rail && isDark;
  const summaryFontSize = railFigmaDark ? "13px" : rail ? "12px" : dense ? "12px" : compact ? "13px" : "14px";

  return (
    <Box
      position="relative"
      overflow={railFigmaDark ? "visible" : "hidden"}
      borderRadius={railFigmaDark ? "0" : "18px"}
      h={railFill ? "100%" : rail && !railFigmaDark ? "200px" : fill ? "100%" : undefined}
      minH={railFill ? 0 : rail && !railFigmaDark ? "200px" : fill ? 0 : undefined}
      maxH={rail && !fill && !railFigmaDark ? "200px" : undefined}
      flex={railFill ? "1" : undefined}
      minW={0}
      display="flex"
      flexDirection="column"
      px={
        railFigmaDark
          ? 0
          : rail
            ? "18px"
            : dense
              ? { base: "12px", md: "12px" }
              : compact
                ? { base: "14px", md: "16px" }
                : { base: "28px", md: "32px" }
      }
      py={
        railFigmaDark
          ? 0
          : rail
            ? "18px"
            : dense
              ? { base: "10px", md: "10px" }
              : compact
                ? { base: "12px", md: "14px" }
                : { base: "28px", md: "32px" }
      }
      borderWidth={railFigmaDark ? 0 : "1px"}
      borderColor={
        railFigmaDark ? "transparent" : financialOverviewShell.border
      }
      backdropFilter={railFigmaDark ? "none" : financialOverviewShell.backdropFilter}
      bg={railFigmaDark ? "transparent" : undefined}
      sx={{
        ...(rail && !railFill && !railFigmaDark ? { overflowY: "auto", overflowX: "hidden" } : {}),
        ...(railFigmaDark
          ? {
              WebkitBackdropFilter: "none",
              boxShadow: "none",
              backgroundImage: "none",
            }
          : {
              WebkitBackdropFilter: financialOverviewShell.WebkitBackdropFilter,
              backgroundImage: financialOverviewShell.backgroundImage,
              boxShadow: financialOverviewShell.boxShadow,
            }),
      }}
      transition="transform 0.28s cubic-bezier(0.33, 1, 0.68, 1), box-shadow 0.32s ease, border-color 0.28s ease"
      _hover={
        rm
          ? {}
          : railFigmaDark
            ? {}
            : {
                transform: "translateY(-2px)",
                borderColor: financialOverviewShell.hoverBorder,
                boxShadow: financialOverviewShell.hoverBoxShadow,
              }
      }
    >
      {!isDark && !railFigmaDark ? (
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
          bg={financialOverviewShell.sheenRadialA}
          opacity={0.85}
        />
        <Box
          position="absolute"
          top="2%"
          left="-8%"
          w="92%"
          h="58%"
          className="fin-overview-amount-breathe"
          bg={financialOverviewShell.sheenRadialB}
          filter="blur(28px)"
        />
      </Box>
      ) : null}

      <Box
        position="relative"
        zIndex={1}
        flex={fill || railFill ? "1" : undefined}
        display="flex"
        flexDirection="column"
        minH={fill || railFill ? 0 : undefined}
      >
          <Text
            fontFamily='"Graphik Trial", var(--font-graphik), system-ui, sans-serif'
            fontSize={railFigmaDark ? "12px" : rail ? "11px" : { base: "11px", md: "12px" }}
            fontStyle={railFigmaDark ? "normal" : undefined}
            fontWeight={railFigmaDark ? 300 : 600}
            letterSpacing={railFigmaDark ? "1.4px" : "0.14em"}
            lineHeight={railFigmaDark ? "normal" : undefined}
            textTransform="uppercase"
            color={railFigmaDark ? undefined : dashColors.text.tertiary}
            mb={railFigmaDark ? "12px" : rail ? "10px" : dense ? "4px" : compact ? "6px" : "10px"}
            sx={
              railFigmaDark
                ? {
                    color: "#ffffff !important",
                  }
                : undefined
            }
          >
            Total Balance
          </Text>

        <Box position="relative" display="inline-block" w="fit-content" maxW="100%">
          {!rm && !deferRichMotion ? (
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
                background: isDark
                  ? "radial-gradient(ellipse 65% 70% at 50% 45%, rgba(100, 160, 255, 0.28) 0%, rgba(45, 107, 255, 0.1) 42%, transparent 72%)"
                  : "radial-gradient(ellipse 65% 70% at 50% 45%, rgba(100, 160, 255, 0.2) 0%, rgba(45, 107, 255, 0.06) 42%, transparent 72%)",
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
              railFigmaDark
                ? { base: "32px", md: "42px" }
                : rail
                  ? { base: "30px", md: "32px" }
                  : dense
                    ? { base: "24px", md: "26px" }
                    : compact
                      ? { base: "28px", md: "30px" }
                      : { base: "40px", md: "48px" }
            }
            fontWeight={railFigmaDark ? 400 : 500}
            letterSpacing="-0.035em"
            lineHeight={rail ? 1.08 : 1.02}
            color={railFigmaDark ? undefined : dashColors.pageTitle}
            textShadow="none"
            sx={
              railFigmaDark
                ? { ...tabularProps, color: "#ffffff !important" }
                : tabularProps
            }
          >
            {formatHeroMillions(heroM)}
          </Text>
        </Box>

        {railFigmaDark ? (
          <Flex
            align="center"
            gap={4}
            flexWrap="nowrap"
            w="full"
            minW={0}
            overflow="hidden"
            fontFamily="var(--font-graphik)"
            fontSize={summaryFontSize}
            fontWeight={500}
            lineHeight={1.35}
            mt="12px"
            sx={{ ...tabularProps, whiteSpace: "nowrap", color: "#ffffff !important" }}
          >
            <Tooltip
              label={`${financialStub.accountCount} operational accounts in your organization.`}
              {...tipProps}
              {...{
                bg: "rgba(12, 16, 32, 0.97)",
                color: "rgba(255, 255, 255, 0.96)",
                borderColor: "rgba(255, 255, 255, 0.14)",
              }}
            >
              <Box as="span" sx={{ color: "#ffffff !important" }}>
                {accountsHref ? (
                  <Link
                    href={accountsHref}
                    prefetch={false}
                    style={{ color: "#ffffff", textDecoration: "none" }}
                  >
                    {financialStub.accountCount} Accounts
                  </Link>
                ) : (
                  <Text as="span" sx={{ color: "#ffffff !important" }}>
                    {financialStub.accountCount} Accounts
                  </Text>
                )}
              </Box>
            </Tooltip>
            <Box w="1px" h="14px" bg="rgba(255,255,255,0.22)" flexShrink={0} aria-hidden />
            <Tooltip label={currenciesTooltip} {...tipProps} {...{ bg: "rgba(12, 16, 32, 0.97)", color: "rgba(255, 255, 255, 0.96)", borderColor: "rgba(255, 255, 255, 0.14)" }}>
              <Text as="span" cursor="default" sx={{ color: "#ffffff !important" }}>
                {financialStub.currencyRows.length} Currencies
              </Text>
            </Tooltip>
            <Box w="1px" h="14px" bg="rgba(255,255,255,0.22)" flexShrink={0} aria-hidden />
            <Tooltip label={financialStub.countriesTooltip} {...tipProps} {...{ bg: "rgba(12, 16, 32, 0.97)", color: "rgba(255, 255, 255, 0.96)", borderColor: "rgba(255, 255, 255, 0.14)" }}>
              <Text as="span" cursor="default" sx={{ color: "#ffffff !important" }}>
                {financialStub.countryCount} Countries
              </Text>
            </Tooltip>
          </Flex>
        ) : (
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
            color={dashColors.text.secondary}
            mt={rail ? "14px" : dense ? "8px" : compact ? "10px" : "14px"}
            sx={{ ...tabularProps, whiteSpace: "nowrap" }}
          >
            <SummaryLineItem
              tooltip={`${financialStub.accountCount} operational accounts in your organization.`}
              href={accountsHref}
            >
              {financialStub.accountCount} Accounts
            </SummaryLineItem>
            <Text as="span" color={dashColors.text.faint} fontWeight={400} userSelect="none" flexShrink={0}>
              |
            </Text>
            <SummaryLineItem tooltip={currenciesTooltip}>
              {financialStub.currencyRows.length} Currencies
            </SummaryLineItem>
            <Text as="span" color={dashColors.text.faint} fontWeight={400} userSelect="none" flexShrink={0}>
              |
            </Text>
            <SummaryLineItem tooltip={financialStub.countriesTooltip}>
              {financialStub.countryCount} Countries
            </SummaryLineItem>
          </Flex>
        )}

        <Box
          flex={railFill || (fill && !rail) ? "1" : undefined}
          minH={railFill || (fill && !rail) ? 0 : undefined}
          display="flex"
          flexDirection="column"
          mt={railFigmaDark ? "34px" : rail ? "18px" : dense ? "10px" : compact ? "14px" : "18px"}
          overflowY={railFill ? "auto" : undefined}
        >
          <CurrencyAllocationList
            compact={compact}
            dense={dense}
            homeRail={rail}
            balances={financialStub.currencyRows}
            suppressBarMotion={deferRichMotion}
          />
        </Box>

        {railFigmaDark ? (
          <Text
            mt="24px"
            flexShrink={0}
            minW={0}
            w="full"
            fontFamily="var(--font-graphik)"
            fontSize="12px"
            fontWeight={400}
            lineHeight={1.35}
            sx={{ color: "#ffffff !important" }}
          >
            Converted at latest FX rates. Updated 2 mins ago
          </Text>
        ) : (
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
              color={dashColors.text.muted}
              letterSpacing="0.01em"
              lineHeight={1.35}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              Converted at latest FX rates • Updated 2 mins ago
            </Text>
            <Tooltip
              label="Balances refresh on a short interval."
              {...tipProps}
              {...(isDark
                ? {
                    bg: "rgba(12, 16, 32, 0.97)",
                    color: "rgba(255, 255, 255, 0.96)",
                    borderColor: "rgba(255, 255, 255, 0.14)",
                  }
                : {})}
              placement="top"
              openDelay={150}
            >
              <Flex as="span" align="center" flexShrink={0} aria-label="Live balance indicator">
                <Box
                  w="4px"
                  h="4px"
                  borderRadius="full"
                  bg="rgba(96, 165, 250, 0.88)"
                  boxShadow={
                    isDark
                      ? "0 0 0 2px rgba(0, 0, 0, 0.35), 0 0 8px rgba(96, 165, 250, 0.45)"
                      : "0 0 0 2px rgba(255,255,255,0.95), 0 0 8px rgba(96, 165, 250, 0.35)"
                  }
                />
              </Flex>
            </Tooltip>
          </Flex>
        )}
      </Box>
    </Box>
  );
}
