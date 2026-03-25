"use client";

import { useMemo, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Box, Flex, Grid, GridItem, Heading, Text, useDisclosure } from "@chakra-ui/react";
import { FinancialOverviewWidget } from "@/components/dashboard/home/FinancialOverviewWidget";
import { QuickActionsCustomizerModal } from "@/components/dashboard/home/QuickActionsCustomizerModal";
import { QuickActionsWidget } from "@/components/dashboard/home/QuickActionsWidget";
import { PlatformCard } from "@/components/dashboard/PlatformCard";
import { useDashboardGlobal } from "@/components/dashboard/DashboardGlobalContext";
import { useDashboardTaxonomy } from "@/components/dashboard/DashboardTaxonomyContext";
import { useDashboardSurfaceReady } from "@/components/dashboard/useDashboardSurfaceReady";
import { useQuickActionsPreference } from "@/hooks/useQuickActionsPreference";
import { useDashboardWidgets } from "@/hooks/useDashboardWidgets";
import { getEligibleQuickActionCatalog } from "@/data/quickActionsCatalog";
import { buildEligibleQuickActionItems } from "@/lib/dashboardQuickActionsBuild";
import { dashColors, dashLayout, dashSpace } from "@/components/dashboard/dashboardTokens";
import { DASHBOARD_L1_HOME_TILES } from "@/data/dashboardL1Home";
import { DASHBOARD_SERVICE_HOVER_IMAGES } from "@/data/dashboardCardHoverImages";
import type { PlatformHealth } from "@/data/dashboardStubApi";
import { firstNavigableL3Href } from "@/lib/mergeServiceTaxonomy";

function hoverImageForServiceId(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * (i + 1)) % 997;
  return DASHBOARD_SERVICE_HOVER_IMAGES[h % DASHBOARD_SERVICE_HOVER_IMAGES.length];
}

function buildCardHref(pathname: string, l1Code: string, leafHref: string | null): string {
  const q = new URLSearchParams();
  q.set("domain", l1Code);
  if (leafHref) {
    try {
      const base = typeof window !== "undefined" ? window.location.origin : "http://localhost";
      const u = new URL(leafHref, base);
      const nav = u.searchParams.get("nav");
      if (nav) q.set("nav", nav);
    } catch {
      /* ignore */
    }
  }
  return `${pathname}?${q.toString()}`;
}

const SERVICE_CARD_HEALTH: PlatformHealth = "operational";

/**
 * Approx. `DashboardPrimaryNav` + `<main>` vertical padding — used so home fills the viewport.
 * Tweak if shell chrome changes.
 */
const DASH_HOME_VIEWPORT_CHROME = "120px";

/** `lg` gutter between launchpad grid and widgets — divider is centered here. */
const HOME_LG_COLUMN_GAP_PX = 40;

/** Inset from gutter so tiles and widgets sit farther from the vertical rule. */
const HOME_LG_RAIL_INSET_PX = 20;

function bankHomeMicroHint(index: number): string {
  return index % 2 === 0 ? "Last activity: 2 hrs ago" : "3 pending items";
}

export type SimpleDashboardHomeProps = {
  footer?: ReactNode;
  /** Shown in hero after “Welcome back,” — stub until user context is wired */
  welcomeName?: string;
};

/**
 * Home share — ~77% / ~23% launchpad + widgets on lg; fixed-height tiles; top-aligned rail. Stacked on small viewports.
 */
