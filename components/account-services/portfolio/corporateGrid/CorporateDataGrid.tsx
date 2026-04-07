"use client";

import {
  Box,
  Flex,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnOrderState,
  type ExpandedState,
  type GroupingState,
  type Row,
  type SortingState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ChevronDown, ChevronRight, GripHorizontal } from "lucide-react";
import { type MouseEvent, Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildCorporateGridColumns, getCorporateGridGroupingLabels } from "@/components/account-services/portfolio/corporateGrid/buildCorporateGridColumns";
import type { CorporateGridColMeta } from "@/components/account-services/portfolio/corporateGrid/corporateGridColumnMeta";
import { CorporateGridRowQuickActions } from "@/components/account-services/portfolio/corporateGrid/CorporateGridRowQuickActions";
import { exportCorporateGridToCsv } from "@/components/account-services/portfolio/corporateGrid/exportCorporateGridCsv";
import { PortfolioColumnVisibilityTrigger } from "@/components/account-services/portfolio/PortfolioColumnVisibilityMenu";
import { PortfolioPagination } from "@/components/account-services/portfolio/PortfolioPagination";
import { PortfolioTableToolbar } from "@/components/account-services/portfolio/PortfolioTableToolbar";
import { useCorpTableTheme } from "@/components/account-services/portfolio/CorpTableThemeContext";
import { useFabTokens } from "@/components/theme/FabTokensContext";
import type { CorporateBankingGridRow } from "@/data/corporateBankingGridTypes";
import type { PortfolioModuleTab } from "@/data/portfolioSummaryTypes";

type ColMeta = CorporateGridColMeta;

function flattenLeafColumnIds(defs: ColumnDef<CorporateBankingGridRow>[]): string[] {
  const ids: string[] = [];
  for (const d of defs) {
    if ("columns" in d && d.columns) {
      ids.push(...flattenLeafColumnIds(d.columns as ColumnDef<CorporateBankingGridRow>[]));
    } else if (d.id) ids.push(d.id);
  }
  return ids;
}

function reorderColumnIds(order: string[], dragId: string, targetId: string): string[] {
  if (dragId === targetId) return order;
  const filtered = order.filter((id) => id !== dragId);
  const ti = filtered.indexOf(targetId);
  if (ti < 0) return order;
  filtered.splice(ti, 0, dragId);
  return filtered;
}

type Props = {
  view: PortfolioModuleTab;
  data: CorporateBankingGridRow[];
  isLoading?: boolean;
  selectedDetailId?: string | null;
  onRowOpenDetail?: (row: CorporateBankingGridRow) => void;
  /**
   * `fill` — parent supplies height (split layout); scroll region flex-grows.
   * `viewport` — fixed max height for scroll body (default).
   */
  scrollAreaMode?: "viewport" | "fill";
};

const VIRTUAL_THRESHOLD = 120;

