"use client";

import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import type { ExploreSolutionChip } from "@/data/dashboardMock";
import { dashRadius } from "@/components/dashboard/dashboardTokens";
import { useFabTokens } from "@/components/theme/FabTokensContext";

const MotionBox = motion(Box);

export type ExploreSolutionsRowProps = {
  chips: ExploreSolutionChip[];
};

export function ExploreSolutionsRow({ chips }: ExploreSolutionsRowProps) {
  const { dashColors, dashEffects, dashShadow } = useFabTokens();
  return (
    <Box w="full">
      <Heading
        as="h2"
        fontFamily="var(--font-graphik)"
        fontSize={{ base: "18px", md: "20px" }}
        fontWeight={500}
        letterSpacing="-0.02em"
        color={dashColors.text.primary}
        mb={4}
      >
        Explore Other Solutions
      </Heading>
      <Flex
        gap={3}
        overflowX="auto"
        pb={1}
        sx={{
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": { height: "6px" },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255,255,255,0.15)",
            borderRadius: "full",
          },
        }}
      >
        {chips.map((c) => (
          <MotionBox
            key={c.id}
            as="button"
            flexShrink={0}
            px={5}
            py={3}
            borderRadius={dashRadius.panel}
            border="1px solid rgba(255,255,255,0.12)"
            bg="rgba(255,255,255,0.04)"
            backdropFilter={dashEffects.surfaceBlur}
            boxShadow={dashShadow.panel}
            cursor="pointer"
            whileHover={{ y: -2, transition: { duration: 0.18 } }}
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
                // eslint-disable-next-line no-console
                console.log("[dashboard explore]", c.id);
              }
            }}
            sx={{
              WebkitBackdropFilter: dashEffects.surfaceBlur,
              _hover: {
                borderColor: "rgba(0, 98, 255, 0.35)",
                boxShadow: dashShadow.cardGlowHover,
              },
            }}
          >
            <Text fontFamily="var(--font-graphik)" fontSize="14px" fontWeight={500} color={dashColors.text.primary} whiteSpace="nowrap">
              {c.label}
            </Text>
          </MotionBox>
        ))}
      </Flex>
    </Box>
  );
}
