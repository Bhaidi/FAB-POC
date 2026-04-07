"use client";

import { Box, Checkbox, Text, type TextProps } from "@chakra-ui/react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import type { MouseEvent, ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { AccountTypeCell } from "@/components/account-services/portfolio/cells/AccountTypeCell";
import { CountryCell } from "@/components/account-services/portfolio/cells/CountryCell";
import { CurrencyCell } from "@/components/account-services/portfolio/cells/CurrencyCell";
import { NumericCell } from "@/components/account-services/portfolio/cells/NumericCell";
import { TruncatedTextCell } from "@/components/account-services/portfolio/cells/TruncatedTextCell";
import { useCorpTableTheme } from "@/components/account-services/portfolio/CorpTableThemeContext";
import { PortfolioColumnHeader } from "@/components/account-services/portfolio/PortfolioColumnHeader";
import type { CorporateBankingGridRow } from "@/data/corporateBankingGridTypes";
import type { PortfolioModuleTab } from "@/data/portfolioSummaryTypes";
import { formatCorporateCurrencyCompact, formatPercentValue } from "@/lib/formatCorporateFinancial";
import type { CorporateGridColMeta } from "./corporateGridColumnMeta";

const helper = createColumnHelper<CorporateBankingGridRow>();

function GridCellText({ color, ...props }: TextProps) {
  const t = useCorpTableTheme();
  return (
    <Text fontFamily="var(--font-graphik)" fontSize="14px" color={color ?? t.bodyPrimary} {...props} />
  );
}

function GridCellMuted(props: TextProps) {
  const t = useCorpTableTheme();
  return <Text fontFamily="var(--font-graphik)" fontSize="14px" color={t.bodyMuted} {...props} />;
}

function RiskFlagCell({ v, bold }: { v: string; bold?: boolean }) {
  const t = useCorpTableTheme();
  const color =
    v === "High" || v === "Negative"
      ? "rgba(255, 120, 120, 0.95)"
      : v === "Medium"
        ? "rgba(255, 200, 120, 0.95)"
        : t.bodyPrimary;
  return (
    <GridCellText fontWeight={bold ? 600 : undefined} color={color}>
      {v}
    </GridCellText>
  );
}

function Pill({ children, tone }: { children: ReactNode; tone?: "warn" | "danger" | "neutral" }) {
  const t = useCorpTableTheme();
  const bg =
    tone === "danger"
      ? "rgba(220, 60, 60, 0.25)"
      : tone === "warn"
        ? "rgba(255, 180, 60, 0.22)"
        : t.pillBg;
  return (
    <Text
      as="span"
      display="inline-block"
      fontFamily="var(--font-graphik)"
      fontSize="11px"
      fontWeight={600}
      px={2}
      py={0.5}
      borderRadius="md"
      bg={bg}
      color={t.bodyPrimary}
    >
      {children}
    </Text>
  );
}

function selectColumn() {
  return helper.display({
    id: "select",
    size: 44,
    minSize: 44,
    maxSize: 52,
    enableSorting: false,
    enableColumnFilter: false,
    enableHiding: false,
    enableGrouping: false,
    enableResizing: false,
    meta: { label: "Select", minW: "44px" } satisfies CorporateGridColMeta,
    header: ({ table }) => (
      <Checkbox
        isChecked={table.getIsAllPageRowsSelected()}
        isIndeterminate={table.getIsSomePageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
        onClick={(e) => e.stopPropagation()}
        size="sm"
        colorScheme="blue"
        sx={{ "& .chakra-checkbox__control": { borderColor: "rgba(255,255,255,0.22)" } }}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        data-row-select
        isChecked={row.getIsSelected()}
        isDisabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
        onClick={(e) => e.stopPropagation()}
        size="sm"
        colorScheme="blue"
        sx={{ "& .chakra-checkbox__control": { borderColor: "rgba(255,255,255,0.22)" } }}
      />
    ),
  });
}

function expandColumn() {
  return helper.display({
    id: "expand",
    size: 36,
    minSize: 36,
    maxSize: 44,
    enableSorting: false,
    enableColumnFilter: false,
    enableHiding: false,
    enableGrouping: false,
    enableResizing: false,
    meta: { label: "Expand", minW: "36px" } satisfies CorporateGridColMeta,
    header: () => null,
    cell: ({ row }) => {
      if (row.getIsGrouped()) return null;
      return (
        <Box
          as="button"
          type="button"
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="28px"
          h="28px"
          borderRadius="md"
          bg="rgba(255,255,255,0.06)"
          color="rgba(255,255,255,0.85)"
          aria-label={row.getIsExpanded() ? "Collapse row" : "Expand row"}
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            row.toggleExpanded();
          }}
        >
          {row.getIsExpanded() ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </Box>
      );
    },
  });
}