export function CorporateDataGrid({
  view,
  data,
  isLoading = false,
  selectedDetailId = null,
  onRowOpenDetail,
  scrollAreaMode = "viewport",
}: Props) {
  const { corpTable } = useFabTokens();
  const columns = useMemo(() => buildCorporateGridColumns(view), [view]);
  const groupingLabels = useMemo(() => getCorporateGridGroupingLabels(view), [view]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<Array<{ id: string; value: unknown }>>([]);
  const [grouping, setGrouping] = useState<GroupingState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() => {
    if (view === "accounts") return { dailyMovement: false, thirtyDayAvgBalance: false };
    return {} as Record<string, boolean>;
  });
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 100 });
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);

  const leafIds = useMemo(() => flattenLeafColumnIds(columns as ColumnDef<CorporateBankingGridRow>[]), [columns]);

  useEffect(() => {
    setColumnOrder(leafIds);
    setSorting([]);
    setColumnFilters([]);
    setGrouping([]);
    setExpanded({});
    setRowSelection({});
    setPagination((p) => ({ ...p, pageIndex: 0 }));
    if (view === "accounts") {
      setColumnVisibility({ dailyMovement: false, thirtyDayAvgBalance: false });
    } else {
      setColumnVisibility({});
    }
  }, [view, leafIds]);

  useEffect(() => {
    if (grouping.length === 0) {
      setExpanded({});
      return;
    }
    setExpanded(true);
  }, [grouping]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      grouping,
      expanded,
      rowSelection,
      columnVisibility,
      pagination,
      columnOrder,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGroupingChange: setGrouping,
    onExpandedChange: setExpanded,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onColumnOrderChange: setColumnOrder,
    columnResizeMode: "onChange",
    enableColumnResizing: true,
    defaultColumn: {
      minSize: 72,
      size: 148,
      maxSize: 560,
      enableGrouping: true,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
    getRowCanExpand: (row) => (row.getIsGrouped() ? true : true),
    enableRowSelection: true,
    enableSorting: true,
    enableFilters: true,
    enableColumnFilters: true,
    enableHiding: true,
    enableMultiSort: true,
  });

  const onGroupByColumnId = useCallback(
    (columnId: string) => {
      const col = table.getColumn(columnId);
      if (col == null || col.getCanGroup() !== true) return;
      table.setGrouping([columnId]);
    },
    [table],
  );

  const onRefresh = useCallback(() => {
    table.resetSorting();
    table.resetColumnFilters();
    table.resetGrouping();
    setExpanded({});
  }, [table]);

  const onExport = useCallback(() => {
    exportCorporateGridToCsv(table, `fab-corporate-${view}.csv`);
  }, [table, view]);

  const onRowActivate = useCallback(
    (row: CorporateBankingGridRow) => {
      onRowOpenDetail?.(row);
    },
    [onRowOpenDetail],
  );

  const rowClick = useCallback(
    (e: React.MouseEvent, row: Row<CorporateBankingGridRow>) => {
      const el = e.target as HTMLElement;
      if (
        el.closest("[data-row-select]") ||
        el.closest("[role='checkbox']") ||
        el.closest("button") ||
        el.closest("input") ||
        el.closest("[data-group-toggle]") ||
        el.closest("[data-col-reorder]") ||
        el.closest("[data-resize-handle]")
      ) {
        return;
      }
      if (row.getIsGrouped()) {
        row.toggleExpanded();
        return;
      }
      onRowActivate(row.original);
    },
    [onRowActivate],
  );

  const [dragColId, setDragColId] = useState<string | null>(null);

  const onColumnHeaderDragStart = useCallback((e: React.DragEvent, columnId: string) => {
    if (columnId === "select" || columnId === "expand") {
      e.preventDefault();
      return;
    }
    setDragColId(columnId);
    e.dataTransfer.setData("text/plain", columnId);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const onColumnHeaderDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onColumnHeaderDrop = useCallback(
    (e: React.DragEvent, targetId: string) => {
      e.preventDefault();
      const id = dragColId ?? e.dataTransfer.getData("text/plain");
      setDragColId(null);
      if (!id || id === "select" || id === "expand" || targetId === "select" || targetId === "expand") return;
      setColumnOrder((prev) => reorderColumnIds(prev.length > 0 ? prev : leafIds, id, targetId));
    },
    [dragColId, leafIds],
  );

  const columnCount = columns.length;
  const leafColumnCount = table.getVisibleLeafColumns().length;
  const rows = table.getRowModel().rows;
  const filteredCount = table.getFilteredRowModel().rows.length;
  const scrollParentRef = useRef<HTMLDivElement>(null);
  /** Virtual rows only when no grouping / row expansion — keeps scroll height consistent with expansion `<tr>` pairs. */
  const useVirtual =
    !isLoading &&
    filteredCount >= VIRTUAL_THRESHOLD &&
    grouping.length === 0 &&
    Object.keys(expanded).length === 0;

  const rowVirtualizer = useVirtualizer({
    count: useVirtual ? rows.length : 0,
    getScrollElement: () => scrollParentRef.current,
    estimateSize: () => 44,
    overscan: 12,
  });

  useEffect(() => {
    if (useVirtual) rowVirtualizer.measure();
  }, [rows.length, useVirtual, rowVirtualizer]);

  const headerTypographySx = {
    fontFamily: corpTable.chromeFontFamily,
    fontSize: corpTable.gridHeaderFontSize,
    fontWeight: 600,
    letterSpacing: corpTable.gridHeaderLetterSpacing,
    textTransform: "uppercase" as const,
    color: corpTable.columnHeadingText,
  };

  const scrollBodyProps =
    scrollAreaMode === "fill"
      ? {
          ref: scrollParentRef,
          flex: "1",
          minH: 0,
          maxH: "none" as const,
          overflowY: "auto" as const,
          position: "relative" as const,
          bg: corpTable.tableCanvasBg,
        }
      : {
          ref: scrollParentRef,
          maxH: "min(68vh, 720px)" as const,
          overflowY: "auto" as const,
          position: "relative" as const,
          bg: corpTable.tableCanvasBg,
        };

  const inner = (
    <>
      <Box flexShrink={0}>
        <PortfolioTableToolbar
          table={table}
          groupingColumnLabels={groupingLabels}
          onGroupByColumnId={onGroupByColumnId}
          onRefresh={onRefresh}
          onExport={onExport}
          columnSettingsTrigger={<PortfolioColumnVisibilityTrigger table={table} />}
        />
      </Box>

      <Box overflowX="auto" w="full" bg={corpTable.tableCanvasBg} flex={scrollAreaMode === "fill" ? 1 : undefined} minH={scrollAreaMode === "fill" ? 0 : undefined} display="flex" flexDirection="column">
        <Box {...scrollBodyProps}>
          <TableContainer minW="1280px">
            <Table variant="unstyled" size="sm" sx={{ borderCollapse: "separate", borderSpacing: 0, width: "100%" }}>
              <Thead position="sticky" top={0} zIndex={3} bg={corpTable.theadStickyBg} boxShadow="none">
                {table.getHeaderGroups().map((hg) => (
                  <Tr key={hg.id} h="42px">
                    {hg.headers.map((header) => {
                      const meta = header.column.columnDef.meta as ColMeta | undefined;
                      const canResize = header.column.getCanResize();
                      const colId = header.column.id;
                      return (
                        <Th
                          key={header.id}
                          colSpan={header.colSpan}
                          minW={meta?.minW}
                          w={header.getSize()}
                          maxW={header.getSize()}
                          px={corpTable.tableCellPx}
                          py={corpTable.tableHeaderPy}
                          h="42px"
                          borderBottomWidth="1px"
                          borderBottomColor={corpTable.tableHeaderRule}
                          textAlign="left"
                          verticalAlign="middle"
                          position="relative"
                          data-column-id={colId}
                          onDragOver={onColumnHeaderDragOver}
                          onDrop={(e) => onColumnHeaderDrop(e, colId)}
                        >
                          {header.isPlaceholder ? null : (
                            <Flex align="center" gap={1} minW={0}>
                              {colId !== "select" && colId !== "expand" ? (
                                <Box
                                  data-col-reorder
                                  draggable
                                  display="flex"
                                  alignItems="center"
                                  flexShrink={0}
                                  cursor="grab"
                                  color={corpTable.columnHeadingIcon}
                                  aria-label="Drag to reorder column"
                                  onDragStart={(e) => onColumnHeaderDragStart(e, colId)}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <GripHorizontal size={14} aria-hidden />
                                </Box>
                              ) : null}
                              <Box minW={0} flex="1">
                                {typeof header.column.columnDef.header === "string" ? (
                                  <Text as="span" sx={headerTypographySx} noOfLines={2}>
                                    {header.column.columnDef.header}
                                  </Text>
                                ) : (
                                  flexRender(header.column.columnDef.header, header.getContext())
                                )}
                              </Box>
                            </Flex>
                          )}
                          {canResize ? (
                            <Box
                              data-resize-handle
                              onMouseDown={header.getResizeHandler()}
                              onTouchStart={header.getResizeHandler()}
                              position="absolute"
                              right={0}
                              top={0}
                              zIndex={2}
                              h="100%"
                              w="6px"
                              cursor="col-resize"
                              userSelect="none"
                              _hover={{ bg: corpTable.resizeHandleHoverBg }}
                            />
                          ) : null}
                        </Th>
                      );
                    })}
                  </Tr>
                ))}
              </Thead>
              <Tbody>
                {isLoading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <Tr key={`sk-${i}`} h="44px" bg={i % 2 ? corpTable.rowAlt : corpTable.rowBase}>
                      {Array.from({ length: columnCount }).map((__, j) => (
                        <Td
                          key={j}
                          px={corpTable.tableCellPx}
                          py={corpTable.tableBodyPy}
                          h="44px"
                          borderBottomWidth="1px"
                          borderBottomColor={corpTable.tableRowRule}
                        >
                          <Skeleton
                            height="14px"
                            borderRadius="sm"
                            startColor={corpTable.skeletonStartColor}
                            endColor={corpTable.skeletonEndColor}
                          />
                        </Td>
                      ))}
                    </Tr>
                  ))
                ) : filteredCount === 0 ? (
                  <Tr>
                    <Td colSpan={leafColumnCount} py={16} borderColor="transparent">
                      <Flex direction="column" align="center" justify="center" gap={2}>
                        <Text
                          fontFamily="var(--font-graphik)"
                          fontSize="16px"
                          fontWeight={500}
                          color={corpTable.emptyStateTitleColor}
                        >
                          No rows match your filters
                        </Text>
                        <Text fontFamily="var(--font-graphik)" fontSize="13px" color={corpTable.bodyMuted}>
                          Reset grouping or column filters to see results.
                        </Text>
                      </Flex>
                    </Td>
                  </Tr>
                ) : useVirtual ? (
                  <>
                    {(() => {
                      const vItems = rowVirtualizer.getVirtualItems();
                      const total = rowVirtualizer.getTotalSize();
                      const padTop = vItems.length > 0 ? vItems[0].start : 0;
                      const padBottom =
                        vItems.length > 0 ? total - vItems[vItems.length - 1].end : 0;
                      return (
                        <>
                          {padTop > 0 ? (
                            <Tr aria-hidden>
                              <Td colSpan={leafColumnCount} p={0} border={0} h={`${padTop}px`} />
                            </Tr>
                          ) : null}
                          {vItems.map((vRow) => {
                            const row = rows[vRow.index];
                            if (!row) return null;
                            return (
                              <DataRow
                                key={row.id}
                                row={row}
                                selectedDetailId={selectedDetailId}
                                rowClick={rowClick}
                                onRowActivate={onRowActivate}
                              />
                            );
                          })}
                          {padBottom > 0 ? (
                            <Tr aria-hidden>
                              <Td colSpan={leafColumnCount} p={0} border={0} h={`${padBottom}px`} />
                            </Tr>
                          ) : null}
                        </>
                      );
                    })()}
                  </>
                ) : (
                  rows.map((row) => (
                    <Fragment key={row.id}>
                      <DataRow
                        row={row}
                        selectedDetailId={selectedDetailId}
                        rowClick={rowClick}
                        onRowActivate={onRowActivate}
                      />
                      {!row.getIsGrouped() && row.getIsExpanded() ? (
                        <Tr bg={corpTable.expandedDetailRowBg}>
                          <Td colSpan={leafColumnCount} p={0} borderBottomWidth="1px" borderColor={corpTable.tableRowRule}>
                            <CorporateGridRowQuickActions row={row.original} />
                          </Td>
                        </Tr>
                      ) : null}
                    </Fragment>
                  ))
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {!isLoading ? (
        <Box flexShrink={0}>
          <PortfolioPagination table={table} />
        </Box>
      ) : null}
    </>
  );

  if (scrollAreaMode === "fill") {
    return (
      <Flex direction="column" w="full" h="full" minH={0} minW={0} alignSelf="stretch">
        {inner}
      </Flex>
    );
  }

  return <>{inner}</>;
}

