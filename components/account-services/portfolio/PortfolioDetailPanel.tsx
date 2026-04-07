"use client";

import { Box, Button, Flex, IconButton, Text } from "@chakra-ui/react";
import Link from "next/link";
import { ExternalLink, X } from "lucide-react";
import { CountryCell } from "@/components/account-services/portfolio/cells/CountryCell";
import { CurrencyCell } from "@/components/account-services/portfolio/cells/CurrencyCell";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import type { CorporateBankingGridRow } from "@/data/corporateBankingGridTypes";
import { formatAedFull } from "@/lib/formatAed";
import { ACCOUNT_SERVICES_BASE_PATH } from "@/lib/accountServicesRoutes";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  const { corpTable } = useFabTokens();
  return (
    <Flex gap={3} py={2.5} align="flex-start" direction={{ base: "column", sm: "row" }}>
      <Text
        flexShrink={0}
        w={{ sm: "140px" }}
        fontFamily="var(--font-graphik)"
        fontSize="12px"
        fontWeight={600}
        letterSpacing="0.06em"
        textTransform="uppercase"
        color={corpTable.chromeTextMuted}
      >
        {label}
      </Text>
      <Box minW={0} flex="1">
        {children}
      </Box>
    </Flex>
  );
}

type Props = {
  row: CorporateBankingGridRow;
  onClose: () => void;
  /**
   * `embedded` — inside operational split row; height matches table block.
   * `standalone` — below table on small screens; uses viewport-friendly min height.
   */
  variant?: "embedded" | "standalone";
};

export function PortfolioDetailPanel({ row, onClose, variant = "standalone" }: Props) {
  const { corpTable } = useFabTokens();
  const detailsHref = `${ACCOUNT_SERVICES_BASE_PATH}/details?accountId=${encodeURIComponent(row.id)}`;
  const embedded = variant === "embedded";

  return (
    <Box
      h="full"
      minH={embedded ? 0 : { base: "320px", lg: "min(85vh, 720px)" }}
      maxH={embedded ? "100%" : { lg: "min(85vh, 720px)" }}
      display="flex"
      flexDirection="column"
      bg={embedded ? corpTable.detailEmbedBg : corpTable.cardBg}
      boxShadow={corpTable.cardShadow}
      overflow="hidden"
      borderLeftWidth={embedded ? "1px" : 0}
      borderColor={embedded ? corpTable.detailEmbedBorder : undefined}
      borderTopRightRadius={embedded ? "8px" : undefined}
      borderBottomRightRadius={embedded ? "8px" : undefined}
    >
      <Flex
        align="flex-start"
        justify="space-between"
        gap={3}
        px={0}
        py={3}
        bg="transparent"
        flexShrink={0}
      >
        <Box minW={0}>
          <Text
            fontFamily="var(--font-graphik)"
            fontSize="11px"
            fontWeight={700}
            letterSpacing="0.14em"
            textTransform="uppercase"
            color={corpTable.chromeTextMuted}
            mb={1}
          >
            Account
          </Text>
          <Text fontFamily="var(--font-graphik)" fontSize="17px" fontWeight={600} color={corpTable.bodyPrimary} lineHeight={1.25}>
            {row.accountName}
          </Text>
        </Box>
        <IconButton
          aria-label="Close detail panel"
          icon={<X size={20} />}
          variant="ghost"
          size="sm"
          color={corpTable.chromeTextMuted}
          flexShrink={0}
          _hover={{ bg: corpTable.chromeButtonHoverBg, color: corpTable.bodyPrimary }}
          onClick={onClose}
        />
      </Flex>

      <Box flex="1" overflowY="auto" px={0} py={2} sx={{ scrollbarWidth: "thin" }}>
        <Row label="Entity">
          <Text fontFamily="var(--font-graphik)" fontSize="14px" color={corpTable.bodyPrimary}>
            {row.entity}
          </Text>
        </Row>
        <Row label="Customer ID">
          <Text fontFamily="var(--font-graphik)" fontSize="14px" color={corpTable.bodyPrimary} sx={{ fontVariantNumeric: "tabular-nums" }}>
            {row.customerId}
          </Text>
        </Row>
        <Row label="Country">
          <CountryCell code={row.accountCountryCode} name={row.accountCountryName} />
        </Row>
        <Row label="Currency">
          <CurrencyCell code={row.accountCcy} />
        </Row>
        <Row label="Balance (AED eq.)">
          <Text
            fontFamily="var(--font-graphik)"
            fontSize="15px"
            fontWeight={500}
            color={corpTable.bodyPrimary}
            sx={{ fontVariantNumeric: "tabular-nums" }}
          >
            {formatAedFull(row.balanceAed)}
          </Text>
        </Row>
        <Row label="Account number">
          <Text fontFamily={corpTable.mono} fontSize="13px" color={corpTable.bodyPrimary} sx={{ fontVariantNumeric: "tabular-nums" }}>
            {row.accountNumber}
          </Text>
        </Row>
        <Row label="IBAN">
          <Text fontFamily={corpTable.mono} fontSize="13px" color={corpTable.bodyPrimary} wordBreak="break-all" sx={{ fontVariantNumeric: "tabular-nums" }}>
            {row.iban}
          </Text>
        </Row>
        <Row label="Type">
          <Text fontFamily="var(--font-graphik)" fontSize="14px" color={corpTable.bodyPrimary}>
            {row.accountType}
          </Text>
        </Row>
      </Box>

      <Box px={0} py={3} bg="transparent" flexShrink={0}>
        <Button
          as={Link}
          href={detailsHref}
          prefetch={false}
          width="full"
          size="sm"
          rightIcon={<ExternalLink size={16} />}
          fontFamily="var(--font-graphik)"
          bg={corpTable.detailCtaBg}
          color={corpTable.bodyPrimary}
          border="none"
          _hover={{ bg: corpTable.detailCtaHoverBg }}
        >
          Open full account workspace
        </Button>
      </Box>
    </Box>
  );
}
