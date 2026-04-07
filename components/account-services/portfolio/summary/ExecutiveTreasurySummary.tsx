"use client";

import { Box, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { animate, AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { AiDecisionFeed } from "@/components/account-services/portfolio/ai-decision-feed";
import { BreakdownColumn } from "@/components/account-services/portfolio/breakdown/BreakdownColumn";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import type { BreakdownChartSelection } from "@/data/breakdownChartTypes";
import type { TreasurySummaryData, TreasurySummaryInteractiveKind, TreasurySummaryPart } from "@/data/treasurySummaryTypes";
import type { PortfolioModuleTab } from "@/data/portfolioSummaryTypes";

const EASE = [0.33, 1, 0.68, 1] as const;
const MODULE_MS = 0.26;
/** Space between each label/value block in the Position column (and before the first block). */
const POSITION_PAIR_GAP = 8;
const sectionLabelSx = {
  fontSize: "12px",
  fontWeight: 600,
  letterSpacing: "0.14em",
  textTransform: "uppercase" as const,
  fontFamily: "var(--font-graphik)",
};

function ColumnHeading({ children }: { children: string }) {
  const { portfolioSectionHeadingSx } = useFabTokens();
  return (
    <Text {...portfolioSectionHeadingSx} mb={4}>
      {children}
    </Text>
  );
}

function RailDivider({ orientation = "vertical" as const }: { orientation?: "vertical" | "horizontal" }) {
  const { dashColors } = useFabTokens();
  const railLine = dashColors.homeRailDivider;
  if (orientation === "horizontal") {
    return <Box as="hr" aria-hidden border="none" borderTopWidth="1px" borderTopColor={railLine} w="full" my={0} />;
  }
  return (
    <Box aria-hidden position="absolute" top={0} bottom={0} left="50%" w="1px" ml="-0.5px" bg={railLine} pointerEvents="none" />
  );
}

function summaryPartsPlainText(parts: TreasurySummaryPart[]): string {
  return parts
    .map((p) => {
      if (p.type === "text") return p.value;
      if (p.type === "accounts") return `${p.count} accounts`;
      if (p.type === "currencies") return `${p.count} currencies`;
      if (p.type === "countries") return `${p.count} countries`;
      if (p.type === "deposits") return `${p.count} deposits`;
      if (p.type === "facilities") return `${p.count} facilities`;
      return "";
    })
    .join("");
}

function TreasuryHeroAmount({
  data,
  animKey,
  reduceMotion,
}: {
  data: TreasurySummaryData;
  animKey: string;
  reduceMotion: boolean;
}) {
  const { dashColors } = useFabTokens();
  const n = data.heroNumeric;
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!n) return;
    const target = n.value;
    if (reduceMotion) {
      setShown(target);
      return;
    }
    setShown(0);
    const ctrl = animate(0, target, {
      duration: 0.55,
      ease: EASE,
      onUpdate: (v) => setShown(v),
    });
    return () => ctrl.stop();
  }, [animKey, n, reduceMotion]);

  if (!n) {
    return (
      <Text
        fontFamily="var(--font-graphik)"
        fontSize={{ base: "48px", md: "clamp(48px, 4.2vw, 56px)" }}
        fontWeight={500}
        letterSpacing="-0.03em"
        lineHeight={1}
        color={dashColors.pageTitle}
        sx={{
          fontVariantNumeric: "tabular-nums",
          textShadow: "0 0 48px rgba(0, 100, 255, 0.12), 0 0 96px rgba(0, 60, 180, 0.06)",
        }}
      >
        {data.heroDisplay}
      </Text>
    );
  }

  const formatted =
    n.decimals > 0
      ? shown.toLocaleString("en-US", {
          minimumFractionDigits: n.decimals,
          maximumFractionDigits: n.decimals,
        })
      : Math.round(shown).toLocaleString("en-US");

  return (
    <Text
      fontFamily="var(--font-graphik)"
      fontSize={{ base: "48px", md: "clamp(48px, 4.2vw, 56px)" }}
      fontWeight={500}
      letterSpacing="-0.03em"
      lineHeight={1}
      color={dashColors.pageTitle}
      sx={{
        fontVariantNumeric: "tabular-nums",
        textShadow: "0 0 48px rgba(0, 100, 255, 0.12), 0 0 96px rgba(0, 60, 180, 0.06)",
      }}
    >
      {n.prefix}
      {formatted}
      {n.suffix}
    </Text>
  );
}

