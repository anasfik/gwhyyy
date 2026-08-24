import { MetadataRoute } from "next";
import siteConfig from "@/config/site.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.seo.url;

  const projectPages: MetadataRoute.Sitemap = siteConfig.projects
    .filter((p) => p.visible)
    .map((p) => ({
      url: `${base}/projects/${p.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/projects`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...projectPages,
    {
      url: `${base}/hire`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