function DataRow({
  row,
  selectedDetailId,
  rowClick,
  onRowActivate,
}: {
  row: Row<CorporateBankingGridRow>;
  selectedDetailId: string | null;
  rowClick: (e: React.MouseEvent, row: Row<CorporateBankingGridRow>) => void;
  onRowActivate: (row: CorporateBankingGridRow) => void;
}) {
  const corpTable = useCorpTableTheme();
  const isGrouped = row.getIsGrouped();
  const orig = row.original;
  const isPanelRow = !isGrouped && selectedDetailId != null && selectedDetailId === orig.id;
  return (
    <Tr
      h="44px"
      bg={
        isPanelRow
          ? corpTable.rowPanelActiveBg
          : row.getIsSelected()
            ? corpTable.rowSelected
            : "transparent"
      }
      _hover={{
        bg: isPanelRow
          ? corpTable.rowPanelActiveHover
          : row.getIsSelected()
            ? corpTable.rowSelected
            : isGrouped
              ? corpTable.rowGroupedHoverBg
              : corpTable.rowHover,
      }}
      cursor="pointer"
      onClick={(e) => rowClick(e, row)}
      onKeyDown={(e) => {
        if (e.key !== "Enter") return;
        if (row.getIsGrouped()) {
          row.toggleExpanded();
          return;
        }
        onRowActivate(orig);
      }}
      tabIndex={0}
      sx={{ transition: "background 0.12s ease" }}
      fontWeight={isGrouped ? 600 : undefined}
    >
      {row.getVisibleCells().map((cell) => {
        const meta = cell.column.columnDef.meta as ColMeta | undefined;
        if (cell.getIsPlaceholder() === true) {
          return (
            <Td
              key={cell.id}
              minW={meta?.minW}
              w={cell.column.getSize()}
              px={corpTable.tableCellPx}
              py={corpTable.tableBodyPy}
              h="44px"
              verticalAlign="middle"
              borderBottomWidth="1px"
              borderBottomColor={corpTable.tableRowRule}
            />
          );
        }
        return (
          <Td
            key={cell.id}
            minW={meta?.minW}
            w={cell.column.getSize()}
            px={corpTable.tableCellPx}
            py={corpTable.tableBodyPy}
            h="44px"
            verticalAlign="middle"
            borderBottomWidth="1px"
            borderBottomColor={corpTable.tableRowRule}
          >
            {cell.getIsGrouped() ? (
              <Flex align="center" gap={2} minW={0}>
                <Box
                  as="button"
                  type="button"
                  data-group-toggle
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                  w="26px"
                  h="26px"
                  borderRadius="md"
                  bg={corpTable.groupToggleBg}
                  borderWidth="0"
                  color={corpTable.groupToggleColor}
                  cursor="pointer"
                  aria-expanded={row.getIsExpanded()}
                  aria-label={row.getIsExpanded() ? "Collapse group" : "Expand group"}
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    row.toggleExpanded();
                  }}
                >
                  {row.getIsExpanded() ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                </Box>
                <Box minW={0} flex="1">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Box>
              </Flex>
            ) : (
              flexRender(cell.column.columnDef.cell, cell.getContext())
            )}
          </Td>
        );
      })}
    </Tr>
  );
}
