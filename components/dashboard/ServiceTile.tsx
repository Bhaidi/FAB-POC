"use client";

import { useState, type KeyboardEvent, type MouseEvent } from "react";
import { Box, Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { HiArrowRight, HiOutlineSquares2X2 } from "react-icons/hi2";
import { dashboardCardCtaSlide, dashboardCardHover } from "@/lib/dashboardCardAnimations";
import { dashRadius } from "@/components/dashboard/dashboardTokens";

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

  return (
    <MotionBox
      role="button"
      tabIndex={0}
      textAlign="left"
      aria-label={`${title}. ${ctaLabel}.`}
      backdropFilter="blur(14px)"
      bg="#FFF"
      border={{ base: "none", md: isHovered ? `1px solid ${BORDER_HOVER}` : "1px solid rgba(255,255,255,0.12)" }}
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="space-between"
      overflow="hidden"
      w="full"
      p={{ base: 5, md: 6 }}
      gap={4}
      position="relative"
      borderRadius={dashRadius.panel}
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
      sx={{ WebkitBackdropFilter: "blur(14px)" }}
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
              color={TITLE_COLOR}
            >
              <HiOutlineSquares2X2 size={22} strokeWidth={1.5} aria-hidden />
            </Box>
            <Text
              fontFamily="var(--font-graphik)"
              fontWeight={500}
              lineHeight="1.35"
              color={TITLE_COLOR}
              fontSize={{ base: "15px", md: "16px" }}
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
              fontWeight={400}
              lineHeight="1.4"
              opacity={0.6}
              fontSize={{ base: "13px", md: "14px" }}
              w="full"
              color={BODY_COLOR}
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
          color={BORDER_HOVER}
          fontSize="16px"
          letterSpacing="0.5px"
        >
          {ctaLabel}
        </Text>
        <Box as="span" display="flex" alignItems="center" justifyContent="center" w="24px" h="24px" ml="4px" color={BORDER_HOVER}>
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
          borderRadius={dashRadius.panel}
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
        borderRadius={dashRadius.panel}
        px={3}
        bg={hoverImage ? "transparent" : "rgba(0, 2, 69, 0.35)"}
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
