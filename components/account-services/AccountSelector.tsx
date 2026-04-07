"use client";

import { ChevronDown } from "lucide-react";
import { Box, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { dashRadius } from "@/components/dashboard/dashboardTokens";
import type { StubAccountRecord } from "@/data/accountServicesTypes";
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
        borderColor="rgba(255,255,255,0.14)"
        bg="rgba(255,255,255,0.06)"
        backdropFilter="blur(12px)"
        sx={{ WebkitBackdropFilter: "blur(12px)" }}
        textAlign="left"
        w={bar ? "full" : { base: "full", md: "min(420px, 100%)" }}
        transition="border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease"
        _hover={{
          bg: "rgba(255,255,255,0.09)",
          borderColor: "rgba(255,255,255,0.2)",
          boxShadow: "0 0 24px rgba(0, 98, 255, 0.12)",
        }}
        _active={{ bg: "rgba(255,255,255,0.1)" }}
        _focusVisible={{ outline: "none", boxShadow: "0 0 0 2px rgba(0, 98, 255, 0.45)" }}
      >
        <Box as="span" display="flex" alignItems="center" justifyContent="space-between" gap={3} w="full">
          <Text
            as="span"
            fontFamily="var(--font-graphik)"
            fontSize={bar ? "13px" : "14px"}
            fontWeight={500}
            color="rgba(255,255,255,0.94)"
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
        bg="rgba(10, 14, 32, 0.97)"
        borderColor="rgba(255,255,255,0.12)"
        borderWidth="1px"
        boxShadow="0 20px 50px rgba(0,0,0,0.5)"
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
