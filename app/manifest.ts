import type { MetadataRoute } from "next";
import siteConfig from "@/config/site.json";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.personal.name} — GWHYYY`,
    short_name: "GWHYYY",
    description: siteConfig.seo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f9f9f9",
    theme_color: "#000000",
    lang: "en",
    scope: "/",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["developer", "technology", "portfolio"],
  };
}
