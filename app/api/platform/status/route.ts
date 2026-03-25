import { NextResponse } from "next/server";
import { stubPlatformStatuses } from "@/data/dashboardStubApi";

export async function GET() {
  return NextResponse.json({ statuses: stubPlatformStatuses });
}
