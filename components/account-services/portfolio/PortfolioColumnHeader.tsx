"use client";

import {
  Box,
  Button,
  Flex,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Filter, GripVertical } from "lucide-react";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import { PORTFOLIO_COLUMN_DRAG_MIME } from "@/components/account-services/portfolio/portfolioDragConstants";
import type { CorporateBankingGridRow } from "@/data/corporateBankingGridTypes";
import { DsTextField } from "@/components/ui/DsTextField";
import { glassTokens } from "@/lib/glassTokens";

type Props = {
  column: Column<CorporateBankingGridRow, unknown>;
  title: string;
  filterable?: boolean;
};

export function PortfolioColumnHeader({ column, title, filterable = true }: Props) {
  const { corpTable } = useFabTokens();
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
            bg={glassTokens.fill.panel}
            borderWidth="1px"
            borderColor={glassTokens.border.default}
            backdropFilter={glassTokens.blur.card}
            sx={{
              WebkitBackdropFilter: glassTokens.blur.card,
              boxShadow: glassTokens.shadowStack.panel,
            }}
            width="220px"
            zIndex={150}
          >
            <PopoverArrow bg={glassTokens.fill.panel} borderColor={glassTokens.border.default} />
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
              <DsTextField
                fieldHeight="32px"
                fieldPaddingX="10px"
                w="full"
                value={filterVal}
                onChange={(e) => column.setFilterValue(e.target.value || undefined)}
                placeholder="Contains…"
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
