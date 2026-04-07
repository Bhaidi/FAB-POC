"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import type { QuickActionCatalogEntry } from "@/data/quickActionsCatalog";

export function QuickActionOption({
  entry,
  selected,
  onToggle,
}: {
  entry: QuickActionCatalogEntry;
  selected: boolean;
  onToggle: () => void;
}) {
  const Icon = entry.icon;
  return (
    <Flex
      as="button"
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={onToggle}
      align="flex-start"
      gap={3}
      w="full"
      textAlign="left"
      p={3}
      borderRadius="12px"
      borderWidth="1px"
      borderColor={selected ? "rgba(0, 98, 255, 0.45)" : "rgba(1, 5, 145, 0.08)"}
      bg={selected ? "rgba(0, 98, 255, 0.1)" : "rgba(242, 242, 243, 0.9)"}
      boxShadow={selected ? "0 0 0 1px rgba(0,98,255,0.2)" : "none"}
      cursor="pointer"
      transition="background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease"
      _hover={{
        borderColor: selected ? "rgba(0, 98, 255, 0.55)" : "rgba(1, 5, 145, 0.12)",
        bg: selected ? "rgba(0, 98, 255, 0.14)" : "#FFFFFF",
      }}
    >
      <Flex
        flexShrink={0}
        w="22px"
        h="22px"
        mt={0.5}
        borderRadius="6px"
        borderWidth="2px"
        borderColor={selected ? "rgba(0, 98, 255, 0.75)" : "rgba(1, 5, 145, 0.2)"}
        bg={selected ? "rgba(0, 98, 255, 0.15)" : "transparent"}
        align="center"
        justify="center"
        transition="border-color 0.15s ease, background 0.15s ease"
      >
        {selected ? (
          <Box as="span" w="8px" h="8px" borderRadius="2px" bg="#010591" />
        ) : null}
      </Flex>
      <Box
        flexShrink={0}
        w="34px"
        h="34px"
        borderRadius="9px"
        bg="rgba(0, 98, 255, 0.12)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="#010591"
      >
        <Icon size={18} strokeWidth={2} aria-hidden />
      </Box>
      <Flex direction="column" gap={0.5} minW={0} flex="1">
        <Text
          fontFamily="var(--font-graphik)"
          fontSize="14px"
          fontWeight={600}
          letterSpacing="-0.02em"
          color="#48525E"
          lineHeight={1.25}
        >
          {entry.label}
        </Text>
        <Text
          fontFamily="var(--font-graphik)"
          fontSize="12px"
          fontWeight={500}
          lineHeight={1.35}
          color="rgba(72, 82, 94, 0.65)"
        >
          {entry.description}
        </Text>
      </Flex>
    </Flex>
  );
}
