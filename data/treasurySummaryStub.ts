import { INTELLIGENCE_PANEL_BY_MODULE } from "@/data/executiveIntelligencePanels";
import type { TreasuryDistSlice, TreasuryDistributionRow, TreasurySummaryData, TreasurySummaryMap } from "@/data/treasurySummaryTypes";

const LEGEND_PALETTE = ["#5b9cf8", "#4ade80", "#f5c054", "#b870ff", "#f9738f", "#94a3b8"] as const;

function bars(percentages: number[]): number[] {
  const max = Math.max(...percentages, 1);
  return percentages.map((p) => Math.round((p / max) * 100));
}

/** Sort key from strings like "AED 754B", "AED 19B" (AED equivalent notionals). */
function parseAmountSortValue(amountLabel: string): number {
  const m = amountLabel.replace(/,/g, "").match(/([\d.]+)\s*([BMK])/i);
  if (!m) return 0;
  const n = parseFloat(m[1]);
  if (!Number.isFinite(n)) return 0;
  const u = (m[2] ?? "").toUpperCase();
  const mult = u === "B" ? 1e9 : u === "M" ? 1e6 : u === "K" ? 1e3 : 1;
  return n * mult;
}

type RowIn = {
  name: string;
  percent: number;
  amountLabel: string;
  amountValue?: number;
  tooltipLine?: string;
  accountCount?: number;
  legendColor?: string;
};

function finalizeRows(rows: RowIn[]): TreasuryDistributionRow[] {
  const bp = bars(rows.map((r) => r.percent));
  return rows.map((r, i) => ({
    name: r.name,
    percent: r.percent,
    amountLabel: r.amountLabel,
    amountValue: r.amountValue ?? parseAmountSortValue(r.amountLabel),
    barPercent: bp[i] ?? 0,
    tooltipLine:
      r.tooltipLine ??
      `${r.name}: ${r.percent}% (${r.amountLabel}${r.accountCount != null ? ` across ${r.accountCount} accounts` : ""})`,
    legendColor: r.legendColor ?? LEGEND_PALETTE[i % LEGEND_PALETTE.length],
  }));
}

function makeSlice(
  headerTitle: string,
  headerSubtext: string,
  rows: RowIn[],
  opts?: { summaryLine?: string; more?: { buttonLabel: string; rows: RowIn[] } },
): TreasuryDistSlice {
  return {
    headerTitle,
    headerSubtext,
    rows: finalizeRows(rows),
    summaryLine: opts?.summaryLine,
    more: opts?.more ? { buttonLabel: opts.more.buttonLabel, rows: finalizeRows(opts.more.rows) } : undefined,
  };
}

