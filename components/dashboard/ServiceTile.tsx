"use client";

import { useMemo, useState, type KeyboardEvent, type MouseEvent } from "react";
import { Box, Flex, Text, useBreakpointValue, useColorMode } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { HiArrowRight, HiOutlineSquares2X2 } from "react-icons/hi2";
import {
  dashboardCardCtaSlide,
  makeDashboardCardHover,
  makeDashboardGlassCardHover,
} from "@/lib/dashboardCardAnimations";
import { dashRadius, figmaHomeServiceCard } from "@/components/dashboard/dashboardTokens";
import { dashboardDarkCardSurface } from "@/lib/dashboardDarkCardSurface";
import { useFabTokens } from "@/components/theme/FabTokensContext";

const MotionDiv = motion.div;
const MotionBox = motion(Box);

/** FABAccess API `AnimatedAPICard` visual spec — white tile, #0f62fe border on hover (md+). */
const TITLE_COLOR = "#010591";
const BODY_COLOR = "#48525e";
const CTA_BG = "#000245";
const BORDER_HOVER = "#0f62fe";

export type ServiceTileProps = {
  title: string;
  description?: string;
  /** Optional cover image on hover (desktop only), like API catalog cards. */
  hoverImage?: string;
  ctaLabel?: string;
  onClick?: () => void;
};

