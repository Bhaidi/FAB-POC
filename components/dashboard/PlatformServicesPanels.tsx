"use client";

import { useMemo, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Box, Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { PlatformCard } from "@/components/dashboard/PlatformCard";
import { useDashboardTaxonomy } from "@/components/dashboard/DashboardTaxonomyContext";
import { useDashboardSurfaceReady } from "@/components/dashboard/useDashboardSurfaceReady";
import { dashColors, dashLayout } from "@/components/dashboard/dashboardTokens";
import { DASHBOARD_SERVICE_HOVER_IMAGES } from "@/data/dashboardCardHoverImages";
import { DASHBOARD_L1_HOME_TILES } from "@/data/dashboardL1Home";
import type { PlatformDefinition } from "@/data/dashboardPlatforms";
import type { PlatformHealth } from "@/data/dashboardStubApi";
import { firstNavigableL3Href } from "@/lib/mergeServiceTaxonomy";
import type { ServiceDomain } from "@/types/platformServiceTaxonomy";

const ease = [0.33, 1, 0.68, 1] as const;

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

function domainToPlatform(domain: ServiceDomain): PlatformDefinition {
  return {
    id: domain.l1Code,
    title: domain.l1Name,
    defaultNavId: domain.l2Items[0]?.l3Items[0]?.l3Code ?? domain.l1Code,
  };
}

function PlatformCardBand({ children, maxW }: { children: ReactNode; maxW?: string }) {
  return (
    <Box w="full" position="relative" px={0} pt={0} pb={0}>
      <Box w="full" maxW={maxW ?? dashLayout.contentMaxW}>
        {children}
      </Box>
    </Box>
  );
}

const SERVICE_CARD_HEALTH: PlatformHealth = "operational";

export type PlatformServicesPanelsProps = {
  /** `launchpad` = 4-column module grid, fixed-height cards (home operating screen). */
  variant?: "default" | "launchpad";
};

export function PlatformServicesPanels({ variant = "default" }: PlatformServicesPanelsProps) {
  const pathname = usePathname() || "/dashboard";
  const { merge, error: taxonomyError } = useDashboardTaxonomy();
  const surfaceReady = useDashboardSurfaceReady();
  const launchPad = variant === "launchpad";

  const activeCards = useMemo(() => {
    if (!merge) return [] as { domain: ServiceDomain; href: string }[];
    const out: { domain: ServiceDomain; href: string }[] = [];
    for (const code of merge.activeL1Codes) {
      const domain = merge.catalogDomainByL1.get(code);
      if (!domain) continue;
      const menuItem = merge.domainByL1.get(code);
      const leaf = firstNavigableL3Href(menuItem);
      out.push({ domain, href: buildCardHref(pathname, code, leaf) });
    }
    return out;
  }, [merge, pathname]);

  const showGhostGrid = activeCards.length === 0 && !surfaceReady && !taxonomyError;

  const grid = launchPad ? (
    <SimpleGrid columns={{ base: 2, md: 4 }} spacingX="24px" spacingY="20px" w="full">
      {activeCards.length > 0
        ? activeCards.map(({ domain, href }, i) => (
            <Box key={domain.l1Code}>
              <PlatformCard
                platform={domainToPlatform(domain)}
                index={i}
                isEnabled
                health={SERVICE_CARD_HEALTH}
                hoverImage={hoverImageForServiceId(domain.l1Code)}
                href={href}
                description={domain.description}
                moduleStyle="launchModule"
              />
            </Box>
          ))
        : DASHBOARD_L1_HOME_TILES.map((g, i) => (
            <Box key={g.id}>
              <PlatformCard
                platform={{ id: g.id, title: g.title, defaultNavId: g.id }}
                index={i}
                isEnabled
                health={SERVICE_CARD_HEALTH}
                hoverImage={hoverImageForServiceId(g.id)}
                description={g.description}
                ghost
                moduleStyle="launchModule"
              />
            </Box>
          ))}
    </SimpleGrid>
  ) : (
    <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={{ base: 4, md: 5 }} w="full">
      {activeCards.length > 0
        ? activeCards.map(({ domain, href }, i) => (
            <Box key={domain.l1Code} h="full">
              <PlatformCard
                platform={domainToPlatform(domain)}
                index={i}
                isEnabled
                health={SERVICE_CARD_HEALTH}
                hoverImage={hoverImageForServiceId(domain.l1Code)}
                href={href}
                description={domain.description}
              />
            </Box>
          ))
        : DASHBOARD_L1_HOME_TILES.slice(0, 4).map((g, i) => (
            <Box key={g.id} h="full">
              <PlatformCard
                platform={{ id: g.id, title: g.title, defaultNavId: g.id }}
                index={i}
                isEnabled
                health={SERVICE_CARD_HEALTH}
                hoverImage={hoverImageForServiceId(g.id)}
                description={g.description}
                ghost
              />
            </Box>
          ))}
    </SimpleGrid>
  );

  return (
    <VStack align="stretch" spacing={0} w="full">
      {taxonomyError ? (
        <Text
          fontFamily="var(--font-graphik)"
          fontSize="xs"
          color="rgba(245, 158, 11, 0.9)"
          textAlign="left"
          py={2}
        >
          {taxonomyError}
        </Text>
      ) : null}

      <PlatformCardBand maxW={launchPad ? "full" : undefined}>
        {activeCards.length > 0 || showGhostGrid ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, ease, delay: 0.1 }}
            style={{ width: "100%" }}
          >
            <Heading
              as="h2"
              fontFamily="var(--font-graphik)"
              fontSize={launchPad ? "18px" : { base: "20px", md: "22px" }}
              fontWeight={600}
              letterSpacing={launchPad ? "-0.02em" : "-0.02em"}
              lineHeight={1.3}
              color={dashColors.text.primary}
              textAlign="left"
              w="full"
              mb={launchPad ? "20px" : 5}
            >
              Active Services
            </Heading>
            {grid}
          </motion.div>
        ) : null}
      </PlatformCardBand>
    </VStack>
  );
}
