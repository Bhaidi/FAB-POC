/**
 * Browser client for `/api/v1/platform/*` — mirrors upstream treasury APIs.
 */
import type {
  MarketActivitiesResponse,
  MarketServicesResponse,
  MarketSummary,
  MarketsListResponse,
  UserMarketContextResponse,
} from "@/types/platformMarkets";
import type { DashboardWidgetsResponse } from "@/types/platformDashboard";
import type { PlatformUserContext } from "@/types/platformUserContext";
import type { MarketServiceAccessResponse, ServiceCatalogResponse } from "@/types/platformServiceTaxonomy";
import { readStubAuthSession } from "@/lib/authStubSession";
import { resolveStubPlatformOrganizationId } from "@/data/platformStubTestPersonas";

const BASE = "/api/v1/platform";

/** Stub login personas override explicit org so every platform call stays consistent before/after user-context loads. */
function platformApiOrganizationId(explicit: string | null): string | null {
  if (typeof window !== "undefined") {
    const s = readStubAuthSession();
    if (s) {
      const mapped = resolveStubPlatformOrganizationId(s.corporateId, s.userId);
      if (mapped) return mapped;
    }
  }
  return explicit;
}

function organizationHeaders(organizationId: string | null): HeadersInit {
  const org = platformApiOrganizationId(organizationId);
  if (!org) return {};
  return { "x-organization-id": org };
}

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function fetchUserContext(): Promise<PlatformUserContext> {
  const res = await fetch(`${BASE}/user-context`, { cache: "no-store" });
  return parseJson<PlatformUserContext>(res);
}

export async function fetchDashboardWidgets(organizationId: string | null, marketCode: string): Promise<DashboardWidgetsResponse> {
  const code = encodeURIComponent(marketCode.trim());
  const res = await fetch(`${BASE}/dashboard/widgets?market=${code}`, {
    cache: "no-store",
    headers: organizationHeaders(organizationId),
  });
  return parseJson<DashboardWidgetsResponse>(res);
}

export async function fetchMarketsList(organizationId: string): Promise<MarketsListResponse> {
  const res = await fetch(`${BASE}/markets`, {
    cache: "no-store",
    headers: organizationHeaders(organizationId),
  });
  return parseJson<MarketsListResponse>(res);
}

export async function fetchMarketSummary(marketCode: string, organizationId: string): Promise<MarketSummary> {
  const code = encodeURIComponent(marketCode);
  const res = await fetch(`${BASE}/markets/${code}/summary`, {
    cache: "no-store",
    headers: organizationHeaders(organizationId),
  });
  return parseJson<MarketSummary>(res);
}

export async function fetchMarketServices(marketCode: string, organizationId: string): Promise<MarketServicesResponse> {
  const code = encodeURIComponent(marketCode);
  const res = await fetch(`${BASE}/markets/${code}/services`, {
    cache: "no-store",
    headers: organizationHeaders(organizationId),
  });
  return parseJson<MarketServicesResponse>(res);
}

export async function fetchServiceCatalog(): Promise<ServiceCatalogResponse> {
  const res = await fetch(`${BASE}/service-catalog`, { cache: "no-store" });
  return parseJson<ServiceCatalogResponse>(res);
}

export async function fetchMarketServiceAccess(
  marketCode: string,
  organizationId: string
): Promise<MarketServiceAccessResponse> {
  const code = encodeURIComponent(marketCode);
  const res = await fetch(`${BASE}/markets/${code}/service-access`, {
    cache: "no-store",
    headers: organizationHeaders(organizationId),
  });
  return parseJson<MarketServiceAccessResponse>(res);
}

export async function fetchMarketActivities(
  marketCode: string,
  organizationId: string,
  limit = 3
): Promise<MarketActivitiesResponse> {
  const code = encodeURIComponent(marketCode);
  const q = new URLSearchParams({ limit: String(limit) });
  const res = await fetch(`${BASE}/markets/${code}/activities?${q}`, {
    cache: "no-store",
    headers: organizationHeaders(organizationId),
  });
  return parseJson<MarketActivitiesResponse>(res);
}

export async function postUserMarketContext(marketCode: string, organizationId: string): Promise<UserMarketContextResponse> {
  const res = await fetch(`${BASE}/user-context/market`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...organizationHeaders(organizationId),
    },
    body: JSON.stringify({ marketCode }),
  });
  return parseJson<UserMarketContextResponse>(res);
}
