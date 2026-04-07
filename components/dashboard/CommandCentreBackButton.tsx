"use client";

import { useRouter } from "next/navigation";
import { Box, Text, useColorMode } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { LayoutDashboard } from "lucide-react";
import { dashRadius } from "@/components/dashboard/dashboardTokens";
import { useFabTokens } from "@/components/theme/FabTokensContext";

const MotionButton = motion.button;

/**
 * High-visibility escape hatch from Account Services back to the main dashboard / command centre.
 */
export function CommandCentreBackButton() {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { dashColors, dashEffects } = useFabTokens();

  return (
    <MotionButton
      type="button"
      layout
      initial={false}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 520, damping: 28 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        flexShrink: 0,
        padding: "8px 12px",
        borderRadius: dashRadius.panel,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: isDark ? "rgba(120, 190, 255, 0.45)" : "rgba(0, 98, 255, 0.28)",
        background: isDark
          ? "linear-gradient(135deg, rgba(0, 98, 255, 0.28) 0%, rgba(6, 10, 24, 0.72) 55%, rgba(0, 70, 180, 0.2) 100%)"
          : "linear-gradient(135deg, rgba(0, 98, 255, 0.14) 0%, rgba(255, 255, 255, 0.92) 60%, rgba(220, 235, 255, 0.85) 100%)",
        boxShadow: isDark
          ? "0 0 0 1px rgba(255,255,255,0.1) inset, 0 4px 24px rgba(0, 60, 160, 0.35), 0 0 32px rgba(0, 120, 255, 0.2)"
          : "0 0 0 1px rgba(255,255,255,0.85) inset, 0 4px 18px rgba(0, 98, 255, 0.12), 0 0 24px rgba(0, 98, 255, 0.08)",
        backdropFilter: dashEffects.primaryNavBlur,
        WebkitBackdropFilter: dashEffects.primaryNavBlur,
        color: dashColors.text.primary,
        cursor: "pointer",
        font: "inherit",
      }}
      onClick={() => router.push("/dashboard")}
      aria-label="Return to command centre dashboard"
    >
      <Box
        as="span"
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        w="28px"
        h="28px"
        borderRadius="md"
        bg={isDark ? "rgba(255,255,255,0.12)" : "rgba(0, 98, 255, 0.1)"}
        color={isDark ? "rgba(255,255,255,0.95)" : "rgba(1, 5, 145, 0.9)"}
        sx={{
          boxShadow: isDark ? "0 0 14px rgba(120, 200, 255, 0.35)" : "0 0 10px rgba(0, 98, 255, 0.2)",
        }}
      >
        <LayoutDashboard size={16} strokeWidth={2.25} aria-hidden />
      </Box>
      <Text
        as="span"
        fontFamily="var(--font-graphik)"
        fontSize="13px"
        fontWeight={600}
        letterSpacing="-0.02em"
        whiteSpace="nowrap"
        display={{ base: "none", sm: "inline" }}
      >
        Command centre
      </Text>
    </MotionButton>
  );
}
