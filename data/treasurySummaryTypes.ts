import type { PortfolioModuleTab } from "@/data/portfolioSummaryTypes";

/** @deprecated */
export type TreasuryMetric = {
  label: string;
  value: string;
};

/** Clickable fragments for optional meta line under hero (column 1) */
export type TreasurySummaryPart =
  | { type: "text"; value: string }
  | { type: "accounts"; count: number }
  | { type: "currencies"; count: number }
  | { type: "countries"; count: number }
  | { type: "deposits"; count: number }
  | { type: "facilities"; count: number };

export type TreasurySummaryInteractiveKind = Exclude<TreasurySummaryPart["type"], "text">;

/** Ranked distribution row — label | % | amount | distribution bar */
export type TreasuryDistributionRow = {
  name: string;
  percent: number;
  amountLabel: string;
  /** Relative bar fill (0–100), derived from row set for visual comparison */
  barPercent: number;
  /** Numeric amount for sorting (AED equivalent scale from `amountLabel` when not set in stub) */
  amountValue?: number;
  tooltipLine?: string;
  tooltipDetail?: string;
  legendColor?: string;
  accountCount?: number;
};

export type TreasuryDistributionMore = {
  buttonLabel: string;
  rows: TreasuryDistributionRow[];
};

export type TreasuryDistSlice = {
  headerTitle: string;
  headerSubtext: string;
  rows: TreasuryDistributionRow[];
  summaryLine?: string;
  more?: TreasuryDistributionMore;
};

export type TreasuryDistributionConfig = {
  options: Array<{ id: string; label: string }>;
  defaultOptionId: string;
  slices: Record<string, TreasuryDistSlice>;
};

/** Column 1 — stacked position metrics */
export type ExecutivePositionRow = {
  label: string;
  value: string;
};

/** Column 3 — intelligence blocks */
export type ExecutiveIntelBlock =
  | { variant: "keyValue"; title: string; rows: { label: string; value: string }[] }
  | { variant: "insight"; title: string; body: string }
  | { variant: "bullets"; title: string; items: string[] };

/** Structured intelligence column — context-aware per module (Portfolio / Accounts / Deposits / Loans). */
export type IntelligenceInsightContent = {
  headline: string;
  drivers: string[];
  recommendation?: string;
};

export type IntelligenceEventItem = {
  id: string;
  label: string;
  /** Days until the event; lower = more urgent for styling */
  daysUntil: number;
  /** When `daysUntil <= 0`, chip can show e.g. "2h" instead of "Today" */
  hoursUntil?: number;
};

export type IntelligenceAlertItem = {
  id: string;
  label: string;
  severity: "high" | "medium" | "low";
};

export type ExecutiveIntelligencePanel = {
  insight: IntelligenceInsightContent;
  events: IntelligenceEventItem[];
  alerts: IntelligenceAlertItem[];
};

export type TreasurySummaryData = {
  /** Uppercase section label, e.g. PORTFOLIO */
  sectionLabel: string;
  heroDisplay: string;
  heroNumeric?: {
    prefix: string;
    value: number;
    decimals: number;
    suffix: string;
  };
  /** Optional meta under hero (clickable segments) */
  summaryParts?: TreasurySummaryPart[];
  positionRows: ExecutivePositionRow[];
  distribution: TreasuryDistributionConfig;
  /** @deprecated Prefer `intelligencePanel` for column 3 UI. */
  intelligence?: ExecutiveIntelBlock[];
  intelligencePanel: ExecutiveIntelligencePanel;
  metrics?: TreasuryMetric[];
};

export type TreasurySummaryMap = Record<PortfolioModuleTab, TreasurySummaryData>;
