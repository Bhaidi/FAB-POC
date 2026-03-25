import { NextResponse } from "next/server";
import { stubUserEntitlements } from "@/data/dashboardStubApi";

export async function GET() {
  return NextResponse.json(stubUserEntitlements);
}
