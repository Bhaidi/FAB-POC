import { NextResponse } from "next/server";
import { getUserContext, resolveOrganizationId } from "@/lib/server/platformStubRepository";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const organizationId = resolveOrganizationId(request);
  return NextResponse.json(getUserContext(organizationId));
}
