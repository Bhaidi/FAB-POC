"use client";

import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import type { FabTokens } from "@/lib/fabTheme/buildFabTokens";
import type { DashboardWidget } from "@/types/platformDashboard";
import { useFabTokens } from "@/components/theme/FabTokensContext";

function num(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function formatShort(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(d);
}

function rowStyles(compact: boolean, dashColors: FabTokens["dashColors"]) {
  return {
    rowText: {
      fontFamily: "var(--font-graphik)",
      fontSize: compact ? "11px" : "13px",
      color: dashColors.text.secondary,
    } as const,
    valueText: {
      fontFamily: "var(--font-graphik)",
      fontSize: compact ? "13px" : "15px",
      fontWeight: 600,
      color: dashColors.text.primary,
    } as const,
  };
}

function StatRow({
  label,
  value,
  compact,
  dashColors,
}: {
  label: string;
  value: string | number;
  compact?: boolean;
  dashColors: FabTokens["dashColors"];
}) {
  const { rowText, valueText } = rowStyles(!!compact, dashColors);
  return (
    <Flex justify="space-between" align="baseline" gap={compact ? 2 : 3} py={compact ? 0.5 : 1}>
      <Text {...rowText} noOfLines={1}>
        {label}
      </Text>
      <Text {...valueText} flexShrink={0}>
        {value}
      </Text>
    </Flex>
  );
}

/**
 * Renders `widget.data` by API `kind` — no persona branching.
 */
export function DashboardWidgetBody({ widget, compact = false }: { widget: DashboardWidget; compact?: boolean }) {
  const { dashColors } = useFabTokens();
  const { kind, data } = widget;
  const { rowText, valueText } = rowStyles(compact, dashColors);

  switch (kind) {
    case "maker_submitted_items":
      return (
        <VStack align="stretch" spacing={0} pt={compact ? 0 : 1}>
          <StatRow dashColors={dashColors} compact={compact} label="Awaiting approval" value={num(data.awaitingApproval)} />
          <StatRow dashColors={dashColors} compact={compact} label="Rejected" value={num(data.rejected)} />
          <StatRow dashColors={dashColors} compact={compact} label="Processed" value={num(data.processed)} />
        </VStack>
      );

    case "maker_needs_attention":
      return (
        <VStack align="stretch" spacing={0} pt={compact ? 0 : 1}>
          <StatRow dashColors={dashColors} compact={compact} label="Rejected items" value={num(data.rejectedItems)} />
          <StatRow dashColors={dashColors} compact={compact} label="Failed transactions" value={num(data.failedTransactions)} />
        </VStack>
      );

    case "maker_recent_activity": {
      const raw = data.transactions;
      const list = Array.isArray(raw) ? raw : [];
      const cap = compact ? 2 : 4;
      return (
        <VStack align="stretch" spacing={compact ? 1 : 2} pt={compact ? 0 : 1}>
          {list.slice(0, cap).map((item, idx) => {
            const t = item as Record<string, unknown>;
            return (
              <Box key={str(t.id) || `tx-${idx}`} borderBottomWidth="1px" borderColor="rgba(255,255,255,0.06)" pb={compact ? 1 : 2} _last={{ border: "none", pb: 0 }}>
                <Text {...valueText} fontSize={compact ? "11px" : "13px"} fontWeight={600} noOfLines={1}>
                  {str(t.id)} · {str(t.type)}
                </Text>
                <Flex justify="space-between" gap={2} mt={0.5}>
                  <Text {...rowText} fontSize={compact ? "10px" : "12px"} noOfLines={1}>
                    {str(t.status)}
                  </Text>
                  <Text {...rowText} fontSize={compact ? "10px" : "12px"} flexShrink={0}>
                    {formatShort(str(t.createdAt))}
                  </Text>
                </Flex>
              </Box>
            );
          })}
        </VStack>
      );
    }

    case "maker_drafts": {
      const last = str(data.lastEdited);
      return (
        <VStack align="stretch" spacing={1} pt={compact ? 0 : 1}>
          <StatRow dashColors={dashColors} compact={compact} label="Saved drafts" value={num(data.count)} />
          {last ? (
            <Text {...rowText} fontSize={compact ? "10px" : "12px"} noOfLines={2}>
              Last edited {formatShort(last)}
            </Text>
          ) : null}
        </VStack>
      );
    }

    case "checker_pending_approvals": {
      const breakdown = Array.isArray(data.breakdown) ? data.breakdown : [];
      return (
        <VStack align="stretch" spacing={compact ? 1 : 2} pt={compact ? 0 : 1}>
          <Text
            fontFamily="var(--font-graphik)"
            fontSize={compact ? "22px" : "28px"}
            fontWeight={500}
            color={dashColors.text.primary}
            lineHeight={1.1}
          >
            {num(data.total)}
          </Text>
          <Text {...rowText} fontSize={compact ? "10px" : "12px"}>
            In queue
          </Text>
          <VStack align="stretch" spacing={0}>
            {breakdown.slice(0, compact ? 3 : breakdown.length).map((b) => {
              const row = b as Record<string, unknown>;
              return (
                <StatRow
                  key={str(row.label)}
                  dashColors={dashColors}
                  compact={compact}
                  label={str(row.label)}
                  value={num(row.count)}
                />
              );
            })}
          </VStack>
        </VStack>
      );
    }

    case "checker_high_value_queue": {
      const items = Array.isArray(data.items) ? data.items : [];
      return (
        <VStack align="stretch" spacing={compact ? 1 : 2} pt={compact ? 0 : 1}>
          {items.slice(0, compact ? 2 : items.length).map((item) => {
            const t = item as Record<string, unknown>;
            return (
              <Box key={str(t.id)} py={compact ? 0.5 : 1} borderBottomWidth="1px" borderColor="rgba(255,255,255,0.06)" _last={{ border: "none" }}>
                <Text {...valueText} fontSize={compact ? "11px" : "13px"} fontWeight={600} noOfLines={2}>
                  {str(t.label)}
                </Text>
                <Text {...rowText} fontSize={compact ? "10px" : "12px"} mt={0.5} noOfLines={1}>
                  {str(t.amount)} {str(t.currency)} · {str(t.id)}
                </Text>
              </Box>
            );
          })}
        </VStack>
      );
    }

    case "checker_aging_approvals":
      return (
        <VStack align="stretch" spacing={compact ? 1 : 2} pt={compact ? 0 : 1}>
          <StatRow dashColors={dashColors} compact={compact} label="Pending over 24h" value={num(data.countOver24h)} />
          <Box>
            <Text {...rowText} fontSize={compact ? "10px" : "12px"} mb={0.5}>
              Oldest
            </Text>
            <Text {...valueText} fontSize={compact ? "11px" : "13px"} noOfLines={2}>
              {str(data.oldestPendingLabel)}
            </Text>
            <Text {...rowText} fontSize={compact ? "10px" : "12px"} mt={1}>
              {num(data.oldestPendingHours)} hours in queue
            </Text>
          </Box>
        </VStack>
      );

    case "checker_alerts_exceptions": {
      const items = Array.isArray(data.items) ? data.items : [];
      return (
        <VStack align="stretch" spacing={compact ? 1 : 2} pt={compact ? 0 : 1}>
          {items.slice(0, compact ? 2 : items.length).map((item) => {
            const t = item as Record<string, unknown>;
            const sev = str(t.severity).toLowerCase();
            const tone =
              sev === "high" ? "rgba(248, 113, 113, 0.95)" : sev === "medium" ? "rgba(251, 191, 36, 0.95)" : "rgba(148, 163, 184, 0.9)";
            return (
              <Flex key={str(t.id)} align="flex-start" gap={compact ? 1.5 : 2}>
                <Box w="6px" h="6px" borderRadius="full" bg={tone} mt={1.5} flexShrink={0} aria-hidden />
                <Box minW={0}>
                  <Text {...valueText} fontSize={compact ? "11px" : "13px"} fontWeight={600} noOfLines={2}>
                    {str(t.label)}
                  </Text>
                  <Text {...rowText} fontSize={compact ? "9px" : "11px"} mt={0.5} textTransform="uppercase" letterSpacing="0.08em" noOfLines={1}>
                    {str(t.severity)} · {str(t.id)}
                  </Text>
                </Box>
              </Flex>
            );
          })}
        </VStack>
      );
    }

    default:
      return (
        <Text {...rowText} fontSize={compact ? "10px" : "12px"} pt={compact ? 0 : 1}>
          No preview for this widget type.
        </Text>
      );
  }
}
