"use client";

import type { ReactNode } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useAccountServicesModule } from "@/components/account-services/AccountServicesContext";
import { AccountSelector } from "@/components/account-services/AccountSelector";
import { dashRadius } from "@/components/dashboard/dashboardTokens";
import { useFabTokens } from "@/components/theme/FabTokensContext";

function MetaChip({ children }: { children: ReactNode }) {
  const { dashColors } = useFabTokens();
  return (
    <Flex
      align="center"
      justify="center"
      px={3}
      minH="32px"
      borderRadius="full"
      borderWidth="1px"
      borderColor={dashColors.metaChipBorder}
      bg={dashColors.metaChipBg}
      flexShrink={0}
    >
      <Text
        fontFamily="var(--font-graphik)"
        fontSize="12px"
        fontWeight={500}
        color={dashColors.metaChipText}
        whiteSpace="nowrap"
      >
        {children}
      </Text>
    </Flex>
  );
}

export function AccountContextBar() {
  const { dashColors } = useFabTokens();
  const { accounts, selectedAccount, selectedAccountId, setSelectedAccountId } = useAccountServicesModule();
  const a = selectedAccount;
  const statusLabel =
    a.status === "active" ? "Active" : a.status === "dormant" ? "Dormant" : "Restricted";

  return (
    <Box
      borderRadius={dashRadius.panel}
      borderWidth="1px"
      borderColor={dashColors.contextBarOuterBorder}
      bg={dashColors.contextBarOuterBg}
      backdropFilter="blur(16px)"
      sx={{ WebkitBackdropFilter: "blur(16px)" }}
      px={{ base: 3, md: 4 }}
      py={0}
      minH="64px"
      mb={6}
      display="flex"
      alignItems="center"
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        align={{ base: "stretch", md: "center" }}
        justify="space-between"
        gap={{ base: 3, md: 4 }}
        w="full"
        py={{ base: 3, md: 0 }}
      >
        <Box minW={0} flexShrink={{ md: 0 }} maxW={{ md: "min(380px, 42%)" }}>
          <AccountSelector
            variant="bar"
            accounts={accounts}
            selectedId={selectedAccountId}
            onSelect={setSelectedAccountId}
          />
        </Box>
        <Flex
          flex="1"
          flexWrap="wrap"
          gap={2}
          justify={{ base: "flex-start", md: "flex-end" }}
          align="center"
        >
          <MetaChip>{`Entity: ${a.entityName}`}</MetaChip>
          <MetaChip>{a.country}</MetaChip>
          <MetaChip>{a.currency}</MetaChip>
          <MetaChip>{statusLabel}</MetaChip>
          <MetaChip>
            {a.linkedAccountsCount} linked account{a.linkedAccountsCount === 1 ? "" : "s"}
          </MetaChip>
        </Flex>
      </Flex>
    </Box>
  );
}
