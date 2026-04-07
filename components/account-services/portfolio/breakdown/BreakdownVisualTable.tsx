"use client";

import {
  Box,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { breakdownCountryLabelToFlagEmoji } from "@/components/account-services/portfolio/breakdown/breakdownCountryFlag";
import { DistributionBarCell } from "@/components/account-services/portfolio/breakdown/DistributionBarCell";
import { currencyCodeToFlagEmoji } from "@/components/account-services/portfolio/cells/currencyRegionCode";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import type { TreasuryDistributionRow } from "@/data/treasurySummaryTypes";

const ROW_MIN_H = "42px";

const columnHelper = createColumnHelper<TreasuryDistributionRow>();

function formatTooltipBody(row: TreasuryDistributionRow): string {
  const p = Number.isFinite(row.percent) ? Math.round(row.percent * 10) / 10 : row.percent;
  return `${row.name}\n${row.amountLabel}\n${p}% of total`;
}

const tooltipProps = {
  placement: "top" as const,
  openDelay: 180,
  hasArrow: true,
  bg: "rgba(14, 18, 32, 0.94)",
  color: "rgba(255,255,255,0.92)",
  fontSize: "12px",
  px: 3,
  py: 2,
  borderWidth: "1px",
  borderColor: "rgba(255,255,255,0.12)",
  whiteSpace: "pre-line" as const,
};

export function BreakdownVisualTable({
  rows,
  dimensionLabel,
  dimensionId,
  hoveredRowName,
  onHoverRow,
  onRowClick,
}: {
  rows: TreasuryDistributionRow[];
  dimensionLabel: string;
  /** Distribution slice id — `country` / `currency` show leading flags */
  dimensionId: string;
  hoveredRowName: string | null;
  onHoverRow: (name: string | null) => void;
  onRowClick: (row: TreasuryDistributionRow) => void;
}) {
  const { corpTable } = useFabTokens();
  const [sorting, setSorting] = useState<SortingState>([{ id: "amountValue", desc: true }]);

  const headerSx = useMemo(
    () =>
      ({
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase" as const,
        color: corpTable.headerLabel,
        fontFamily: "var(--font-graphik)",
        cursor: "pointer",
        userSelect: "none" as const,
      }) as const,
    [corpTable],
  );

  const leadingByAmountName = useMemo(() => {
    if (rows.length === 0) return null as string | null;
    const sorted = [...rows].sort((a, b) => (b.amountValue ?? 0) - (a.amountValue ?? 0));
    return sorted[0]?.name ?? null;
  }, [rows]);

  const nameCellFlag = useCallback(
    (name: string) => {
      if (dimensionId === "currency") return currencyCodeToFlagEmoji(name);
      if (dimensionId === "country") return breakdownCountryLabelToFlagEmoji(name);
      return null;
    },
    [dimensionId],
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        id: "name",
        header: dimensionLabel,
        enableSorting: true,
        cell: (ctx) => {
          const name = ctx.getValue();
          const flag = nameCellFlag(name);
          if (flag == null) {
            return (
              <Text
                fontSize="14px"
                fontWeight={500}
                color={corpTable.bodyPrimary}
                fontFamily="var(--font-graphik)"
                noOfLines={1}
                title={name}
              >
                {name}
              </Text>
            );
          }
          return (
            <Flex align="center" gap={2} minW={0}>
              <Text as="span" fontSize="15px" lineHeight={1} aria-hidden flexShrink={0}>
                {flag}
              </Text>
              <Text
                fontSize="14px"
                fontWeight={500}
                color={corpTable.bodyPrimary}
                fontFamily="var(--font-graphik)"
                noOfLines={1}
                minW={0}
                title={name}
              >
                {name}
              </Text>
            </Flex>
          );
        },
      }),
      columnHelper.accessor("percent", {
        id: "percent",
        header: "%",
        enableSorting: true,
        sortingFn: (a, b) => a.original.percent - b.original.percent,
        cell: (ctx) => {
          const v = ctx.getValue();
          const t = Number.isInteger(v) ? `${v}%` : `${Math.round(v * 10) / 10}%`;
          return (
            <Text
              fontSize="13px"
              fontWeight={500}
              color={corpTable.bodyMuted}
              fontFamily="var(--font-graphik)"
              textAlign="right"
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              {t}
            </Text>
          );
        },
      }),
      columnHelper.accessor((r) => r.amountValue ?? 0, {
        id: "amountValue",
        header: "Amount",
        enableSorting: true,
        cell: (ctx) => (
          <Text
            fontSize="13px"
            fontWeight={500}
            color={corpTable.bodyPrimary}
            fontFamily="var(--font-graphik)"
            textAlign="right"
            sx={{ fontVariantNumeric: "tabular-nums" }}
          >
            {ctx.row.original.amountLabel}
          </Text>
        ),
      }),
      columnHelper.display({
        id: "distribution",
        header: "Distribution",
        enableSorting: false,
        cell: (ctx) => (
          <Flex justify="flex-end" align="center" w="full">
            <DistributionBarCell
              widthPercent={ctx.row.original.percent}
              isFirstRow={ctx.row.original.name === leadingByAmountName}
              isHovered={hoveredRowName === ctx.row.original.name}
            />
          </Flex>
        ),
      }),
    ],
    [corpTable, dimensionLabel, hoveredRowName, leadingByAmountName, nameCellFlag],
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (r) => r.name,
  });

  return (
    <TableContainer w="full" overflowX="visible">
      <Table variant="unstyled" size="sm" sx={{ borderCollapse: "separate", borderSpacing: 0 }}>
        <Thead>
          {table.getHeaderGroups().map((hg) => (
            <Tr key={hg.id}>
              {hg.headers.map((header) => {
                const sorted = header.column.getIsSorted();
                return (
                  <Th
                    key={header.id}
                    px={2}
                    py={2}
                    borderBottomWidth="1px"
                    borderBottomColor={corpTable.tableHeaderRule}
                    textAlign={header.column.id === "name" ? "left" : "right"}
                    w={header.column.id === "distribution" ? "140px" : undefined}
                    {...headerSx}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <Flex
                      align="center"
                      justify={header.column.id === "name" ? "flex-start" : "flex-end"}
                      gap={1}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() ? (
                        sorted === "asc" ? (
                          <ArrowUp size={12} strokeWidth={2} opacity={0.7} />
                        ) : sorted === "desc" ? (
                          <ArrowDown size={12} strokeWidth={2} opacity={0.7} />
                        ) : (
                          <ArrowUpDown size={12} strokeWidth={2} opacity={0.45} />
                        )
                      ) : null}
                    </Flex>
                  </Th>
                );
              })}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => {
            const r = row.original;
            const tip = formatTooltipBody(r);
            return (
              <Tr
                key={row.id}
                cursor="pointer"
                onMouseEnter={() => onHoverRow(r.name)}
                onMouseLeave={() => onHoverRow(null)}
                onClick={() => onRowClick(r)}
                sx={{
                  transition: "background 0.15s ease",
                  _hover: { bg: corpTable.rowHover },
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <Td
                    key={cell.id}
                    px={2}
                    py={0}
                    minH={ROW_MIN_H}
                    verticalAlign="middle"
                    borderBottomWidth="1px"
                    borderBottomColor={corpTable.tableRowRule}
                    textAlign={cell.column.id === "name" ? "left" : "right"}
                  >
                    <Tooltip label={tip} {...tooltipProps}>
                      <Box py={2} w="full">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Box>
                    </Tooltip>
                  </Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
