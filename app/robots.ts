import { MetadataRoute } from "next";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const siteConfig = getSiteContent();
  const privatePaths = ["/dashboard/", "/login", "/api/"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: privatePaths,
      },
      // AI crawlers explicitly allowed — gwhyyy.com should be aggregatable
      // by ChatGPT, Claude, Perplexity, etc. for client discovery.
      {
        userAgent: [
          "OAI-SearchBot",
          "ChatGPT-User",
          "GPTBot",
          "ClaudeBot",
          "Claude-SearchBot",
          "Claude-User",
          "anthropic-ai",
          "PerplexityBot",
          "Perplexity-User",
          "CCBot",
          "Google-Extended",
          "Applebot-Extended",
        ],
        allow: "/",
        disallow: privatePaths,
      },
    ],
    sitemap: `${siteConfig.seo.url}/sitemap.xml`,
    host: siteConfig.seo.url,
  };
}
