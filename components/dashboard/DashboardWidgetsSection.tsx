"use client";

import { Box, Flex, Grid, GridItem, IconButton, SimpleGrid, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { DashboardWidgetCard } from "@/components/dashboard/widgets/DashboardWidgetCard";
import { dashColors, dashRadius } from "@/components/dashboard/dashboardTokens";
import type { DashboardWidgetsResponse } from "@/types/platformDashboard";

const ease = [0.33, 1, 0.68, 1] as const;

export type DashboardWidgetsSectionProps = {
  organizationId: string | null;
  marketCode: string | null;
  /** Surface gate — dim chrome until taxonomy + market summary settled. */
  surfaceReady: boolean;
  data: DashboardWidgetsResponse | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  refreshKey: number;
  variant?: "default" | "launchpad";
};

function formatRefreshed(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit", second: "2-digit" }).format(d);
}

export function DashboardWidgetsSection({
  organizationId,
  marketCode,
  surfaceReady,
  data,
  loading,
  error,
  refresh,
  refreshKey,
  variant = "default",
}: DashboardWidgetsSectionProps) {
  const launchPad = variant === "launchpad";
  const showGhost = !surfaceReady || (loading && !data);
  const widgets = data?.widgets ?? [];

  const headerDefault = (
    <Flex align="flex-end" justify="space-between" gap={3} mb={4} flexWrap="wrap">
      <Box minW={0}>
        <Text
          fontFamily="var(--font-graphik)"
          fontSize="11px"
          fontWeight={600}
          letterSpacing="0.12em"
          textTransform="uppercase"
          color={dashColors.text.muted}
          mb={1}
        >
          Operational overview
        </Text>
        <Text fontFamily="var(--font-graphik)" fontSize={{ base: "15px", md: "16px" }} fontWeight={500} color="rgba(255,255,255,0.88)">
          Prioritized for your workspace
        </Text>
      </Box>
      <Flex align="center" gap={2} flexShrink={0}>
        {data?.refreshedAt ? (
          <Text fontFamily="var(--font-graphik)" fontSize="11px" color="rgba(255,255,255,0.38)" display={{ base: "none", sm: "block" }}>
            Updated {formatRefreshed(data.refreshedAt)}
          </Text>
        ) : null}
        <IconButton
          aria-label="Refresh dashboard"
          icon={<RefreshCw size={18} strokeWidth={2} aria-hidden />}
          variant="ghost"
          size="sm"
          borderRadius="full"
          color="rgba(255,255,255,0.72)"
          _hover={{ bg: "rgba(255,255,255,0.1)", color: "white" }}
          isLoading={loading}
          isDisabled={!organizationId || !marketCode}
          onClick={() => refresh()}
        />
      </Flex>
    </Flex>
  );

  const headerLaunch = (
    <Flex align="center" justify="space-between" gap={2} mb={2} flexShrink={0}>
      <Text
        fontFamily="var(--font-graphik)"
        fontSize="12px"
        fontWeight={600}
        letterSpacing="0.1em"
        textTransform="uppercase"
        color={dashColors.text.muted}
      >
        Operational overview
      </Text>
      <Flex align="center" gap={2}>
        {data?.refreshedAt ? (
          <Text fontFamily="var(--font-graphik)" fontSize="10px" color="rgba(255,255,255,0.35)" display={{ base: "none", sm: "block" }}>
            {formatRefreshed(data.refreshedAt)}
          </Text>
        ) : null}
        <IconButton
          aria-label="Refresh dashboard"
          icon={<RefreshCw size={16} strokeWidth={2} aria-hidden />}
          variant="ghost"
          size="sm"
          borderRadius="full"
          color="rgba(255,255,255,0.72)"
          _hover={{ bg: "rgba(255,255,255,0.1)", color: "white" }}
          isLoading={loading}
          isDisabled={!organizationId || !marketCode}
          onClick={() => refresh()}
        />
      </Flex>
    </Flex>
  );

  return (
    <Box
      w="full"
      flex={launchPad ? 1 : undefined}
      minH={launchPad ? 0 : undefined}
      display={launchPad ? "flex" : undefined}
      flexDirection={launchPad ? "column" : undefined}
      overflow={launchPad ? "hidden" : undefined}
      pt={launchPad ? 0 : { base: 2, md: 3 }}
    >
      {launchPad ? headerLaunch : headerDefault}

      {error ? (
        <Text fontFamily="var(--font-graphik)" fontSize="sm" color="rgba(252,165,165,0.9)" mb={launchPad ? 2 : 4}>
          {error}
        </Text>
      ) : null}

      <motion.div
        key={`${data?.refreshedAt ?? "boot"}-${refreshKey}`}
        style={
          launchPad
            ? { width: "100%", flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }
            : { width: "100%" }
        }
        initial={false}
        animate={{
          opacity: showGhost ? 0.45 : 1,
          filter: showGhost ? "blur(1px)" : "blur(0px)",
        }}
        transition={{ duration: 0.36, ease }}
      >
        {launchPad ? (
          <Grid
            flex={1}
            minH={0}
            w="full"
            templateColumns="repeat(2, minmax(0, 1fr))"
            templateRows="repeat(2, minmax(0, 1fr))"
            gap={2}
          >
            {widgets.length === 0 && loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <GridItem key={`ph-${i}`} minH={0} minW={0}>
                    <Box
                      h="full"
                      minH="80px"
                      borderRadius={dashRadius.panel}
                      border="1px solid rgba(255,255,255,0.06)"
                      bg="rgba(255,255,255,0.03)"
                      className="fab-ghost-card-sheen"
                      aria-hidden
                    />
                  </GridItem>
                ))
              : widgets.map((w) => (
                  <GridItem key={w.id} minH={0} minW={0} overflow="hidden">
                    <DashboardWidgetCard widget={w} compact />
                  </GridItem>
                ))}
          </Grid>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
            {widgets.length === 0 && loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Box
                    key={`ph-${i}`}
                    h="168px"
                    borderRadius={dashRadius.panel}
                    border="1px solid rgba(255,255,255,0.06)"
                    bg="rgba(255,255,255,0.03)"
                    className="fab-ghost-card-sheen"
                    aria-hidden
                  />
                ))
              : widgets.map((w) => (
                  <Box
                    key={w.id}
                    sx={{
                      gridColumn: w.emphasis === "primary" ? { base: "auto", md: "span 2" } : undefined,
                    }}
                  >
                    <DashboardWidgetCard widget={w} />
                  </Box>
                ))}
          </SimpleGrid>
        )}
      </motion.div>
    </Box>
  );
}
