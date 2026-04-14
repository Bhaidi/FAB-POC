"use client";

import { ChevronDown } from "lucide-react";
import { Box, Menu, MenuButton, MenuItem, MenuList, Text, useColorMode } from "@chakra-ui/react";
import { dashRadius } from "@/components/dashboard/dashboardTokens";
import type { StubAccountRecord } from "@/data/accountServicesTypes";
import { LIGHT_SURFACE } from "@/lib/fabTheme/lightModePrimitives";
import { glassTokens } from "@/lib/glassTokens";
import { formatBalanceCompact } from "@/lib/accountServicesService";

type AccountSelectorProps = {
  accounts: StubAccountRecord[];
  selectedId: string;
  onSelect: (id: string) => void;
  /** Compact control for context bar (~64px strip). */
  variant?: "default" | "bar";
};

export function AccountSelector({
  accounts,
  selectedId,
  onSelect,
  variant = "default",
}: AccountSelectorProps) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const selected = accounts.find((a) => a.accountId === selectedId) ?? accounts[0];
  const bar = variant === "bar";

  return (
    <Menu matchWidth>
      <MenuButton
        type="button"
        px={bar ? 3 : 4}
        py={bar ? 2 : 2.5}
        minH={bar ? "40px" : undefined}
        borderRadius={dashRadius.panel}
        borderWidth="1px"
        borderColor={isDark ? glassTokens.border.default : "rgba(1, 5, 145, 0.12)"}
        bg={isDark ? glassTokens.fill.button : LIGHT_SURFACE.elevated}
        backdropFilter={isDark ? glassTokens.blur.button : "blur(12px)"}
        sx={{
          WebkitBackdropFilter: isDark ? glassTokens.blur.button : "blur(12px)",
          boxShadow: isDark
            ? `${glassTokens.shadow.insetTopSheen}, ${glassTokens.shadow.innerLens}`
            : "inset 0 1px 0 rgba(255,255,255,0.95), 0 1px 2px rgba(1, 5, 145, 0.05)",
        }}
        textAlign="left"
        w={bar ? "full" : { base: "full", md: "min(420px, 100%)" }}
        transition="border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease"
        _hover={{
          bg: isDark ? "rgba(255,255,255,0.1)" : LIGHT_SURFACE.hover,
          borderColor: isDark ? glassTokens.border.hover : "rgba(0, 98, 255, 0.28)",
          boxShadow: isDark
            ? `${glassTokens.shadowStack.button}, ${glassTokens.shadow.activeGlow}`
            : "0 4px 16px rgba(1, 5, 145, 0.08)",
        }}
        _active={{ bg: isDark ? "rgba(255,255,255,0.12)" : LIGHT_SURFACE.hover }}
        _focusVisible={{
          outline: "none",
          boxShadow: isDark ? glassTokens.search.focusRing : "0 0 0 2px rgba(0, 98, 255, 0.35)",
        }}
      >
        <Box as="span" display="flex" alignItems="center" justifyContent="space-between" gap={3} w="full">
          <Text
            as="span"
            fontFamily="var(--font-graphik)"
            fontSize={bar ? "13px" : "14px"}
            fontWeight={500}
            color={isDark ? "rgba(255,255,255,0.94)" : "#1a1d21"}
            noOfLines={1}
          >
            {selected?.accountName ?? "Select account"}
          </Text>
          <ChevronDown size={18} strokeWidth={2} aria-hidden style={{ flexShrink: 0, opacity: 0.7 }} />
        </Box>
      </MenuButton>
      <MenuList
        zIndex={200}
        minW="0"
        w={{ base: "calc(100vw - 32px)", md: "420px" }}
        maxH="280px"
        overflowY="auto"
        bg={isDark ? glassTokens.fill.card : "rgba(255,255,255,0.98)"}
        borderColor={isDark ? glassTokens.border.default : "rgba(1, 5, 145, 0.1)"}
        borderWidth="1px"
        backdropFilter={isDark ? glassTokens.blur.card : "blur(16px)"}
        sx={{
          WebkitBackdropFilter: isDark ? glassTokens.blur.card : "blur(16px)",
          boxShadow: isDark ? glassTokens.shadowStack.card : "0 20px 48px rgba(1, 5, 145, 0.1)",
        }}
        py={1}
        px={0}
      >
        {accounts.map((a) => (
          <MenuItem
            key={a.accountId}
            onClick={() => onSelect(a.accountId)}
            bg={a.accountId === selectedId ? "rgba(0, 72, 255, 0.22)" : "transparent"}
            _hover={{ bg: "rgba(255,255,255,0.08)" }}
            _focus={{ bg: "rgba(255,255,255,0.08)" }}
            py={3}
            px={4}
          >
            <Box>
              <Text fontFamily="var(--font-graphik)" fontSize="13px" fontWeight={500} color="white" noOfLines={2}>
                {a.accountName}
              </Text>
              <Text fontFamily="var(--font-graphik)" fontSize="11px" color="rgba(255,255,255,0.45)" mt={1}>
                {formatBalanceCompact(a.availableBalance, a.currency)} available · {a.country} · {a.entityName}
              </Text>
            </Box>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
