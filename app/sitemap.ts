import type { MetadataRoute } from "next";
import { getProjects, getSiteContentRecord } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const { content, updatedAt } = getSiteContentRecord();
  const base = content.seo.url;
  const updated = new Date(updatedAt);
  return [
    { url: base, lastModified: updated, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/projects`, lastModified: updated, changeFrequency: "monthly", priority: .9 },
    ...getProjects(content).map((project) => ({ url: `${base}/projects/${project.slug}`, lastModified: updated, changeFrequency: "monthly" as const, priority: .8 })),
    { url: `${base}/hire`, lastModified: updated, changeFrequency: "monthly", priority: .8 },
    { url: `${base}/resume`, lastModified: updated, changeFrequency: "monthly", priority: .8 },
    { url: `${base}/llms.txt`, lastModified: updated, changeFrequency: "monthly", priority: .5 },
    { url: `${base}/llms.md`, lastModified: updated, changeFrequency: "monthly", priority: .5 },
    { url: `${base}/profile.json`, lastModified: updated, changeFrequency: "monthly", priority: .5 },
  ];
}
