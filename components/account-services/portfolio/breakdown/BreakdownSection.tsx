"use client";

import { Box, Text } from "@chakra-ui/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { BreakdownSummaryLine } from "@/components/account-services/portfolio/breakdown/BreakdownSummaryLine";
import { BreakdownViewBySheet } from "@/components/account-services/portfolio/breakdown/BreakdownViewBySheet";
import { BreakdownVisualTable } from "@/components/account-services/portfolio/breakdown/BreakdownVisualTable";
import type { BreakdownChartSelection } from "@/data/breakdownChartTypes";
import type { TreasurySummaryData } from "@/data/treasurySummaryTypes";
import type { PortfolioModuleTab } from "@/data/portfolioSummaryTypes";

const CONTEXT_TO_TABLE_PX = "14px";

const VISIBLE_ROW_CAP = 4;

export function BreakdownSection({
  module,
  effectiveDistId,
  distConfig,
  activeSlice,
  onDistChange,
  onBreakdownSelect,
}: {
  module: PortfolioModuleTab;
  effectiveDistId: string;
  distConfig: TreasurySummaryData["distribution"];
  activeSlice: TreasurySummaryData["distribution"]["slices"][string];
  onDistChange: (id: string) => void;
  onBreakdownSelect?: (payload: BreakdownChartSelection) => void;
}) {
  const reduceMotion = useReducedMotion() === true;
  const [hoveredRowName, setHoveredRowName] = useState<string | null>(null);

  const dimensionLabel = useMemo(
    () => distConfig.options.find((o) => o.id === effectiveDistId)?.label ?? "Label",
    [distConfig.options, effectiveDistId],
  );

  const baseRows = activeSlice.rows;

  const tableRows = useMemo(() => {
    const withValues = baseRows.map((r) => ({
      ...r,
      amountValue: r.amountValue ?? 0,
    }));
    return withValues.slice(0, VISIBLE_ROW_CAP);
  }, [baseRows]);

  const hiddenExtraCount = Math.max(0, baseRows.length - VISIBLE_ROW_CAP);

  const transitionKey = `${module}-${effectiveDistId}-${baseRows.map((r) => `${r.name}:${r.percent}:${r.amountLabel}`).join("|")}`;

  const emitSelect = useCallback(
    (row: (typeof baseRows)[number]) => {
      const payload: BreakdownChartSelection = {
        module,
        sliceId: effectiveDistId,
        itemName: row.name,
        percent: row.percent,
        amountLabel: row.amountLabel,
      };
      onBreakdownSelect?.(payload);
    },
    [effectiveDistId, module, onBreakdownSelect],
  );

  return (
    <Box minW={0} w="full">
      <BreakdownViewBySheet
        options={distConfig.options}
        value={effectiveDistId}
        onChange={onDistChange}
        defaultOptionId={distConfig.defaultOptionId}
        aria-label="Breakdown dimension"
      />

      <Box
        mt={CONTEXT_TO_TABLE_PX}
        w="full"
        minW={0}
        px={{ base: 0, md: 0 }}
        py={{ base: 2, md: 2 }}
        borderRadius="md"
        bg="rgba(255,255,255,0.03)"
        borderWidth="1px"
        borderColor="rgba(255,255,255,0.06)"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={transitionKey}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 10 }}
            transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.42, 0, 0.58, 1] }}
            style={{ width: "100%", minWidth: 0 }}
          >
            <Box px={{ base: 2, md: 3 }} pt={1} pb={2}>
              <BreakdownVisualTable
                key={transitionKey}
                rows={tableRows}
                dimensionLabel={dimensionLabel}
                dimensionId={effectiveDistId}
                hoveredRowName={hoveredRowName}
                onHoverRow={setHoveredRowName}
                onRowClick={emitSelect}
              />
              {hiddenExtraCount > 0 ? (
                <Text
                  mt={2}
                  fontSize="11px"
                  fontWeight={500}
                  color="rgba(255,255,255,0.38)"
                  fontFamily="var(--font-graphik)"
                  textAlign="center"
                >
                  +{hiddenExtraCount} more
                </Text>
              ) : null}
              {activeSlice.summaryLine ? <BreakdownSummaryLine>{activeSlice.summaryLine}</BreakdownSummaryLine> : null}
            </Box>
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
}
