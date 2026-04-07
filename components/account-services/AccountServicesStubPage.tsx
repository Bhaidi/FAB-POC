"use client";

import Link from "next/link";
import { Box, Button, Text } from "@chakra-ui/react";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import { ACCOUNT_SERVICES_BASE_PATH } from "@/lib/accountServicesRoutes";

export function AccountServicesStubPage({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const { dashColors } = useFabTokens();
  return (
    <Box w="full" px={{ base: 0, md: 0 }} py={{ base: 8, md: 10 }}>
      <Text
        fontFamily="var(--font-graphik)"
        fontSize="11px"
        fontWeight={700}
        letterSpacing="0.16em"
        textTransform="uppercase"
        color={dashColors.pageEyebrow}
        mb={3}
      >
        Account services
      </Text>
      <Text
        as="h1"
        fontFamily="var(--font-graphik)"
        fontSize={{ base: "26px", md: "32px" }}
        fontWeight={400}
        color={dashColors.pageTitle}
        mb={3}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text fontFamily="var(--font-graphik)" fontSize="15px" color={dashColors.pageSubtitle} lineHeight={1.55} mb={8}>
          {subtitle}
        </Text>
      ) : (
        <Text fontFamily="var(--font-graphik)" fontSize="15px" color={dashColors.pageSubtitle} lineHeight={1.55} mb={8}>
          This area is a stub for the next implementation phase. Navigation and layout use the live FAB Access shell.
        </Text>
      )}
      <Button
        as={Link}
        href={ACCOUNT_SERVICES_BASE_PATH}
        variant="ghost"
        color={dashColors.pageTitle}
        _hover={{ bg: "rgba(1, 5, 145, 0.06)" }}
        fontFamily="var(--font-graphik)"
      >
        Back to Account Services
      </Button>
    </Box>
  );
}
