"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DetailDialog, useConfirmation, useUnsavedChanges, useRetainedState } from "./WorkspaceUI";

type Contact = {
  id: number;
  name: string;
  email: string;
  subject: string;
  budget: string;
  message: string;
  service: string | null;
  stage: string | null;
  company: string | null;
  company_website: string | null;
  timeframe: string | null;
  contact_method: string | null;
  source: string | null;
  email_status: string | null;
  status: "unread" | "read" | "archived";
  lead_stage: "new" | "qualified" | "contacted" | "won" | "lost" | "archived";
  notes: string;
  follow_up_at: string | null;
  created_at: string;
};

type ApiResponse = { rows: Contact[]; total: number; page: number; perPage: number };

const STATUSES = ["all", "unread", "read", "archived"];
const STAGES = ["all", "new", "qualified", "contacted", "won", "lost", "archived"];

export default function InquiriesManager({ initialStatus = "all", initialQuery = "" }: { initialStatus?: string; initialQuery?: string }) {
  const confirm = useConfirmation();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [filter, setFilter] = useState(STATUSES.includes(initialStatus) ? initialStatus : "all");
  const [stage, setStage] = useState("all");
  const [query, setQuery] = useState(initialQuery);
  const [search, setSearch] = useState(initialQuery);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useRetainedState<Contact | null>("inquiry:selected", null);
  const [notes, setNotes] = useRetainedState("inquiry:notes", "");
  const [followUp, setFollowUp] = useRetainedState("inquiry:followUp", "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useRetainedState("inquiry:saving", false);
  const [recordStage, setRecordStage] = useRetainedState<Contact["lead_stage"]>("inquiry:stage", "new");
  const [notice, setNotice] = useState("");
  const generation = useRef(0);
  const dirty = Boolean(selected && (notes !== (selected.notes ?? "") || followUp !== (selected.follow_up_at ?? "") || recordStage !== selected.lead_stage));
  useUnsavedChanges(dirty, false, "inquiries");
  const close = async () => {
    if (saving) return;
    if (dirty && !await confirm({ title: "Discard unsaved inquiry edits?", description: "Your notes, stage and follow-up date have not been saved.", action: "Discard edits", danger: true })) return;
    setSelected(null);
  };

  const fetchMessages = useCallback(async () => {
    const request = ++generation.current;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/messages?status=${filter}&stage=${stage}&q=${encodeURIComponent(search)}&page=${page}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Inbox load failed (${res.status})`);
      const next = await res.json();
      if (request === generation.current) setData(next);
    } catch (e) {
      if (request === generation.current) setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      if (request === generation.current) setLoading(false);
    }
  }, [filter, stage, search, page]);

  useEffect(() => {
    // Initial remote state belongs to this effect; fetch resolves asynchronously.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMessages();
  }, [fetchMessages]);

  const patch = async (id: number, payload: Record<string, unknown>) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/messages", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...payload }) });
      if (!res.ok) throw new Error(`Update failed (${res.status})`);
      setSelected(current => current?.id === id ? { ...current, ...payload } as Contact : current);
      setNotice("Inquiry updated.");
      await fetchMessages();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!await confirm({ title: "Permanently delete this inquiry?", description: "The inquiry and qualification notes will be removed. This cannot be undone.", action: "Delete inquiry", danger: true })) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/messages?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      setSelected(null);
      fetchMessages();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally { setSaving(false); }
  };

  const open = (row: Contact) => {
    setSelected(row); setNotes(row.notes ?? ""); setFollowUp(row.follow_up_at ?? ""); setRecordStage(row.lead_stage); setNotice("");
    if (row.status === "unread") void patch(row.id, { status: "read" });
  };

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.perPage)) : 1;

  return (
    <div className="ws-page ws-stack">
      <header className="ws-page-header">
        <div>
          <h1>Inquiries</h1><p>Incoming requests from your website. Review the details and save a clear next step.</p>
        </div>
        <a href={`/api/messages/export?status=${filter}&stage=${stage}&q=${encodeURIComponent(search)}`} download className="ws-button">Export filtered CSV</a>
      </header>

      <section>
        <div>
          <form onSubmit={event => { event.preventDefault(); setSearch(query); setPage(1); }} className="ws-filterbar">
            <label className="ws-field">Search inquiries<input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name, email or message" /></label>
            <label className="ws-field">Read status<select value={filter} onChange={event=>{setFilter(event.target.value);setPage(1);}}>{STATUSES.map(value=><option key={value} value={value}>{value === "all" ? "All statuses" : value}</option>)}</select></label>
            <label className="ws-field">Pipeline stage<select value={stage} onChange={event=>{setStage(event.target.value);setPage(1);}}>{STAGES.map(value=><option key={value} value={value}>{value === "all" ? "All stages" : value}</option>)}</select></label>
            <div className="flex gap-2">
              <button className="ws-button ws-primary">Search</button>
              {(search || filter !== "all" || stage !== "all") && <button type="button" onClick={() => { setQuery(""); setSearch(""); setFilter("all"); setStage("all"); setPage(1); }} className="ws-button">Reset</button>}
            </div>
          </form>

          {error && <p role="alert" className="mb-4">{error} <button className="underline" onClick={fetchMessages}>Retry</button></p>}
          <p role="status" className="ws-muted mb-4">{loading && data ? "Refreshing inquiries…" : notice}</p>

          {selected && <DetailDialog title="Inquiry review" onClose={()=>void close()}>
            <div>
              {error && <p role="alert">{error}</p>}<p role="status" className="ws-muted">{notice}</p>
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <div className="text-xl font-semibold">{selected.name}</div>
                  <div className="font-mono text-[13px] text-secondary">{selected.email}</div>
                </div>
                 <span className="ws-badge">{dirty ? "Unsaved edits" : "Saved"}</span>
              </div>
              <div className="mb-6 grid gap-4 border-t border-outline-variant pt-4 sm:grid-cols-3">
                <div><span className="mb-1 block text-[11px] uppercase tracking-widest text-secondary">Service</span><span className="text-[15px]">{selected.service || "—"}</span></div>
                <div><span className="mb-1 block text-[11px] uppercase tracking-widest text-secondary">Project stage</span><span className="text-[15px]">{selected.stage || "—"}</span></div>
                <div><span className="mb-1 block text-[11px] uppercase tracking-widest text-secondary">Company</span><span className="text-[15px]">{selected.company || "—"}</span></div>
                <div><span className="mb-1 block text-[11px] uppercase tracking-widest text-secondary">Received</span><span className="font-mono text-[12px]">{selected.created_at}</span></div>
                <div><span className="mb-1 block text-[11px] uppercase tracking-widest text-secondary">Email delivery</span><span className="text-[15px]">{selected.email_status || "—"}</span></div>
                <div><span className="mb-1 block text-[11px] uppercase tracking-widest text-secondary">Source</span><span className="text-[15px]">{selected.source || "Direct"}</span></div>
              </div>
              <p className="mb-6 whitespace-pre-wrap text-[16px] leading-7">{selected.message}</p>
              <fieldset disabled={saving}><div className="grid gap-4 border-t border-outline-variant pt-4 lg:grid-cols-2">
                 <label className="ws-field">Qualification notes<textarea rows={3} maxLength={5000} value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
                <label className="grid gap-1.5 text-sm content-start"><span className="text-[11px] uppercase tracking-widest text-secondary">Follow up date</span><input type="date" value={followUp} onChange={(e) => setFollowUp(e.target.value)} className="min-h-11 border border-outline-variant px-3" /></label>
              </div>
              <div className="mt-4 flex flex-wrap items-end gap-2">
                 <a href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject || "your inquiry"}`)}`} className="ws-button">Reply in email app</a>
                 <label className="ws-field">Pipeline stage<select value={recordStage} onChange={(e) => setRecordStage(e.target.value as Contact["lead_stage"])}>
                  {STAGES.filter((s) => s !== "all").map((s) => <option key={s} value={s}>{s}</option>)}
                 </select></label>
                 <button onClick={() => patch(selected.id, { notes, lead_stage: recordStage, follow_up_at: followUp || null })} disabled={saving || !dirty} className="ws-button ws-primary">{saving ? "Saving…" : "Save review"}</button>
                <button onClick={() => patch(selected.id, { status: selected.status === "read" ? "unread" : "read" })} className="border border-outline-variant px-5 py-3 text-[11px] uppercase tracking-widest">Mark {selected.status === "read" ? "unread" : "read"}</button>
                 <button onClick={async () => { if (await confirm({ title: "Archive this inquiry?", description: "This saves your current review and moves the inquiry out of the active pipeline. You can find it with the archived filter.", action: "Archive inquiry" })) { setRecordStage("archived"); void patch(selected.id, { status: "archived", lead_stage: "archived", notes, follow_up_at: followUp || null }); } }} className="ws-button">Archive</button>
                <button onClick={() => remove(selected.id)} className="border border-error px-5 py-3 text-[11px] uppercase tracking-widest text-error">Delete</button>
              </div></fieldset>
            </div>
          </DetailDialog>}

          {loading && !data ? <div className="ws-skeleton" aria-label="Loading inquiries" aria-busy="true" /> : !data?.rows.length && !error ? <div className="ws-empty"><h2>No inquiries here</h2><p>{search || filter !== "all" || stage !== "all" ? "Try a different search or reset your filters." : "New requests from the website contact form will appear here."}</p></div> : (
            <div className="overflow-x-auto border border-outline-variant">
              <table className="w-full border-collapse ws-inquiries-table">
                <caption className="sr-only">Website inquiries matching the current filters</caption>
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-low text-left">
                    {["Status", "Sender", "Service", "Stage", "Follow up", "Action"].map((h) => <th scope="col" key={h} className="px-4 py-3 text-secondary">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {data?.rows.map((row) => (
                    <tr key={row.id}>
                      <td className="px-4 py-4 font-mono text-[11px] uppercase">{row.status}</td>
                      <td className="px-4 py-4"><div className="text-sm font-medium">{row.email}</div><div className="text-xs text-secondary">{row.name} · {row.created_at.slice(0, 10)}</div></td>
                      <td className="px-4 py-4 text-xs">{row.service || "—"}</td>
                      <td className="px-4 py-4 text-xs uppercase">{row.lead_stage}</td>
                      <td className="px-4 py-4 font-mono text-xs">{row.follow_up_at ?? "—"}</td>
                      <td className="px-4 py-4 text-right"><button className="ws-button" aria-label={`Open inquiry from ${row.name}`} onClick={()=>open(row)}>Open</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {data && data.total > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant py-4 font-mono text-[11px] text-secondary">
              <span>SHOWING {Math.min((page - 1) * data.perPage + 1, data.total)}–{Math.min(page * data.perPage, data.total)} OF {data.total}</span>
              <div className="flex items-center gap-4">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="disabled:opacity-30">← PREV</button>
                <span>{String(page).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}</span>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="disabled:opacity-30">NEXT →</button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
