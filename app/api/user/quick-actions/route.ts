import { NextResponse } from "next/server";

/**
 * Stub for `GET/POST /api/user/quick-actions`.
 * Client persists to `localStorage` first; this route reserves the contract for a future service.
 */
export async function GET() {
  return NextResponse.json({ selectedQuickActions: [] as string[] });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { selectedQuickActions?: unknown };
    if (!Array.isArray(body.selectedQuickActions) || !body.selectedQuickActions.every((x) => typeof x === "string")) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
