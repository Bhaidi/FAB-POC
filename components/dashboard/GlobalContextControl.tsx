"use client";

import { useMemo } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  Tooltip,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useDashboardGlobal } from "@/components/dashboard/DashboardGlobalContext";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import { authColorsLight } from "@/lib/fabTheme/authPalettes";
import { marketFlagEmoji } from "@/lib/marketDisplay";
import type { PlatformMarket } from "@/types/platformMarkets";

const MotionBox = motion(Box);

const panelEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const INACTIVE_TOOLTIP = "Not active for your organization";

/** Dropdown panel is always a light surface — ink stays FAB light spec regardless of app color mode. */
const marketMenuText = authColorsLight.text;

function isOperationalSelectable(m: PlatformMarket): boolean {
  return m.selectable && m.operationalStatus === "active";
}

function MarketFlagCell({ marketCode, dimmed }: { marketCode: string | null; dimmed?: boolean }) {
  const emoji = marketFlagEmoji(marketCode);
  return (
    <Flex
      w="32px"
      h="32px"
      flexShrink={0}
      align="center"
      justify="center"
      borderRadius="8px"
      bg={dimmed ? "rgba(1,5,145,0.04)" : "rgba(1,5,145,0.06)"}
      borderWidth="1px"
      borderColor={dimmed ? "rgba(1,5,145,0.06)" : "rgba(1,5,145,0.1)"}
      fontSize="18px"
      lineHeight={1}
      opacity={dimmed ? 0.65 : 1}
      aria-hidden
    >
      {emoji ? (
        emoji
      ) : (
        <Globe size={17} strokeWidth={2} color="#48525E" style={{ opacity: dimmed ? 0.5 : 0.9 }} />
      )}
    </Flex>
  );
}

type SimpleMarketSelectorProps = {
  markets: PlatformMarket[];
  marketCode: string | null;
  selectedMarketName: string;
  marketsLoading: boolean;
  error: string | null;
  onSelect: (code: string) => Promise<void>;
  onClose: () => void;
};

function SimpleMarketSelector({
  markets,
  marketCode,
  selectedMarketName,
  marketsLoading,
  error,
  onSelect,
  onClose,
}: SimpleMarketSelectorProps) {
  const selected = useMemo(
    () => (marketCode ? markets.find((m) => m.code === marketCode) : undefined),
    [markets, marketCode]
  );

  const selectedLabel = selected?.name ?? selectedMarketName;

  const activeOthers = useMemo(
    () => markets.filter((m) => isOperationalSelectable(m) && m.code !== marketCode),
    [markets, marketCode]
  );

  const inactive = useMemo(() => markets.filter((m) => !isOperationalSelectable(m)), [markets]);

  const hasActiveOthers = activeOthers.length > 0;
  const hasInactive = inactive.length > 0;

  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.18, ease: panelEase }}
      color={marketMenuText.primary}
      bg="rgba(255, 255, 255, 0.98)"
      backdropFilter="blur(20px)"
      sx={{ WebkitBackdropFilter: "blur(20px)" }}
      borderRadius="14px"
      borderWidth="1px"
      borderColor="rgba(1, 5, 145, 0.1)"
      boxShadow="0 20px 48px rgba(1, 5, 145, 0.1), 0 0 0 1px rgba(1, 5, 145, 0.04)"
      overflow="hidden"
      py={2}
      minW="260px"
      maxW="300px"
    >
      {error ? (
        <Text px={4} py={2} fontSize="xs" color="rgba(252,165,165,0.95)" fontFamily="var(--font-graphik)">
          {error}
        </Text>
      ) : null}

      {/* 1. Selected market */}
      <Box px={3} pb={1}>
        <Box
          px={3}
          py={3}
          bg="rgba(0, 98, 255, 0.1)"
          borderLeftWidth="3px"
          borderLeftColor="rgba(0, 98, 255, 0.85)"
          borderRadius="10px"
        >
          <Flex align="center" gap={3} minH="28px">
            <MarketFlagCell marketCode={marketCode} />
            <Text
              flex="1"
              fontFamily="var(--font-graphik)"
              fontSize="14px"
              fontWeight={600}
              letterSpacing="-0.01em"
              color={marketMenuText.primary}
              noOfLines={1}
            >
              {marketsLoading ? "…" : selectedLabel}
            </Text>
            <Box color="#010591" flexShrink={0} lineHeight={0} aria-hidden>
              <Check size={17} strokeWidth={2.5} />
            </Box>
          </Flex>
        </Box>
      </Box>

      {hasActiveOthers || hasInactive ? (
        <Box maxH="min(52vh, 340px)" overflowY="auto" sx={{ scrollbarGutter: "stable" }} px={1}>
          {hasActiveOthers ? (
            <>
              <Divider borderColor="rgba(1, 5, 145, 0.1)" my={3} />
              <Box px={2} pb={1} pt={0}>
                {activeOthers.map((m) => (
                  <Box
                    key={m.code}
                    as="button"
                    type="button"
                    display="block"
                    w="full"
                    textAlign="left"
                    py={2.5}
                    px={2}
                    mb={1}
                    borderRadius="lg"
                    fontFamily="var(--font-graphik)"
                    fontSize="14px"
                    fontWeight={500}
                    letterSpacing="-0.01em"
                    color={marketMenuText.primary}
                    bg="transparent"
                    border="none"
                    cursor="pointer"
                    transition="background 0.2s ease"
                    _hover={{ bg: "rgba(1, 5, 145, 0.05)" }}
                    _active={{ bg: "rgba(1, 5, 145, 0.08)" }}
                    _focusVisible={{
                      outline: "2px solid",
                      outlineColor: "rgba(0, 98, 255, 0.65)",
                      outlineOffset: "2px",
                    }}
                    onClick={() => {
                      onClose();
                      void onSelect(m.code);
                    }}
                  >
                    <Flex align="center" gap={3} w="full">
                      <MarketFlagCell marketCode={m.code} />
                      <Text as="span" flex="1" textAlign="left" noOfLines={1} color="inherit">
                        {m.name}
                      </Text>
                    </Flex>
                  </Box>
                ))}
              </Box>
            </>
          ) : null}

          {hasInactive ? (
            <>
              <Divider borderColor="rgba(1, 5, 145, 0.1)" borderTopWidth="2px" my={4} />
              <Box
                mx={2}
                mb={2}
                px={3}
                pt={3}
                pb={2}
                borderRadius="lg"
                bg="rgba(1, 5, 145, 0.04)"
                borderWidth="1px"
                borderColor="rgba(1, 5, 145, 0.08)"
                boxShadow="inset 0 1px 0 rgba(255,255,255,0.9)"
              >
                <Text
                  fontFamily="var(--font-graphik)"
                  fontSize="10px"
                  fontWeight={700}
                  letterSpacing="0.14em"
                  textTransform="uppercase"
                  color={marketMenuText.tertiary}
                  mb={3}
                  px={0.5}
                >
                  Not active for your organization
                </Text>
                <Flex direction="column" gap={1}>
                  {inactive.map((m) => (
                    <Tooltip
                      key={m.code}
                      label={INACTIVE_TOOLTIP}
                      placement="left"
                      hasArrow
                      openDelay={280}
                      bg="rgba(255, 255, 255, 0.98)"
                      color="#48525E"
                      fontSize="xs"
                      px={3}
                      py={2}
                      borderRadius="md"
                    >
                      <Box
                        display="block"
                        w="full"
                        py={2.5}
                        px={2}
                        borderRadius="md"
                        cursor="default"
                        aria-disabled
                        _hover={{ bg: "rgba(1, 5, 145, 0.04)" }}
                        transition="background 0.15s ease"
                      >
                        <Flex align="center" gap={3} pointerEvents="none">
                          <MarketFlagCell marketCode={m.code} dimmed />
                          <Text
                            fontFamily="var(--font-graphik)"
                            fontSize="14px"
                            fontWeight={500}
                            letterSpacing="-0.01em"
                            color={marketMenuText.secondary}
                            noOfLines={1}
                            flex="1"
                          >
                            {m.name}
                          </Text>
                        </Flex>
                      </Box>
                    </Tooltip>
                  ))}
                </Flex>
              </Box>
            </>
          ) : null}
        </Box>
      ) : null}
    </MotionBox>
  );
}

