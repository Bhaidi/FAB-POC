"use client";

import {
  Box,
  Flex,
  Grid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import type { StubAccountRecord, StubDepositRecord, StubLoanRecord } from "@/data/accountServicesTypes";
import { buildPortfolioColumns } from "@/components/account-services/portfolioTableColumns";
import { buildPortfolioRows } from "@/components/account-services/portfolioTableRows";
import { portfolioTableThemeForMode } from "@/components/account-services/portfolioTableTheme";
import { LIGHT_INK_PRIMARY, LIGHT_SURFACE } from "@/lib/fabTheme/lightModePrimitives";
import { getStubPortfolioSummary } from "@/lib/accountServicesService";
import { useFabTokens } from "@/components/theme/FabTokensContext";

/** Matches dashboard `PlatformCard` bank-home tiles */
const DASH_CARD_TITLE = "#010591";
const DASH_CARD_LABEL = "rgba(1, 5, 145, 0.55)";

export type PortfolioFilter = "all" | "accounts" | "deposits" | "loans";

type ColumnMeta = {
  width?: string;
  isNumeric?: boolean;
  isChevron?: boolean;
};

function FilterTab({
  id,
  label,
  count,
  isActive,
  onSelect,
}: {
  id: PortfolioFilter;
  label: string;
  count: number;
  isActive: boolean;
  onSelect: (id: PortfolioFilter) => void;
}) {
  const { colorMode } = useColorMode();
  const { corpTable } = useFabTokens();
  const isDark = colorMode === "dark";
  const activeBorder = isDark ? "rgba(255,255,255,0.14)" : "rgba(0, 98, 255, 0.22)";
  return (
    <Box
      as="button"
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => onSelect(id)}
      px={4}
      py={2}
      borderRadius="10px"
      fontFamily="var(--font-graphik)"
      fontSize="13px"
      fontWeight={isActive ? 600 : 500}
      color={isActive ? corpTable.bodyPrimary : corpTable.tabInactive}
      bg={isActive ? corpTable.tabActiveBg : "transparent"}
      borderWidth="1px"
      borderColor={isActive ? activeBorder : "transparent"}
      transition="background 0.15s ease, color 0.15s ease, border-color 0.15s ease"
      _hover={{
        color: corpTable.bodyPrimary,
        bg: isActive ? corpTable.chromeButtonHoverStrong : corpTable.chromeButtonHoverMuted,
      }}
    >
      {label}
      <Text as="span" ml={1.5} fontWeight={500} color={corpTable.chromeTextMuted}>
        {count}
      </Text>
    </Box>
  );
}

type PortfolioUnifiedTableProps = {
  accounts: StubAccountRecord[];
  deposits: StubDepositRecord[];
  loans: StubLoanRecord[];
};

