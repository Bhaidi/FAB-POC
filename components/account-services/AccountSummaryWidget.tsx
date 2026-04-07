"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { useAccountServicesModule } from "@/components/account-services/AccountServicesContext";
import { dashRadius } from "@/components/dashboard/dashboardTokens";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import { formatBalanceCompact } from "@/lib/accountServicesService";

export function AccountSummaryWidget() {
  const { dashShadow } = useFabTokens();
  const { selectedAccount } = useAccountServicesModule();
  const a = selectedAccount;

  return (
    <Box
      borderRadius={dashRadius.panel}
      borderWidth="1px"
      borderColor="rgba(255,255,255,0.1)"
      bg="rgba(255,255,255,0.05)"
      backdropFilter="blur(20px)"
      sx={{
        WebkitBackdropFilter: "blur(20px)",
        backgroundImage: `
          linear-gradient(168deg, rgba(14, 20, 52, 0.92) 0%, rgba(10, 16, 42, 0.82) 48%, rgba(8, 12, 36, 0.94) 100%),
          linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 36%, rgba(95, 85, 180, 0.04) 100%)
        `,
        boxShadow: dashShadow.cardGlow,
      }}
      p={{ base: 4, md: 5 }}
      transition="transform 0.28s cubic-bezier(0.33, 1, 0.68, 1), box-shadow 0.28s ease"
      _hover={{ transform: "translateY(-2px)", boxShadow: dashShadow.cardGlowHover }}
    >
      <Text
        fontFamily="var(--font-graphik)"
        fontSize="11px"
        fontWeight={600}
        letterSpacing="0.14em"
        textTransform="uppercase"
        color="rgba(255,255,255,0.55)"
        mb={4}
      >
        Account summary
      </Text>

      <Box mb={4}>
        <Text fontFamily="var(--font-graphik)" fontSize="11px" color="rgba(255,255,255,0.45)" mb={1}>
          Available balance
        </Text>
        <Text
          fontFamily="var(--font-graphik)"
          fontSize={{ base: "26px", md: "28px" }}
          fontWeight={500}
          letterSpacing="-0.03em"
          color="white"
        >
          {formatBalanceCompact(a.availableBalance, a.currency)}
        </Text>
      </Box>

      <Box mb={4}>
        <Text fontFamily="var(--font-graphik)" fontSize="11px" color="rgba(255,255,255,0.45)" mb={1}>
          Current balance
        </Text>
        <Text fontFamily="var(--font-graphik)" fontSize="17px" fontWeight={500} color="rgba(255,255,255,0.9)">
          {formatBalanceCompact(a.currentBalance, a.currency)}
        </Text>
      </Box>

      <Flex flexWrap="wrap" gap={2} mb={4}>
        <Text fontFamily="var(--font-graphik)" fontSize="12px" color="rgba(255,255,255,0.72)">
          {a.currency} <Text as="span" color="rgba(255,255,255,0.35)">|</Text> {a.country}{" "}
          <Text as="span" color="rgba(255,255,255,0.35)">|</Text> {a.linkedAccountsCount} linked account
          {a.linkedAccountsCount === 1 ? "" : "s"}
        </Text>
      </Flex>

      <Text fontFamily="var(--font-graphik)" fontSize="12px" color="rgba(255,255,255,0.55)" mb={1}>
        Entity:{" "}
        <Text as="span" color="rgba(255,255,255,0.82)" fontWeight={500}>
          {a.entityName}
        </Text>
      </Text>

      <Text fontFamily="var(--font-graphik)" fontSize="11px" color="rgba(255,255,255,0.38)" mt={3}>
        Updated 2 mins ago
      </Text>
    </Box>
  );
}
