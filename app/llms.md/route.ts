import { buildFullProfileMarkdown } from "@/lib/public-profile";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export function GET() {
  return new Response(buildFullProfileMarkdown(getSiteContent()), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=900",
      "X-Robots-Tag": "index, follow",
    },
  });
}
