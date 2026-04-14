"use client";

import { Box, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { motion, useReducedMotion } from "framer-motion";
import { dashRadius } from "@/components/dashboard/dashboardTokens";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import { getStubPortfolioSummary } from "@/lib/accountServicesService";

const BAR_DURATION = 0.65;

export function AccountFinancialSummary() {
  const { corpTable, financialOverviewShell } = useFabTokens();
  const portfolio = getStubPortfolioSummary();
  const rm = useReducedMotion() === true;
  const supporting = `Across ${portfolio.accountCount} accounts · ${portfolio.currencyCount} currencies · ${portfolio.countryCount} countries`;

  return (
    <Box
      borderRadius="16px"
      sx={{
        ...financialOverviewShell,
        boxShadow: financialOverviewShell.boxShadow,
      }}
      px={{ base: 5, md: 6 }}
      py={{ base: 5, md: 6 }}
    >
      <Grid templateColumns={{ base: "1fr", md: "1.2fr 1fr" }} gap={{ base: 6, md: "24px" }} alignItems="start">
        <GridItem minW={0}>
          <Text
            fontFamily="var(--font-graphik)"
            fontSize="11px"
            fontWeight={600}
            letterSpacing="0.16em"
            textTransform="uppercase"
            color={corpTable.headerLabel}
            mb={3}
          >
            Total balance
          </Text>
          <Text
            as="div"
            fontFamily="var(--font-graphik)"
            fontSize={{ base: "32px", md: "38px", lg: "42px" }}
            fontWeight={500}
            letterSpacing="-0.04em"
            lineHeight={1.05}
            color={corpTable.columnHeadingTextHover}
            mb={4}
          >
            {portfolio.totalDisplay}
          </Text>
          <Text fontFamily="var(--font-graphik)" fontSize="14px" lineHeight={1.45} color={corpTable.bodyPrimary}>
            {supporting}
          </Text>
        </GridItem>
        <GridItem minW={0} w="full">
          <Text
            fontFamily="var(--font-graphik)"
            fontSize="10px"
            fontWeight={600}
            letterSpacing="0.12em"
            textTransform="uppercase"
            color={corpTable.headerLabel}
            mb={4}
          >
            Currency mix (top 4)
          </Text>
          <Box display="flex" flexDirection="column" gap={3.5} w="full">
            {portfolio.topCurrencies.map((row, index) => {
              const fillGradient =
                index === 0
                  ? "linear-gradient(90deg, #3D7AFF 0%, #62A6FF 55%, #7EB8FF 100%)"
                  : "linear-gradient(90deg, rgba(61,122,255,0.82) 0%, rgba(98,166,255,0.68) 100%)";
              return (
                <Box key={row.code} w="full">
                  <Flex align="baseline" justify="space-between" gap={3} mb="6px">
                    <Text
                      fontFamily="var(--font-graphik)"
                      fontSize="12px"
                      fontWeight={600}
                      letterSpacing="0.08em"
                      textTransform="uppercase"
                      color={corpTable.chromeTextMuted}
                    >
                      {row.code}
                    </Text>
                    <Text
                      fontFamily="var(--font-graphik)"
                      fontSize="12px"
                      fontWeight={500}
                      color={corpTable.bodyPrimary}
                    >
                      {row.displayShare}
                    </Text>
                  </Flex>
                  <Box h="4px" borderRadius="full" bg="rgba(1, 5, 145, 0.08)" overflow="hidden">
                    <motion.div
                      initial={rm ? { width: `${row.pct}%` } : { width: "0%" }}
                      animate={{ width: `${row.pct}%` }}
                      transition={
                        rm
                          ? { duration: 0 }
                          : { duration: BAR_DURATION, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }
                      }
                      style={{
                        height: 4,
                        borderRadius: 9999,
                        background: fillGradient,
                        minWidth: row.pct > 0 ? 2 : 0,
                      }}
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
}
