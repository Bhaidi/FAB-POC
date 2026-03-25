import { NextResponse } from "next/server";
import {
  getMarketSummaryForOrganization,
  isValidMarketCode,
  normalizeMarketCode,
  resolveOrganizationId,
} from "@/lib/server/platformStubRepository";

export const dynamic = "force-dynamic";

type RouteParams = { params: { marketCode: string } };

export async function GET(request: Request, { params }: RouteParams) {
  const organizationId = resolveOrganizationId(request);
  const code = normalizeMarketCode(params.marketCode);
  if (!isValidMarketCode(code)) {
    return NextResponse.json({ error: "Unknown market" }, { status: 404 });
  }
  const summary = getMarketSummaryForOrganization(organizationId, code);
  if (!summary) {
    return NextResponse.json({ error: "Unknown market" }, { status: 404 });
  }
  return NextResponse.json(summary);
}
