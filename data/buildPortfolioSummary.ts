import type { CorporateAccountPortfolioRow } from "@/data/corporateAccountPortfolioTypes";
import { CORPORATE_PORTFOLIO_TAB_COUNTS } from "@/data/corporateAccountPortfolioTypes";
import type {
  PortfolioCurrencyExposureRow,
  PortfolioModuleTab,
  PortfolioSummarySnapshot,
} from "@/data/portfolioSummaryTypes";
import { formatAedExecutive } from "@/lib/formatAedExecutive";

function computeInsight(sortedCcy: [string, number][], totalAed: number, currencyCount: number): string {
  if (totalAed <= 0 || sortedCcy.length === 0) {
    return "Add positions to see allocation insights.";
  }
  const shares = sortedCcy.map(([, v]) => (v / totalAed) * 100);
  const topCode = sortedCcy[0][0];
  const topShare = shares[0] ?? 0;
  const top3Sum = shares.slice(0, 3).reduce((a, b) => a + b, 0);

  if (currencyCount >= 8 && topShare < 22) {
    return `Diversified across ${currencyCount} currencies`;
  }
  if (topShare >= 28) {
    return `High concentration in ${topCode} (${Math.round(topShare)}%)`;
  }
  if (sortedCcy.length >= 3 && top3Sum >= 70) {
    return `Top 3 currencies represent ${Math.round(top3Sum)}% of portfolio`;
  }
  if (sortedCcy.length >= 3) {
    return `Top 3 currencies represent ${Math.round(top3Sum)}% of portfolio`;
  }
  return `Largest position is ${topCode} (${Math.round(topShare)}%)`;
}

function exposureRowsFromSorted(
  sortedCcy: [string, number][],
  totalAed: number,
): PortfolioCurrencyExposureRow[] {
  const top4 = sortedCcy.slice(0, 4);
  const maxVal = top4[0]?.[1] ?? 0;
  if (top4.length === 0 || totalAed <= 0) {
    return [{ code: "—", amountLabel: "AED 0", sharePercent: 0, barPercent: 0 }];
  }
  return top4.map(([code, val]) => ({
    code,
    amountLabel: formatAedExecutive(val),
    sharePercent: Math.round((val / totalAed) * 100),
    barPercent: maxVal > 0 ? Math.min(100, (val / maxVal) * 100) : 0,
  }));
}

export function buildAccountsPortfolioSummary(rows: CorporateAccountPortfolioRow[]): PortfolioSummarySnapshot {
  const totalAed = rows.reduce((s, r) => s + r.balanceAed, 0);
  const entitySet = new Set(rows.map((r) => r.entity));
  const entityCount = entitySet.size;
  const countries = new Set(rows.map((r) => r.accountCountryCode));
  const countryCount = countries.size;

  const byCcy = new Map<string, number>();
  for (const r of rows) {
    byCcy.set(r.accountCcy, (byCcy.get(r.accountCcy) ?? 0) + r.balanceAed);
  }
  const sortedCcy = Array.from(byCcy.entries()).sort((a, b) => b[1] - a[1]);
  const currencyCount = sortedCcy.length;

  const currencyExposureTop = exposureRowsFromSorted(sortedCcy, totalAed);
  const moreCurrenciesCount = Math.max(0, sortedCcy.length - 4);
  const insightLine = computeInsight(sortedCcy, totalAed, currencyCount);

  const attentionCount = rows.filter((r) => r.accountType === "External").length;
  const timeDepositCount = rows.filter((r) => r.accountType === "Time Deposit").length;
  const maturingDeposits = timeDepositCount > 0 ? Math.min(timeDepositCount, 2) : 0;
  const inactiveSignal = rows.length >= 40 && rows.filter((r) => r.accountType === "Call").length > 0;

  const alerts: string[] = [];
  if (attentionCount > 0) {
    alerts.push(
      `${attentionCount} account${attentionCount === 1 ? "" : "s"} require${attentionCount === 1 ? "s" : ""} attention`,
    );
  }
  if (maturingDeposits > 0) {
    alerts.push(
      `${maturingDeposits} deposit${maturingDeposits === 1 ? "" : "s"} mature in 7 days`,
    );
  }
  if (inactiveSignal && alerts.length < 3) {
    alerts.push("1 inactive account");
  }

  return {
    totalBalanceLabel: formatAedExecutive(totalAed),
    metaLine: `Across ${rows.length} accounts • ${currencyCount} currencies • ${countryCount} countries`,
    entityCount,
    positionLabel: "Accounts",
    positionCount: rows.length,
    countryCount,
    currencyCount,
    currencyExposureTop,
    moreCurrenciesCount,
    insightLine,
    alerts,
  };
}

/** Stub aggregates for deposits — aligned with tab counts, deterministic from accounts slice. */
export function buildDepositsPortfolioSummary(rows: CorporateAccountPortfolioRow[]): PortfolioSummarySnapshot {
  const entityCount = new Set(rows.map((r) => r.entity)).size;
  const countryCount = new Set(rows.map((r) => r.accountCountryCode)).size;
  const base = rows.reduce((s, r) => s + r.balanceAed, 0);
  const totalAed = base * 1.88;
  const positionCount = CORPORATE_PORTFOLIO_TAB_COUNTS.deposits;

  const weights: [string, number][] = [
    ["AED", 0.33],
    ["USD", 0.26],
    ["EUR", 0.19],
    ["SGD", 0.12],
    ["SAR", 0.06],
    ["OTH", 0.04],
  ];
  const sortedCcy: [string, number][] = weights.map(([c, w]): [string, number] => [c, totalAed * w]);
  sortedCcy.sort((a, b) => b[1] - a[1]);
  const currencyExposureTop = exposureRowsFromSorted(sortedCcy, totalAed);
  const currencyCount = weights.length;
  const moreCurrenciesCount = Math.max(0, currencyCount - 4);
  const insightLine = computeInsight(sortedCcy, totalAed, currencyCount);

  const alerts: string[] = [
    `${Math.min(5, 2 + (positionCount % 4))} deposits roll within 30 days`,
    "Review rate locks on 3 structures",
  ].slice(0, 2);

  return {
    totalBalanceLabel: formatAedExecutive(totalAed),
    metaLine: `Across ${positionCount} deposits • ${currencyCount} currencies • ${countryCount} countries`,
    entityCount,
    positionLabel: "Deposits",
    positionCount,
    countryCount,
    currencyCount,
    currencyExposureTop,
    moreCurrenciesCount,
    insightLine,
    alerts,
  };
}

