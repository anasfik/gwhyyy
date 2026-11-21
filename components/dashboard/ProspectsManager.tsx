"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DetailDialog, useConfirmation, useUnsavedChanges, useRetainedState } from "./WorkspaceUI";

type Stage = "new" | "qualified" | "contacted" | "won" | "lost" | "archived";

type Prospect = {
  id: number;
  external_id: string | null;
  name: string;
  email: string | null;
  company: string;
  role: string | null;
  website: string | null;
  source: string;
  source_url: string | null;
  stage: Stage;
  notes: string;
  last_contacted_at: string | null;
  follow_up_at: string | null;
  created_at: string;
  updated_at: string | null;
  activity_count: number;
  email_status: string | null;
  lawful_basis: string | null;
  unsubscribed_at: string | null;
  suppressed_at: string | null;
};

type Summary = Record<Stage, number>;

type ApiResponse = {
  rows: Prospect[];
  total: number;
  page: number;
  perPage: number;
  summary: Summary;
  due: number;
  mcpEnabled: boolean;
};

type Activity = { id: number; prospect_id: number; kind: string; body: string; created_at: string };

const STAGES: Stage[] = ["new", "qualified", "contacted", "won", "lost", "archived"];
const STAGE_LABELS: Record<Stage, string> = {
  new: "Sourced",
  qualified: "Qualified",
  contacted: "Contacted",
  won: "Won",
  lost: "Lost",
  archived: "Archived",
};
const ACTIVITY_KINDS = ["note", "email", "call", "linkedin", "meeting", "other"];

const EMPTY_FORM = {
  name: "",
  email: "",
  company: "",
  role: "",
  website: "",
  source: "manual",
  sourceUrl: "",
  stage: "new",
  followUpAt: "",
  notes: "",
};

const primaryButton = "bg-primary px-5 py-3 text-[11px] uppercase tracking-widest text-on-primary hover:bg-primary/90 disabled:opacity-40";
const secondaryButton = "border border-outline-variant px-4 py-2.5 text-[11px] uppercase tracking-widest hover:bg-surface-container-high disabled:opacity-40";

