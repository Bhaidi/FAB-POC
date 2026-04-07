"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import type { PortfolioTableRow } from "@/components/account-services/portfolioTableTypes";
import type { PortfolioStubTableTheme } from "@/components/account-services/portfolioTableTheme";

const columnHelper = createColumnHelper<PortfolioTableRow>();

function typeBadgeLabel(kind: PortfolioTableRow["kind"]): string {
  if (kind === "accounts") return "Account";
  if (kind === "deposits") return "Deposit";
  return "Loan";
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <Box
      w="8px"
      h="8px"
      borderRadius="full"
      bg={active ? "rgba(52, 211, 153, 0.95)" : "rgba(251, 191, 36, 0.95)"}
      boxShadow={active ? "0 0 10px rgba(52, 211, 153, 0.45)" : "none"}
      flexShrink={0}
    />
  );
}

export function buildPortfolioColumns(theme: PortfolioStubTableTheme) {
  const t = theme;
  return [
    columnHelper.accessor("kind", {
      id: "type",
      header: "Type",
      meta: { width: "100px" },
      cell: ({ getValue }) => {
        const kind = getValue();
        return (
          <Text
            as="span"
            display="inline-block"
            px={2}
            py={0.5}
            borderRadius="6px"
            fontFamily="var(--font-graphik)"
            fontSize="11px"
            fontWeight={600}
            letterSpacing="0.04em"
            textTransform="uppercase"
            color={kind === "accounts" ? t.badgeAccountFg : kind === "deposits" ? t.badgeDepositFg : t.badgeLoanFg}
            bg={kind === "accounts" ? t.badgeAccountBg : kind === "deposits" ? t.badgeDepositBg : t.badgeLoanBg}
          >
            {typeBadgeLabel(kind)}
          </Text>
        );
      },
    }),
    columnHelper.display({
      id: "product",
      header: "Product",
      cell: ({ row }) => (
        <>
          <Text
            fontFamily="var(--font-graphik)"
            fontSize="15px"
            fontWeight={600}
            color={t.title}
            noOfLines={1}
          >
            {row.original.name}
          </Text>
          <Text mt={1} fontFamily="var(--font-graphik)" fontSize="12px" color={t.bodyMuted} noOfLines={2}>
            {row.original.meta}
          </Text>
        </>
      ),
    }),
    columnHelper.accessor("amountDisplay", {
      id: "balance",
      header: "Balance",
      meta: { width: "120px", isNumeric: true },
      cell: ({ getValue }) => (
        <Text
          fontFamily="var(--font-graphik)"
          fontSize="15px"
          fontWeight={500}
          color={t.balance}
          whiteSpace="nowrap"
        >
          {getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor("progressPct", {
      id: "progress",
      header: "Progress",
      meta: { width: "140px" },
      cell: ({ getValue, row }) => {
        const pct = getValue();
        if (pct != null) {
          return (
            <Box h="4px" borderRadius="full" bg={t.progressTrack} overflow="hidden">
              <Box
                h="full"
                w={`${pct}%`}
                bg={row.original.kind === "deposits" ? t.progressFillDeposit : t.progressFillLoan}
                borderRadius="full"
              />
            </Box>
          );
        }
        return (
          <Text fontFamily="var(--font-graphik)" fontSize="13px" color={t.emDash}>
            —
          </Text>
        );
      },
    }),
    columnHelper.display({
      id: "status",
      header: "Status",
      meta: { width: "120px" },
      cell: ({ row }) => (
        <Flex align="center" gap={2}>
          <StatusDot active={row.original.statusActive} />
          <Text fontFamily="var(--font-graphik)" fontSize="13px" color={t.subtle}>
            {row.original.statusLabel}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.display({
      id: "chevron",
      header: "",
      meta: { width: "48px", isChevron: true },
      cell: () => (
        <Box as="span" color={t.chevron} display="flex" justifyContent="center">
          <ChevronRight size={20} strokeWidth={2} aria-hidden />
        </Box>
      ),
    }),
  ];
}
