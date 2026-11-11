import { NextRequest, NextResponse } from "next/server";
import { plusManifest } from "@/lib/plus/manifest";

export async function GET(request: NextRequest) {
  const host = request.headers.get("host");
  return NextResponse.json(plusManifest(host), {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