export default function ProspectsManager({ initialQuery = "", initialDue = false }: { initialQuery?: string; initialDue?: boolean }) {
  const confirm = useConfirmation();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [stage, setStage] = useState<"all" | Stage>("all");
  const [query, setQuery] = useState(initialQuery);
  const [search, setSearch] = useState(initialQuery);
  const [dueOnly, setDueOnly] = useState(initialDue);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useRetainedState<Prospect | null>("prospect:selected", null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [notes, setNotes] = useRetainedState("prospect:notes", "");
  const [followUp, setFollowUp] = useRetainedState("prospect:followUp", "");
  const [activityKind, setActivityKind] = useRetainedState("prospect:activityKind", "note");
  const [activityBody, setActivityBody] = useRetainedState("prospect:activityBody", "");
  const [saving, setSaving] = useRetainedState("prospect:saving", false);
  const [emailStatus, setEmailStatus] = useRetainedState("prospect:emailStatus", "unknown");
  const [lawfulBasis, setLawfulBasis] = useRetainedState("prospect:lawfulBasis", "");
  const [recordStage, setRecordStage] = useRetainedState<Stage>("prospect:stage", "new");
  const [notice, setNotice] = useState("");
  const selectionId = useRef<number | null>(selected?.id ?? null);
  const loadGeneration = useRef(0);
  const [activityError, setActivityError] = useState("");
  const recordDirty = Boolean(selected && (notes !== (selected.notes ?? "") || followUp !== (selected.follow_up_at ?? "") || recordStage !== selected.stage || emailStatus !== (selected.email_status || "unknown") || lawfulBasis !== (selected.lawful_basis || "") || activityBody));
  useUnsavedChanges(recordDirty, false, "prospects");
  const closeRecord = async () => {
    if (saving) return;
    if (recordDirty && !await confirm({ title: "Discard unsaved prospect edits?", description: "Save your review or activity note before closing to keep your work.", action: "Discard edits", danger: true })) return;
    selectionId.current = null; setSelected(null);
  };

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [formError, setFormError] = useState<string | null>(null);

  const [showImport, setShowImport] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [csvName, setCsvName] = useState("");
  const [importResult, setImportResult] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const load = useCallback(async () => {
    const generation = ++loadGeneration.current;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ stage, q: search, page: String(page) });
      if (dueOnly) params.set("due", "1");
      const res = await fetch(`/api/prospects?${params}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Outreach load failed (${res.status})`);
      const next = await res.json();
      if (generation === loadGeneration.current) setData(next);
    } catch (e) {
      if (generation === loadGeneration.current) setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      if (generation === loadGeneration.current) setLoading(false);
    }
  }, [stage, search, dueOnly, page]);
  useEffect(() => {
    const params = new URLSearchParams(); if (search) params.set("q",search); if (dueOnly) params.set("due","1");
    history.replaceState(null,"",`${location.pathname}${params.size ? `?${params}` : ""}`);
  }, [search,dueOnly]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const loadActivities = useCallback(async (id: number) => {
    setActivityError("");
    try {
      const res = await fetch(`/api/prospects/${id}/activities`, { cache: "no-store" });
      if (!res.ok) throw new Error("Could not load activity. Retry below.");
      const json = await res.json();
      if (selectionId.current === id) setActivities(json.rows ?? []);
    } catch {
      if (selectionId.current === id) setActivityError("Activity could not load. Retry below.");
    }
  }, []);
  useEffect(() => {
    if (selectionId.current) void loadActivities(selectionId.current);
  }, [loadActivities]);

  const openProspect = (prospect: Prospect) => {
    selectionId.current = prospect.id;
    setActivities([]);
    setSelected(prospect);
    setNotes(prospect.notes ?? "");
    setFollowUp(prospect.follow_up_at ?? "");
    setActivityBody("");
    setEmailStatus(prospect.email_status || "unknown");
    setLawfulBasis(prospect.lawful_basis || "");
    setRecordStage(prospect.stage);
    setNotice("");
    loadActivities(prospect.id);
  };

  const patch = async (id: number, payload: Record<string, unknown>) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/prospects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...payload }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? `Update failed (${res.status})`);
      }
      setSelected(current => current?.id === id ? { ...current, ...payload,
        ...(typeof payload.emailStatus === "string" ? { email_status: payload.emailStatus } : {}),
        ...(typeof payload.lawfulBasis === "string" ? { lawful_basis: payload.lawfulBasis } : {}),
        ...(payload.followUpAt !== undefined ? { follow_up_at: payload.followUpAt } : {}),
      } as Prospect : current);
      setNotice("Prospect review saved.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!await confirm({ title: "Permanently delete this prospect?", description: "The prospect and activity log will be removed. Outreach attempt history is retained. This cannot be undone.", action: "Delete prospect", danger: true })) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/prospects?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      setSelected(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  };

  const addActivity = async () => {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/prospects/${selected.id}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: activityKind, body: activityBody }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? `Activity failed (${res.status})`);
      }
      setActivityBody("");
      await loadActivities(selected.id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Activity failed");
    } finally {
      setSaving(false);
    }
  };

  const addProspect = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const payload = { ...form, followUpAt: form.followUpAt || null };
      const res = await fetch("/api/prospects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? `Create failed (${res.status})`);
      setForm({ ...EMPTY_FORM });
      setShowAdd(false);
      await load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Create failed");
    } finally {
      setSaving(false);
    }
  };

  const runImport = async () => {
    setImporting(true);
    setImportError(null);
    setImportResult(null);
    try {
      const res = await fetch("/api/prospects/import", {
        method: "POST",
        headers: { "Content-Type": "text/csv" },
        body: csvText,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? `Import failed (${res.status})`);
      setImportResult(
        `Received ${json.received}: ${json.inserted} inserted, ${json.updated} updated, ${json.skipped} skipped.` +
          (json.errors?.length ? ` First errors: ${json.errors.map((e: { row: number; error: string }) => `row ${e.row} ${e.error}`).join("; ")}` : "")
      );
      if (!json.errors?.length && !json.skipped) { setCsvText(""); setCsvName(""); }
      await load();
    } catch (e) {
      setImportError(e instanceof Error ? e.message : "Import failed");
    } finally {
      setImporting(false);
    }
  };

  const exportAll = () => {
    const params = new URLSearchParams({ stage, q: search });
    if (dueOnly) params.set("due", "1");
    window.open(`/api/prospects/export?${params}`, "_blank");
  };

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.perPage)) : 1;
  const summary = data?.summary;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="flex flex-shrink-0 flex-wrap items-center justify-between gap-3 border-b border-outline-variant px-4 py-4 lg:px-12">
        <div>
          <h1>Prospects</h1>
          <p className="mt-2 text-secondary text-sm">Find a contact, review their source, and keep the next step clear.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => { setShowImport((v) => !v); setShowAdd(false); }} aria-expanded={showImport} className={secondaryButton}>Import CSV</button>
          <button onClick={exportAll} className={secondaryButton}>Export</button>
          <button onClick={() => { setShowAdd((v) => !v); setShowImport(false); }} aria-expanded={showAdd} className={primaryButton}>+ Add prospect</button>
        </div>
      </header>

      <section className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {STAGES.slice(0, 5).map((item) => (
              <button
                key={item}
                onClick={() => { setStage(stage === item ? "all" : item); setPage(1); }}
                aria-pressed={stage === item}
                className={`border p-4 text-left ${stage === item ? "border-primary bg-primary text-on-primary" : "border-outline-variant bg-surface hover:bg-surface-container-high"}`}
              >
                <span className="block text-[10px] uppercase tracking-widest opacity-70">{STAGE_LABELS[item]}</span>
                <span className="mt-1 block text-2xl font-semibold leading-none">{summary?.[item] ?? "–"}</span>
              </button>
            ))}
            <button
              onClick={() => { setDueOnly((v) => !v); setPage(1); }}
              aria-pressed={dueOnly}
              className={`border p-4 text-left ${dueOnly ? "border-primary bg-primary text-on-primary" : "border-outline-variant bg-surface hover:bg-surface-container-high"}`}
            >
              <span className="block text-[10px] uppercase tracking-widest opacity-70">Follow-ups due</span>
              <span className="mt-1 block text-2xl font-semibold leading-none">{data?.due ?? "–"}</span>
            </button>
          </div>

          <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_auto]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { setSearch(query); setPage(1); } }}
              placeholder="Search company, name, email, role, source, notes…"
              aria-label="Search prospects"
              className="min-h-11 w-full border border-outline-variant bg-surface px-4 text-sm text-paper placeholder:text-secondary"
            />
            <div className="flex flex-wrap gap-2">
              <button onClick={() => { setSearch(query); setPage(1); }} className={primaryButton}>Search</button>
              <button onClick={() => { setQuery(""); setSearch(""); setStage("all"); setDueOnly(false); setPage(1); }} className={secondaryButton}>Reset</button>
            </div>
          </div>

          {error && <p role="alert" className="mb-4 border border-error px-4 py-3 text-sm text-error">{error} <button className="underline" onClick={load}>Retry</button></p>}
          <p role="status" className="text-sm mb-4 text-secondary">{loading && data ? "Refreshing prospects…" : notice}</p>

          {showImport && (
            <div className="mb-6 border border-primary bg-surface p-5 lg:p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-widest">Import prospects</h2>
                  <p className="mt-1 text-sm text-secondary">
                    Matching email addresses or external IDs update existing records. Review your file before importing. Maximum 500 rows. Columns: name, email, company, role, website, source, source_url, stage, follow_up_at, notes.
                  </p>
                </div>
                <button onClick={() => setShowImport(false)} aria-label="Close import panel" className="min-h-11 min-w-11 border border-outline-variant text-xl">×</button>
              </div>
              <label className="mb-3 block text-sm">
                <span className="mb-1 block text-[11px] uppercase tracking-widest text-secondary">CSV file</span>
                  <input
                    disabled={importing}
                  type="file"
                  accept=".csv,text/csv,text/plain"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setImportError(null);
                    if (file.size > 1_000_000) { setImportError("File is larger than 1 MB."); return; }
                    setCsvName(file.name);
                    setCsvText(await file.text());
                  }}
                  className="block w-full border border-outline-variant bg-surface p-2 text-sm text-paper file:mr-3 file:border-0 file:bg-primary file:px-3 file:py-2 file:text-[11px] file:uppercase file:tracking-widest file:text-on-primary"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-[11px] uppercase tracking-widest text-secondary">Or paste CSV{csvName ? ` · ${csvName} loaded` : ""}</span>
                <textarea disabled={importing} value={csvText} onChange={(e) => setCsvText(e.target.value)} rows={6} placeholder="name,email,company,role,website,source,stage" className="w-full border border-outline-variant bg-surface p-3 font-mono text-xs text-paper placeholder:text-secondary" />
              </label>
              {importError && <p role="alert" className="mt-3 border border-error px-3 py-2 text-sm text-error">{importError}</p>}
              {importResult && <p role="status" aria-live="polite" className="mt-3 border border-outline-variant bg-surface-container-low px-3 py-2 text-sm">{importResult}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={async () => { if (await confirm({ title: "Import this prospect file?", description: "Matching email addresses or external IDs may overwrite existing prospect fields. Skipped rows will remain available for correction.", action: "Import prospects" })) await runImport(); }} disabled={importing || !csvText.trim()} className={primaryButton}>{importing ? "Importing…" : "Import"}</button>
                <button disabled={importing} onClick={() => { setCsvText(""); setCsvName(""); setImportResult(null); setImportError(null); }} className={secondaryButton}>Clear</button>
              </div>
            </div>
          )}

          {showAdd && (
            <form onSubmit={addProspect} className="mb-6 border border-primary bg-surface p-5 lg:p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <h2 className="text-sm font-semibold uppercase tracking-widest">Add prospect</h2>
                <button type="button" onClick={() => setShowAdd(false)} aria-label="Close add prospect panel" className="min-h-11 min-w-11 border border-outline-variant text-xl">×</button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["name", "Name"],
                  ["company", "Company"],
                  ["email", "Email"],
                  ["role", "Role"],
                  ["website", "Website"],
                  ["source", "Source"],
                  ["sourceUrl", "Source URL"],
                ].map(([key, label]) => (
                  <label key={key} className="grid gap-1.5 text-sm">
                    <span className="text-[11px] uppercase tracking-widest text-secondary">{label}</span>
                    <input
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      type={key === "email" ? "email" : "text"}
                      className="min-h-11 border border-outline-variant bg-surface px-3 text-paper placeholder:text-secondary [color-scheme:dark]"
                    />
                  </label>
                ))}
                <label className="grid gap-1.5 text-sm">
                  <span className="text-[11px] uppercase tracking-widest text-secondary">Stage</span>
                  <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })} className="min-h-11 border border-outline-variant bg-surface px-3 text-paper placeholder:text-secondary [color-scheme:dark]">
                    {STAGES.map((item) => <option key={item} value={item}>{STAGE_LABELS[item]}</option>)}
                  </select>
                </label>
                <label className="grid gap-1.5 text-sm">
                  <span className="text-[11px] uppercase tracking-widest text-secondary">Follow up</span>
                  <input type="date" value={form.followUpAt} onChange={(e) => setForm({ ...form, followUpAt: e.target.value })} className="min-h-11 border border-outline-variant bg-surface px-3 text-paper placeholder:text-secondary [color-scheme:dark]" />
                </label>
              </div>
              <label className="mt-4 grid gap-1.5 text-sm">
                <span className="text-[11px] uppercase tracking-widest text-secondary">Notes</span>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full border border-outline-variant bg-surface p-3 text-sm text-paper placeholder:text-secondary [color-scheme:dark]" placeholder="Context, fit, next step…" />
              </label>
              <p className="mt-2 text-xs text-secondary">Name or company is required. Email is optional but enables deduplication.</p>
              {formError && <p role="alert" className="mt-3 border border-error px-3 py-2 text-sm text-error">{formError}</p>}
              <div className="mt-4 flex gap-2">
                <button type="submit" disabled={saving} className={primaryButton}>{saving ? "Saving…" : "Save prospect"}</button>
                <button type="button" onClick={() => setForm({ ...EMPTY_FORM })} className={secondaryButton}>Clear</button>
              </div>
            </form>
          )}

          {selected && <DetailDialog title="Prospect review" onClose={() => void closeRecord()}>
            <div className="mb-8 border border-primary bg-surface p-5 lg:p-8">
              {error && <p role="alert">{error}</p>}<p role="status" className="text-sm text-secondary">{notice}</p>
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{selected.company || selected.name || "Prospect"}</h2>
                  <p className="font-mono text-[13px] text-secondary">
                    {[selected.name, selected.role, selected.email].filter(Boolean).join(" · ") || "No contact details"}
                  </p>
                </div>
                <span className="ws-badge">{recordDirty ? "Unsaved edits" : "Saved"}</span>
              </div>

              <div className="mb-6 grid gap-4 border-t border-outline-variant pt-4 sm:grid-cols-2 lg:grid-cols-4">
                <div><span className="mb-1 block text-[11px] uppercase tracking-widest text-secondary">Source</span><span className="text-sm">{selected.source || "—"}</span></div>
                <div><span className="mb-1 block text-[11px] uppercase tracking-widest text-secondary">Stage</span><span className="text-sm uppercase">{STAGE_LABELS[selected.stage]}</span></div>
                <div><span className="mb-1 block text-[11px] uppercase tracking-widest text-secondary">Last contacted</span><span className="font-mono text-xs">{selected.last_contacted_at?.slice(0, 10) ?? "—"}</span></div>
                <div><span className="mb-1 block text-[11px] uppercase tracking-widest text-secondary">Created</span><span className="font-mono text-xs">{selected.created_at.slice(0, 10)}</span></div>
                {selected.website && <div className="sm:col-span-2"><span className="mb-1 block text-[11px] uppercase tracking-widest text-secondary">Website</span><a href={selected.website} target="_blank" rel="noopener noreferrer" className="text-sm underline">{selected.website}</a></div>}
                {selected.source_url && <div className="sm:col-span-2"><span className="mb-1 block text-[11px] uppercase tracking-widest text-secondary">Source URL</span><a href={selected.source_url} target="_blank" rel="noopener noreferrer" className="text-sm underline break-all">{selected.source_url}</a></div>}
              </div>

              <fieldset disabled={saving}><div className="grid gap-4 border-t border-outline-variant pt-4 lg:grid-cols-[1fr_1fr]">
                <label className="grid gap-1.5 text-sm">
                  <span className="text-[11px] uppercase tracking-widest text-secondary">Notes</span>
                   <textarea maxLength={10000} value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} className="w-full border border-outline-variant bg-surface p-3 text-sm text-paper placeholder:text-secondary" placeholder="Context, fit, next step…" />
                </label>
                <div className="grid content-start gap-4">
                  <label className="grid gap-1.5 text-sm">
                    <span className="text-[11px] uppercase tracking-widest text-secondary">Stage</span>
                    <select value={recordStage} onChange={(e) => setRecordStage(e.target.value as Stage)} className="min-h-11 border border-outline-variant bg-surface px-3 text-sm text-paper placeholder:text-secondary">
                      {STAGES.map((item) => <option key={item} value={item}>{STAGE_LABELS[item]}</option>)}
                    </select>
                  </label>
                  <label className="grid gap-1.5 text-sm">
                    <span className="text-[11px] uppercase tracking-widest text-secondary">Follow up date</span>
                    <input type="date" value={followUp} onChange={(e) => setFollowUp(e.target.value)} className="min-h-11 border border-outline-variant bg-surface px-3 text-paper placeholder:text-secondary [color-scheme:dark]" />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selected.email && <a href={`mailto:${selected.email}`} className={secondaryButton}>Email</a>}
                    {selected.email && <Link href={`/dashboard/mail/new?prospectId=${selected.id}&email=${encodeURIComponent(selected.email)}`} className={secondaryButton}>Draft outreach</Link>}
                    <button onClick={() => remove(selected.id)} disabled={saving} className="border border-error px-4 py-2.5 text-[11px] uppercase tracking-widest text-error">Delete</button>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-outline-variant pt-4 space-y-4">
                <h3 className="font-semibold">Outreach eligibility</h3>
                <p className="text-sm text-secondary">Published addresses are not mailbox-verified or proof of buying intent. Document verification and legal review before approval.</p>
                {(selected.suppressed_at || selected.unsubscribed_at) && <p className="text-sm">Blocked: this prospect is suppressed or unsubscribed.</p>}
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm">Email verification status<select value={emailStatus} onChange={e => setEmailStatus(e.target.value)} className="min-h-11 border border-outline-variant bg-surface p-3">
                    {["unknown", "verified", "invalid", "risky"].map(status => <option key={status}>{status}</option>)}
                  </select></label>
                  <label className="grid gap-2 text-sm">Reviewed lawful basis<input maxLength={200} value={lawfulBasis} onChange={e => setLawfulBasis(e.target.value)} className="min-h-11 border border-outline-variant bg-surface p-3" /></label>
                </div>
                <p className="text-xs text-secondary">Lawful basis: {lawfulBasis.length}/200 characters. Recording it is a reviewed decision, not automatic legal clearance.</p>
                <button type="button" disabled={saving} className={primaryButton} onClick={() => patch(selected.id, { notes, stage: recordStage, followUpAt: followUp || null, emailStatus, lawfulBasis })}>{saving ? "Saving review…" : "Save prospect review"}</button>
              </div>

              <div className="mt-6 border-t border-outline-variant pt-4">
                <h3 className="mb-3 text-[11px] uppercase tracking-widest text-secondary">Activity · {activities.length}</h3>
                <div className="grid gap-2 sm:grid-cols-[140px_1fr_auto]">
                  <select aria-label="Activity type" value={activityKind} onChange={(e) => setActivityKind(e.target.value)} className="min-h-11 border border-outline-variant bg-surface px-3 text-[11px] uppercase tracking-widest text-paper [color-scheme:dark]">
                    {ACTIVITY_KINDS.map((kind) => <option key={kind} value={kind}>{kind}</option>)}
                  </select>
                  <input value={activityBody} onChange={(e) => setActivityBody(e.target.value)} placeholder="What happened?" aria-label="Activity note" className="min-h-11 border border-outline-variant bg-surface px-3 text-sm text-paper placeholder:text-secondary [color-scheme:dark]" />
                  <button onClick={addActivity} disabled={saving || !activityBody.trim()} className={secondaryButton}>Log</button>
                </div>
                {activityError && <p role="alert">{activityError} <button className="underline" onClick={()=>loadActivities(selected.id)}>Retry activity</button></p>}
                {activities.length === 0 && !activityError ? <p className="mt-3 text-sm text-secondary">No activity yet. Add a note to record your next step.</p> : (
                  <ul className="mt-3 divide-y divide-outline-variant border-t border-outline-variant">
                    {activities.map((activity) => (
                      <li key={activity.id} className="flex flex-wrap items-baseline justify-between gap-2 py-2.5 text-sm">
                        <span><span className="mr-2 font-mono text-[10px] uppercase text-secondary">{activity.kind}</span>{activity.body || "—"}</span>
                        <span className="font-mono text-[10px] text-secondary">{activity.created_at}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div></fieldset>
            </div>
          </DetailDialog>}

          {loading && !data ? <p className="py-16 text-center text-secondary" aria-busy="true">Loading prospects…</p> : !data?.rows.length && !error ? (
            <div className="border border-outline-variant bg-surface px-6 py-16 text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-secondary">No prospects match these filters.</p>
              <p className="mx-auto mt-3 max-w-[52ch] text-sm text-secondary">
                Import a CSV, add a prospect manually, or let an agent populate this table through the MCP endpoint.
              </p>
              <button className={secondaryButton} onClick={()=>{setQuery("");setSearch("");setStage("all");setDueOnly(false);setPage(1);}}>Clear filters</button>
            </div>
          ) : (
            <>
            <div className="divide-y divide-outline-variant border border-outline-variant md:hidden">
                {data?.rows.map((row) => (
                <article key={row.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold">{row.company || row.name || "Prospect"}</h3>
                      <p className="text-xs text-secondary">{[row.name, row.role].filter(Boolean).join(" · ") || "—"}</p>
                    </div>
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest">{STAGE_LABELS[row.stage]}</span>
                  </div>
                  <p className="mt-2 text-xs">{row.email || "No email"}</p>
                  <div className="mt-3 flex items-center justify-between gap-3 font-mono text-[10px] text-secondary">
                    <span>Follow up {row.follow_up_at ?? "—"}</span>
                    <button onClick={() => openProspect(row)} className="border border-primary px-4 py-2 text-[10px] uppercase tracking-widest text-paper">Open</button>
                  </div>
                </article>
              ))}
            </div>
            <div className="hidden overflow-x-auto border border-outline-variant md:block">
              <table className="w-full min-w-[860px] border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-low text-left">
                    {["Company", "Contact", "Source", "Stage", "Last contacted", "Follow up", ""].map((header) => (
                      <th key={header} className="px-4 py-3 font-mono text-[11px] uppercase text-secondary">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {data?.rows.map((row) => (
                    <tr key={row.id} className={`hover:bg-surface-container-high ${row.follow_up_at && row.follow_up_at <= new Date().toISOString().slice(0, 10) && !["won", "lost", "archived"].includes(row.stage) ? "border-l-2 border-l-primary" : ""}`}>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium">{row.company || "—"}</div>
                        <div className="text-xs text-secondary">{row.role || ""}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm">{row.email || row.name || "—"}</div>
                        <div className="text-xs text-secondary">{row.name}</div>
                      </td>
                      <td className="px-4 py-4 text-xs">{row.source || "manual"}</td>
                      <td className="px-4 py-4 text-[11px] uppercase tracking-widest">{STAGE_LABELS[row.stage]}</td>
                      <td className="px-4 py-4 font-mono text-xs">{row.last_contacted_at?.slice(0, 10) ?? "—"}</td>
                      <td className="px-4 py-4 font-mono text-xs">{row.follow_up_at ?? "—"}</td>
                      <td className="px-4 py-4 text-right">
                        <button onClick={() => openProspect(row)} className="border border-primary px-4 py-2 text-[11px] uppercase tracking-widest">Open</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </>
          )}

          {data && data.total > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant py-4 font-mono text-[11px] text-secondary">
              <span>SHOWING {Math.min((page - 1) * data.perPage + 1, data.total)}–{Math.min(page * data.perPage, data.total)} OF {data.total}</span>
              <div className="flex items-center gap-4">
                <button onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1} className="disabled:opacity-30">← PREV</button>
                <span>{String(page).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}</span>
                <button onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={page === totalPages} className="disabled:opacity-30">NEXT →</button>
              </div>
            </div>
          )}

          <details className="mt-8 border border-outline-variant bg-surface">
            <summary className="cursor-pointer px-5 py-4 text-[11px] uppercase tracking-widest text-secondary">Agent / MCP access</summary>
            <div className="border-t border-outline-variant px-5 py-4 text-sm">
              <p className="mb-2">
                Status: <strong>{data?.mcpEnabled ? "token configured" : "token not configured"}</strong>.{" "}
                {data?.mcpEnabled ? "The endpoints accept a bearer token or an admin session." : "Set OUTREACH_API_TOKEN on the server to enable agent access."}
              </p>
              <ul className="mb-3 grid gap-1 font-mono text-[12px] text-secondary">
                <li>GET /api/prospects</li>
                <li>POST /api/prospects</li>
                <li>POST /api/prospects/import</li>
                <li>GET|POST /api/prospects/:id/activities</li>
              </ul>
              <p className="text-secondary">Contract and curl examples: <code className="border border-outline-variant px-1.5 py-0.5 text-[12px]">docs/rebuild/OUTREACH.md</code></p>
            </div>
          </details>
        </div>
      </section>
    </div>
  );
}
