"use client";

import { Checkbox, Text } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { AccountTypeCell } from "@/components/account-services/portfolio/cells/AccountTypeCell";
import { CountryCell } from "@/components/account-services/portfolio/cells/CountryCell";
import { CurrencyCell } from "@/components/account-services/portfolio/cells/CurrencyCell";
import { NumericCell } from "@/components/account-services/portfolio/cells/NumericCell";
import { TruncatedTextCell } from "@/components/account-services/portfolio/cells/TruncatedTextCell";
import { corpTable } from "@/components/account-services/portfolio/corporatePortfolioTableTheme";
import { PortfolioColumnHeader } from "@/components/account-services/portfolio/PortfolioColumnHeader";
import type { CorporateBankingGridRow } from "@/data/corporateBankingGridTypes";

const columnHelper = createColumnHelper<CorporateBankingGridRow>();

const cellTextProps = {
  fontFamily: "var(--font-graphik)",
  fontSize: "14px",
  color: corpTable.bodyPrimary,
};

export function buildCorporateAccountColumns() {
  return [
    columnHelper.display({
      id: "select",
      size: 44,
      minSize: 44,
      maxSize: 52,
      enableSorting: false,
      enableColumnFilter: false,
      enableHiding: false,
      enableGrouping: false,
      header: ({ table }) => (
        <Checkbox
          isChecked={table.getIsAllPageRowsSelected()}
          isIndeterminate={table.getIsSomePageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          onClick={(e) => e.stopPropagation()}
          size="sm"
          colorScheme="blue"
          sx={{
            "& .chakra-checkbox__control": { borderColor: "rgba(255,255,255,0.22)" },
          }}
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
          sx={{
            "& .chakra-checkbox__control": { borderColor: "rgba(255,255,255,0.22)" },
          }}
        />
      ),
      aggregatedCell: () => null,
    }),
    columnHelper.accessor("entity", {
      header: ({ column }) => <PortfolioColumnHeader column={column} title="Entity" filterable={false} />,
      cell: (info) => (
        <Text {...cellTextProps} noOfLines={2} minW={0}>
          {info.getValue() ?? "—"}
        </Text>
      ),
      aggregatedCell: () => null,
      filterFn: "includesString",
      sortingFn: "alphanumeric",
      meta: { minW: "160px" },
    }),
    columnHelper.accessor("customerId", {
      header: ({ column }) => <PortfolioColumnHeader column={column} title="Customer ID" filterable={false} />,
      cell: (info) => (
        <Text {...cellTextProps} sx={{ fontVariantNumeric: "tabular-nums" }}>
          {info.getValue() ?? "—"}
        </Text>
      ),
      aggregatedCell: () => null,
      filterFn: "includesString",
      sortingFn: "alphanumeric",
      meta: { minW: "120px" },
    }),
    columnHelper.accessor("accountCountryName", {
      id: "accountCountry",
      header: ({ column }) => <PortfolioColumnHeader column={column} title="Account Country" filterable={false} />,
      cell: ({ row }) => {
        const o = row.original;
        if (!o) return null;
        return <CountryCell code={o.accountCountryCode} name={o.accountCountryName} />;
      },
      aggregatedCell: () => null,
      filterFn: "includesString",
      sortingFn: "alphanumeric",
      meta: { minW: "200px" },
    }),
    columnHelper.accessor("accountName", {
      header: ({ column }) => <PortfolioColumnHeader column={column} title="Account Name" filterable={false} />,
      cell: (info) => {
        const v = info.getValue();
        return <TruncatedTextCell value={v ?? undefined} label={v ?? undefined} />;
      },
      aggregatedCell: () => null,
      filterFn: "includesString",
      sortingFn: "alphanumeric",
      meta: { minW: "240px" },
    }),
    columnHelper.accessor("accountCcy", {
      header: ({ column }) => <PortfolioColumnHeader column={column} title="Account CCY" filterable={false} />,
      cell: (info) => <CurrencyCell code={info.getValue()} />,
      aggregatedCell: () => null,
      filterFn: "includesString",
      sortingFn: "alphanumeric",
      meta: { minW: "108px" },
    }),
    columnHelper.accessor("accountNumber", {
      header: ({ column }) => <PortfolioColumnHeader column={column} title="Account Number" filterable={false} />,
      cell: (info) => <NumericCell value={info.getValue()} />,
      aggregatedCell: () => null,
      filterFn: "includesString",
      sortingFn: "alphanumeric",
      meta: { minW: "132px" },
    }),
    columnHelper.accessor("iban", {
      header: ({ column }) => <PortfolioColumnHeader column={column} title="IBAN" filterable={false} />,
      cell: (info) => {
        const v = info.getValue();
        return <NumericCell value={v} title={v} truncate />;
      },
      aggregatedCell: () => null,
      filterFn: "includesString",
      sortingFn: "alphanumeric",
      meta: { minW: "200px" },
    }),
    columnHelper.accessor("accountType", {
      header: ({ column }) => <PortfolioColumnHeader column={column} title="Account Type" filterable={false} />,
      cell: (info) => <AccountTypeCell type={info.getValue()} />,
      aggregatedCell: () => null,
      filterFn: "includesString",
      sortingFn: "alphanumeric",
      meta: { minW: "128px" },
    }),
  ];
}
