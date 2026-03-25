import { NextResponse } from "next/server";
import {
  canOrganizationSwitchToMarket,
  isValidMarketCode,
  normalizeMarketCode,
  resolveOrganizationId,
} from "@/lib/server/platformStubRepository";
import type { UserMarketContextRequest, UserMarketContextResponse } from "@/types/platformMarkets";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const organizationId = resolveOrganizationId(request);
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const marketCode = typeof body === "object" && body !== null && "marketCode" in body
    ? String((body as UserMarketContextRequest).marketCode)
    : "";
  const code = normalizeMarketCode(marketCode);
  if (!code || !isValidMarketCode(code)) {
    return NextResponse.json({ error: "Invalid marketCode" }, { status: 400 });
  }
  if (!canOrganizationSwitchToMarket(organizationId, code)) {
    return NextResponse.json({ error: "Market is not available for context switching" }, { status: 403 });
  }
  const res: UserMarketContextResponse = { ok: true, marketCode: code };
  return NextResponse.json(res);
}
