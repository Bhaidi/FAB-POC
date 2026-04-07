"use client";

import { useMemo } from "react";
import { Box, SimpleGrid, useColorMode } from "@chakra-ui/react";
import { DASHBOARD_SERVICE_HOVER_IMAGES } from "@/data/dashboardCardHoverImages";
import type { DashboardServiceTile } from "@/data/dashboardMock";
import { dashLayout, figmaHomeServiceCard } from "@/components/dashboard/dashboardTokens";
import { ServiceTile } from "@/components/dashboard/ServiceTile";
import { useFabTokens } from "@/components/theme/FabTokensContext";

export type ServiceTileGridProps = {
  tiles: DashboardServiceTile[];
};

/**
 * Responsive grid inside a Popular APIs–style gradient band.
 */
export function ServiceTileGrid({ tiles }: ServiceTileGridProps) {
  const { colorMode } = useColorMode();
  const { dashGradients } = useFabTokens();
  const sortedTiles = useMemo(
    () => [...tiles].sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" })),
    [tiles]
  );

  return (
    <Box
      w="100vw"
      position="relative"
      pt={{ base: 0, md: 2, lg: 4 }}
      pb={{ base: 4, md: 8, lg: 10 }}
      px={{ base: 4, md: 6, lg: 8 }}
      backdropFilter="blur(14.5px)"
      sx={{
        WebkitBackdropFilter: "blur(14.5px)",
        backgroundImage: dashGradients.canvas,
        marginLeft: "calc(50% - 50vw)",
        marginRight: "calc(50% - 50vw)",
      }}
    >
      <Box maxW={dashLayout.contentMaxW} mx="auto" w="full">
        <SimpleGrid
          columns={{ base: 1, sm: 2, lg: 4 }}
          spacing={colorMode === "dark" ? figmaHomeServiceCard.gridGap : { base: 4, md: 5 }}
          w="full"
        >
          {sortedTiles.map((t, index) => (
            <ServiceTile
              key={t.id}
              title={t.title}
              description={t.description}
              hoverImage={DASHBOARD_SERVICE_HOVER_IMAGES[index % DASHBOARD_SERVICE_HOVER_IMAGES.length]}
              onClick={() => {
                if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
                  // eslint-disable-next-line no-console
                  console.log("[dashboard stub tile]", t.id, t.title);
                }
              }}
            />
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}
