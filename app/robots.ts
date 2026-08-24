import { MetadataRoute } from "next";
import siteConfig from "@/config/site.json";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/login", "/api/"],
      },
    ],
    // AI crawlers explicitly allowed — gwhyyy.com should be aggregatable
    // by ChatGPT, Claude, Perplexity, etc. for client discovery.
    sitemap: `${siteConfig.seo.url}/sitemap.xml`,
    host: siteConfig.seo.url,
  };
}
