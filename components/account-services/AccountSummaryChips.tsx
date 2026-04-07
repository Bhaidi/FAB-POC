"use client";

import { HStack, Text } from "@chakra-ui/react";
import type { StubAccountRecord } from "@/data/accountServicesTypes";
import { formatBalanceCompact } from "@/lib/accountServicesService";

const chipSx = {
  px: 2.5,
  py: 1,
  borderRadius: "full",
  borderWidth: "1px",
  borderColor: "rgba(255,255,255,0.12)",
  bg: "rgba(255,255,255,0.06)",
} as const;

const chipLabelProps = {
  fontFamily: "var(--font-graphik)",
  fontSize: "11px",
  fontWeight: 500,
  letterSpacing: "-0.01em",
  color: "rgba(255,255,255,0.78)",
  lineHeight: 1.2,
} as const;

export function AccountSummaryChips({ account }: { account: StubAccountRecord }) {
  const statusLabel =
    account.status === "active" ? "Active" : account.status === "dormant" ? "Dormant" : "Restricted";

  return (
    <HStack flexWrap="wrap" spacing={2} justify={{ base: "flex-start", md: "flex-end" }}>
      <HStack {...chipSx}>
        <Text {...chipLabelProps}>{formatBalanceCompact(account.availableBalance, account.currency)} Available</Text>
      </HStack>
      <HStack {...chipSx}>
        <Text {...chipLabelProps}>{statusLabel}</Text>
      </HStack>
      <HStack {...chipSx}>
        <Text {...chipLabelProps}>{account.country}</Text>
      </HStack>
      <HStack {...chipSx}>
        <Text {...chipLabelProps}>
          {account.linkedAccountsCount} linked account{account.linkedAccountsCount === 1 ? "" : "s"}
        </Text>
      </HStack>
    </HStack>
  );
}