export function PortfolioUnifiedTable({ accounts, deposits, loans }: PortfolioUnifiedTableProps) {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const tableTheme = portfolioTableThemeForMode(colorMode);
  const summary = getStubPortfolioSummary();
  const [filter, setFilter] = useState<PortfolioFilter>("all");
  const showProgressCol = useBreakpointValue({ base: false, lg: true }) === true;

  const columns = useMemo(() => buildPortfolioColumns(tableTheme), [tableTheme]);

  const allRows = useMemo(
    () => buildPortfolioRows(accounts, deposits, loans),
    [accounts, deposits, loans],
  );

  const filteredRows = useMemo(() => {
    if (filter === "all") return allRows;
    return allRows.filter((r) => r.kind === filter);
  }, [allRows, filter]);

  const counts = useMemo(
    () => ({
      all: allRows.length,
      accounts: accounts.length,
      deposits: deposits.length,
      loans: loans.length,
    }),
    [allRows.length, accounts.length, deposits.length, loans.length],
  );

  const onRowNavigate = useCallback(
    (href: string) => {
      router.push(href);
    },
    [router],
  );

  const table = useReactTable({
    data: filteredRows,
    columns,
    state: {
      columnVisibility: {
        progress: showProgressCol,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.key,
  });

  const headerCellSx = {
    px: 4,
    py: 3,
    borderBottomWidth: "1px",
    borderColor: tableTheme.headerRule,
    fontFamily: "var(--font-graphik)",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: tableTheme.headerText,
  };

  const isDarkSummary = colorMode === "dark";

  return (
    <Box>
      <Box
        mb={6}
        p={{ base: 4, md: 5 }}
        borderRadius="12px"
        bg={isDarkSummary ? "rgba(0,0,0,0.18)" : LIGHT_SURFACE.subtle}
        borderWidth="1px"
        borderColor={isDarkSummary ? "rgba(255,255,255,0.06)" : "rgba(1, 5, 145, 0.1)"}
      >
        <Text
          fontFamily="var(--font-graphik)"
          fontSize="11px"
          fontWeight={700}
          letterSpacing="0.16em"
          textTransform="uppercase"
          color={isDarkSummary ? "rgba(255,255,255,0.42)" : "rgba(1, 5, 145, 0.48)"}
          mb={3}
        >
          Portfolio summary
        </Text>
        <Text
          fontFamily="var(--font-graphik)"
          fontSize={{ base: "26px", md: "32px" }}
          fontWeight={400}
          letterSpacing="-0.03em"
          color={isDarkSummary ? "white" : LIGHT_INK_PRIMARY}
          lineHeight={1.1}
          mb={2}
        >
          {summary.totalDisplay}
        </Text>
        <Text
          fontFamily="var(--font-graphik)"
          fontSize="13px"
          color={isDarkSummary ? "rgba(255,255,255,0.48)" : "rgba(58, 69, 86, 0.72)"}
          mb={5}
        >
          Equivalent balance · {summary.currencyCount} currencies · {summary.countryCount} markets
        </Text>
        <Grid templateColumns={{ base: "1fr", sm: "repeat(3, minmax(0, 1fr))" }} gap={3}>
          {[
            { label: "Accounts", value: String(counts.accounts) },
            { label: "Deposits", value: String(counts.deposits) },
            { label: "Loans", value: String(counts.loans) },
          ].map((s) => (
            <Box
              key={s.label}
              px={{ base: 4, md: 5 }}
              py={{ base: 4, md: 5 }}
              borderRadius="16px"
              bg={isDarkSummary ? "rgba(255, 255, 255, 0.92)" : LIGHT_SURFACE.elevated}
              backdropFilter={isDarkSummary ? "blur(12px)" : undefined}
              borderWidth="1px"
              borderColor={isDarkSummary ? "rgba(255, 255, 255, 0.08)" : "rgba(1, 5, 145, 0.1)"}
              boxShadow={
                isDarkSummary ? "0 1px 2px rgba(0, 6, 80, 0.06)" : "0 1px 3px rgba(1, 5, 145, 0.06)"
              }
              sx={isDarkSummary ? { WebkitBackdropFilter: "blur(12px)" } : undefined}
              transition="box-shadow 0.2s ease, transform 0.2s ease"
              _hover={{
                boxShadow: isDarkSummary
                  ? "0 4px 20px rgba(0, 6, 80, 0.08)"
                  : "0 4px 18px rgba(1, 5, 145, 0.08)",
              }}
            >
              <Text
                fontFamily="var(--font-graphik)"
                fontSize="11px"
                fontWeight={600}
                letterSpacing="0.12em"
                textTransform="uppercase"
                color={DASH_CARD_LABEL}
                mb={2}
              >
                {s.label}
              </Text>
              <Text
                fontFamily="var(--font-graphik)"
                fontSize={{ base: "28px", md: "32px" }}
                fontWeight={500}
                letterSpacing="-0.03em"
                lineHeight={1.05}
                color={DASH_CARD_TITLE}
                sx={{ fontVariantNumeric: "tabular-nums" }}
              >
                {s.value}
              </Text>
            </Box>
          ))}
        </Grid>
      </Box>

      <Flex role="tablist" aria-label="Portfolio type" flexWrap="wrap" gap={2} mb={4}>
        <FilterTab
          id="all"
          label="All"
          count={counts.all}
          isActive={filter === "all"}
          onSelect={setFilter}
        />
        <FilterTab
          id="accounts"
          label="Accounts"
          count={counts.accounts}
          isActive={filter === "accounts"}
          onSelect={setFilter}
        />
        <FilterTab
          id="deposits"
          label="Deposits"
          count={counts.deposits}
          isActive={filter === "deposits"}
          onSelect={setFilter}
        />
        <FilterTab
          id="loans"
          label="Loans"
          count={counts.loans}
          isActive={filter === "loans"}
          onSelect={setFilter}
        />
      </Flex>

      <TableContainer
        borderRadius="12px"
        bg={tableTheme.surface}
        borderWidth="1px"
        borderColor={tableTheme.surfaceBorder}
        boxShadow={
          colorMode === "dark"
            ? "0 1px 3px rgba(0, 0, 0, 0.25)"
            : "0 1px 3px rgba(1, 5, 145, 0.06)"
        }
        overflowX="auto"
      >
        <Table variant="unstyled" size="md" sx={{ tableLayout: "fixed" }}>
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id} bg={tableTheme.headerBg}>
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta as ColumnMeta | undefined;
                  return (
                    <Th
                      key={header.id}
                      w={meta?.width}
                      isNumeric={meta?.isNumeric}
                      {...headerCellSx}
                      px={meta?.isChevron ? 3 : 4}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr
                key={row.id}
                role="button"
                tabIndex={0}
                cursor="pointer"
                onClick={() => onRowNavigate(row.original.href)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onRowNavigate(row.original.href);
                  }
                }}
                _hover={{ bg: tableTheme.rowHover }}
                _focusVisible={{
                  outline: "2px solid",
                  outlineColor:
                    colorMode === "dark" ? "rgba(15, 98, 254, 0.55)" : "rgba(0, 98, 255, 0.45)",
                  outlineOffset: "-2px",
                }}
                sx={{ transition: "background 0.15s ease" }}
              >
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta as ColumnMeta | undefined;
                  return (
                    <Td
                      key={cell.id}
                      isNumeric={meta?.isNumeric}
                      px={meta?.isChevron ? 3 : 4}
                      py={3}
                      verticalAlign="middle"
                      borderBottomWidth="1px"
                      borderColor={tableTheme.rowRule}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Td>
                  );
                })}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
