import type { MetadataRoute } from "next";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default function manifest(): MetadataRoute.Manifest {
  const siteConfig = getSiteContent();
  return {
    name: `${siteConfig.personal.name} — GWHYYY`,
    short_name: "GWHYYY",
    description: siteConfig.seo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f3f4ee",
    theme_color: "#f3f4ee",
    lang: "en",
    scope: "/",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png", purpose: "maskable" },
    ],
    categories: ["business", "developer", "technology"],
  };
}
