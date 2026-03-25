"use client";

import { Box, Heading, Text, SimpleGrid } from "@chakra-ui/react";
import { FeatureCard } from "./FeatureCard";
import { portalTiles } from "@/data/portal-tiles";
import { HiBanknotes, HiCreditCard, HiDocumentText, HiChartBar, HiCog } from "react-icons/hi2";

const iconMap: Record<string, React.ComponentType> = {
  Banking: HiBanknotes,
  Cards: HiCreditCard,
  Trade: HiDocumentText,
  Reports: HiChartBar,
  Admin: HiCog,
};

export function ExploreSolutions() {
  return (
    <Box>
      <Heading size="md" color="neutral.mainText" mb={2}>
        Explore solutions
      </Heading>
      <Text fontSize="sm" color="neutral.secondaryText" mb={4}>
        Access banking, cards, trade, and more from one place.
      </Text>
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={4}>
        {portalTiles.map((tile) => (
          <FeatureCard
            key={tile.id}
            title={tile.title}
            description={tile.description}
            href={tile.href}
            icon={iconMap[tile.title] as any}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}
