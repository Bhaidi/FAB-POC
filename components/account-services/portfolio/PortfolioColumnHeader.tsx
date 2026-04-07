"use client";

import { useMemo } from "react";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Filter, GripVertical } from "lucide-react";
import { corpChromeTypographyFrom } from "@/components/account-services/portfolio/corporatePortfolioTableTheme";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import { PORTFOLIO_COLUMN_DRAG_MIME } from "@/components/account-services/portfolio/portfolioDragConstants";
import type { CorporateBankingGridRow } from "@/data/corporateBankingGridTypes";
import { getDsTextFieldStyles } from "@/lib/fabTheme/dsTextField";

type Props = {
  column: Column<CorporateBankingGridRow, unknown>;
  title: string;
  filterable?: boolean;
};

export function PortfolioColumnHeader({ column, title, filterable = true }: Props) {
  const { corpTable } = useFabTokens();
  const { colorMode } = useColorMode();
  const corpChromeTypography = corpChromeTypographyFrom(corpTable);
  const filterFieldStyles = useMemo(
    () =>
      getDsTextFieldStyles({
        colorMode: colorMode === "dark" ? "dark" : "light",
        height: "32px",
        paddingX: "10px",
      }),
    [colorMode],
  );
  const canSort = column.getCanSort();
  const canGroup = column.getCanGroup() === true;
  const sorted = column.getIsSorted();
  const filterVal = (column.getFilterValue() as string) ?? "";

  return (
    <Flex align="center" gap={0.5} minW={0}>
      {canGroup ? (
        <Box
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData(PORTFOLIO_COLUMN_DRAG_MIME, column.id);
            e.dataTransfer.setData("text/plain", column.id);
            e.dataTransfer.effectAllowed = "copy";
          }}
          display="flex"
          alignItems="center"
          flexShrink={0}
          cursor="grab"
          color={corpTable.columnHeadingIcon}
          _active={{ cursor: "grabbing" }}
          pr={0.5}
          aria-label={`Drag to group by ${title}`}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical size={14} strokeWidth={2} aria-hidden />
        </Box>
      ) : null}
      <Box
        as="button"
        type="button"
        display="flex"
        alignItems="center"
        gap={1}
        minW={0}
        cursor={canSort ? "pointer" : "default"}
        onClick={canSort ? column.getToggleSortingHandler() : undefined}
        bg="transparent"
        border="none"
        p={0}
        color={corpTable.columnHeadingText}
        _hover={canSort ? { color: corpTable.columnHeadingTextHover } : undefined}
      >
        <Text
          as="span"
          fontFamily={corpTable.chromeFontFamily}
          fontSize={corpTable.gridHeaderFontSize}
          fontWeight={600}
          letterSpacing={corpTable.gridHeaderLetterSpacing}
          color="inherit"
          textTransform="uppercase"
          noOfLines={1}
          textAlign="left"
        >
          {title}
        </Text>
        {canSort ? (
          <Box as="span" display="flex" flexShrink={0} opacity={sorted ? 1 : 0.45} color="currentcolor" aria-hidden>
            {sorted === "desc" ? (
              <ArrowDown size={14} strokeWidth={2.5} />
            ) : sorted === "asc" ? (
              <ArrowUp size={14} strokeWidth={2.5} />
            ) : (
              <ArrowUpDown size={14} strokeWidth={2} />
            )}
          </Box>
        ) : null}
      </Box>
      {filterable && column.getCanFilter() ? (
        <Popover placement="bottom-start">
          <PopoverTrigger>
            <IconButton
              aria-label={`Filter ${title}`}
              icon={<Filter size={14} strokeWidth={2} aria-hidden />}
              variant="ghost"
              size="xs"
              minW="22px"
              h="22px"
              color={filterVal ? corpTable.accent : corpTable.columnHeadingIcon}
              _hover={{
                bg: "rgba(255,255,255,0.08)",
                color: filterVal ? corpTable.accent : corpTable.columnHeadingTextHover,
              }}
            />
          </PopoverTrigger>
          <PopoverContent
            bg="rgba(14, 18, 36, 0.98)"
            borderWidth={0}
            width="220px"
            zIndex={150}
            boxShadow="0 16px 48px rgba(0,0,0,0.35)"
          >
            <PopoverArrow bg="rgba(14, 18, 36, 0.98)" />
            <PopoverCloseButton color="rgba(255,255,255,0.5)" />
            <PopoverHeader
              borderBottomWidth={0}
              fontFamily={corpTable.chromeFontFamily}
              fontSize={corpTable.chromeFontSize}
              fontWeight={corpTable.chromeFontWeight}
              letterSpacing={corpTable.chromeLetterSpacing}
              color={corpTable.chromeText}
            >
              Filter: {title}
            </PopoverHeader>
            <PopoverBody>
              <Input
                size="sm"
                variant="unstyled"
                value={filterVal}
                onChange={(e) => column.setFilterValue(e.target.value || undefined)}
                placeholder="Contains…"
                {...filterFieldStyles}
                _placeholder={{ color: corpTable.filterInputPlaceholder }}
              />
              <Button
                mt={2}
                size="xs"
                variant="ghost"
                fontFamily={corpTable.chromeFontFamily}
                fontSize={corpTable.chromeFontSizeSm}
                fontWeight={corpTable.chromeFontWeight}
                color={corpTable.chromeTextMuted}
                onClick={() => column.setFilterValue(undefined)}
              >
                Clear
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      ) : null}
    </Flex>
  );
}
