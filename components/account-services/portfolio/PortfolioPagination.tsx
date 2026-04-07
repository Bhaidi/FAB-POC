"use client";

import { useMemo } from "react";
import {
  Flex,
  IconButton,
  Input,
  Select,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import type { Table as TanstackTable } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CorporateBankingGridRow } from "@/data/corporateBankingGridTypes";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import { getDsTextFieldStyles } from "@/lib/fabTheme/dsTextField";

type Props = {
  table: TanstackTable<CorporateBankingGridRow>;
};

export function PortfolioPagination({ table }: Props) {
  const { corpTable } = useFabTokens();
  const { colorMode } = useColorMode();
  const pageFieldStyles = useMemo(
    () =>
      getDsTextFieldStyles({
        colorMode: colorMode === "dark" ? "dark" : "light",
        height: "32px",
        paddingX: "6px",
      }),
    [colorMode],
  );
  const { pageIndex, pageSize } = table.getState().pagination;
  const filtered = table.getFilteredRowModel().rows.length;
  const pageCount = Math.max(1, table.getPageCount());
  const from = filtered === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, filtered);

  return (
    <Flex
      align={{ base: "flex-start", sm: "center" }}
      justify="space-between"
      gap={4}
      px={{ base: 4, md: 5 }}
      py={3}
      flexWrap="wrap"
      bg={corpTable.footerBg}
    >
      <Flex align="center" gap={2} flexWrap="wrap">
        <IconButton
          aria-label="Previous page"
          icon={<ChevronLeft size={18} />}
          size="sm"
          variant="ghost"
          color="rgba(255,255,255,0.8)"
          isDisabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
          _hover={{ bg: "rgba(255,255,255,0.08)" }}
        />
        <Flex align="center" gap={1}>
          <Input
            w="52px"
            size="sm"
            variant="unstyled"
            textAlign="center"
            type="number"
            min={1}
            max={pageCount}
            value={pageIndex + 1}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (!Number.isFinite(v) || v < 1) return;
              table.setPageIndex(Math.min(v - 1, pageCount - 1));
            }}
            sx={{ fontVariantNumeric: "tabular-nums" }}
            {...pageFieldStyles}
          />
          <Text
            fontFamily={corpTable.chromeFontFamily}
            fontSize={corpTable.chromeFontSize}
            fontWeight={corpTable.chromeFontWeight}
            letterSpacing={corpTable.chromeLetterSpacing}
            color={corpTable.chromeTextMuted}
          >
            / {pageCount}
          </Text>
        </Flex>
        <IconButton
          aria-label="Next page"
          icon={<ChevronRight size={18} />}
          size="sm"
          variant="ghost"
          color="rgba(255,255,255,0.8)"
          isDisabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
          _hover={{ bg: "rgba(255,255,255,0.08)" }}
        />
        <Select
          size="sm"
          w="auto"
          ml={1}
          value={String(pageSize)}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          bg={corpTable.filterInputBg}
          borderWidth={0}
          sx={{
            fontFamily: corpTable.chromeFontFamily,
            fontWeight: corpTable.chromeFontWeight,
            fontSize: corpTable.chromeFontSize,
            letterSpacing: corpTable.chromeLetterSpacing,
            color: corpTable.chromeText,
          }}
        >
          {[10, 25, 50, 100, 500, 1000].map((n) => (
            <option key={n} value={n} style={{ background: corpTable.selectOptionBg }}>
              {n} / page
            </option>
          ))}
        </Select>
      </Flex>

      <Text
        fontFamily={corpTable.chromeFontFamily}
        fontSize={corpTable.chromeFontSize}
        fontWeight={corpTable.chromeFontWeight}
        letterSpacing={corpTable.chromeLetterSpacing}
        color={corpTable.chromeTextMuted}
        sx={{ fontVariantNumeric: "tabular-nums" }}
      >
        {from}–{to} of {filtered} items
      </Text>
    </Flex>
  );
}