export function buildCorporateGridColumns(view: PortfolioModuleTab) {
  if (view === "portfolio") return buildPortfolioColumns();
  if (view === "accounts") return buildAccountsColumns();
  if (view === "deposits") return buildDepositsColumns();
  return buildLoansColumns();
}

function buildPortfolioColumns() {
  return [
    selectColumn(),
    expandColumn(),
    helper.group({
      id: "grp_entity",
      header: "ENTITY",
      columns: [
        helper.accessor("entity", {
          id: "entity",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Entity" />,
          cell: (info) => (
            <GridCellText noOfLines={2} minW={0}>
              {info.getValue() ?? "—"}
            </GridCellText>
          ),
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Entity", minW: "160px", groupKey: "ENTITY" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("customerId", {
          id: "customerId",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Customer ID" />,
          cell: (info) => (
            <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
              {info.getValue() ?? "—"}
            </GridCellText>
          ),
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Customer ID", minW: "120px", groupKey: "ENTITY" } satisfies CorporateGridColMeta,
        }),
      ],
    }),
    helper.group({
      id: "grp_account_info",
      header: "ACCOUNT INFO",
      columns: [
        helper.accessor("accountCountryName", {
          id: "country",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Country" />,
          cell: ({ row }) => <CountryCell code={row.original.accountCountryCode} name={row.original.accountCountryName} />,
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Country", minW: "200px", groupKey: "ACCOUNT_INFO" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("productTypeLabel", {
          id: "productType",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Product Type" />,
          cell: (info) => <AccountTypeCell type={info.getValue() as string | undefined} />,
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Product Type", minW: "140px", groupKey: "PRODUCT" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("facilityDisplayName", {
          id: "facilityName",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Account / Facility Name" />,
          cell: (info) => {
            const v = info.getValue() ?? info.row.original.accountName;
            return <TruncatedTextCell value={v} label={v} />;
          },
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Account / Facility Name", minW: "260px", groupKey: "ACCOUNT_INFO" } satisfies CorporateGridColMeta,
        }),
      ],
    }),
    helper.group({
      id: "grp_financials",
      header: "FINANCIALS",
      columns: [
        helper.accessor("accountCcy", {
          id: "currency",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Currency" />,
          cell: (info) => <CurrencyCell code={info.getValue()} />,
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Currency", minW: "100px", groupKey: "FINANCIALS" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("balance", {
          id: "balance",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Balance" />,
          cell: (info) => {
            const row = info.row.original;
            const v = info.getValue() ?? row.balanceAed;
            return (
              <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
                {formatCorporateCurrencyCompact(v, row.accountCcy)}
              </GridCellText>
            );
          },
          sortingFn: "basic",
          meta: { label: "Balance", minW: "128px", groupKey: "FINANCIALS" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("availableBalance", {
          id: "availableBalance",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Available Balance" />,
          cell: (info) => {
            const row = info.row.original;
            const v = info.getValue();
            if (v == null) return <GridCellText>—</GridCellText>;
            return (
              <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
                {formatCorporateCurrencyCompact(v, row.accountCcy)}
              </GridCellText>
            );
          },
          sortingFn: "basic",
          meta: { label: "Available Balance", minW: "140px", groupKey: "FINANCIALS" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("utilisedAmount", {
          id: "utilisedAmount",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Utilised Amount" />,
          cell: (info) => {
            const row = info.row.original;
            const v = info.getValue();
            if (v == null || v === 0) return <GridCellText>—</GridCellText>;
            return (
              <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
                {formatCorporateCurrencyCompact(v, row.accountCcy)}
              </GridCellText>
            );
          },
          sortingFn: "basic",
          meta: { label: "Utilised Amount", minW: "140px", groupKey: "FINANCIALS" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("exposure", {
          id: "exposure",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Exposure" />,
          cell: (info) => {
            const row = info.row.original;
            const v = info.getValue() ?? row.balanceAed;
            return (
              <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
                {formatCorporateCurrencyCompact(v, row.accountCcy)}
              </GridCellText>
            );
          },
          sortingFn: "basic",
          meta: { label: "Exposure", minW: "128px", groupKey: "FINANCIALS" } satisfies CorporateGridColMeta,
        }),
      ],
    }),
    helper.group({
      id: "grp_activity",
      header: "ACTIVITY",
      columns: [
        helper.accessor("lastActivityDate", {
          id: "lastActivityDate",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Last Activity Date" />,
          cell: (info) => (
            <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
              {info.getValue() ?? "—"}
            </GridCellText>
          ),
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Last Activity Date", minW: "132px", groupKey: "ACTIVITY" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("status", {
          id: "status",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Status" />,
          cell: (info) => <Pill>{info.getValue() ?? "—"}</Pill>,
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Status", minW: "108px", groupKey: "STATUS" } satisfies CorporateGridColMeta,
        }),
      ],
    }),
    helper.group({
      id: "grp_analytics",
      header: "ANALYTICS",
      columns: [
        helper.accessor("netPosition", {
          id: "netPosition",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Net Position" />,
          cell: (info) => {
            const row = info.row.original;
            const v = info.getValue() ?? row.balanceAed;
            return (
              <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
                {formatCorporateCurrencyCompact(v, row.accountCcy)}
              </GridCellText>
            );
          },
          sortingFn: "basic",
          meta: { label: "Net Position", minW: "128px", groupKey: "ANALYTICS" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("liquidityImpact", {
          id: "liquidityImpact",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Liquidity Impact" />,
          cell: (info) => {
            const v = info.getValue();
            if (v == null) return <GridCellText>—</GridCellText>;
            return <RiskFlagCell v={v} />;
          },
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Liquidity Impact", minW: "120px", groupKey: "ANALYTICS" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("riskFlag", {
          id: "riskFlag",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Risk Flag" />,
          cell: (info) => {
            const v = info.getValue();
            if (v == null) return <GridCellText>—</GridCellText>;
            return <RiskFlagCell v={v} bold />;
          },
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Risk Flag", minW: "100px", groupKey: "ANALYTICS" } satisfies CorporateGridColMeta,
        }),
      ],
    }),
  ];
}

function buildAccountsColumns() {
  return [
    selectColumn(),
    expandColumn(),
    helper.group({
      id: "grp_entity",
      header: "ENTITY",
      columns: [
        helper.accessor("entity", {
          id: "entity",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Entity" />,
          cell: (info) => (
            <GridCellText noOfLines={2} minW={0}>
              {info.getValue() ?? "—"}
            </GridCellText>
          ),
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Entity", minW: "160px" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("customerId", {
          id: "customerId",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Customer ID" />,
          cell: (info) => (
            <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
              {info.getValue() ?? "—"}
            </GridCellText>
          ),
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Customer ID", minW: "120px" } satisfies CorporateGridColMeta,
        }),
      ],
    }),
    helper.group({
      id: "grp_account_info",
      header: "ACCOUNT INFO",
      columns: [
        helper.accessor("accountCountryName", {
          id: "accountCountry",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Account Country" />,
          cell: ({ row }) => <CountryCell code={row.original.accountCountryCode} name={row.original.accountCountryName} />,
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Account Country", minW: "200px" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("accountName", {
          id: "accountName",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Account Name" />,
          cell: (info) => {
            const v = info.getValue();
            return <TruncatedTextCell value={v ?? undefined} label={v ?? undefined} />;
          },
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Account Name", minW: "240px" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("accountCcy", {
          id: "accountCcy",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Account CCY" />,
          cell: (info) => <CurrencyCell code={info.getValue()} />,
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Account CCY", minW: "108px" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("accountNumber", {
          id: "accountNumber",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Account Number" />,
          cell: (info) => <NumericCell value={info.getValue()} />,
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Account Number", minW: "132px" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("iban", {
          id: "iban",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="IBAN" />,
          cell: (info) => {
            const v = info.getValue();
            return <NumericCell value={v} title={v} truncate />;
          },
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "IBAN", minW: "200px" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("accountType", {
          id: "accountType",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Account Type" />,
          cell: (info) => <AccountTypeCell type={info.getValue() as string | undefined} />,
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Account Type", minW: "128px" } satisfies CorporateGridColMeta,
        }),
      ],
    }),
    helper.group({
      id: "grp_financials",
      header: "FINANCIALS",
      columns: [
        helper.accessor("currentBalance", {
          id: "currentBalance",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Current Balance" />,
          cell: (info) => {
            const row = info.row.original;
            const v = info.getValue() ?? row.balanceAed;
            return (
              <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
                {formatCorporateCurrencyCompact(v, row.accountCcy)}
              </GridCellText>
            );
          },
          sortingFn: "basic",
          meta: { label: "Current Balance", minW: "140px" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("availableBalance", {
          id: "availableBalance",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Available Balance" />,
          cell: (info) => {
            const row = info.row.original;
            const v = info.getValue();
            if (v == null) return <GridCellText>—</GridCellText>;
            return (
              <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
                {formatCorporateCurrencyCompact(v, row.accountCcy)}
              </GridCellText>
            );
          },
          sortingFn: "basic",
          meta: { label: "Available Balance", minW: "140px" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("blockedAmount", {
          id: "blockedAmount",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Blocked Amount" />,
          cell: (info) => {
            const row = info.row.original;
            const v = info.getValue();
            if (v == null) return <GridCellText>—</GridCellText>;
            return (
              <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
                {formatCorporateCurrencyCompact(v, row.accountCcy)}
              </GridCellText>
            );
          },
          sortingFn: "basic",
          meta: { label: "Blocked Amount", minW: "128px" } satisfies CorporateGridColMeta,
        }),
      ],
    }),
    helper.group({
      id: "grp_activity",
      header: "ACTIVITY",
      columns: [
        helper.accessor("lastTransactionDate", {
          id: "lastTransactionDate",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Last Transaction Date" />,
          cell: (info) => (
            <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
              {info.getValue() ?? "—"}
            </GridCellText>
          ),
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Last Transaction Date", minW: "140px" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("status", {
          id: "status",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Status" />,
          cell: (info) => <Pill>{info.getValue() ?? "—"}</Pill>,
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Status", minW: "108px" } satisfies CorporateGridColMeta,
        }),
      ],
    }),
    helper.group({
      id: "grp_analytics",
      header: "ANALYTICS (OPTIONAL)",
      columns: [
        helper.accessor("dailyMovement", {
          id: "dailyMovement",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Daily Movement" />,
          cell: (info) => {
            const row = info.row.original;
            const v = info.getValue();
            if (v == null) return <GridCellText>—</GridCellText>;
            return (
              <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
                {formatCorporateCurrencyCompact(v, row.accountCcy)}
              </GridCellText>
            );
          },
          sortingFn: "basic",
          meta: { label: "Daily Movement", minW: "128px" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("thirtyDayAvgBalance", {
          id: "thirtyDayAvgBalance",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="30 Day Avg Balance" />,
          cell: (info) => {
            const row = info.row.original;
            const v = info.getValue();
            if (v == null) return <GridCellText>—</GridCellText>;
            return (
              <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
                {formatCorporateCurrencyCompact(v, row.accountCcy)}
              </GridCellText>
            );
          },
          sortingFn: "basic",
          meta: { label: "30 Day Avg Balance", minW: "148px" } satisfies CorporateGridColMeta,
        }),
      ],
    }),
  ];
}

function buildDepositsColumns() {
  return [
    selectColumn(),
    expandColumn(),
    helper.group({
      id: "grp_entity",
      header: "ENTITY",
      columns: [
        helper.accessor("entity", {
          id: "entity",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Entity" />,
          cell: (info) => (
            <GridCellText noOfLines={2} minW={0}>
              {info.getValue() ?? "—"}
            </GridCellText>
          ),
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Entity", minW: "160px" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("customerId", {
          id: "customerId",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Customer ID" />,
          cell: (info) => (
            <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
              {info.getValue() ?? "—"}
            </GridCellText>
          ),
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Customer ID", minW: "120px" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("depositId", {
          id: "depositId",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Deposit ID" />,
          cell: (info) => (
            <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
              {info.getValue() ?? "—"}
            </GridCellText>
          ),
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Deposit ID", minW: "120px" } satisfies CorporateGridColMeta,
        }),
      ],
    }),
    helper.group({
      id: "grp_product",
      header: "PRODUCT",
      columns: [
        helper.accessor("depositType", {
          id: "depositType",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Deposit Type" />,
          cell: (info) => <AccountTypeCell type={info.getValue() as string | undefined} />,
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Deposit Type", minW: "132px" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("accountCcy", {
          id: "currency",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Currency" />,
          cell: (info) => <CurrencyCell code={info.getValue()} />,
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Currency", minW: "100px" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("interestRatePct", {
          id: "interestRate",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Interest Rate" />,
          cell: (info) => (
            <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
              {info.getValue() != null ? formatPercentValue(info.getValue() as number) : "—"}
            </GridCellText>
          ),
          sortingFn: "basic",
          meta: { label: "Interest Rate", minW: "108px" } satisfies CorporateGridColMeta,
        }),
      ],
    }),
    helper.group({
      id: "grp_financials",
      header: "FINANCIALS",
      columns: [
        helper.accessor("principalAmount", {
          id: "principalAmount",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Principal Amount" />,
          cell: (info) => {
            const row = info.row.original;
            const v = info.getValue();
            if (v == null) return <GridCellText>—</GridCellText>;
            return (
              <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
                {formatCorporateCurrencyCompact(v, row.accountCcy)}
              </GridCellText>
            );
          },
          sortingFn: "basic",
          meta: { label: "Principal Amount", minW: "140px" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("accruedInterest", {
          id: "accruedInterest",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Accrued Interest" />,
          cell: (info) => {
            const row = info.row.original;
            const v = info.getValue();
            if (v == null) return <GridCellText>—</GridCellText>;
            return (
              <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
                {formatCorporateCurrencyCompact(v, row.accountCcy)}
              </GridCellText>
            );
          },
          sortingFn: "basic",
          meta: { label: "Accrued Interest", minW: "132px" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("maturityValue", {
          id: "maturityValue",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Maturity Value" />,
          cell: (info) => {
            const row = info.row.original;
            const v = info.getValue();
            if (v == null) return <GridCellText>—</GridCellText>;
            return (
              <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
                {formatCorporateCurrencyCompact(v, row.accountCcy)}
              </GridCellText>
            );
          },
          sortingFn: "basic",
          meta: { label: "Maturity Value", minW: "132px" } satisfies CorporateGridColMeta,
        }),
      ],
    }),
    helper.group({
      id: "grp_activity",
      header: "ACTIVITY",
      columns: [
        helper.accessor("startDate", {
          id: "startDate",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Start Date" />,
          cell: (info) => (
            <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
              {info.getValue() ?? "—"}
            </GridCellText>
          ),
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Start Date", minW: "112px" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("maturityDate", {
          id: "maturityDate",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Maturity Date" />,
          cell: (info) => (
            <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
              {info.getValue() ?? "—"}
            </GridCellText>
          ),
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Maturity Date", minW: "120px" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("remainingDays", {
          id: "remainingDays",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Remaining Days" />,
          cell: (info) => (
            <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
              {info.getValue() ?? "—"}
            </GridCellText>
          ),
          sortingFn: "basic",
          meta: { label: "Remaining Days", minW: "120px" } satisfies CorporateGridColMeta,
        }),
      ],
    }),
    helper.group({
      id: "grp_status",
      header: "STATUS",
      columns: [
        helper.accessor("autoRenewalFlag", {
          id: "autoRenewal",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Auto Renewal" />,
          cell: (info) => <Pill>{info.getValue() === true ? "Yes" : "No"}</Pill>,
          filterFn: (row, _cid, filterValue) => {
            const v = row.original.autoRenewalFlag === true ? "yes" : "no";
            return String(v).toLowerCase().includes(String(filterValue ?? "").toLowerCase());
          },
          meta: { label: "Auto Renewal Flag", minW: "120px" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("status", {
          id: "status",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Status" />,
          cell: (info) => <Pill>{info.getValue() ?? "—"}</Pill>,
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Status", minW: "108px" } satisfies CorporateGridColMeta,
        }),
        helper.display({
          id: "maturityRisk",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Maturity Risk" filterable={false} />,
          cell: ({ row }) =>
            row.original.maturityRisk === true ? (
              <Pill tone="warn">At risk</Pill>
            ) : (
              <GridCellMuted>
                —
              </GridCellMuted>
            ),
          enableColumnFilter: false,
          enableSorting: false,
          meta: { label: "Maturity Risk", minW: "112px" } satisfies CorporateGridColMeta,
        }),
        helper.display({
          id: "renewalPending",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Renewal Pending" filterable={false} />,
          cell: ({ row }) =>
            row.original.renewalPending === true ? (
              <Pill tone="warn">Pending</Pill>
            ) : (
              <GridCellMuted>
                —
              </GridCellMuted>
            ),
          enableColumnFilter: false,
          enableSorting: false,
          meta: { label: "Renewal Pending", minW: "120px" } satisfies CorporateGridColMeta,
        }),
      ],
    }),
  ];
}

function buildLoansColumns() {
  return [
    selectColumn(),
    expandColumn(),
    helper.group({
      id: "grp_entity",
      header: "ENTITY",
      columns: [
        helper.accessor("entity", {
          id: "entity",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Entity" />,
          cell: (info) => (
            <GridCellText noOfLines={2} minW={0}>
              {info.getValue() ?? "—"}
            </GridCellText>
          ),
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Entity", minW: "160px" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("customerId", {
          id: "customerId",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Customer ID" />,
          cell: (info) => (
            <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
              {info.getValue() ?? "—"}
            </GridCellText>
          ),
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Customer ID", minW: "120px" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("loanId", {
          id: "loanId",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Loan ID" />,
          cell: (info) => (
            <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
              {info.getValue() ?? "—"}
            </GridCellText>
          ),
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Loan ID", minW: "120px" } satisfies CorporateGridColMeta,
        }),
      ],
    }),
    helper.group({
      id: "grp_account_info",
      header: "ACCOUNT INFO",
      columns: [
        helper.accessor("facilityName", {
          id: "facilityName",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Facility Name" />,
          cell: (info) => {
            const v = info.getValue() ?? info.row.original.accountName;
            return <TruncatedTextCell value={v} label={v} />;
          },
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Facility Name", minW: "240px" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("accountCcy", {
          id: "currency",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Currency" />,
          cell: (info) => <CurrencyCell code={info.getValue()} />,
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Currency", minW: "100px" } satisfies CorporateGridColMeta,
        }),
      ],
    }),
    helper.group({
      id: "grp_financials",
      header: "FINANCIALS",
      columns: [
        helper.accessor("approvedLimit", {
          id: "approvedLimit",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Approved Limit" />,
          cell: (info) => {
            const row = info.row.original;
            const v = info.getValue();
            if (v == null) return <GridCellText>—</GridCellText>;
            return (
              <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
                {formatCorporateCurrencyCompact(v, row.accountCcy)}
              </GridCellText>
            );
          },
          sortingFn: "basic",
          meta: { label: "Approved Limit", minW: "140px" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("outstandingAmount", {
          id: "outstandingAmount",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Outstanding Amount" />,
          cell: (info) => {
            const row = info.row.original;
            const v = info.getValue();
            if (v == null) return <GridCellText>—</GridCellText>;
            return (
              <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
                {formatCorporateCurrencyCompact(v, row.accountCcy)}
              </GridCellText>
            );
          },
          sortingFn: "basic",
          meta: { label: "Outstanding Amount", minW: "152px" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("availableLimit", {
          id: "availableLimit",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Available Limit" />,
          cell: (info) => {
            const row = info.row.original;
            const v = info.getValue();
            if (v == null) return <GridCellText>—</GridCellText>;
            return (
              <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
                {formatCorporateCurrencyCompact(v, row.accountCcy)}
              </GridCellText>
            );
          },
          sortingFn: "basic",
          meta: { label: "Available Limit", minW: "140px" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("loanInterestRatePct", {
          id: "interestRate",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Interest Rate" />,
          cell: (info) => (
            <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
              {info.getValue() != null ? formatPercentValue(info.getValue() as number) : "—"}
            </GridCellText>
          ),
          sortingFn: "basic",
          meta: { label: "Interest Rate", minW: "108px" } satisfies CorporateGridColMeta,
        }),
      ],
    }),
    helper.group({
      id: "grp_activity",
      header: "ACTIVITY",
      columns: [
        helper.accessor("nextRepaymentDate", {
          id: "nextRepaymentDate",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Next Repayment Date" />,
          cell: (info) => (
            <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
              {info.getValue() ?? "—"}
            </GridCellText>
          ),
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Next Repayment Date", minW: "152px" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("nextRepaymentAmount", {
          id: "nextRepaymentAmount",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Next Repayment Amount" />,
          cell: (info) => {
            const row = info.row.original;
            const v = info.getValue();
            if (v == null) return <GridCellText>—</GridCellText>;
            return (
              <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
                {formatCorporateCurrencyCompact(v, row.accountCcy)}
              </GridCellText>
            );
          },
          sortingFn: "basic",
          meta: { label: "Next Repayment Amount", minW: "160px" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("tenor", {
          id: "tenor",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Tenor" />,
          cell: (info) => (
            <GridCellText sx={{ fontVariantNumeric: "tabular-nums" }}>
              {info.getValue() ?? "—"}
            </GridCellText>
          ),
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Tenor", minW: "100px" } satisfies CorporateGridColMeta,
        }),
      ],
    }),
    helper.group({
      id: "grp_product",
      header: "PRODUCT",
      columns: [
        helper.accessor("collateralType", {
          id: "collateralType",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Collateral Type" />,
          cell: (info) => <GridCellText>{info.getValue() ?? "—"}</GridCellText>,
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Collateral Type", minW: "120px" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("riskRating", {
          id: "riskRating",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Risk Rating" />,
          cell: (info) => <Pill>{info.getValue() ?? "—"}</Pill>,
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Risk Rating", minW: "108px" } satisfies CorporateGridColMeta,
        }),
        helper.accessor("status", {
          id: "status",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Status" />,
          cell: (info) => <Pill>{info.getValue() ?? "—"}</Pill>,
          filterFn: "includesString",
          sortingFn: "alphanumeric",
          meta: { label: "Status", minW: "108px" } satisfies CorporateGridColMeta,
        }),
        helper.display({
          id: "repaymentDueSoon",
          header: ({ column }) => <PortfolioColumnHeader column={column} title="Repayment Due Soon" filterable={false} />,
          cell: ({ row }) =>
            row.original.repaymentDueSoon === true ? (
              <Pill tone="danger">Due soon</Pill>
            ) : (
              <GridCellMuted>
                —
              </GridCellMuted>
            ),
          enableColumnFilter: false,
          enableSorting: false,
          meta: { label: "Repayment Due Soon", minW: "140px" } satisfies CorporateGridColMeta,
        }),
      ],
    }),
  ];
}

function collectLeafLabels(defs: ColumnDef<CorporateBankingGridRow>[], out: Record<string, string>) {
  for (const def of defs) {
    if ("columns" in def && def.columns) {
      collectLeafLabels(def.columns as ColumnDef<CorporateBankingGridRow>[], out);
    } else if (def.id) {
      const m = def.meta as CorporateGridColMeta | undefined;
      if (m?.label) out[def.id] = m.label;
    }
  }
}

/** Labels for group-by toolbar chips — keyed by column id */
export function getCorporateGridGroupingLabels(view: PortfolioModuleTab): Record<string, string> {
  const out: Record<string, string> = {};
  collectLeafLabels(buildCorporateGridColumns(view) as ColumnDef<CorporateBankingGridRow>[], out);
  return out;
}
