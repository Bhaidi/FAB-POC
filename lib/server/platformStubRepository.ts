/**
 * Organization-scoped platform stubs — JSON-backed until upstream APIs exist.
 */
import marketsCatalog from "@/data/platformStubs/markets-catalog.json";
import org3001Markets from "@/data/platformStubs/org-3001-markets.json";
import org3001Data from "@/data/platformStubs/org-3001-market-data.json";
import userContext9001 from "@/data/platformStubs/user-context-org-9001.json";
import userContext9002 from "@/data/platformStubs/user-context-org-9002.json";
import userContext9003 from "@/data/platformStubs/user-context-org-9003.json";
import type {
  ActivityItem,
  MarketStatus,
  MarketSummary,
  MarketsListResponse,
  PlatformMarket,
  ServiceItem,
} from "@/types/platformMarkets";
import type { PlatformUserContext, PlatformUserWorkflowRole } from "@/types/platformUserContext";

/** Default when no `x-organization-id` / env — must exist in `USER_BY_ORG`. */
export const DEFAULT_STUB_ORGANIZATION_ID = "org-9001";

type CatalogRow = {
  code: string;
  name: string;
  type: string;
  status: MarketStatus;
};

type OrgMarketPack = {
  summary: Omit<MarketSummary, "status"> & { status?: MarketStatus };
  services: ServiceItem[];
  activities: ActivityItem[];
};

const CATALOG = marketsCatalog as CatalogRow[];

export const ALL_MARKET_CODES: string[] = CATALOG.map((r) => r.code);

export function normalizeMarketCode(raw: string): string {
  return raw.trim().toUpperCase();
}

const USER_BY_ORG_RAW: Record<string, PlatformUserContext> = {
  "org-9001": userContext9001 as PlatformUserContext,
  "org-9002": userContext9002 as PlatformUserContext,
  "org-9003": userContext9003 as PlatformUserContext,
};

function coerceWorkflowRole(v: unknown): PlatformUserWorkflowRole {
  if (v === "CHECKER" || v === "MAKER" || v === "ADMIN") return v;
  return "MAKER";
}

function normalizeUserContextRow(row: PlatformUserContext): PlatformUserContext {
  return {
    ...row,
    userRole: coerceWorkflowRole(row.userRole),
  };
}

const USER_BY_ORG: Record<string, PlatformUserContext> = Object.fromEntries(
  Object.entries(USER_BY_ORG_RAW).map(([k, v]) => [k, normalizeUserContextRow(v)])
) as Record<string, PlatformUserContext>;

const FULL_ORG_3001_MARKETS = org3001Markets as MarketsListResponse;
const FULL_ORG_3001_DATA = org3001Data as Record<string, OrgMarketPack>;

function sliceMarketsPayload(
  full: MarketsListResponse,
  codes: readonly string[],
  defaultMarket: string
): MarketsListResponse {
  const codeSet = new Set(codes.map((c) => normalizeMarketCode(c)));
  const markets = full.markets.filter((m) => codeSet.has(normalizeMarketCode(m.code)));
  return {
    defaultMarket: normalizeMarketCode(defaultMarket),
    markets,
  };
}

function sliceMarketData(full: Record<string, OrgMarketPack>, codes: readonly string[]): Record<string, OrgMarketPack> {
  const out: Record<string, OrgMarketPack> = {};
  for (const c of codes) {
    const k = normalizeMarketCode(c);
    const row = full[k];
    if (row) out[k] = row;
  }
  return out;
}

/** Max-demo org: all slice countries fully switchable (incl. FR). */
function maxDemoMarketsPayload(base: MarketsListResponse): MarketsListResponse {
  return {
    ...base,
    markets: base.markets.map((m) => {
      const code = normalizeMarketCode(m.code);
      if (code !== "FR") return m;
      return {
        ...m,
        selectable: true,
        operationalStatus: "active" as const,
        onboardingStatus: "completed" as const,
        availableServices: Math.max(m.availableServices ?? 0, 8),
        pendingActions: Math.max(m.pendingActions ?? 0, 1),
      };
    }),
  };
}

const _MAX_MARKETS = sliceMarketsPayload(FULL_ORG_3001_MARKETS, ["UAE", "UK", "SG", "HK", "FR"], "UAE");

const MARKETS_PAYLOAD_BY_ORG: Record<string, MarketsListResponse> = {
  "org-9001": maxDemoMarketsPayload(_MAX_MARKETS),
  "org-9002": sliceMarketsPayload(FULL_ORG_3001_MARKETS, ["UAE"], "UAE"),
  "org-9003": sliceMarketsPayload(FULL_ORG_3001_MARKETS, ["UAE", "UK", "SG"], "UAE"),
};