export function SimpleDashboardHome({ footer, welcomeName = "Daniel Okonkwo" }: SimpleDashboardHomeProps) {
  const pathname = usePathname() || "/dashboard";
  const { merge } = useDashboardTaxonomy();
  const { organizationId, marketCode, userContext } = useDashboardGlobal();
  const { data: widgetsPayload } = useDashboardWidgets(organizationId, marketCode);
  const persona = userContext?.userRole ?? "MAKER";
  const surfaceReady = useDashboardSurfaceReady();
  const ghost = !surfaceReady;

  const items = useMemo(() => {
    const tiles =
      merge == null
        ? [...DASHBOARD_L1_HOME_TILES]
        : DASHBOARD_L1_HOME_TILES.filter((t) => merge.domainByL1.has(t.id));
    return tiles.map((tile, i) => {
      const catalog = merge?.catalogDomainByL1.get(tile.id);
      const description = catalog?.description ?? tile.description;
      const menuItem = merge?.domainByL1.get(tile.id);
      const leaf = firstNavigableL3Href(menuItem);
      const href = buildCardHref(pathname, tile.id, leaf);
      return { tile, i, description, href };
    });
  }, [merge, pathname]);

  const accountsHref = useMemo(
    () => buildCardHref(pathname, "accounts", firstNavigableL3Href(merge?.domainByL1.get("accounts"))),
    [merge, pathname]
  );

  const eligibleCatalog = useMemo(() => getEligibleQuickActionCatalog(persona), [persona]);

  const eligibleIds = useMemo(() => eligibleCatalog.map((e) => e.id), [eligibleCatalog]);

  const eligibleMap = useMemo(
    () => buildEligibleQuickActionItems(persona, pathname, merge, widgetsPayload?.quickActions),
    [persona, pathname, merge, widgetsPayload?.quickActions]
  );

  const { displayItems, hydrated, persist, resetToDefaults, resolvedOrder } = useQuickActionsPreference(
    userContext?.userId,
    persona,
    eligibleIds,
    eligibleMap
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  const cardCount = items.length;
  const welcomeLabel = userContext?.userName ?? welcomeName;
  const bankHomeComfortable = cardCount <= 6;

  const homeMainMinH = `calc(100dvh - ${DASH_HOME_VIEWPORT_CHROME})`;

  return (
    <Box flex="1" w="full" minH={0} display="flex" flexDirection="column">
      <Flex
        flex="1"
        w="full"
        direction="column"
        justify="space-between"
        pt={{ base: "24px", md: "32px", lg: "40px" }}
        minH={homeMainMinH}
      >
        <Flex direction="column" flex="1" w="full" minH={0}>
          <Box
            maxW={dashLayout.dashboardHomeMaxW}
            mx="auto"
            w="full"
            px={{
              base: 0,
              sm: dashSpace.sm,
              md: dashSpace.md,
              lg: "16px 40px",
            }}
            flex="1"
            display="flex"
            flexDirection="column"
            minH={0}
          >
            <Box as="header" flexShrink={0} mb={{ base: "32px", md: "38px", lg: "40px" }}>
              <Heading
                as="h1"
                color="#FFF"
                textAlign="left"
                fontFamily="var(--font-graphik)"
                fontSize={{ base: "28px", md: "34px" }}
                fontStyle="normal"
                fontWeight={400}
                lineHeight="1.1"
                letterSpacing="-0.5px"
                mb="10px"
              >
                Welcome back,{" "}
                <Box as="span" fontWeight={500} letterSpacing="-0.02em">
                  {welcomeLabel}
                </Box>
              </Heading>
              <Text
                fontFamily="var(--font-graphik)"
                fontSize="15px"
                lineHeight="1.35"
                opacity={0.72}
                color="#FFF"
                textAlign="left"
                mb={0}
              >
                Choose a service to launch.
              </Text>
            </Box>

            <Flex
              direction="column"
              flex="1"
              w="full"
              minH={0}
              justify="flex-start"
              pb="32px"
            >
              <Grid
                w="full"
                alignItems="stretch"
                templateColumns={{ base: "minmax(0, 1fr)", lg: "minmax(0, 77fr) minmax(0, 23fr)" }}
                gap={{ base: "16px", lg: `${HOME_LG_COLUMN_GAP_PX}px` }}
              >
                <GridItem
                  minW={0}
                  order={{ base: 2, lg: 1 }}
                  w="full"
                  pr={{ base: 0, lg: `${HOME_LG_RAIL_INSET_PX}px` }}
                  display="flex"
                  flexDirection="column"
                  minH={0}
                  h={{ base: "auto", lg: "100%" }}
                >
                  <Box
                    flex={{ base: "none", lg: 1 }}
                    minH={0}
                    display="flex"
                    flexDirection="column"
                    w="full"
                  >
                    <Grid
                      flex={{ lg: 1 }}
                      minH={0}
                      h={{ base: "auto", lg: "100%" }}
                      w="full"
                      display="grid"
                      templateColumns={{
                        base: "repeat(2, minmax(0, 1fr))",
                        md: "repeat(4, minmax(0, 1fr))",
                        lg: "repeat(4, minmax(0, 1fr))",
                      }}
                      columnGap={{ base: "14px", lg: "28px" }}
                      rowGap={{ base: "18px", md: "28px", lg: "28px" }}
                      alignContent={{ base: "start", lg: "space-between" }}
                      justifyItems="stretch"
                    >
                      {items.map(({ tile, i, description, href }) => (
                        <GridItem key={tile.id} minW={0} w="full">
                          <PlatformCard
                            platform={{ id: tile.id, title: tile.title, defaultNavId: tile.id }}
                            index={i}
                            isEnabled
                            health={SERVICE_CARD_HEALTH}
                            hoverImage={hoverImageForServiceId(tile.id)}
                            href={href}
                            description={description}
                            ghost={ghost}
                            moduleStyle="bankHome"
                            bankHomeComfortable={bankHomeComfortable}
                            uniformGridCell
                            microHint={bankHomeComfortable ? bankHomeMicroHint(i) : undefined}
                          />
                        </GridItem>
                      ))}
                    </Grid>
                  </Box>
                </GridItem>

                <GridItem
                  minW={0}
                  order={{ base: 1, lg: 2 }}
                  w="full"
                  position="relative"
                  display="flex"
                  flexDirection="column"
                  minH={0}
                  h={{ lg: "100%" }}
                  pl={{ base: 0, lg: `${HOME_LG_RAIL_INSET_PX}px` }}
                >
                  <Box
                    aria-hidden
                    display={{ base: "none", lg: "block" }}
                    position="absolute"
                    left={`${-HOME_LG_COLUMN_GAP_PX / 2}px`}
                    top={0}
                    bottom={0}
                    w="1px"
                    bg={dashColors.homeRailDivider}
                    pointerEvents="none"
                  />
                  <Flex
                    direction="column"
                    flex={{ base: "none", lg: "1" }}
                    w="full"
                    minH={0}
                    h={{ lg: "100%" }}
                    gap={{ base: "16px", lg: "12px" }}
                  >
                    <Box flex={{ base: "none", lg: "1" }} minH={0} display="flex" flexDirection="column" w="full">
                      <FinancialOverviewWidget accountsHref={accountsHref} homeRail fillCell />
                    </Box>
                    <Box flexShrink={0} w="full">
                      <QuickActionsWidget
                        actions={displayItems}
                        homeRail
                        onCustomizeClick={
                          hydrated && eligibleCatalog.length > 0 ? onOpen : undefined
                        }
                      />
                    </Box>
                  </Flex>
                </GridItem>
              </Grid>
            </Flex>
          </Box>
        </Flex>

        <QuickActionsCustomizerModal
          isOpen={isOpen}
          onClose={onClose}
          entries={eligibleCatalog}
          initialSelectedIds={resolvedOrder}
          onSave={persist}
          onResetToDefaults={resetToDefaults}
        />

        {footer ? (
          <Box flexShrink={0} w="full" mt="24px">
            {footer}
          </Box>
        ) : null}
      </Flex>
    </Box>
  );
}
