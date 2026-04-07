"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { motion, useReducedMotion } from "framer-motion";
import { DashboardBackground } from "@/components/dashboard/DashboardBackground";
import { dashLayout, dashRadius } from "@/components/dashboard/dashboardTokens";
import { AUTH_CONTENT_EASE_OUT } from "@/lib/motion/authContentTransition";

const MotionFlex = motion(Flex);

/**
 * Shown while stub session is being read on the client — avoids a blank frame or a flash of
 * dashboard chrome with placeholder IDs before redirect or shell mount.
 */
export function DashboardEntryBridge() {
  const reduceMotion = useReducedMotion();
  const rm = reduceMotion === true;

  return (
    <Box position="relative" minH="100dvh" w="100%" maxW="100vw" sx={{ overflowX: "clip" }}>
      <DashboardBackground />
      <Flex
        position="relative"
        zIndex={1}
        minH="100dvh"
        align="center"
        justify="center"
        px={6}
        direction="column"
        gap={5}
      >
        <MotionFlex
          direction="column"
          align="center"
          gap={4}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: AUTH_CONTENT_EASE_OUT }}
        >
          <Box
            w={{ base: "52px", md: "56px" }}
            h={{ base: "52px", md: "56px" }}
            borderRadius="full"
            borderWidth="1px"
            borderColor="rgba(1, 5, 145, 0.12)"
            bg="rgba(255, 255, 255, 0.9)"
            backdropFilter="blur(12px)"
            sx={{ WebkitBackdropFilter: "blur(12px)" }}
            boxShadow="0 12px 40px rgba(1, 5, 145, 0.08), inset 0 1px 0 rgba(255,255,255,0.95)"
            aria-hidden
          />
          <Text
            fontFamily="var(--font-graphik)"
            fontSize="13px"
            fontWeight={500}
            letterSpacing="0.04em"
            color="rgba(72, 82, 94, 0.72)"
          >
            Opening your workspace…
          </Text>
        </MotionFlex>
        <Box
          mt={dashLayout.primaryNavFloatInset}
          w="min(280px, 72vw)"
          h="4px"
          borderRadius={dashRadius.panel}
          bg="rgba(1, 5, 145, 0.08)"
          overflow="hidden"
          aria-hidden
        >
          <motion.div
            style={{
              height: "100%",
              width: rm ? "100%" : "36%",
              borderRadius: "inherit",
              background: "linear-gradient(90deg, rgba(61,122,255,0.2), rgba(98,166,255,0.85), rgba(61,122,255,0.2))",
            }}
            animate={rm ? { opacity: [0.35, 0.85, 0.35] } : { x: ["-100%", "220%"] }}
            transition={
              rm
                ? { duration: 1.4, ease: "easeInOut", repeat: Infinity }
                : { duration: 1.35, ease: "easeInOut", repeat: Infinity }
            }
          />
        </Box>
      </Flex>
    </Box>
  );
}
