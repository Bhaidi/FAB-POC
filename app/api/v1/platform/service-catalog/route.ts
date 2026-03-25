import { NextResponse } from "next/server";
import { SERVICE_CATALOG_RESPONSE } from "@/lib/server/serviceCatalogCanonical";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(SERVICE_CATALOG_RESPONSE);
}