const MARKET_DATA_BY_ORG: Record<string, Record<string, OrgMarketPack>> = {
  "org-9001": sliceMarketData(FULL_ORG_3001_DATA, ["UAE", "UK", "SG", "HK", "FR"]),
  "org-9002": sliceMarketData(FULL_ORG_3001_DATA, ["UAE"]),
  "org-9003": sliceMarketData(FULL_ORG_3001_DATA, ["UAE", "UK", "SG"]),
};

export const DEMO_ORG_IDS = ["org-9001", "org-9002", "org-9003"] as const;

export const KNOWN_ORG_IDS = new Set<string>([...DEMO_ORG_IDS]);

export function isValidMarketCode(code: string): boolean {
  return ALL_MARKET_CODES.includes(code);
}

export function resolveOrganizationId(request: Request): string {
  const header = request.headers.get("x-organization-id")?.trim();
  if (header && KNOWN_ORG_IDS.has(header)) return header;
  const env = process.env.FAB_ACCESS_ORG_ID?.trim();
  if (env && KNOWN_ORG_IDS.has(env)) return env;
  return DEFAULT_STUB_ORGANIZATION_ID;
}

export function getUserContext(organizationId: string): PlatformUserContext {
  return USER_BY_ORG[organizationId] ?? USER_BY_ORG[DEFAULT_STUB_ORGANIZATION_ID]!;
}

function catalogRow(code: string): CatalogRow | undefined {
  return CATALOG.find((r) => r.code === code);
}

function catalogStatus(code: string): MarketStatus {
  return catalogRow(code)?.status ?? "operational";
}

function marketsPayloadForOrg(organizationId: string): MarketsListResponse {
  return MARKETS_PAYLOAD_BY_ORG[organizationId] ?? MARKETS_PAYLOAD_BY_ORG[DEFAULT_STUB_ORGANIZATION_ID]!;
}

export function getMarketsResponseForOrganization(organizationId: string): MarketsListResponse {
  const raw = marketsPayloadForOrg(organizationId);
  const markets = raw.markets.filter((m) => m.accessible && m.visibility === "visible");
  return {
    defaultMarket: normalizeMarketCode(raw.defaultMarket),
    markets,
  };
}

export function findMarketForOrganization(organizationId: string, marketCode: string): PlatformMarket | undefined {
  const { markets } = getMarketsResponseForOrganization(organizationId);
  const code = normalizeMarketCode(marketCode);
  return markets.find((m) => normalizeMarketCode(m.code) === code);
}

export function isMarketAccessibleForOrganization(organizationId: string, marketCode: string): boolean {
  return findMarketForOrganization(organizationId, marketCode) != null;
}

export function canOrganizationSwitchToMarket(organizationId: string, marketCode: string): boolean {
  const m = findMarketForOrganization(organizationId, marketCode);
  return !!m && m.selectable && m.operationalStatus === "active";
}

export function canLoadOperationalMarketData(organizationId: string, marketCode: string): boolean {
  if (!canOrganizationSwitchToMarket(organizationId, marketCode)) return false;
  const code = normalizeMarketCode(marketCode);
  const orgData = MARKET_DATA_BY_ORG[organizationId];
  return !!orgData?.[code];
}

export function getMarketSummaryForOrganization(organizationId: string, marketCode: string): MarketSummary | null {
  const code = normalizeMarketCode(marketCode);
  if (!isValidMarketCode(code) || !canLoadOperationalMarketData(organizationId, code)) {
    return null;
  }
  const orgData = MARKET_DATA_BY_ORG[organizationId];
  const pack = orgData?.[code];
  if (!pack) return null;
  const { summary } = pack;
  return {
    ...summary,
    marketCode: code,
    status: summary.status ?? catalogStatus(code),
  };
}

export function getMarketServicesForOrganization(organizationId: string, marketCode: string): ServiceItem[] | null {
  const code = normalizeMarketCode(marketCode);
  if (!isValidMarketCode(code) || !canLoadOperationalMarketData(organizationId, code)) {
    return null;
  }
  const orgData = MARKET_DATA_BY_ORG[organizationId];
  return orgData?.[code]?.services ?? null;
}

export function getMarketActivitiesForOrganization(
  organizationId: string,
  marketCode: string,
  limit: number
): ActivityItem[] | null {
  const code = normalizeMarketCode(marketCode);
  if (!isValidMarketCode(code) || !canLoadOperationalMarketData(organizationId, code)) {
    return null;
  }
  const orgData = MARKET_DATA_BY_ORG[organizationId];
  const list = orgData?.[code]?.activities;
  if (!list) return null;
  const cap = Math.min(Math.max(limit, 1), 10);
  return list.slice(0, cap);
}