function SummaryMetaLine({
  parts,
  onInteractive,
}: {
  parts: TreasurySummaryPart[];
  onInteractive: (kind: TreasurySummaryInteractiveKind) => void;
}) {
  const { dashColors } = useFabTokens();
  const plain = summaryPartsPlainText(parts);
  return (
    <Box
      as="p"
      mt={4}
      mb={0}
      mx={0}
      fontFamily="var(--font-graphik)"
      fontSize="15px"
      fontWeight={600}
      lineHeight={1.4}
      color={dashColors.pageSubtitle}
      maxW="520px"
      aria-label={plain}
    >
      {parts.map((p, i) => {
        if (p.type === "text") {
          return (
            <Box as="span" key={i}>
              {p.value}
            </Box>
          );
        }
        const label =
          p.type === "accounts"
            ? `${p.count} accounts`
            : p.type === "currencies"
              ? `${p.count} currencies`
              : p.type === "countries"
                ? `${p.count} countries`
                : p.type === "deposits"
                  ? `${p.count} deposits`
                  : `${p.count} facilities`;
        return (
          <Box
            key={i}
            as="button"
            type="button"
            display="inline"
            verticalAlign="baseline"
            bg="transparent"
            border="none"
            cursor="pointer"
            p={0}
            m={0}
            fontFamily="inherit"
            fontSize="inherit"
            fontWeight={700}
            lineHeight="inherit"
            color={dashColors.pageTitle}
            _hover={{ color: dashColors.pageTitle, textDecoration: "underline", opacity: 0.88 }}
            onClick={() => onInteractive(p.type)}
          >
            {label}
          </Box>
        );
      })}
    </Box>
  );
}

export type ExecutiveTreasurySummaryProps = {
  module: PortfolioModuleTab;
  data: TreasurySummaryData;
  activeDistId: string;
  onActiveDistIdChange: (id: string) => void;
  onSummaryInteractive: (kind: TreasurySummaryInteractiveKind) => void;
  /** Breakdown chart / list selection — wire to table filters when ready */
  onBreakdownChartSelect?: (payload: BreakdownChartSelection) => void;
};

function PositionColumnBody({
  data,
  module,
  reduceMotion,
  onSummaryInteractive,
}: {
  data: TreasurySummaryData;
  module: PortfolioModuleTab;
  reduceMotion: boolean;
  onSummaryInteractive: (kind: TreasurySummaryInteractiveKind) => void;
}) {
  const { dashColors } = useFabTokens();
  const showSectionLabel = data.sectionLabel.trim().length > 0;

  return (
    <>
      {showSectionLabel ? (
        <Text {...sectionLabelSx} color={dashColors.pageEyebrow} mb={2.5}>
          {data.sectionLabel}
        </Text>
      ) : null}
      <TreasuryHeroAmount data={data} animKey={module} reduceMotion={reduceMotion} />
      {data.summaryParts != null && data.summaryParts.length > 0 ? (
        <SummaryMetaLine parts={data.summaryParts} onInteractive={onSummaryInteractive} />
      ) : null}
      {data.positionRows.length > 0 ? (
        <Flex direction="column" gap={POSITION_PAIR_GAP} mt={POSITION_PAIR_GAP}>
          {data.positionRows.map((row) => (
            <Box key={row.label}>
              <Text fontFamily="var(--font-graphik)" fontSize="13px" fontWeight={500} color={dashColors.pageSubtitle} mb={1}>
                {row.label}
              </Text>
              <Text
                fontFamily="var(--font-graphik)"
                fontSize={{ base: "24px", md: "clamp(24px, 2vw, 28px)" }}
                fontWeight={500}
                lineHeight={1.1}
                color={dashColors.pageTitle}
                sx={{ fontVariantNumeric: "tabular-nums" }}
              >
                {row.value}
              </Text>
            </Box>
          ))}
        </Flex>
      ) : null}
    </>
  );
}

