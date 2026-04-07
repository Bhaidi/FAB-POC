import type { Table } from "@tanstack/react-table";
import type { CorporateBankingGridRow } from "@/data/corporateBankingGridTypes";
import type { CorporateGridColMeta } from "@/components/account-services/portfolio/corporateGrid/corporateGridColumnMeta";

function cellCsvValue(row: CorporateBankingGridRow, columnId: string): string {
  const o = row as Record<string, unknown>;
  const v = o[columnId];
  if (v == null) return "";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

export function exportCorporateGridToCsv(table: Table<CorporateBankingGridRow>, filename = "corporate-portfolio.csv") {
  const leafCols = table
    .getVisibleLeafColumns()
    .filter((c) => c.id !== "select" && c.id !== "expand");

  const headers = leafCols.map((c) => {
    const m = c.columnDef.meta as CorporateGridColMeta | undefined;
    return m?.label ?? c.id;
  });

  const dataRows = table.getFilteredRowModel().rows.filter((r) => !r.getIsGrouped());
  const lines: string[] = [];
  lines.push(headers.map(escapeCsv).join(","));

  for (const tableRow of dataRows) {
    const cells = leafCols.map((col) => {
      let raw: unknown;
      try {
        raw = tableRow.getValue(col.id);
      } catch {
        raw = undefined;
      }
      if (raw === undefined) {
        raw = cellCsvValue(tableRow.original, col.id);
      }
      if (raw == null) return escapeCsv("");
      if (typeof raw === "object") return escapeCsv(JSON.stringify(raw));
      return escapeCsv(String(raw));
    });
    lines.push(cells.join(","));
  }

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function escapeCsv(s: string): string {
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}
