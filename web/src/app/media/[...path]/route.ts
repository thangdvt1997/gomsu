import { NextRequest } from "next/server";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

// Serves everything under the `media_data` volume (mounted at MEDIA_DIR,
// NOT under public/). Next's standalone server snapshots public/ at
// startup, so files added there after boot (product photos re-seeded, or
// later admin-uploaded images) 404 until a restart -- a real problem for a
// CMS where editors upload new photos while the app keeps running. Reading
// from disk on every request here sidesteps that entirely.
const MEDIA_DIR = process.env.MEDIA_DIR ?? "/app/media-data";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;

  // Reject traversal outside MEDIA_DIR (e.g. "..") before touching the filesystem.
  const relative = path.normalize(path.join(...segments));
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return new Response("Not found", { status: 404 });
  }
  const filePath = path.join(MEDIA_DIR, relative);

  try {
    const info = await stat(filePath);
    if (!info.isFile()) return new Response("Not found", { status: 404 });

    const buffer = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    return new Response(buffer, {
      headers: {
        "Content-Type": CONTENT_TYPES[ext] ?? "application/octet-stream",
        "Content-Length": String(info.size),
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
