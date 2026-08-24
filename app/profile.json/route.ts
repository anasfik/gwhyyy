import { publicProfile } from "@/lib/public-profile";

export const dynamic = "force-static";

export function GET() {
  return Response.json(publicProfile, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-Robots-Tag": "index, follow",
    },
  });
}
