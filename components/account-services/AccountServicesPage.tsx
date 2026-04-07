"use client";

import { Box, Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useMemo, useRef, useState } from "react";
import type { BreakdownChartSelection } from "@/data/breakdownChartTypes";
import type { TreasurySummaryInteractiveKind } from "@/data/treasurySummaryTypes";
import { PortfolioDetailPanel } from "@/components/account-services/portfolio/PortfolioDetailPanel";
import { PortfolioSummaryCard } from "@/components/account-services/portfolio/summary/PortfolioSummaryCard";
import { PortfolioModuleSegmentedControl } from "@/components/account-services/portfolio/summary/PortfolioModuleSegmentedControl";
import { PortfolioOperationalSectionHeader } from "@/components/account-services/portfolio/PortfolioOperationalSectionHeader";
import { PortfolioOperationalSurface } from "@/components/account-services/portfolio/PortfolioOperationalSurface";
import { PortfolioTableCard } from "@/components/account-services/portfolio/PortfolioTableCard";
import { dashSpace } from "@/components/dashboard/dashboardTokens";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import type { CorporateBankingGridRow } from "@/data/corporateBankingGridTypes";
import { listCorporateBankingGridForModule } from "@/data/corporateBankingGridMock";
import type { PortfolioModuleTab } from "@/data/portfolioSummaryTypes";

const PANEL_WIDTH_PX = 400;
const PANEL_GAP_PX = 16;

const MotionBox = motion(Box);

const TREASURY_DIST_DEFAULT: Record<PortfolioModuleTab, string> = {
  portfolio: "currency",
  accounts: "currency",
  deposits: "maturity",
  loans: "loanType",
};