/**
 * Global market selector — compact trigger, readable dropdown with flags and clear inactive grouping.
 */
export function GlobalContextControl() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { dashColors } = useFabTokens();

  const { marketCode, selectedMarketName, markets, marketsLoading, error, selectMarket } = useDashboardGlobal();

  const headerFlag = marketFlagEmoji(marketCode);

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement="bottom-end" closeOnBlur gutter={10} strategy="fixed">
      <PopoverTrigger>
        <Button
          type="button"
          variant="unstyled"
          display="flex"
          alignItems="center"
          gap={3}
          px={4}
          minH="40px"
          h="40px"
          py={0}
          minW={0}
          maxW={{ base: "min(260px, 72vw)", sm: "none" }}
          borderRadius="20px"
          fontFamily="var(--font-graphik)"
          lineHeight={1.2}
          transition="background 0.2s ease"
          _hover={{
            bg: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(1, 5, 145, 0.06)",
          }}
          _active={{
            bg: isDark ? "rgba(255, 255, 255, 0.14)" : "rgba(1, 5, 145, 0.09)",
          }}
          _focusVisible={{ outline: "none", boxShadow: "0 0 0 2px rgba(0, 98, 255, 0.45)" }}
          aria-label={`Operating market: ${selectedMarketName}`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          isDisabled={marketsLoading}
        >
          <Flex
            w="30px"
            h="30px"
            flexShrink={0}
            align="center"
            justify="center"
            borderRadius="8px"
            bg={isDark ? "rgba(255, 255, 255, 0.08)" : "#F2F2F3"}
            borderWidth="1px"
            borderColor={isDark ? "rgba(255, 255, 255, 0.14)" : "rgba(1, 5, 145, 0.1)"}
            fontSize="16px"
            lineHeight={1}
            aria-hidden
          >
            {headerFlag ? (
              headerFlag
            ) : (
              <Globe
                size={16}
                strokeWidth={2}
                color={isDark ? "rgba(255, 255, 255, 0.85)" : "#48525E"}
                style={{ opacity: 0.92 }}
              />
            )}
          </Flex>
          <Text
            as="span"
            fontSize="14px"
            fontWeight={600}
            letterSpacing="-0.02em"
            color={dashColors.text.primary}
            textShadow="none"
            noOfLines={1}
            minW={0}
            flexShrink={1}
          >
            {marketsLoading ? "…" : selectedMarketName}
          </Text>
          <Box
            color={dashColors.text.tertiary}
            lineHeight={0}
            flexShrink={0}
            transition="transform 0.2s ease"
            style={{ transform: isOpen ? "rotate(180deg)" : undefined }}
          >
            <ChevronDown size={17} strokeWidth={2} aria-hidden />
          </Box>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        w="auto"
        minW="unset"
        border="none"
        bg="transparent"
        boxShadow="none"
        p={0}
        _focus={{ outline: "none" }}
      >
        <PopoverBody p={0}>
          <SimpleMarketSelector
            markets={markets}
            marketCode={marketCode}
            selectedMarketName={selectedMarketName}
            marketsLoading={marketsLoading}
            error={error}
            onSelect={selectMarket}
            onClose={onClose}
          />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
