import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.hostname === "vectis.nymlab.it") {
    return NextResponse.rewrite(new URL("/coming-soon", request.url));
  }
}