export const TREASURY_SUMMARY_STUB: TreasurySummaryMap = {
  portfolio: {
    sectionLabel: "",
    heroDisplay: "AED 1.64T",
    heroNumeric: { prefix: "AED ", value: 1.64, decimals: 2, suffix: "T" },
    summaryParts: [
      { type: "text", value: "Across " },
      { type: "accounts", count: 76 },
      { type: "text", value: " • " },
      { type: "currencies", count: 10 },
      { type: "text", value: " • " },
      { type: "countries", count: 10 },
    ],
    positionRows: [
      { label: "Total Assets", value: "AED 2.14T" },
      { label: "Total Liabilities", value: "AED 500B" },
    ],
    distribution: {
      defaultOptionId: "currency",
      options: [
        { id: "entity", label: "Entity" },
        { id: "currency", label: "Currency" },
        { id: "country", label: "Country" },
        { id: "productMix", label: "Product Mix" },
      ],
      slices: {
        currency: makeSlice(
          "Currency Distribution",
          "Based on AED equivalent balances",
          [
            { name: "AED", percent: 46, amountLabel: "AED 754B", tooltipLine: "AED: 46% (AED 754B across 32 accounts)", accountCount: 32, legendColor: "#5b9cf8" },
            { name: "USD", percent: 22, amountLabel: "AED 361B", tooltipLine: "USD: 22% (AED 361B across 18 accounts)", accountCount: 18, legendColor: "#4ade80" },
            { name: "EUR", percent: 18, amountLabel: "AED 295B", tooltipLine: "EUR: 18% (AED 295B across 12 accounts)", accountCount: 12, legendColor: "#f5c054" },
            { name: "OTH", percent: 14, amountLabel: "AED 230B", tooltipLine: "Other CCYs: 14% (AED 230B across 14 accounts)", accountCount: 14, legendColor: "#b870ff" },
          ],
          { summaryLine: "Top 3 currencies represent 81% of portfolio" },
        ),
        entity: makeSlice(
          "Entity Distribution",
          "By legal entity (AED equivalent)",
          [
            { name: "FAB Holdings LLC", percent: 28, amountLabel: "AED 459B", tooltipLine: "FAB Holdings LLC: 28% (AED 459B)", legendColor: "#5b9cf8" },
            { name: "FAB Treasury SPV", percent: 18, amountLabel: "AED 295B", tooltipLine: "FAB Treasury SPV: 18% (AED 295B)", legendColor: "#4ade80" },
            { name: "FAB Trading Ltd", percent: 16, amountLabel: "AED 262B", tooltipLine: "FAB Trading Ltd: 16% (AED 262B)", legendColor: "#f5c054" },
            { name: "Regional Subs", percent: 14, amountLabel: "AED 230B", tooltipLine: "Regional Subs: 14% (AED 230B)", legendColor: "#b870ff" },
          ],
          { summaryLine: "Largest entity represents 28% of group book" },
        ),
        country: makeSlice(
          "Country Distribution",
          "By booking country (AED equivalent)",
          [
            { name: "UAE", percent: 39, amountLabel: "AED 640B", tooltipLine: "UAE: 39% (AED 640B across 28 accounts)", accountCount: 28, legendColor: "#5b9cf8" },
            { name: "KSA", percent: 22, amountLabel: "AED 361B", tooltipLine: "KSA: 22% (AED 361B across 14 accounts)", accountCount: 14, legendColor: "#4ade80" },
            { name: "UK", percent: 14, amountLabel: "AED 230B", tooltipLine: "UK: 14% (AED 230B across 8 accounts)", accountCount: 8, legendColor: "#f5c054" },
            { name: "SG", percent: 12, amountLabel: "AED 197B", tooltipLine: "SG: 12% (AED 197B across 6 accounts)", accountCount: 6, legendColor: "#b870ff" },
          ],
          {
            summaryLine: "Top 3 countries represent 75% of portfolio",
            more: {
              buttonLabel: "+6 more countries",
              rows: [
                { name: "US", percent: 6, amountLabel: "AED 98B", tooltipLine: "US: 6% (AED 98B across 4 accounts)", accountCount: 4 },
                { name: "FR", percent: 3, amountLabel: "AED 49B", tooltipLine: "FR: 3% (AED 49B across 3 accounts)", accountCount: 3 },
                { name: "IN", percent: 2, amountLabel: "AED 33B", tooltipLine: "IN: 2% (AED 33B across 2 accounts)", accountCount: 2 },
                { name: "CN", percent: 2, amountLabel: "AED 33B", tooltipLine: "CN: 2% (AED 33B across 2 accounts)", accountCount: 2 },
                { name: "JP", percent: 1, amountLabel: "AED 16B", tooltipLine: "JP: 1% (AED 16B across 1 account)", accountCount: 1 },
                { name: "NL", percent: 1, amountLabel: "AED 16B", tooltipLine: "NL: 1% (AED 16B across 1 account)", accountCount: 1 },
              ],
            },
          },
        ),
        productMix: makeSlice(
          "Product Mix",
          "Share of group book (AED equivalent)",
          [
            { name: "Operating Accounts", percent: 38, amountLabel: "AED 820B", legendColor: "#5b9cf8" },
            { name: "Deposits", percent: 31, amountLabel: "AED 500B", legendColor: "#4ade80" },
            { name: "Loans (drawn)", percent: 20, amountLabel: "AED 320B", legendColor: "#f5c054" },
            { name: "Other", percent: 11, amountLabel: "AED 180B", legendColor: "#b870ff" },
          ],
          { summaryLine: "Cash and deposits together are 69% of gross assets" },
        ),
      },
    },
    intelligencePanel: INTELLIGENCE_PANEL_BY_MODULE.portfolio,
  },

  accounts: {
    sectionLabel: "Accounts",
    heroDisplay: "AED 820B",
    heroNumeric: { prefix: "AED ", value: 820, decimals: 0, suffix: "B" },
    summaryParts: [
      { type: "text", value: "Across " },
      { type: "accounts", count: 76 },
      { type: "text", value: " • " },
      { type: "currencies", count: 8 },
      { type: "text", value: " • " },
      { type: "countries", count: 6 },
    ],
    positionRows: [
      { label: "Total Available Balance", value: "AED 612B" },
      { label: "Total Current Balance", value: "AED 820B" },
    ],
    distribution: {
      defaultOptionId: "currency",
      options: [
        { id: "entity", label: "Entity" },
        { id: "currency", label: "Currency" },
        { id: "country", label: "Country" },
      ],
      slices: {
        currency: makeSlice(
          "Currency Distribution",
          "Cash balances by currency (AED equiv.)",
          [
            { name: "AED", percent: 44, amountLabel: "AED 361B", tooltipLine: "AED: 44% (AED 361B across 30 accounts)", accountCount: 30 },
            { name: "USD", percent: 26, amountLabel: "AED 213B", tooltipLine: "USD: 26% (AED 213B across 16 accounts)", accountCount: 16 },
            { name: "EUR", percent: 19, amountLabel: "AED 156B", tooltipLine: "EUR: 19% (AED 156B across 11 accounts)", accountCount: 11 },
            { name: "OTH", percent: 11, amountLabel: "AED 90B", tooltipLine: "Other: 11% (AED 90B across 9 accounts)", accountCount: 9 },
          ],
          { summaryLine: "AED and USD together are 70% of operating cash" },
        ),
        entity: makeSlice(
          "Entity Distribution",
          "Account balances by legal entity",
          [
            { name: "FAB Holdings LLC", percent: 32, amountLabel: "AED 262B", tooltipLine: "FAB Holdings LLC: 32% (AED 262B)" },
            { name: "FAB Trading Ltd", percent: 24, amountLabel: "AED 197B", tooltipLine: "FAB Trading Ltd: 24% (AED 197B)" },
            { name: "FAB Treasury SPV", percent: 20, amountLabel: "AED 164B", tooltipLine: "FAB Treasury SPV: 20% (AED 164B)" },
            { name: "Others", percent: 24, amountLabel: "AED 197B", tooltipLine: "Other entities: 24% (AED 197B)" },
          ],
          { summaryLine: "Primary pool entity holds almost a third of cash" },
        ),
        country: makeSlice(
          "Country Distribution",
          "Balances by account country",
          [
            { name: "UAE", percent: 41, amountLabel: "AED 336B", tooltipLine: "UAE: 41% (AED 336B across 31 accounts)", accountCount: 31 },
            { name: "KSA", percent: 23, amountLabel: "AED 189B", tooltipLine: "KSA: 23% (AED 189B across 15 accounts)", accountCount: 15 },
            { name: "UK", percent: 17, amountLabel: "AED 139B", tooltipLine: "UK: 17% (AED 139B across 12 accounts)", accountCount: 12 },
            { name: "SG", percent: 11, amountLabel: "AED 90B", tooltipLine: "SG: 11% (AED 90B across 7 accounts)", accountCount: 7 },
          ],
          {
            summaryLine: "UAE books over 40% of operating balances",
            more: {
              buttonLabel: "+2 more countries",
              rows: [
                { name: "BH", percent: 5, amountLabel: "AED 41B", tooltipLine: "BH: 5% (AED 41B across 5 accounts)", accountCount: 5 },
                { name: "EG", percent: 3, amountLabel: "AED 25B", tooltipLine: "EG: 3% (AED 25B across 6 accounts)", accountCount: 6 },
              ],
            },
          },
        ),
      },
    },
    intelligencePanel: INTELLIGENCE_PANEL_BY_MODULE.accounts,
  },

  deposits: {
    sectionLabel: "Deposits",
    heroDisplay: "AED 500B",
    heroNumeric: { prefix: "AED ", value: 500, decimals: 0, suffix: "B" },
    summaryParts: [
      { type: "deposits", count: 390 },
      { type: "text", value: " • " },
      { type: "currencies", count: 6 },
    ],
    positionRows: [
      { label: "Avg Interest Rate", value: "3.8% p.a." },
      { label: "Avg Tenor", value: "45 days" },
    ],
    distribution: {
      defaultOptionId: "maturity",
      options: [
        { id: "currency", label: "Currency" },
        { id: "country", label: "Country" },
        { id: "maturity", label: "Maturity" },
      ],
      slices: {
        maturity: makeSlice(
          "Maturity Distribution",
          "By next roll date (AED equivalent notional)",
          [
            { name: "< 7 days", percent: 10, amountLabel: "AED 50B", tooltipLine: "< 7 days: 10% (AED 50B, 42 deposits)" },
            { name: "7–30 days", percent: 24, amountLabel: "AED 120B", tooltipLine: "7–30 days: 24% (AED 120B, 98 deposits)" },
            { name: "1–3 months", percent: 40, amountLabel: "AED 200B", tooltipLine: "1–3 months: 40% (AED 200B, 156 deposits)" },
            { name: "> 3 months", percent: 26, amountLabel: "AED 130B", tooltipLine: "> 3 months: 26% (AED 130B, 94 deposits)" },
          ],
          {
            summaryLine: "40% of deposits mature within 30 days",
            more: {
              buttonLabel: "+12 more buckets (stub)",
              rows: [
                { name: "Overnight", percent: 4, amountLabel: "AED 20B", tooltipLine: "Overnight call: 4% (AED 20B)" },
                { name: "31–60 d", percent: 8, amountLabel: "AED 40B", tooltipLine: "31–60 days: 8% (AED 40B)" },
              ],
            },
          },
        ),
        currency: makeSlice(
          "Currency Distribution",
          "Time deposits by currency",
          [
            { name: "AED", percent: 38, amountLabel: "AED 190B", tooltipLine: "AED: 38% (AED 190B, 148 deposits)" },
            { name: "USD", percent: 29, amountLabel: "AED 145B", tooltipLine: "USD: 29% (AED 145B, 102 deposits)" },
            { name: "EUR", percent: 21, amountLabel: "AED 105B", tooltipLine: "EUR: 21% (AED 105B, 78 deposits)" },
            { name: "OTH", percent: 12, amountLabel: "AED 60B", tooltipLine: "Other: 12% (AED 60B, 62 deposits)" },
          ],
          { summaryLine: "AED book dominates short-dated liquidity" },
        ),
        country: makeSlice(
          "Country Distribution",
          "Deposits by booking country",
          [
            { name: "UAE", percent: 45, amountLabel: "AED 225B", tooltipLine: "UAE: 45% (AED 225B)" },
            { name: "KSA", percent: 24, amountLabel: "AED 120B", tooltipLine: "KSA: 24% (AED 120B)" },
            { name: "UK", percent: 18, amountLabel: "AED 90B", tooltipLine: "UK: 18% (AED 90B)" },
            { name: "SG", percent: 13, amountLabel: "AED 65B", tooltipLine: "SG: 13% (AED 65B)" },
          ],
          { summaryLine: "UAE concentration reflects hub treasury booking" },
        ),
      },
    },
    intelligencePanel: INTELLIGENCE_PANEL_BY_MODULE.deposits,
  },

  loans: {
    sectionLabel: "Loans",
    heroDisplay: "AED 320B",
    heroNumeric: { prefix: "AED ", value: 320, decimals: 0, suffix: "B" },
    summaryParts: [
      { type: "facilities", count: 24 },
      { type: "text", value: " • " },
      { type: "currencies", count: 5 },
    ],
    positionRows: [
      { label: "Available Credit", value: "AED 120B" },
      { label: "Avg Interest Rate", value: "4.2% p.a." },
    ],
    distribution: {
      defaultOptionId: "loanType",
      options: [
        { id: "currency", label: "Currency" },
        { id: "country", label: "Country" },
        { id: "loanType", label: "Loan Type" },
      ],
      slices: {
        loanType: makeSlice(
          "Loan Type Distribution",
          "Drawn amounts by facility type",
          [
            { name: "Term Loans", percent: 52, amountLabel: "AED 166B", tooltipLine: "Term Loans: 52% (AED 166B, 11 facilities)" },
            { name: "Revolving", percent: 26, amountLabel: "AED 83B", tooltipLine: "Revolving: 26% (AED 83B, 8 facilities)" },
            { name: "Trade Loans", percent: 14, amountLabel: "AED 45B", tooltipLine: "Trade Loans: 14% (AED 45B, 5 facilities)" },
            { name: "Overdraft / Other", percent: 8, amountLabel: "AED 26B", tooltipLine: "Overdraft / Other: 8% (AED 26B)" },
          ],
          { summaryLine: "Term facilities carry the majority of drawn exposure" },
        ),
        currency: makeSlice(
          "Currency Distribution",
          "Outstandings by facility currency",
          [
            { name: "AED", percent: 48, amountLabel: "AED 154B", tooltipLine: "AED: 48% (AED 154B)" },
            { name: "USD", percent: 31, amountLabel: "AED 99B", tooltipLine: "USD: 31% (AED 99B)" },
            { name: "EUR", percent: 15, amountLabel: "AED 48B", tooltipLine: "EUR: 15% (AED 48B)" },
            { name: "OTH", percent: 6, amountLabel: "AED 19B", tooltipLine: "Other: 6% (AED 19B)" },
          ],
          { summaryLine: "AED debt aligns with domestic revenue base" },
        ),
        country: makeSlice(
          "Country Distribution",
          "Facilities by borrower jurisdiction",
          [
            { name: "UAE", percent: 46, amountLabel: "AED 147B", tooltipLine: "UAE: 46% (AED 147B)" },
            { name: "KSA", percent: 24, amountLabel: "AED 77B", tooltipLine: "KSA: 24% (AED 77B)" },
            { name: "UK", percent: 18, amountLabel: "AED 58B", tooltipLine: "UK: 18% (AED 58B)" },
            { name: "SG", percent: 12, amountLabel: "AED 38B", tooltipLine: "SG: 12% (AED 38B)" },
          ],
          { summaryLine: "UAE remains the primary booking jurisdiction" },
        ),
      },
    },
    intelligencePanel: INTELLIGENCE_PANEL_BY_MODULE.loans,
  },
};

export function getTreasurySummaryForModule(module: keyof TreasurySummaryMap): TreasurySummaryData {
  return TREASURY_SUMMARY_STUB[module];
}
