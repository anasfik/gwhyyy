"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import CopyFields, { setAtPath } from "@/components/dashboard/CopyFields";
import type { SiteConfig } from "@/config/site";

type Revision = { id: number; version: number; created_at: string };
type Loaded = { content: SiteConfig; version: number; updatedAt: string; revisions: Revision[]; warnings?: { weakAdminPassword: boolean } };

const TABS = [
  { id: "site", label: "Site & Identity" },
  { id: "copy", label: "Page Copy & Labels" },
  { id: "projects", label: "Projects" },
  { id: "services", label: "Services & Stack" },
  { id: "experience", label: "Experience" },
  { id: "faq", label: "FAQ & SEO" },
  { id: "publish", label: "Publish & Revisions" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || `project-${Date.now()}`;
}

function listToText(list: string[]) { return list.join(", "); }
function textToList(value: string) { return value.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 40); }
function linesToList(value: string) { return value.split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 40); }
function listToLines(list: string[]) { return list.join("\n"); }

export default function ContentManager({ initialTab = "site" }: { initialTab?: TabId }) {
  const [tab, setTab] = useState<TabId>(initialTab);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [draft, setDraft] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/content", { cache: "no-store" });
      if (!res.ok) throw new Error(`Load failed (${res.status})`);
      const data = (await res.json()) as Loaded;
      setLoaded(data);
      setDraft(structuredClone(data.content));
      setSavedAt(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial remote content belongs to this effect; load resolves asynchronously.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const dirty = useMemo(() => loaded && draft ? JSON.stringify(loaded.content) !== JSON.stringify(draft) : false, [loaded, draft]);

  const weakPassword = loaded?.warnings?.weakAdminPassword ?? false;

  const set = <K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) => {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  };

  const save = async () => {
    if (!loaded || !draft) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: draft, version: loaded.version }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `Save failed (${res.status})`);
      setLoaded({ content: structuredClone(data.content ?? draft), version: data.version, updatedAt: data.updatedAt, revisions: data.revisions ?? loaded.revisions });
      setDraft(structuredClone(data.content ?? draft));
      setSavedAt(new Date().toISOString());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const restore = async (revisionId: number) => {
    if (!loaded || !confirm("Restore this revision? Current content becomes a new revision first.")) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revisionId, version: loaded.version }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Restore failed");
      setLoaded({ content: structuredClone(data.content), version: data.version, updatedAt: data.updatedAt, revisions: loaded.revisions });
      setDraft(structuredClone(data.content));
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Restore failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Shell title="SITE_CONTENT"><p className="py-16 text-center font-mono text-xs uppercase text-secondary">Loading live content…</p></Shell>;
  if (!loaded || !draft) return <Shell title="SITE_CONTENT"><p className="py-16 text-center text-sm text-error">{error ?? "No content"}</p><button onClick={load} className="mx-auto mt-6 block border border-outline-variant px-6 py-3 text-xs uppercase tracking-widest">Retry</button></Shell>;

  return (
    <Shell title="SITE_CONTENT" right={
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] text-secondary">v{loaded.version} · {dirty ? "UNSAVED" : "SYNCED"}</span>
        <button onClick={load} className="border border-outline-variant px-4 py-2 text-[11px] uppercase tracking-widest hover:bg-surface-container-high">Reload</button>
        <button onClick={save} disabled={!dirty || saving} className="bg-primary px-5 py-2 text-[11px] uppercase tracking-widest text-on-primary disabled:opacity-40">{saving ? "Saving…" : "Publish changes"}</button>
      </div>
    }>
      {error && <p role="alert" className="mb-4 border border-error px-4 py-3 text-sm text-error">{error}{error.includes("another session") && <button onClick={load} className="ml-3 underline">Reload latest</button>}</p>}
      {savedAt && !dirty && <p role="status" className="mb-4 border border-green-600 px-4 py-3 text-sm text-green-700">Published. Public pages, /llms.txt, /llms.md, /profile.json, sitemap, and social cards now read this version.</p>}

      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-outline-variant" role="tablist" aria-label="Content sections">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={`whitespace-nowrap px-4 py-3 text-[11px] uppercase tracking-widest ${tab === t.id ? "bg-primary text-on-primary" : "text-secondary hover:bg-surface-container-high"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "site" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Identity">
            <Field label="Full name"><input value={draft.personal.name} onChange={(e) => set("personal", { ...draft.personal, name: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Handle"><input value={draft.personal.handle} onChange={(e) => set("personal", { ...draft.personal, handle: e.target.value })} /></Field>
              <Field label="Title"><input value={draft.personal.title} onChange={(e) => set("personal", { ...draft.personal, title: e.target.value })} /></Field>
            </div>
            <Field label="Headline"><input value={draft.personal.headline} onChange={(e) => set("personal", { ...draft.personal, headline: e.target.value })} /></Field>
            <Field label="Summary"><textarea rows={3} value={draft.personal.summary} onChange={(e) => set("personal", { ...draft.personal, summary: e.target.value })} /></Field>
            <Field label="Bio"><textarea rows={4} value={draft.personal.bio} onChange={(e) => set("personal", { ...draft.personal, bio: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Email"><input value={draft.personal.email} onChange={(e) => set("personal", { ...draft.personal, email: e.target.value })} /></Field>
              <Field label="Phone"><input value={draft.personal.phone} onChange={(e) => set("personal", { ...draft.personal, phone: e.target.value })} /></Field>
              <Field label="Location"><input value={draft.personal.location} onChange={(e) => set("personal", { ...draft.personal, location: e.target.value })} /></Field>
              <Field label="Work mode"><input value={draft.personal.workMode} onChange={(e) => set("personal", { ...draft.personal, workMode: e.target.value })} /></Field>
            </div>
          </Card>
          <div className="grid gap-6 content-start">
            <Card title="Availability">
              <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" checked={draft.availability.available} onChange={(e) => set("availability", { ...draft.availability, available: e.target.checked })} className="h-5 w-5" /> Available for projects</label>
              <Field label="Availability label"><input value={draft.availability.label} onChange={(e) => set("availability", { ...draft.availability, label: e.target.value })} /></Field>
              <Field label="Engagement description"><textarea rows={3} value={draft.availability.engagement} onChange={(e) => set("availability", { ...draft.availability, engagement: e.target.value })} /></Field>
            </Card>
            <Card title="Links">
              {(["github", "linkedin", "calendly", "email"] as const).map((k) => (
                <Field key={k} label={k}><input value={draft.links[k]} onChange={(e) => set("links", { ...draft.links, [k]: e.target.value })} /></Field>
              ))}
            </Card>
            <Card title="Proof bar metrics (4 max)">
              {draft.metrics.map((m, i) => (
                <div key={i} className="mb-3 grid grid-cols-[1fr_2fr_auto] gap-2">
                  <input aria-label={`Metric ${i + 1} value`} value={m.value} onChange={(e) => set("metrics", draft.metrics.map((x, j) => j === i ? { ...x, value: e.target.value } : x))} />
                  <input aria-label={`Metric ${i + 1} label`} value={m.label} onChange={(e) => set("metrics", draft.metrics.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} />
                  <button onClick={() => set("metrics", draft.metrics.filter((_, j) => j !== i))} aria-label={`Remove metric ${i + 1}`} className="border border-outline-variant px-3">×</button>
                </div>
              ))}
              {draft.metrics.length < 6 && <button onClick={() => set("metrics", [...draft.metrics, { value: "", label: "" }])} className="border border-outline-variant px-4 py-2 text-[11px] uppercase tracking-widest">Add metric</button>}
            </Card>
          </div>
        </div>
      )}

      {tab === "copy" && (
        <div className="grid gap-6">
          <p className="border border-outline-variant bg-surface p-4 text-sm text-secondary">
            Every heading, label, button, FAQ prompt, footer line, hire mode, and social-card line on the public site. Changes apply site-wide after publishing — no rebuild, no redeploy.
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            {Object.entries(draft.copy).map(([group, value]) => (
              <Card key={group} title={group}>
                <CopyFields value={value} path={[group]} onChange={(next) => set("copy", setAtPath(draft.copy, [group], next))} depth={1} />
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === "projects" && (
        <div className="grid gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-secondary">{draft.projects.length} projects · order controls homepage + /projects + case-study order</p>
            <button onClick={() => {
              const order = Math.max(0, ...draft.projects.map((p) => p.order)) + 1;
              set("projects", [...draft.projects, { slug: `new-project-${order}`, name: "New project", category: "AI Product", summary: "", problem: "", approach: "", ownership: [""], results: [""], stack: [""], link: "https://example.com", signal: "", featured: true, order, architecture: ["Input", "System", "Output"] }]);
            }} className="bg-primary px-5 py-2 text-[11px] uppercase tracking-widest text-on-primary">Add project</button>
          </div>
          {[...draft.projects].sort((a, b) => a.order - b.order).map((project) => (
            <Card key={project.slug} title={`${String(project.order).padStart(2, "0")} · ${project.name}`}>
              <div className="grid gap-4 lg:grid-cols-2">
                <Field label="Name"><input value={project.name} onChange={(e) => set("projects", draft.projects.map((p) => p.slug === project.slug ? { ...p, name: e.target.value, slug: p.slug.startsWith("new-project") ? slugify(e.target.value) : p.slug } : p))} /></Field>
                <Field label="Slug"><input value={project.slug} onChange={(e) => set("projects", draft.projects.map((p) => p.slug === project.slug ? { ...p, slug: slugify(e.target.value) } : p))} /></Field>
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                <Field label="Category"><input value={project.category} onChange={(e) => set("projects", draft.projects.map((p) => p.slug === project.slug ? { ...p, category: e.target.value } : p))} /></Field>
                <Field label="Signal"><input value={project.signal ?? ""} onChange={(e) => set("projects", draft.projects.map((p) => p.slug === project.slug ? { ...p, signal: e.target.value } : p))} /></Field>
                <Field label="External URL"><input value={project.link} onChange={(e) => set("projects", draft.projects.map((p) => p.slug === project.slug ? { ...p, link: e.target.value } : p))} /></Field>
              </div>
              <Field label="Summary"><textarea rows={2} value={project.summary} onChange={(e) => set("projects", draft.projects.map((p) => p.slug === project.slug ? { ...p, summary: e.target.value } : p))} /></Field>
              <div className="grid gap-4 lg:grid-cols-2">
                <Field label="Problem"><textarea rows={3} value={project.problem} onChange={(e) => set("projects", draft.projects.map((p) => p.slug === project.slug ? { ...p, problem: e.target.value } : p))} /></Field>
                <Field label="Approach"><textarea rows={3} value={project.approach} onChange={(e) => set("projects", draft.projects.map((p) => p.slug === project.slug ? { ...p, approach: e.target.value } : p))} /></Field>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <Field label="Ownership (one per line)"><textarea rows={3} value={listToLines(project.ownership)} onChange={(e) => set("projects", draft.projects.map((p) => p.slug === project.slug ? { ...p, ownership: linesToList(e.target.value) } : p))} /></Field>
                <Field label="Results (one per line)"><textarea rows={3} value={listToLines(project.results)} onChange={(e) => set("projects", draft.projects.map((p) => p.slug === project.slug ? { ...p, results: linesToList(e.target.value) } : p))} /></Field>
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                <Field label="Stack (comma separated)"><input value={listToText(project.stack)} onChange={(e) => set("projects", draft.projects.map((p) => p.slug === project.slug ? { ...p, stack: textToList(e.target.value) } : p))} /></Field>
                <Field label="Architecture nodes (comma separated)"><input value={listToText(project.architecture)} onChange={(e) => set("projects", draft.projects.map((p) => p.slug === project.slug ? { ...p, architecture: textToList(e.target.value) } : p))} /></Field>
                <Field label="Order"><input type="number" value={project.order} onChange={(e) => set("projects", draft.projects.map((p) => p.slug === project.slug ? { ...p, order: Number(e.target.value) || 0 } : p))} /></Field>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <label className="flex items-center gap-2 text-xs uppercase tracking-widest"><input type="checkbox" checked={project.featured} onChange={(e) => set("projects", draft.projects.map((p) => p.slug === project.slug ? { ...p, featured: e.target.checked } : p))} className="h-4 w-4" /> Featured</label>
                <span className="flex-1" />
                <button onClick={() => set("projects", draft.projects.map((p) => p.slug === project.slug ? { ...p, order: p.order - 1 } : p))} className="border border-outline-variant px-3 py-1 text-xs">Move up</button>
                <button onClick={() => set("projects", draft.projects.map((p) => p.slug === project.slug ? { ...p, order: p.order + 1 } : p))} className="border border-outline-variant px-3 py-1 text-xs">Move down</button>
                <button onClick={() => { if (confirm(`Delete ${project.name}?`)) set("projects", draft.projects.filter((p) => p.slug !== project.slug)); }} className="border border-error px-3 py-1 text-xs text-error">Delete</button>
                <a href={`/projects/${project.slug}`} target="_blank" rel="noopener noreferrer" className="border border-outline-variant px-3 py-1 text-xs">Preview ↗</a>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "services" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="grid gap-6 content-start">
            <div className="flex items-center justify-between"><h3 className="text-sm uppercase tracking-widest text-secondary">Services</h3><button onClick={() => set("capabilities", [...draft.capabilities, { title: "New service", summary: "", outcomes: [] }])} className="border border-outline-variant px-3 py-1 text-xs uppercase">Add</button></div>
            {draft.capabilities.map((cap, i) => (
              <Card key={`${cap.title}-${i}`} title={cap.title || `Service ${i + 1}`}>
                <Field label="Title"><input value={cap.title} onChange={(e) => set("capabilities", draft.capabilities.map((c, j) => j === i ? { ...c, title: e.target.value } : c))} /></Field>
                <Field label="Summary"><textarea rows={2} value={cap.summary} onChange={(e) => set("capabilities", draft.capabilities.map((c, j) => j === i ? { ...c, summary: e.target.value } : c))} /></Field>
                <Field label="Outcomes (one per line)"><textarea rows={3} value={listToLines(cap.outcomes)} onChange={(e) => set("capabilities", draft.capabilities.map((c, j) => j === i ? { ...c, outcomes: linesToList(e.target.value) } : c))} /></Field>
                <button onClick={() => set("capabilities", draft.capabilities.filter((_, j) => j !== i))} className="text-xs uppercase tracking-widest text-error">Remove service</button>
              </Card>
            ))}
          </div>
          <div className="grid gap-6 content-start">
            <Card title="AI reliability bullets">
              <Field label="One per line"><textarea rows={6} value={listToLines(draft.aiReliability)} onChange={(e) => set("aiReliability", linesToList(e.target.value))} /></Field>
            </Card>
            <Card title="Stack groups">
              {draft.stackGroups.map((group, i) => (
                <div key={`${group.label}-${i}`} className="mb-4 grid gap-2">
                  <input aria-label={`Stack group ${i + 1} label`} value={group.label} onChange={(e) => set("stackGroups", draft.stackGroups.map((g, j) => j === i ? { ...g, label: e.target.value } : g))} />
                  <input aria-label={`Stack group ${i + 1} items`} value={listToText(group.items)} onChange={(e) => set("stackGroups", draft.stackGroups.map((g, j) => j === i ? { ...g, items: textToList(e.target.value) } : g))} />
                  <button onClick={() => set("stackGroups", draft.stackGroups.filter((_, j) => j !== i))} className="self-start text-xs uppercase tracking-widest text-error">Remove group</button>
                </div>
              ))}
              <button onClick={() => set("stackGroups", [...draft.stackGroups, { label: "New group", items: [] }])} className="border border-outline-variant px-4 py-2 text-[11px] uppercase tracking-widest">Add group</button>
            </Card>
            <Card title="Process steps">
              {draft.process.map((step, i) => (
                <div key={step.step} className="mb-4 grid gap-2 border-b border-outline-variant pb-4">
                  <div className="grid grid-cols-[64px_1fr] gap-2">
                    <input aria-label={`Step ${i + 1} number`} value={step.step} onChange={(e) => set("process", draft.process.map((s, j) => j === i ? { ...s, step: e.target.value } : s))} />
                    <input aria-label={`Step ${i + 1} title`} value={step.title} onChange={(e) => set("process", draft.process.map((s, j) => j === i ? { ...s, title: e.target.value } : s))} />
                  </div>
                  <textarea aria-label={`Step ${i + 1} description`} rows={2} value={step.description} onChange={(e) => set("process", draft.process.map((s, j) => j === i ? { ...s, description: e.target.value } : s))} />
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {tab === "experience" && (
        <div className="grid gap-6">
          <div className="flex justify-end"><button onClick={() => set("experience", [...draft.experience, { id: `role-${Date.now()}`, company: "New company", role: "Role", period: "", type: "Remote", scope: "", stack: [], link: "https://" }])} className="border border-outline-variant px-4 py-2 text-[11px] uppercase tracking-widest">Add role</button></div>
          {draft.experience.map((exp) => (
            <Card key={exp.id} title={`${exp.company} · ${exp.role}`}>
              <div className="grid gap-4 lg:grid-cols-3">
                <Field label="Company"><input value={exp.company} onChange={(e) => set("experience", draft.experience.map((x) => x.id === exp.id ? { ...x, company: e.target.value } : x))} /></Field>
                <Field label="Role"><input value={exp.role} onChange={(e) => set("experience", draft.experience.map((x) => x.id === exp.id ? { ...x, role: e.target.value } : x))} /></Field>
                <Field label="Link"><input value={exp.link} onChange={(e) => set("experience", draft.experience.map((x) => x.id === exp.id ? { ...x, link: e.target.value } : x))} /></Field>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <Field label="Period"><input value={exp.period} onChange={(e) => set("experience", draft.experience.map((x) => x.id === exp.id ? { ...x, period: e.target.value } : x))} /></Field>
                <Field label="Type"><input value={exp.type} onChange={(e) => set("experience", draft.experience.map((x) => x.id === exp.id ? { ...x, type: e.target.value } : x))} /></Field>
              </div>
              <Field label="Scope"><textarea rows={3} value={exp.scope} onChange={(e) => set("experience", draft.experience.map((x) => x.id === exp.id ? { ...x, scope: e.target.value } : x))} /></Field>
              <Field label="Stack (comma separated)"><input value={listToText(exp.stack)} onChange={(e) => set("experience", draft.experience.map((x) => x.id === exp.id ? { ...x, stack: textToList(e.target.value) } : x))} /></Field>
              <button onClick={() => set("experience", draft.experience.filter((x) => x.id !== exp.id))} className="text-xs uppercase tracking-widest text-error">Remove role</button>
            </Card>
          ))}
        </div>
      )}

      {tab === "faq" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="grid gap-6 content-start">
            <div className="flex items-center justify-between"><h3 className="text-sm uppercase tracking-widest text-secondary">FAQ</h3><button onClick={() => set("faq", [...draft.faq, { question: "New question", answer: "" }])} className="border border-outline-variant px-3 py-1 text-xs uppercase">Add</button></div>
            {draft.faq.map((item, i) => (
              <Card key={`${item.question}-${i}`} title={item.question || `Question ${i + 1}`}>
                <Field label="Question"><input value={item.question} onChange={(e) => set("faq", draft.faq.map((f, j) => j === i ? { ...f, question: e.target.value } : f))} /></Field>
                <Field label="Answer"><textarea rows={3} value={item.answer} onChange={(e) => set("faq", draft.faq.map((f, j) => j === i ? { ...f, answer: e.target.value } : f))} /></Field>
                <button onClick={() => set("faq", draft.faq.filter((_, j) => j !== i))} className="text-xs uppercase tracking-widest text-error">Remove</button>
              </Card>
            ))}
          </div>
          <div className="grid gap-6 content-start">
            <Card title="SEO & social">
              <Field label="Canonical URL"><input value={draft.seo.url} onChange={(e) => set("seo", { ...draft.seo, url: e.target.value })} /></Field>
              <Field label="SEO title"><input value={draft.seo.title} onChange={(e) => set("seo", { ...draft.seo, title: e.target.value })} /></Field>
              <Field label="Title template"><input value={draft.seo.titleTemplate} onChange={(e) => set("seo", { ...draft.seo, titleTemplate: e.target.value })} /></Field>
              <Field label="Description"><textarea rows={3} value={draft.seo.description} onChange={(e) => set("seo", { ...draft.seo, description: e.target.value })} /></Field>
              <Field label="Keywords (comma separated)"><input value={listToText([...draft.seo.keywords])} onChange={(e) => set("seo", { ...draft.seo, keywords: textToList(e.target.value) })} /></Field>
              <Field label="Twitter handle"><input value={draft.seo.twitterHandle} onChange={(e) => set("seo", { ...draft.seo, twitterHandle: e.target.value })} /></Field>
            </Card>
            <Card title="Budget options (contact form allowlist)">
              <Field label="One per line"><textarea rows={5} value={listToLines([...draft.budgetOptions])} onChange={(e) => set("budgetOptions", linesToList(e.target.value))} /></Field>
            </Card>
          </div>
        </div>
      )}

      {tab === "publish" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {weakPassword && (
            <p role="alert" className="lg:col-span-2 border border-error px-4 py-3 text-sm text-error">
              ADMIN_PASSWORD is missing or still a placeholder. Anyone who guesses it owns this dashboard. Set a strong value in <code className="font-mono">.env.production</code> on the server and restart the container.
            </p>
          )}
          <Card title="Live outputs">
            <ul className="grid gap-2 text-sm">
              {[["Homepage", "/"], ["Work index", "/projects"], ["Hire page", "/hire"], ["Resume", "/resume"], ["LLM index", "/llms.txt"], ["Full AI profile", "/llms.md"], ["Structured profile", "/profile.json"], ["Sitemap", "/sitemap.xml"], ["Robots", "/robots.txt"], ["Social card", "/opengraph-image"]].map(([label, href]) => (
                <li key={href} className="flex items-center justify-between border-b border-outline-variant py-2"><span>{label}</span><a href={href} target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest underline">Open ↗</a></li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-5 text-secondary">Version v{loaded.version} · updated {loaded.updatedAt}. Publishing writes one atomic SQLite document; public pages and bot feeds read it on every request.</p>
            <a href="/api/backup" className="mt-4 inline-block border border-outline-variant px-4 py-2 text-[11px] uppercase tracking-widest">Download database backup</a>
          </Card>
          <Card title={`Revisions (${loaded.revisions.length})`}>
            {loaded.revisions.length === 0 ? <p className="text-sm text-secondary">No revisions yet. Each publish stores the previous version here.</p> : (
              <ul className="grid gap-2">
                {loaded.revisions.map((r) => (
                  <li key={r.id} className="flex items-center justify-between border-b border-outline-variant py-2 text-sm"><span className="font-mono text-xs">v{r.version} · {r.created_at}</span><button onClick={() => restore(r.id)} disabled={saving} className="border border-outline-variant px-3 py-1 text-xs uppercase tracking-widest disabled:opacity-40">Restore</button></li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      )}
    </Shell>
  );
}

function Shell({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="flex flex-shrink-0 flex-wrap items-center justify-between gap-3 border-b border-outline-variant bg-surface px-4 py-4 lg:px-12">
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        {right}
      </header>
      <section className="flex-1 overflow-y-auto p-4 lg:p-8"><div className="mx-auto max-w-[1200px]">{children}</div></section>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-outline-variant bg-surface p-4 lg:p-6">
      <h3 className="mb-4 text-[12px] uppercase tracking-[0.1em] text-secondary">{title}</h3>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactElement }) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="text-[11px] uppercase tracking-[0.1em] text-secondary">{label}</span>
      <span className="[&_input]:min-h-11 [&_input]:w-full [&_input]:border [&_input]:border-outline-variant [&_input]:bg-surface [&_input]:px-3 [&_input]:py-2 [&_input]:text-sm [&_textarea]:w-full [&_textarea]:border [&_textarea]:border-outline-variant [&_textarea]:bg-surface [&_textarea]:p-3 [&_textarea]:text-sm">{children}</span>
    </label>
  );
}
