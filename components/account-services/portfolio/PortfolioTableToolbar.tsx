"use client";

import { useState, type ReactNode } from "react";
import { Box, Button, Flex, IconButton, Text, Wrap, WrapItem } from "@chakra-ui/react";
import type { Table as TanstackTable } from "@tanstack/react-table";
import { Download, Filter, LayoutGrid, RefreshCw, X } from "lucide-react";
import type { CorporateBankingGridRow } from "@/data/corporateBankingGridTypes";
import { corpChromeTypographyFrom } from "@/components/account-services/portfolio/corporatePortfolioTableTheme";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import { PORTFOLIO_COLUMN_DRAG_MIME } from "@/components/account-services/portfolio/portfolioDragConstants";

type Props = {
  table: TanstackTable<CorporateBankingGridRow>;
  /** Human-readable label per column id for active group chips */
  groupingColumnLabels: Record<string, string>;
  onGroupByColumnId: (columnId: string) => void;
  onRefresh: () => void;
  onExport: () => void;
  columnSettingsTrigger: ReactNode;
};

export function PortfolioTableToolbar({
  table,
  groupingColumnLabels,
  onGroupByColumnId,
  onRefresh,
  onExport,
  columnSettingsTrigger,
}: Props) {
  const { corpTable } = useFabTokens();
  const corpChromeTypography = corpChromeTypographyFrom(corpTable);
  const grouping = table.getState().grouping;
  const [dropActive, setDropActive] = useState(false);

  return (
    <Flex
      align={{ base: "stretch", lg: "center" }}
      justify="space-between"
      gap={3}
      px={{ base: 4, md: 5 }}
      py={3}
      bg={corpTable.toolbarBg}
      borderBottomWidth="1px"
      borderBottomColor={corpTable.toolbarBorder}
      flexWrap="wrap"
    >
      <Box
        flex="1"
        minW={{ base: "100%", lg: "240px" }}
        maxW={{ base: "100%", lg: "none" }}
        borderWidth={0}
        borderRadius="md"
        px={3}
        py={2}
        bg={dropActive ? corpTable.toolbarDropActiveBg : corpTable.groupZoneBg}
        boxShadow={dropActive ? corpTable.toolbarDropActiveRing : "none"}
        transition="background 0.12s ease, box-shadow 0.12s ease"
        onDragEnter={(e) => {
          e.preventDefault();
          setDropActive(true);
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setDropActive(false);
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDropActive(false);
          const id =
            e.dataTransfer.getData(PORTFOLIO_COLUMN_DRAG_MIME) || e.dataTransfer.getData("text/plain");
          if (!id) return;
          onGroupByColumnId(id);
        }}
      >
        <Flex align="center" gap={2} flexWrap="wrap">
          <LayoutGrid size={16} aria-hidden strokeWidth={2} color={corpTable.groupZoneText} />
          <Text
            as="span"
            fontFamily={corpTable.chromeFontFamily}
            fontSize={corpTable.chromeFontSizeSm}
            fontWeight={corpTable.chromeFontWeight}
            letterSpacing={corpTable.chromeLetterSpacing}
            color={corpTable.groupZoneText}
          >
            Drag a column header grip here to group
          </Text>
        </Flex>
        {grouping.length > 0 ? (
          <Wrap mt={2} spacing={2}>
            {grouping.map((gid) => (
              <WrapItem key={gid}>
                <Flex
                  align="center"
                  gap={1}
                  pl={2}
                  pr={1}
                  py={0.5}
                  borderRadius="md"
                  bg={corpTable.groupChipBg}
                >
                  <Text
                    fontFamily={corpTable.chromeFontFamily}
                    fontSize="12px"
                    fontWeight={corpTable.chromeFontWeight}
                    color={corpTable.chromeText}
                  >
                    {groupingColumnLabels[gid] ?? gid}
                  </Text>
                  <IconButton
                    aria-label={`Remove grouping by ${groupingColumnLabels[gid] ?? gid}`}
                    icon={<X size={14} />}
                    size="xs"
                    variant="ghost"
                    minW="24px"
                    h="24px"
                    color={corpTable.groupChipIconMuted}
                    _hover={{ color: corpTable.bodyPrimary, bg: corpTable.chromeButtonHoverBg }}
                    onClick={() => {
                      table.setGrouping(grouping.filter((g) => g !== gid));
                    }}
                  />
                </Flex>
              </WrapItem>
            ))}
          </Wrap>
        ) : null}
      </Box>

      <Flex align="center" gap={2} flexShrink={0} flexWrap="wrap" justify="flex-end">
        <IconButton
          aria-label="Refresh table data"
          icon={<RefreshCw size={18} />}
          variant="ghost"
          size="sm"
          color={corpTable.chromeTextMuted}
          _hover={{ bg: corpTable.chromeButtonHoverBg, color: corpTable.chromeText }}
          onClick={onRefresh}
        />
        <Button
          size="sm"
          variant="ghost"
          leftIcon={<Download size={16} />}
          fontFamily={corpTable.chromeFontFamily}
          fontSize={corpTable.chromeFontSize}
          fontWeight={corpTable.chromeFontWeight}
          letterSpacing={corpTable.chromeLetterSpacing}
          color={corpTable.chromeText}
          _hover={{ bg: corpTable.chromeButtonHoverMuted }}
          onClick={onExport}
        >
          Export
        </Button>
        {columnSettingsTrigger}
        <Button
          size="sm"
          variant="ghost"
          leftIcon={<Filter size={16} />}
          {...corpChromeTypography}
          fontWeight={corpTable.chromeFontWeight}
          _hover={{ bg: corpTable.chromeButtonHoverStrong, color: corpTable.chromeText }}
          onClick={() => {
            table.resetColumnFilters();
            table.resetGrouping();
          }}
        >
          Reset grouping
        </Button>
      </Flex>
    </Flex>
  );
}
