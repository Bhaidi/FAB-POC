"use client";

import NextLink from "next/link";
import { Box, Text, Tooltip } from "@chakra-ui/react";
import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { HiArrowRight } from "react-icons/hi2";
import { dashRadius } from "@/components/dashboard/dashboardTokens";
import { useFabTokens } from "@/components/theme/FabTokensContext";

const MotionBox = motion(Box);

const LOCK_MSG = "This service is not enabled for your profile.";

export type PrimaryActionCardProps = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  entitled?: boolean;
};

export function PrimaryActionCard({
  href,
  title,
  description,
  icon: Icon,
  entitled = true,
}: PrimaryActionCardProps) {
  const { dashShadow } = useFabTokens();
  const rm = useReducedMotion() === true;

  const inner = (
    <MotionBox
      role="group"
      h={{ base: "120px", md: "132px" }}
      minH={{ base: "120px", md: "132px" }}
      maxH={{ base: "140px", md: "140px" }}
      p={{ base: 4, md: 4 }}
      borderRadius={dashRadius.panel}
      borderWidth="1px"
      borderColor={entitled ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"}
      bg={entitled ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)"}
      backdropFilter="blur(14px)"
      sx={{ WebkitBackdropFilter: "blur(14px)" }}
      boxShadow={dashShadow.cardGlow}
      opacity={entitled ? 1 : 0.5}
      cursor={entitled ? "pointer" : "not-allowed"}
      pointerEvents={entitled ? "auto" : "none"}
      whileHover={
        entitled && !rm
          ? {
              y: -3,
              boxShadow: "0 0 0 1px rgba(0, 98, 255, 0.22), 0 16px 48px rgba(0, 0, 0, 0.5), 0 0 56px rgba(0, 98, 255, 0.1)",
              borderColor: "rgba(255,255,255,0.16)",
              transition: { duration: 0.28, ease: [0.33, 1, 0.68, 1] },
            }
          : undefined
      }
      display="flex"
      flexDirection="column"
      position="relative"
    >
      <Box
        w="36px"
        h="36px"
        borderRadius="10px"
        bg="rgba(0, 98, 255, 0.2)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="#93c5fd"
        mb={2.5}
        flexShrink={0}
      >
        <Icon size={18} strokeWidth={2} aria-hidden />
      </Box>
      <Text
        fontFamily="var(--font-graphik)"
        fontSize="15px"
        fontWeight={600}
        letterSpacing="-0.02em"
        color="rgba(255,255,255,0.94)"
        mb={1}
        pr={7}
        noOfLines={1}
      >
        {title}
      </Text>
      <Text
        fontFamily="var(--font-graphik)"
        fontSize="12px"
        lineHeight={1.35}
        color="rgba(255,255,255,0.5)"
        noOfLines={1}
        pr={7}
      >
        {description}
      </Text>
      <Box
        className="as-primary-card-arrow"
        position="absolute"
        right={4}
        bottom={4}
        color="rgba(147, 197, 253, 0.95)"
        opacity={entitled ? 0.35 : 0.2}
        transition="opacity 0.2s ease, transform 0.22s ease"
      >
        <HiArrowRight size={20} aria-hidden />
      </Box>
    </MotionBox>
  );

  if (!entitled) {
    return (
      <Tooltip label={LOCK_MSG} placement="top" hasArrow openDelay={300} borderRadius="md" px={3} py={2}>
        <Box>{inner}</Box>
      </Tooltip>
    );
  }

  return (
    <Box
      as={NextLink}
      href={href}
      display="block"
      h="full"
      textDecor="none"
      sx={{
        "@media (hover: hover)": {
          "&:hover .as-primary-card-arrow": {
            opacity: 1,
            transform: "translateX(4px)",
          },
        },
      }}
    >
      {inner}
    </Box>
  );
}
