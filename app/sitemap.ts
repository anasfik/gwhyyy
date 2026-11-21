import type { MetadataRoute } from "next";
import { getProjects, getSiteContentRecord } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const { content, updatedAt } = getSiteContentRecord();
  const base = content.seo.url;
  const updated = new Date(updatedAt);
  const privacyLastMod = new Date("2026-10-06T00:00:00Z");
  const sitePrivacyLastMod = new Date("2026-10-28T00:00:00Z");

  return [
    { url: base, lastModified: updated },
    { url: `${base}/services`, lastModified: updated },
    ...content.capabilities.map((service) => ({ url: `${base}/services/${service.slug}`, lastModified: updated })),
    { url: `${base}/work`, lastModified: updated },
    ...getProjects(content).map((project) => ({ url: `${base}/work/${project.slug}`, lastModified: updated })),
    { url: `${base}/about`, lastModified: updated },
    { url: `${base}/contact`, lastModified: updated },
    { url: `${base}/resume`, lastModified: updated },
    { url: `${base}/privacy`, lastModified: sitePrivacyLastMod },
    { url: `${base}/privacy/sandouk`, lastModified: privacyLastMod },
    { url: `${base}/privacy/flutterguard`, lastModified: new Date("2026-10-30T00:00:00Z") },
    { url: `${base}/privacy/flutterguard/security`, lastModified: new Date("2026-10-30T00:00:00Z") },
  ];
}