export function ServiceTile({
  title,
  description,
  hoverImage,
  ctaLabel = "Launch",
  onClick,
}: ServiceTileProps) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { dashShadow } = useFabTokens();
  const dashboardCardHover = useMemo(
    () =>
      isDark
        ? makeDashboardGlassCardHover()
        : makeDashboardCardHover(dashShadow.cardGlow, dashShadow.cardGlowHover),
    [dashShadow.cardGlow, dashShadow.cardGlowHover, isDark],
  );
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleMouseEnter = () => {
    if (!isMobile) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!isMobile) setIsHovered(false);
  };

  const runAction = () => {
    onClick?.();
  };

  const tileBackdrop = isDark ? dashboardDarkCardSurface.backdrop : "blur(14px)";
  const tileBg = isDark ? figmaHomeServiceCard.fill : "#FFF";
  const tileRadius = isDark ? figmaHomeServiceCard.radius : dashRadius.panel;
  const tileBorder = isDark
    ? {
        base: "none",
        md: isHovered
          ? `1px solid ${dashboardDarkCardSurface.borderHover}`
          : `1px solid ${dashboardDarkCardSurface.border}`,
      }
    : {
        base: "none",
        md: isHovered ? `1px solid ${BORDER_HOVER}` : "1px solid rgba(1, 5, 145, 0.1)",
      };

  return (
    <MotionBox
      role="button"
      tabIndex={0}
      textAlign="left"
      aria-label={`${title}. ${ctaLabel}.`}
      backdropFilter={tileBackdrop}
      bg={tileBg}
      border={tileBorder}
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="space-between"
      overflow="hidden"
      w="full"
      p={isDark ? { base: 5, md: 8 } : { base: 5, md: 6 }}
      gap={4}
      position="relative"
      borderRadius={tileRadius}
      cursor="pointer"
      variants={dashboardCardHover}
      initial="rest"
      whileHover={isMobile ? "rest" : "hover"}
      whileFocus={isMobile ? "rest" : "hover"}
      whileTap={{ scale: 0.995 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={runAction}
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          runAction();
        }
      }}
      sx={{ WebkitBackdropFilter: tileBackdrop }}
    >
      <Flex
        direction="column"
        flex="1"
        w="full"
        minH={{ base: "120px", md: "140px" }}
        justify="space-between"
        gap={4}
        position="relative"
        zIndex={10}
        minW={0}
        overflow="hidden"
      >
        <Flex flexDirection="column" gap={3} alignItems="flex-start" w="full" minH={0} flex="1">
          <Flex gap="6px" alignItems="flex-start" w="full" minW={0} overflow="visible">
            <Box
              flexShrink={0}
              w="22px"
              h="22px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mt="1px"
              color={isDark ? dashboardDarkCardSurface.title : TITLE_COLOR}
            >
              <HiOutlineSquares2X2 size={22} strokeWidth={1.5} aria-hidden />
            </Box>
            <Text
              fontFamily="var(--font-graphik)"
              fontWeight={500}
              lineHeight="1.35"
              color={isDark ? dashboardDarkCardSurface.title : TITLE_COLOR}
              fontSize={{ base: "15px", md: isDark ? "20px" : "16px" }}
              flex="1"
              noOfLines={2}
              minW={0}
            >
              {title}
            </Text>
          </Flex>
        </Flex>
        {description ? (
          <Box w="full" overflow="hidden" flexShrink={0}>
            <Text
              fontFamily="var(--font-graphik)"
              fontWeight={isDark ? 300 : 400}
              lineHeight="1.4"
              opacity={isDark ? 1 : 0.6}
              fontSize={{ base: "13px", md: isDark ? "12px" : "14px" }}
              w="full"
              color={isDark ? dashboardDarkCardSurface.body : BODY_COLOR}
              overflow="hidden"
              textOverflow="ellipsis"
              display="-webkit-box"
              sx={{
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
              minH={0}
            >
              {description}
            </Text>
          </Box>
        ) : null}
      </Flex>

      <Flex
        alignItems="center"
        position="relative"
        flexShrink={0}
        zIndex={10}
        display={{ base: "flex", md: "none" }}
        onClick={(e: MouseEvent<HTMLDivElement>) => {
          e.stopPropagation();
          runAction();
        }}
        cursor="pointer"
      >
        <Text
          fontFamily="var(--font-graphik)"
          fontWeight={500}
          lineHeight="none"
          color={isDark ? "rgba(96, 170, 238, 0.95)" : BORDER_HOVER}
          fontSize="16px"
          letterSpacing="0.5px"
        >
          {ctaLabel}
        </Text>
        <Box
          as="span"
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="24px"
          h="24px"
          ml="4px"
          color={isDark ? "rgba(96, 170, 238, 0.95)" : BORDER_HOVER}
        >
          <HiArrowRight size={20} strokeWidth={2} aria-hidden />
        </Box>
      </Flex>

      {hoverImage ? (
        <Box
          position="absolute"
          inset={0}
          display={{ base: "none", md: "block" }}
          zIndex={20}
          pointerEvents="none"
          borderRadius={tileRadius}
          overflow="hidden"
        >
          <MotionDiv
            style={{ position: "absolute", inset: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Box as="img" alt="" position="absolute" inset={0} w="full" h="full" objectFit="cover" src={hoverImage} />
          </MotionDiv>
        </Box>
      ) : null}

      <Box
        as={motion.div}
        position="absolute"
        inset={0}
        display={{ base: "none", md: isHovered ? "flex" : "none" }}
        alignItems="center"
        justifyContent="center"
        zIndex={30}
        pointerEvents="none"
        borderRadius={tileRadius}
        px={3}
        bg={hoverImage ? "transparent" : isDark ? dashboardDarkCardSurface.hoverScrim : "rgba(0, 2, 69, 0.35)"}
      >
        <MotionBox
          variants={dashboardCardCtaSlide}
          initial="hidden"
          animate={isHovered ? "visible" : "hidden"}
          pointerEvents="auto"
          bg={CTA_BG}
          display="flex"
          alignItems="center"
          justifyContent="center"
          pl="24px"
          pr="16px"
          py="12px"
          minH="40px"
          w="full"
          maxW="280px"
          borderRadius="100px"
          flexShrink={0}
          cursor="pointer"
          onClick={(e: MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            runAction();
          }}
          _hover={{ opacity: 0.9 }}
        >
          <Flex gap="4px" alignItems="center">
            <Text fontFamily="var(--font-graphik)" fontWeight={500} lineHeight="24px" fontSize="14px" color="white">
              {ctaLabel}
            </Text>
            <Box as="span" display="flex" w="24px" h="24px" color="white">
              <HiArrowRight size={22} strokeWidth={2} aria-hidden />
            </Box>
          </Flex>
        </MotionBox>
      </Box>
    </MotionBox>
  );
}