export function AccountServicesPage() {
  const { dashColors } = useFabTokens();
  const [portfolioModule, setPortfolioModule] = useState<PortfolioModuleTab>("portfolio");
  const gridRows = useMemo(() => listCorporateBankingGridForModule(portfolioModule), [portfolioModule]);
  const tableAnchorRef = useRef<HTMLDivElement>(null);
  const [treasuryDistByModule, setTreasuryDistByModule] = useState<Partial<Record<PortfolioModuleTab, string>>>({});
  const [panelRow, setPanelRow] = useState<CorporateBankingGridRow | null>(null);

  const treasuryDistId = treasuryDistByModule[portfolioModule] ?? TREASURY_DIST_DEFAULT[portfolioModule];

  const setTreasuryDist = useCallback((id: string) => {
    setTreasuryDistByModule((m) => ({ ...m, [portfolioModule]: id }));
  }, [portfolioModule]);

  const onSummaryInteractive = useCallback(
    (kind: TreasurySummaryInteractiveKind) => {
      if (kind === "accounts") {
        setPortfolioModule("accounts");
        window.requestAnimationFrame(() => {
          tableAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        return;
      }
      if (kind === "deposits") {
        setPortfolioModule("deposits");
        return;
      }
      if (kind === "facilities") {
        setPortfolioModule("loans");
        return;
      }
      if (kind === "currencies") {
        setTreasuryDistByModule((m) => ({ ...m, [portfolioModule]: "currency" }));
        return;
      }
      if (kind === "countries") {
        setTreasuryDistByModule((m) => ({ ...m, [portfolioModule]: "country" }));
      }
    },
    [portfolioModule],
  );

  const onBreakdownChartSelect = useCallback((payload: BreakdownChartSelection) => {
    if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log("[account-services] breakdown selection (table filter hook)", payload);
    }
  }, []);

  const isLg = useBreakpointValue({ base: false, lg: true }) === true;
  const reduceMotion = useReducedMotion() === true;

  const handleRowSelect = useCallback((row: CorporateBankingGridRow) => {
    setPanelRow((prev) => (prev?.id === row.id ? null : row));
  }, []);

  const duration = reduceMotion ? 0 : 0.38;
  const ease = [0.33, 1, 0.68, 1] as const;

  return (
    <Box flex="1" w="full" minH={0} display="flex" flexDirection="column" pb={6}>
      <Box w="full" px={{ base: 0, sm: dashSpace.sm, md: dashSpace.md, lg: "20px 48px", xl: "24px 64px" }}>
        <Box mt={{ base: 5, md: 9 }} mb={5}>
          <Text
            fontFamily="var(--font-graphik)"
            fontSize="11px"
            fontWeight={700}
            letterSpacing="0.18em"
            textTransform="uppercase"
            color={dashColors.pageEyebrow}
            mb={2}
          >
            Account services
          </Text>
          <Flex align="flex-start" justify="space-between" gap={4} flexWrap="wrap" columnGap={6}>
            <Box flex="1" minW="min(100%, 240px)">
              <Text
                as="h1"
                fontFamily="var(--font-graphik)"
                fontSize={{ base: "28px", md: "34px" }}
                fontWeight={400}
                letterSpacing="-0.03em"
                lineHeight={1.1}
                color={dashColors.pageTitle}
              >
                Your portfolio
              </Text>
              <Text
                mt={1}
                fontFamily="var(--font-graphik)"
                fontSize="14px"
                lineHeight={1.45}
                color={dashColors.pageSubtitle}
                maxW="560px"
              >
                View and manage your portfolio across accounts, loans, and deposits
              </Text>
            </Box>
            <Box
              flexShrink={0}
              pt={{ base: 0, md: "2px" }}
              w={{ base: "100%", md: "min(100%, 560px)" }}
              minW={{ base: "100%", sm: "300px" }}
              maxW="560px"
            >
              <PortfolioModuleSegmentedControl value={portfolioModule} onChange={setPortfolioModule} />
            </Box>
          </Flex>
        </Box>

        <Box mt={4} mb={5}>
          <PortfolioSummaryCard
            module={portfolioModule}
            activeTreasuryDistId={treasuryDistId}
            onTreasuryDistIdChange={setTreasuryDist}
            onSummaryInteractive={onSummaryInteractive}
            onBreakdownChartSelect={onBreakdownChartSelect}
          />
        </Box>

        {isLg ? (
          <Box ref={tableAnchorRef} scrollMarginTop="96px" w="full">
            <PortfolioOperationalSurface>
              <PortfolioOperationalSectionHeader module={portfolioModule} />
              <Flex
                align="stretch"
                gap={`${PANEL_GAP_PX}px`}
                px={{ base: 3, md: 4 }}
                pb={{ base: 3, md: 4 }}
                minW={0}
                minH="min(70vh, 760px)"
                w="full"
              >
                <Box flex="1" minW={0} minH={0} display="flex" flexDirection="column" alignSelf="stretch">
                  <PortfolioTableCard
                    gridRows={gridRows}
                    selectedRowId={panelRow?.id ?? null}
                    onSelectRow={handleRowSelect}
                    activeTab={portfolioModule}
                    scrollAreaMode="fill"
                  />
                </Box>
                <AnimatePresence initial={false} mode="popLayout">
                  {panelRow ? (
                    <MotionBox
                      key={panelRow.id}
                      initial={reduceMotion ? false : { width: 0, opacity: 0 }}
                      animate={{ width: PANEL_WIDTH_PX, opacity: 1 }}
                      exit={reduceMotion ? { opacity: 0 } : { width: 0, opacity: 0 }}
                      transition={{ duration, ease }}
                      flexShrink={0}
                      alignSelf="stretch"
                      display="flex"
                      flexDirection="column"
                      minH={0}
                      overflow="hidden"
                      style={{ minWidth: 0 }}
                    >
                      <Box
                        w={`${PANEL_WIDTH_PX}px`}
                        minW={`${PANEL_WIDTH_PX}px`}
                        h="full"
                        minH={0}
                        flex="1"
                        display="flex"
                        flexDirection="column"
                      >
                        <PortfolioDetailPanel
                          variant="embedded"
                          row={panelRow}
                          onClose={() => setPanelRow(null)}
                        />
                      </Box>
                    </MotionBox>
                  ) : null}
                </AnimatePresence>
              </Flex>
            </PortfolioOperationalSurface>
          </Box>
        ) : (
          <Box ref={tableAnchorRef} scrollMarginTop="96px" w="full">
            <PortfolioOperationalSurface>
              <PortfolioOperationalSectionHeader module={portfolioModule} />
              <PortfolioTableCard
                gridRows={gridRows}
                selectedRowId={panelRow?.id ?? null}
                onSelectRow={handleRowSelect}
                activeTab={portfolioModule}
              />
            </PortfolioOperationalSurface>
            <AnimatePresence initial={false}>
              {panelRow ? (
                <MotionBox
                  key={panelRow.id}
                  mt={4}
                  initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                  transition={{ duration: reduceMotion ? 0 : 0.3, ease }}
                >
                  <PortfolioDetailPanel row={panelRow} onClose={() => setPanelRow(null)} />
                </MotionBox>
              ) : null}
            </AnimatePresence>
          </Box>
        )}
      </Box>
    </Box>
  );
}
