"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { Download, FileBadge, FileSearch, ListTodo } from "lucide-react";
import { useAccountServicesActivity } from "@/components/account-services/AccountServicesContext";
import type { AccountActivityType } from "@/data/accountServicesTypes";
import { dashRadius } from "@/components/dashboard/dashboardTokens";
import { useFabTokens } from "@/components/theme/FabTokensContext";

function activityIcon(type: AccountActivityType) {
  const common = { size: 16, strokeWidth: 2, "aria-hidden": true as const };
  switch (type) {
    case "statement_downloaded":
      return <Download {...common} />;
    case "service_request":
    case "certificate_requested":
      return <FileBadge {...common} />;
    case "details_viewed":
      return <FileSearch {...common} />;
    case "signatory_update":
      return <ListTodo {...common} />;
    default:
      return <ListTodo {...common} />;
  }
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 48) return `${hrs}h ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function RecentActivityWidget() {
  const { dashShadow } = useFabTokens();
  const activity = useAccountServicesActivity();
  const rows = activity.slice(0, 4);

  return (
    <Box
      borderRadius={dashRadius.panel}
      borderWidth="1px"
      borderColor="rgba(255,255,255,0.1)"
      bg="rgba(255,255,255,0.05)"
      backdropFilter="blur(20px)"
      sx={{
        WebkitBackdropFilter: "blur(20px)",
        backgroundImage:
          "linear-gradient(165deg, rgba(10, 16, 40, 0.88) 0%, rgba(6, 10, 28, 0.9) 100%)",
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
        Recent activity
      </Text>
      <Flex direction="column" gap={0}>
        {rows.map((row, i) => (
          <Flex
            key={row.id}
            align="flex-start"
            gap={3}
            py={3}
            borderBottomWidth={i < rows.length - 1 ? "1px" : undefined}
            borderColor="rgba(255,255,255,0.06)"
          >
            <Box
              mt={0.5}
              w="30px"
              h="30px"
              borderRadius="8px"
              bg="rgba(0, 98, 255, 0.16)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="#93c5fd"
              flexShrink={0}
            >
              {activityIcon(row.type)}
            </Box>
            <Box minW={0} flex={1}>
              <Text fontFamily="var(--font-graphik)" fontSize="13px" fontWeight={500} color="rgba(255,255,255,0.88)">
                {row.label}
              </Text>
              <Text fontFamily="var(--font-graphik)" fontSize="11px" color="rgba(255,255,255,0.42)" mt={0.5}>
                {formatTime(row.timestamp)}
              </Text>
            </Box>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}
