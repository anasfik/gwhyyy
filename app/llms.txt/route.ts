import { buildLlmsIndex } from "@/lib/public-profile";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export function GET() {
  return new Response(buildLlmsIndex(getSiteContent()), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=900",
      "X-Robots-Tag": "index, follow",
    },
  });
}
