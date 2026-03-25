import { NextResponse } from "next/server";
import { getDashboardWidgetsPayload } from "@/lib/server/dashboardWidgetsStub";
import { resolveOrganizationId } from "@/lib/server/platformStubRepository";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const organizationId = resolveOrganizationId(request);
  const { searchParams } = new URL(request.url);
  const market = searchParams.get("market")?.trim() ?? "";
  if (!market) {
    return NextResponse.json({ error: "Query parameter `market` is required." }, { status: 400 });
  }
  const payload = getDashboardWidgetsPayload(organizationId, market);
  if (!payload) {
    return NextResponse.json({ error: "Market is not available for this organization." }, { status: 400 });
  }
  return NextResponse.json(payload);
}
