import { NextResponse } from "next/server";
import {
  getMarketServicesForOrganization,
  isValidMarketCode,
  normalizeMarketCode,
  resolveOrganizationId,
} from "@/lib/server/platformStubRepository";
import type { MarketServicesResponse } from "@/types/platformMarkets";

/**
 * Service rows: `presentation.l1` = tile headline; `presentation.l2` = L2+ detail (not on tiles).
 */
export const dynamic = "force-dynamic";

type RouteParams = { params: { marketCode: string } };

export async function GET(request: Request, { params }: RouteParams) {
  const organizationId = resolveOrganizationId(request);
  const code = normalizeMarketCode(params.marketCode);
  if (!isValidMarketCode(code)) {
    return NextResponse.json({ error: "Unknown market" }, { status: 404 });
  }
  const services = getMarketServicesForOrganization(organizationId, code);
  if (!services) {
    return NextResponse.json({ error: "Unknown market" }, { status: 404 });
  }
  const body: MarketServicesResponse = { services };
  return NextResponse.json(body);
}
