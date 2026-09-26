"use client";

import { useCallback, useEffect, useState } from "react";

type Contact = {
  id: number;
  name: string;
  email: string;
  subject: string;
  budget: string;
  message: string;
  status: "unread" | "read" | "archived";
  lead_stage: "new" | "qualified" | "contacted" | "won" | "lost" | "archived";
  notes: string;
  follow_up_at: string | null;
  created_at: string;
};

type ApiResponse = { rows: Contact[]; total: number; page: number; perPage: number };

const STATUSES = ["all", "unread", "read", "archived"];
const STAGES = ["all", "new", "qualified", "contacted", "won", "lost", "archived"];

export default function MessagesPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [filter, setFilter] = useState("all");
  const [stage, setStage] = useState("all");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [notes, setNotes] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/messages?status=${filter}&stage=${stage}&q=${encodeURIComponent(search)}&page=${page}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Inbox load failed (${res.status})`);
      setData(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
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
      await fetchMessages();
      if (selected?.id === id) {
        const updated = { ...selected, ...payload } as Contact;
        setSelected(payload.status === "archived" && !payload.lead_stage ? null : updated);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Permanently delete this lead?")) return;
    try {
      const res = await fetch(`/api/messages?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      setSelected(null);
      fetchMessages();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const exportAll = () => {
    window.open(`/api/messages/export?status=${filter}&stage=${stage}&q=${encodeURIComponent(search)}`, "_blank");
  };

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.perPage)) : 1;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="flex flex-shrink-0 flex-wrap items-center justify-between gap-3 border-b border-outline-variant px-4 py-4 lg:px-12">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-secondary">Pipeline / Incoming requests</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">LEADS</h1>
        </div>
        <button onClick={exportAll} className="border border-outline-variant px-4 py-2 text-[11px] uppercase tracking-widest hover:bg-surface-container-high">Export filtered CSV</button>
      </header>

      <section className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_auto]">
            <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { setSearch(query); setPage(1); } }} placeholder="Search name, email, subject, message…" aria-label="Search leads" className="min-h-11 w-full border border-outline-variant bg-surface px-4 text-sm" />
            <div className="flex gap-2">
              <button onClick={() => { setSearch(query); setPage(1); }} className="bg-primary px-5 text-[11px] uppercase tracking-widest text-on-primary">Search</button>
              {(search || filter !== "all" || stage !== "all") && <button onClick={() => { setQuery(""); setSearch(""); setFilter("all"); setStage("all"); setPage(1); }} className="border border-outline-variant px-4 text-[11px] uppercase tracking-widest">Reset</button>}
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-1">
            {STATUSES.map((f) => (
              <button key={f} onClick={() => { setFilter(f); setPage(1); }} className={`px-3 py-2 text-[11px] uppercase tracking-widest ${filter === f ? "bg-primary text-on-primary" : "border border-outline-variant hover:bg-surface-container-high"}`}>{f}</button>
            ))}
            <span className="mx-2 hidden h-6 w-px bg-outline-variant sm:block" aria-hidden="true" />
            {STAGES.map((s) => (
              <button key={s} onClick={() => { setStage(s); setPage(1); }} className={`px-3 py-2 text-[11px] uppercase tracking-widest ${stage === s ? "bg-green-700 text-white" : "border border-outline-variant hover:bg-surface-container-high"}`}>{s}</button>
            ))}
          </div>

          {error && <p role="alert" className="mb-4 border border-error px-4 py-3 text-sm text-error">{error}</p>}

          {selected && (
            <div className="mb-8 border border-primary bg-surface p-5 lg:p-8">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <div className="text-xl font-semibold">{selected.name}</div>
                  <div className="font-mono text-[13px] text-secondary">{selected.email}</div>
                </div>
                <button onClick={() => setSelected(null)} aria-label="Close lead detail" className="min-h-11 min-w-11 border border-outline-variant text-xl">×</button>
              </div>
              <div className="mb-6 grid gap-4 border-t border-outline-variant pt-4 sm:grid-cols-3">
                <div><span className="mb-1 block text-[11px] uppercase tracking-widest text-secondary">Subject</span><span className="text-[15px]">{selected.subject || "—"}</span></div>
                <div><span className="mb-1 block text-[11px] uppercase tracking-widest text-secondary">Budget</span><span className="text-[15px]">{selected.budget || "—"}</span></div>
                <div><span className="mb-1 block text-[11px] uppercase tracking-widest text-secondary">Received</span><span className="font-mono text-[12px]">{selected.created_at}</span></div>
              </div>
              <p className="mb-6 whitespace-pre-wrap text-[16px] leading-7">{selected.message}</p>
              <div className="grid gap-4 border-t border-outline-variant pt-4 lg:grid-cols-2">
                <label className="grid gap-1.5 text-sm"><span className="text-[11px] uppercase tracking-widest text-secondary">Qualification notes</span><textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border border-outline-variant p-3 text-sm" /></label>
                <label className="grid gap-1.5 text-sm content-start"><span className="text-[11px] uppercase tracking-widest text-secondary">Follow up date</span><input type="date" value={followUp} onChange={(e) => setFollowUp(e.target.value)} className="min-h-11 border border-outline-variant px-3" /></label>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="bg-primary px-5 py-3 text-[11px] uppercase tracking-widest text-on-primary">Reply</a>
                <select aria-label="Lead stage" value={selected.lead_stage} onChange={(e) => patch(selected.id, { lead_stage: e.target.value })} className="min-h-11 border border-outline-variant px-3 text-[11px] uppercase tracking-widest">
                  {STAGES.filter((s) => s !== "all").map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => patch(selected.id, { notes, follow_up_at: followUp || null })} disabled={saving} className="border border-outline-variant px-5 py-3 text-[11px] uppercase tracking-widest disabled:opacity-40">Save notes</button>
                <button onClick={() => patch(selected.id, { status: selected.status === "read" ? "unread" : "read" })} className="border border-outline-variant px-5 py-3 text-[11px] uppercase tracking-widest">Mark {selected.status === "read" ? "unread" : "read"}</button>
                <button onClick={() => patch(selected.id, { status: "archived", lead_stage: "archived" })} className="border border-outline-variant px-5 py-3 text-[11px] uppercase tracking-widest">Archive</button>
                <button onClick={() => remove(selected.id)} className="border border-error px-5 py-3 text-[11px] uppercase tracking-widest text-error">Delete</button>
              </div>
            </div>
          )}

          {loading ? <p className="py-16 text-center font-mono text-xs uppercase text-secondary">Loading…</p> : !data?.rows.length ? <p className="py-16 text-center font-mono text-xs uppercase text-secondary">No leads match these filters.</p> : (
            <div className="overflow-x-auto border border-outline-variant">
              <table className="w-full min-w-[820px] border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-low text-left">
                    {["Status", "Sender", "Budget", "Stage", "Follow up", "Action"].map((h) => <th key={h} className="px-4 py-3 font-mono text-[11px] uppercase text-secondary">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {data.rows.map((row) => (
                    <tr key={row.id} className="cursor-pointer hover:bg-surface-container-high" onClick={() => { setSelected(row); setNotes(row.notes ?? ""); setFollowUp(row.follow_up_at ?? ""); patch(row.id, { status: "read" }); }}>
                      <td className="px-4 py-4 font-mono text-[11px] uppercase">{row.status}</td>
                      <td className="px-4 py-4"><div className="text-sm font-medium">{row.email}</div><div className="text-xs text-secondary">{row.name} · {row.created_at.slice(0, 10)}</div></td>
                      <td className="px-4 py-4 font-mono text-xs">{row.budget || "—"}</td>
                      <td className="px-4 py-4 text-xs uppercase">{row.lead_stage}</td>
                      <td className="px-4 py-4 font-mono text-xs">{row.follow_up_at ?? "—"}</td>
                      <td className="px-4 py-4 text-right"><span className="inline-block border border-primary px-4 py-2 text-[11px] uppercase tracking-widest">View</span></td>
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
