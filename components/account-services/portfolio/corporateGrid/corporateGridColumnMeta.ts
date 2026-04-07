import type { ColumnDef, RowData } from "@tanstack/react-table";

export type CorporateGridColMeta = {
  /** Human label for column visibility menu */
  label?: string;
  minW?: string;
  /** Logical group key for documentation / future presets */
  groupKey?: "ENTITY" | "ACCOUNT_INFO" | "FINANCIALS" | "PRODUCT" | "ACTIVITY" | "ANALYTICS" | "STATUS";
};

export function metaLabel<T extends RowData>(def: ColumnDef<T, unknown>): string {
  const m = def.meta as CorporateGridColMeta | undefined;
  if (m?.label) return m.label;
  if ("accessorKey" in def && typeof def.accessorKey === "string") return def.accessorKey;
  return def.id ?? "";
}