export function buildLoansPortfolioSummary(rows: CorporateAccountPortfolioRow[]): PortfolioSummarySnapshot {
  const entityCount = new Set(rows.map((r) => r.entity)).size;
  const countryCount = new Set(rows.map((r) => r.accountCountryCode)).size;
  const base = rows.reduce((s, r) => s + r.balanceAed, 0);
  const totalAed = base * 0.38;
  const positionCount = CORPORATE_PORTFOLIO_TAB_COUNTS.loans;

  const weights: [string, number][] = [
    ["AED", 0.41],
    ["USD", 0.29],
    ["EUR", 0.17],
    ["GBP", 0.13],
  ];
  const sortedCcy: [string, number][] = weights.map(([c, w]): [string, number] => [c, totalAed * w]);
  sortedCcy.sort((a, b) => b[1] - a[1]);
  const currencyExposureTop = exposureRowsFromSorted(sortedCcy, totalAed);
  const currencyCount = weights.length;
  const moreCurrenciesCount = Math.max(0, currencyCount - 4);
  const insightLine = computeInsight(sortedCcy, totalAed, currencyCount);

  const alerts: string[] = ["2 facilities due for covenant review"].slice(0, 2);

  return {
    totalBalanceLabel: formatAedExecutive(totalAed),
    metaLine: `Across ${positionCount} loans • ${currencyCount} currencies • ${countryCount} countries`,
    entityCount,
    positionLabel: "Loans",
    positionCount,
    countryCount,
    currencyCount,
    currencyExposureTop,
    moreCurrenciesCount,
    insightLine,
    alerts,
  };
}

/** Combined books: accounts + deposits + loans notionals for executive portfolio view. */
export function buildFullBooksPortfolioSummary(rows: CorporateAccountPortfolioRow[]): PortfolioSummarySnapshot {
  const accountsSnap = buildAccountsPortfolioSummary(rows);
  const depositsSnap = buildDepositsPortfolioSummary(rows);
  const loansSnap = buildLoansPortfolioSummary(rows);

  const accountsTotal = rows.reduce((s, r) => s + r.balanceAed, 0);
  const depositsTotal = accountsTotal * 1.88;
  const loansTotal = accountsTotal * 0.38;
  const totalAed = accountsTotal + depositsTotal + loansTotal;

  const entityCount = accountsSnap.entityCount;
  const countryCount = accountsSnap.countryCount;
  const nAcc = CORPORATE_PORTFOLIO_TAB_COUNTS.accounts;
  const nDep = CORPORATE_PORTFOLIO_TAB_COUNTS.deposits;
  const nLoans = CORPORATE_PORTFOLIO_TAB_COUNTS.loans;
  const nPos = CORPORATE_PORTFOLIO_TAB_COUNTS.portfolio;

  const byCcy = new Map<string, number>();
  for (const r of rows) {
    byCcy.set(r.accountCcy, (byCcy.get(r.accountCcy) ?? 0) + r.balanceAed);
  }
  const sortedCcy = Array.from(byCcy.entries()).sort((a, b) => b[1] - a[1]);
  const scale = accountsTotal > 0 ? totalAed / accountsTotal : 0;
  const scaledSorted: [string, number][] = sortedCcy.map(([c, v]) => [c, v * scale]);
  const currencyCount = accountsSnap.currencyCount;

  const currencyExposureTop = exposureRowsFromSorted(scaledSorted.length > 0 ? scaledSorted : [["—", 0]], totalAed);
  const moreCurrenciesCount = Math.max(0, sortedCcy.length - 4);
  const insightLine =
    totalAed > 0 && scaledSorted.length > 0
      ? computeInsight(scaledSorted, totalAed, currencyCount)
      : "Add positions to see allocation insights.";

  const alerts = [...accountsSnap.alerts, ...depositsSnap.alerts.slice(0, 1), ...loansSnap.alerts].slice(0, 3);

  return {
    totalBalanceLabel: formatAedExecutive(totalAed),
    metaLine: `Across ${nPos} positions (${nAcc} accounts • ${nDep} deposits • ${nLoans} loans) • ${countryCount} countries`,
    entityCount,
    positionLabel: "Positions",
    positionCount: nPos,
    countryCount,
    currencyCount,
    currencyExposureTop,
    moreCurrenciesCount,
    insightLine,
    alerts,
  };
}

export function buildPortfolioSummary(
  module: PortfolioModuleTab,
  rows: CorporateAccountPortfolioRow[],
): PortfolioSummarySnapshot {
  if (module === "portfolio") return buildFullBooksPortfolioSummary(rows);
  if (module === "deposits") return buildDepositsPortfolioSummary(rows);
  if (module === "loans") return buildLoansPortfolioSummary(rows);
  return buildAccountsPortfolioSummary(rows);
}
