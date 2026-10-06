import type { MetadataRoute } from "next";
import { getProjects, getSiteContentRecord } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const { content, updatedAt } = getSiteContentRecord();
  const base = content.seo.url;
  const updated = new Date(updatedAt);
  // Static file mtime for public/privacy/sandouk.html (not DB-driven)
  const privacyLastMod = new Date("2026-10-06T00:00:00Z");
  // Note: only indexable HTML routes. llms.txt / llms.md / profile.json stay
  // crawlable via <link rel="alternate"> but out of the sitemap (non-HTML).
  // changeFrequency/priority omitted: ignored by Google, avoid false signals.
  return [
    { url: base, lastModified: updated },
    { url: `${base}/projects`, lastModified: updated },
    ...getProjects(content).map((project) => ({ url: `${base}/projects/${project.slug}`, lastModified: updated })),
    { url: `${base}/hire`, lastModified: updated },
    { url: `${base}/resume`, lastModified: updated },
    { url: `${base}/privacy/sandouk`, lastModified: privacyLastMod },
  ];
}
