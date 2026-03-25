import { NextResponse } from "next/server";
import {
  getMarketActivitiesForOrganization,
  isValidMarketCode,
  normalizeMarketCode,
  resolveOrganizationId,
} from "@/lib/server/platformStubRepository";
import type { MarketActivitiesResponse } from "@/types/platformMarkets";

export const dynamic = "force-dynamic";

type RouteParams = { params: { marketCode: string } };

export async function GET(request: Request, { params }: RouteParams) {
  const organizationId = resolveOrganizationId(request);
  const code = normalizeMarketCode(params.marketCode);
  if (!isValidMarketCode(code)) {
    return NextResponse.json({ error: "Unknown market" }, { status: 404 });
  }
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("limit");
  const parsed = raw ? parseInt(raw, 10) : 3;
  const limit = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 1), 10) : 3;
  const activities = getMarketActivitiesForOrganization(organizationId, code, limit);
  if (!activities) {
    return NextResponse.json({ error: "Unknown market" }, { status: 404 });
  }
  const body: MarketActivitiesResponse = { activities };
  return NextResponse.json(body);
}
