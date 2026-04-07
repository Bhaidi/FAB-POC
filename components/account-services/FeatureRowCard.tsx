"use client";

import Link from "next/link";
import { Box, Flex, Text, Tooltip } from "@chakra-ui/react";
import { ChevronRight, Lock } from "lucide-react";
import { dashRadius } from "@/components/dashboard/dashboardTokens";

const LOCK_MSG = "This service is not enabled for your profile.";

export type FeatureRowCardProps = {
  href: string;
  title: string;
  description: string;
  entitled: boolean;
};

export function FeatureRowCard({ href, title, description, entitled }: FeatureRowCardProps) {
  const row = (
    <Flex
      align="center"
      gap={4}
      minH="56px"
      py={2}
      px={1}
      mx={-1}
      borderRadius={dashRadius.surface}
      borderBottomWidth="1px"
      borderColor="rgba(255,255,255,0.06)"
      opacity={entitled ? 1 : 0.48}
      cursor={entitled ? "pointer" : "not-allowed"}
      transition="background 0.18s ease, opacity 0.18s ease"
      _hover={
        entitled
          ? {
              bg: "rgba(255,255,255,0.04)",
            }
          : undefined
      }
    >
      <Box flex="1" minW={0}>
        <Text
          fontFamily="var(--font-graphik)"
          fontSize="14px"
          fontWeight={600}
          color="rgba(255,255,255,0.9)"
          mb={0.5}
          noOfLines={1}
        >
          {title}
        </Text>
        <Text
          fontFamily="var(--font-graphik)"
          fontSize="12px"
          lineHeight={1.35}
          color="rgba(255,255,255,0.42)"
          noOfLines={1}
        >
          {description}
        </Text>
      </Box>
      <Flex align="center" gap={1} flexShrink={0} color="rgba(255,255,255,0.35)">
        {!entitled ? <Lock size={16} strokeWidth={2} aria-hidden /> : <ChevronRight size={18} strokeWidth={2} aria-hidden />}
      </Flex>
    </Flex>
  );

  if (!entitled) {
    return (
      <Tooltip label={LOCK_MSG} placement="left" hasArrow openDelay={350} borderRadius="md" px={3} py={2}>
        <Box>{row}</Box>
      </Tooltip>
    );
  }

  return (
    <Link href={href} style={{ textDecoration: "none", display: "block" }}>
      {row}
    </Link>
  );
}
