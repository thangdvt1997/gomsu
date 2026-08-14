import { NextResponse } from "next/server";
import { getIndexNowKey } from "@/lib/indexnow";

// Serves the IndexNow key-verification file IndexNow requires at
// https://{host}/{key}.txt (the filename must equal the key itself).
// Falls through to a plain 404 for any other unmatched top-level path --
// Next.js resolves explicit static routes ((site) pages, /admin, /api,
// robots.txt/sitemap.xml conventions) before this dynamic catch-all, so it
// only ever sees requests that didn't match anything more specific.
export async function GET(_req: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  const key = await getIndexNowKey();

  if (filename === `${key}.txt`) {
    return new NextResponse(key, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
  return new NextResponse("Not found", { status: 404 });
}
