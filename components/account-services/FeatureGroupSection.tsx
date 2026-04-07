"use client";

import { Box, Text, VStack } from "@chakra-ui/react";
import { FeatureRowCard } from "@/components/account-services/FeatureRowCard";

export type FeatureRowDef = {
  title: string;
  description: string;
  href: string;
  entitled: boolean;
};

export function FeatureGroupSection({
  heading,
  rows,
}: {
  heading: string;
  rows: FeatureRowDef[];
}) {
  return (
    <Box mb={6}>
      <Text
        fontFamily="var(--font-graphik)"
        fontSize="11px"
        fontWeight={700}
        letterSpacing="0.14em"
        textTransform="uppercase"
        color="rgba(255,255,255,0.5)"
        mb={3}
      >
        {heading}
      </Text>
      <VStack align="stretch" spacing={0}>
        {rows.map((r) => (
          <FeatureRowCard
            key={r.title}
            href={r.href}
            title={r.title}
            description={r.description}
            entitled={r.entitled}
          />
        ))}
      </VStack>
    </Box>
  );
}
