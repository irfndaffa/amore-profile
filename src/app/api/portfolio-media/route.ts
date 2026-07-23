import { type NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/blob";

// Portfolio photos and videos are stored in a private Vercel Blob store, so
// they must be streamed to visitors through a Function rather than linked
// to directly. Only pathnames under our fixed "portfolio/<category>/<file>"
// namespace are allowed, which also rules out path traversal / access to
// unrelated blobs.
const SAFE_PATHNAME = /^portfolio\/[a-z0-9-]+\/[^/]+$/;

export async function GET(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.searchParams.get("pathname");

  if (!pathname || !SAFE_PATHNAME.test(pathname)) {
    return NextResponse.json({ error: "Invalid pathname" }, { status: 400 });
  }

  const result = await get(pathname, { access: "private" });

  if (!result || result.statusCode !== 200) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType,
      "X-Content-Type-Options": "nosniff",
      // Pathnames always carry a random suffix (addRandomSuffix), so the
      // content at a given pathname never changes — safe to cache forever.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
