import type { CorporateBankingGridRow, CorporateGridProductType } from "@/data/corporateBankingGridTypes";
import { CORPORATE_PORTFOLIO_TAB_COUNTS } from "@/data/corporateBankingGridTypes";

const ENTITIES = [
  "FAB Holdings LLC",
  "FAB Trading Sub A Ltd",
  "MENA Treasury SPV",
  "Singapore Operations Pte Ltd",
  "UK Financing Limited",
  "LuxCo Treasury S.à r.l.",
  "India Collections Pvt Ltd",
  "US Collections — Subsidiary A",
  "GCC Project Co LLC",
  "Europe Liquidity DAC",
] as const;

const COUNTRIES: { code: string; name: string; ccy: string }[] = [
  { code: "AE", name: "United Arab Emirates", ccy: "AED" },
  { code: "SG", name: "Singapore", ccy: "SGD" },
  { code: "GB", name: "United Kingdom", ccy: "GBP" },
  { code: "US", name: "United States", ccy: "USD" },
  { code: "SA", name: "Saudi Arabia", ccy: "SAR" },
  { code: "EG", name: "Egypt", ccy: "EGP" },
  { code: "IN", name: "India", ccy: "INR" },
  { code: "HK", name: "Hong Kong", ccy: "HKD" },
  { code: "LU", name: "Luxembourg", ccy: "EUR" },
  { code: "CH", name: "Switzerland", ccy: "CHF" },
];

const ACCOUNT_TYPES: CorporateGridProductType[] = [
  "Current",
  "Savings",
  "External",
  "Call",
  "Time Deposit",
];

const NAME_PREFIXES = [
  "Operating",
  "Collections",
  "Payroll",
  "Treasury Pool",
  "Escrow",
  "VAT",
  "Trust",
  "Liquidity",
  "Project Escrow",
  "Intercompany",
];

/** Deterministic pseudo-random for reproducible stubs */
export function seededOffset(seed: number, max: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return Math.floor((x - Math.floor(x)) * max);
}

export function ibanFor(seed: number, countryCode: string): string {
  const cc = countryCode.toUpperCase().slice(0, 2).padEnd(2, "0");
  let n = "";
  let s = seed * 9301 + 49297;
  for (let k = 0; k < 22; k++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    n += String(s % 10);
  }
  const raw = `${cc}83${n}`.slice(0, 34);
  return raw.match(/.{1,4}/g)?.join(" ") ?? raw;
}

export function formatCustomerId(seed: number): string {
  return `CIF-${String(8800000 + (seed % 120000)).padStart(7, "0")}`;
}

export function buildCorporateAccountRow(i: number): CorporateBankingGridRow {
  const seed = i + 1;
  const country = COUNTRIES[seededOffset(seed * 3, COUNTRIES.length)];
  const entity = ENTITIES[seededOffset(seed * 7, ENTITIES.length)];
  const type = ACCOUNT_TYPES[seededOffset(seed * 11, ACCOUNT_TYPES.length)];
  const namePart = NAME_PREFIXES[seededOffset(seed * 13, NAME_PREFIXES.length)];
  const ccyRoll = seededOffset(seed * 17, 100);
  const accountCcy = ccyRoll < 70 ? country.ccy : COUNTRIES[seededOffset(seed * 19, COUNTRIES.length)].ccy;

  const accountNumber = String(1000000000 + ((seed * 7919) % 899999999));
  const balanceAed = 25_000 + ((seed * 1103515245) % 48_000_000_000);
  const blocked = Math.round(balanceAed * (seededOffset(seed * 23, 5) / 100_000));
  const statuses = ["Active", "Active", "Active", "Dormant", "Restricted"] as const;
  const status = statuses[seededOffset(seed * 29, statuses.length)];

  const lastTx = new Date(Date.UTC(2025, seededOffset(seed, 11), 1 + seededOffset(seed * 2, 27)));
  const lastTxIso = lastTx.toISOString().slice(0, 10);

  return {
    id: `corp-acc-${seed}`,
    productLine: "account",
    entity,
    customerId: formatCustomerId(seed * 97),
    accountCountryCode: country.code,
    accountCountryName: country.name,
    accountName: `${namePart} — ${entity.split(" ")[0]} ${accountCcy} (${seed})`,
    accountCcy,
    accountNumber,
    iban: ibanFor(seed, country.code),
    accountType: type,
    status,
    balanceAed,
    productTypeLabel: type,
    facilityDisplayName: `${namePart} — ${entity.split(" ")[0]} ${accountCcy} (${seed})`,
    balance: balanceAed,
    availableBalance: Math.max(0, balanceAed - blocked),
    utilisedAmount: type === "External" ? Math.round(balanceAed * 0.12) : 0,
    exposure: balanceAed,
    lastActivityDate: lastTxIso,
    lastTransactionDate: lastTxIso,
    netPosition: balanceAed - Math.round(balanceAed * 0.02),
    liquidityImpact:
      seededOffset(seed * 31, 3) === 0 ? "Negative" : seededOffset(seed * 31, 3) === 1 ? "Neutral" : "Positive",
    riskFlag: type === "External" ? "High" : seededOffset(seed * 37, 10) > 7 ? "Medium" : "Low",
    currentBalance: balanceAed,
    blockedAmount: blocked,
    dailyMovement: Math.round(balanceAed * (seededOffset(seed * 41, 200) - 100) / 10_000),
    thirtyDayAvgBalance: Math.round(balanceAed * (0.92 + seededOffset(seed * 43, 16) / 100)),
  };
}

/** Full stub set — length matches CORPORATE_PORTFOLIO_TAB_COUNTS.accounts */
export const CORPORATE_ACCOUNTS_PORTFOLIO_MOCK: CorporateBankingGridRow[] = Array.from(
  { length: CORPORATE_PORTFOLIO_TAB_COUNTS.accounts },
  (_, i) => buildCorporateAccountRow(i),
);

export function listCorporateAccountsPortfolio(): CorporateBankingGridRow[] {
  return [...CORPORATE_ACCOUNTS_PORTFOLIO_MOCK];
}