export function ExecutiveTreasurySummary({
  module,
  data,
  activeDistId,
  onActiveDistIdChange,
  onSummaryInteractive,
  onBreakdownChartSelect,
}: ExecutiveTreasurySummaryProps) {
  const reduceMotion = useReducedMotion() === true;
  const distConfig = data.distribution;

  const effectiveDistId = useMemo(() => {
    return distConfig.slices[activeDistId] != null ? activeDistId : distConfig.defaultOptionId;
  }, [activeDistId, distConfig.defaultOptionId, distConfig.slices]);

  const activeSlice = useMemo(() => {
    return distConfig.slices[effectiveDistId] ?? distConfig.slices[distConfig.defaultOptionId];
  }, [distConfig.defaultOptionId, distConfig.slices, effectiveDistId]);

  const moduleMotion = {
    initial: reduceMotion ? false : { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    exit: reduceMotion ? undefined : { opacity: 0, y: -4 },
    transition: { duration: reduceMotion ? 0 : MODULE_MS, ease: EASE },
  };

  const breakdown = (
    <BreakdownColumn
      module={module}
      effectiveDistId={effectiveDistId}
      distConfig={distConfig}
      activeSlice={activeSlice}
      onDistChange={onActiveDistIdChange}
      onBreakdownSelect={onBreakdownChartSelect}
    />
  );

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={module} {...moduleMotion} style={{ width: "100%", minWidth: 0 }}>
        {/* Mobile / tablet: stack with horizontal rails (register-style rule) */}
        <Box display={{ base: "block", xl: "none" }} w="full">
          <ColumnHeading>Net Position</ColumnHeading>
          <PositionColumnBody
            data={data}
            module={module}
            reduceMotion={reduceMotion}
            onSummaryInteractive={onSummaryInteractive}
          />
          <Box my={10}>
            <RailDivider orientation="horizontal" />
          </Box>
          <ColumnHeading>Breakdown</ColumnHeading>
          {breakdown}
          <Box my={10}>
            <RailDivider orientation="horizontal" />
          </Box>
          <ColumnHeading>Intelligence</ColumnHeading>
          <Box minW={0}>
            <AiDecisionFeed resetKey={module} />
          </Box>
        </Box>

        {/* Desktop: dashboard home rail — 1px vertical between columns */}
        <Grid
          display={{ base: "none", xl: "grid" }}
          templateColumns="minmax(0,26fr) 1px minmax(0,46fr) 1px minmax(0,28fr)"
          templateRows="auto 1fr"
          w="full"
          alignItems="stretch"
          columnGap={0}
        >
          <GridItem minW={0} pr={6} rowStart={1} colStart={1}>
            <ColumnHeading>Net Position</ColumnHeading>
          </GridItem>
          <GridItem minW={0} pr={6} rowStart={2} colStart={1} alignSelf="start">
            <PositionColumnBody
              data={data}
              module={module}
              reduceMotion={reduceMotion}
              onSummaryInteractive={onSummaryInteractive}
            />
          </GridItem>

          <GridItem rowStart={1} rowSpan={2} colStart={2} position="relative" minW="1px" w="1px" maxW="1px" justifySelf="center" p={0}>
            <RailDivider orientation="vertical" />
          </GridItem>

          <GridItem minW={0} px={6} rowStart={1} colStart={3}>
            <ColumnHeading>Breakdown</ColumnHeading>
          </GridItem>
          <GridItem minW={0} px={6} rowStart={2} colStart={3} alignSelf="start">
            {breakdown}
          </GridItem>

          <GridItem rowStart={1} rowSpan={2} colStart={4} position="relative" minW="1px" w="1px" maxW="1px" justifySelf="center" p={0}>
            <RailDivider orientation="vertical" />
          </GridItem>

          <GridItem minW={0} pl={6} rowStart={1} colStart={5}>
            <ColumnHeading>Intelligence</ColumnHeading>
          </GridItem>
          <GridItem minW={0} pl={6} rowStart={2} colStart={5} alignSelf="start">
            <AiDecisionFeed resetKey={module} />
          </GridItem>
        </Grid>
      </motion.div>
    </AnimatePresence>
  );
}
