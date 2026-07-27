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
      // Block AI training crawlers (optional, remove if you want AI indexing)
      {
        userAgent: ["GPTBot", "ChatGPT-User", "CCBot", "anthropic-ai", "Claude-Web"],
        disallow: ["/"],
      },
    ],
    sitemap: `${siteConfig.seo.url}/sitemap.xml`,
    host: siteConfig.seo.url,
  };
}
