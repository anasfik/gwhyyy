import { buildFullProfileMarkdown } from "@/lib/public-profile";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildFullProfileMarkdown(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-Robots-Tag": "index, follow",
    },
  });
}
