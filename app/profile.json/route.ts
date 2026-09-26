import { buildPublicProfile } from "@/lib/public-profile";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(buildPublicProfile(getSiteContent()), {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=900",
      "X-Robots-Tag": "index, follow",
    },
  });
}
