import { getDb } from "@/lib/db";
import { defaultSiteContent, type SiteConfig } from "@/config/site";

type ContentRow = { document: string; version: number; updated_at: string };

export type SiteContentRecord = {
  content: SiteConfig;
  version: number;
  updatedAt: string;
};

type Json = Record<string, unknown>;

function isObject(value: unknown): value is Json {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

// Stored documents always win; keys missing from an older document fall back to code defaults,
// so upgrading the app fills in new sections instead of crashing the public site.
function withDefaults(stored: unknown, defaults: unknown): unknown {
  if (!isObject(defaults)) return stored ?? defaults;
  if (!isObject(stored)) return defaults;
  const merged: Json = { ...defaults };
  for (const [key, value] of Object.entries(stored)) merged[key] = withDefaults(value, defaults[key]);
  return merged;
}

function rowToRecord(row: ContentRow): SiteContentRecord {
  return { content: withDefaults(JSON.parse(row.document), defaultSiteContent) as SiteConfig, version: row.version, updatedAt: row.updated_at };
}

export function getSiteContentRecord(): SiteContentRecord {
  const db = getDb();
  const row = db.prepare("SELECT document, version, updated_at FROM site_content WHERE id = 1").get() as ContentRow | undefined;
  if (row) return rowToRecord(row);

  const document = JSON.stringify(defaultSiteContent);
  db.prepare("INSERT INTO site_content (id, document, version) VALUES (1, ?, 1)").run(document);
  return rowToRecord(db.prepare("SELECT document, version, updated_at FROM site_content WHERE id = 1").get() as ContentRow);
}

export function getSiteContent() {
  return getSiteContentRecord().content;
}

export function getProjects(content: SiteConfig) {
  return [...content.projects].sort((a, b) => a.order - b.order);
}

export function validateSiteContent(value: unknown): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return ["Content must be an object"];
  const content = value as Partial<SiteConfig>;
  const errors: string[] = [];
  if (!content.personal?.name?.trim()) errors.push("Name is required");
  if (!content.personal?.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.personal.email)) errors.push("Valid email is required");
  if (!content.seo?.url || !URL.canParse(content.seo.url) || new URL(content.seo.url).protocol !== "https:") errors.push("Canonical URL must use HTTPS");
  if (!content.seo?.title?.trim() || !content.seo?.description?.trim()) errors.push("SEO title and description are required");
  if (!Array.isArray(content.projects) || !content.projects.length) errors.push("At least one project is required");
  const slugs = new Set<string>();
  for (const project of content.projects ?? []) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug)) errors.push(`Invalid project slug: ${project.slug || "empty"}`);
    if (slugs.has(project.slug)) errors.push(`Duplicate project slug: ${project.slug}`);
    slugs.add(project.slug);
    if (!project.name?.trim() || !project.summary?.trim()) errors.push(`Project ${project.slug || "without slug"} needs name and summary`);
    if (!URL.canParse(project.link) || !["http:", "https:"].includes(new URL(project.link).protocol)) errors.push(`Invalid project URL: ${project.slug}`);
  }
  if (JSON.stringify(value).length > 500_000) errors.push("Content exceeds 500 KB");
  if (!content.copy?.nav?.links?.length) errors.push("Navigation needs at least one link");
  if (!content.copy?.hero?.titleLead?.trim() || !content.copy?.hero?.titleTail?.trim()) errors.push("Hero title is required");
  return errors;
}

export function saveSiteContent(content: SiteConfig, expectedVersion: number) {
  const errors = validateSiteContent(content);
  if (errors.length) return { ok: false as const, status: 400, errors };

  const db = getDb();
  return db.transaction(() => {
    const current = getSiteContentRecord();
    if (current.version !== expectedVersion) return { ok: false as const, status: 409, errors: ["Content changed in another session. Reload before saving."] };
    const document = JSON.stringify(withDefaults(content, defaultSiteContent));
    db.prepare("INSERT INTO site_content_revisions (version, document) VALUES (?, ?)").run(current.version, JSON.stringify(current.content));
    db.prepare("UPDATE site_content SET document = ?, version = version + 1, updated_at = datetime('now') WHERE id = 1").run(document);
    return { ok: true as const, record: getSiteContentRecord() };
  })();
}

export function listSiteContentRevisions() {
  return getDb().prepare("SELECT id, version, created_at FROM site_content_revisions ORDER BY id DESC LIMIT 20").all() as { id: number; version: number; created_at: string }[];
}

export function restoreSiteContentRevision(id: number, expectedVersion: number) {
  const db = getDb();
  const revision = db.prepare("SELECT document FROM site_content_revisions WHERE id = ?").get(id) as { document: string } | undefined;
  if (!revision) return { ok: false as const, status: 404, errors: ["Revision not found"] };
  return saveSiteContent(JSON.parse(revision.document) as SiteConfig, expectedVersion);
}
