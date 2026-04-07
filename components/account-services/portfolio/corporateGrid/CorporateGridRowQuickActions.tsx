"use client";

import { Button, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { FileDown, LayoutList, PanelRight, Send } from "lucide-react";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import type { CorporateBankingGridRow } from "@/data/corporateBankingGridTypes";
import { ACCOUNT_SERVICES_BASE_PATH } from "@/lib/accountServicesRoutes";

type Props = {
  row: CorporateBankingGridRow;
};

export function CorporateGridRowQuickActions({ row }: Props) {
  const { corpTable } = useFabTokens();
  const detailsHref = `${ACCOUNT_SERVICES_BASE_PATH}/details?accountId=${encodeURIComponent(row.id)}`;
  const txHref = `${ACCOUNT_SERVICES_BASE_PATH}/transactions?accountId=${encodeURIComponent(row.id)}`;
  const stmtHref = `${ACCOUNT_SERVICES_BASE_PATH}/statements?accountId=${encodeURIComponent(row.id)}`;
  const reqHref = `${ACCOUNT_SERVICES_BASE_PATH}/requests?accountId=${encodeURIComponent(row.id)}`;

  return (
    <Flex
      direction="column"
      gap={3}
      py={3}
      px={corpTable.tableCellPx}
      bg="rgba(0, 98, 255, 0.06)"
      borderTopWidth="1px"
      borderColor={corpTable.tableRowRule}
    >
      <Text
        fontFamily={corpTable.chromeFontFamily}
        fontSize="11px"
        fontWeight={600}
        letterSpacing="0.12em"
        textTransform="uppercase"
        color={corpTable.chromeTextMuted}
      >
        Quick actions
      </Text>
      <Flex flexWrap="wrap" gap={2}>
        <Button
          as={Link}
          href={txHref}
          size="sm"
          variant="outline"
          leftIcon={<LayoutList size={16} />}
          fontFamily={corpTable.chromeFontFamily}
          fontWeight={500}
          borderColor="rgba(255,255,255,0.2)"
          color={corpTable.chromeText}
          _hover={{ bg: "rgba(255,255,255,0.08)" }}
          onClick={(e) => e.stopPropagation()}
        >
          View Transactions
        </Button>
        <Button
          as={Link}
          href={stmtHref}
          size="sm"
          variant="outline"
          leftIcon={<FileDown size={16} />}
          fontFamily={corpTable.chromeFontFamily}
          fontWeight={500}
          borderColor="rgba(255,255,255,0.2)"
          color={corpTable.chromeText}
          _hover={{ bg: "rgba(255,255,255,0.08)" }}
          onClick={(e) => e.stopPropagation()}
        >
          Download Statement
        </Button>
        <Button
          as={Link}
          href={detailsHref}
          size="sm"
          variant="outline"
          leftIcon={<PanelRight size={16} />}
          fontFamily={corpTable.chromeFontFamily}
          fontWeight={500}
          borderColor="rgba(255,255,255,0.2)"
          color={corpTable.chromeText}
          _hover={{ bg: "rgba(255,255,255,0.08)" }}
          onClick={(e) => e.stopPropagation()}
        >
          Open Account Details
        </Button>
        <Button
          as={Link}
          href={reqHref}
          size="sm"
          variant="outline"
          leftIcon={<Send size={16} />}
          fontFamily={corpTable.chromeFontFamily}
          fontWeight={500}
          borderColor="rgba(255,255,255,0.2)"
          color={corpTable.chromeText}
          _hover={{ bg: "rgba(255,255,255,0.08)" }}
          onClick={(e) => e.stopPropagation()}
        >
          Raise Request
        </Button>
      </Flex>
    </Flex>
  );
}
