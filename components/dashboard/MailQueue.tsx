"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import MailTabs from "./MailTabs";
import { mailButtonClass, mailPrimaryClass, mailRequest, type MailState } from "./mail-client";
import { EmptyState } from "./WorkspaceUI";

export default function MailQueue() {
  const [data, setData] = useState<MailState | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try { setData(await mailRequest<MailState>("/api/outreach")); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not load drafts."); }
    finally { setLoading(false); }
  }, []);
  // Initial remote state belongs to this effect; load resolves asynchronously.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, [load]);

  const drafts = data?.messages.filter(row => !row.attempted_at) ?? [];
  const approved = drafts.filter(row => row.status === "approved").length;
  return <div className="ws-page ws-stack">
    <header className="ws-page-header">
      <div><h1>Drafts</h1><p>Each message moves through review, approval and one deliberate send. Nothing sends from this list.</p></div>
      <Link href="/dashboard/mail/new" className={mailPrimaryClass}>Write a draft</Link>
    </header>
    <MailTabs active="drafts" />
    {error && <p role="alert">{error} <button className="underline" onClick={load}>Retry</button></p>}
    {loading && !data && <div className="ws-skeleton" aria-label="Loading drafts" aria-busy="true" />}
    {data && <>
      <section className="ws-card ws-list-item">
        <div>
          <h2>{data.settings.paused ? "Sending is paused" : "Sending is enabled"}</h2>
          <p className="ws-muted">{drafts.length} unsent {drafts.length === 1 ? "draft" : "drafts"}{approved ? `, ${approved} approved` : ""} · {data.todayAttempts} of {data.settings.dailyCap} attempts today (UTC)</p>
        </div>
        <Link href="/dashboard/mail/settings" className={mailButtonClass}>{data.settings.paused ? "Enable sending" : "Sending settings"}</Link>
      </section>
      {data.settings.paused && <p className="ws-notice">Final sending is blocked until dispatch is enabled in Sender settings. Drafting and approval can continue.</p>}
      <section className="ws-card">
        <div className="ws-section-heading"><h2>Unsent messages</h2>{loading && <span className="ws-muted">Refreshing…</span>}</div>
        {drafts.length ? <ul className="ws-list">{drafts.map(row => <li className="ws-list-item" key={row.id}>
          <div className="min-w-0">
            <strong className="break-words">{row.subject}</strong>
            <p className="ws-muted text-xs break-all">{row.recipient}</p>
            <p className="ws-muted text-xs">#{row.id}{row.is_test ? " · test" : ""}{row.updated_at ? ` · updated ${row.updated_at}` : ""}</p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <span className={`ws-badge ${row.status === "approved" ? "good" : ""}`}>{row.status === "approved" ? "Approved" : row.status}</span>
            <Link href={`/dashboard/mail/draft/${row.id}${row.status === "approved" ? "/send" : ""}`} className={row.status === "approved" ? mailPrimaryClass : mailButtonClass}>{row.status === "approved" ? "Send" : "Review"}</Link>
          </div>
        </li>)}</ul> : <EmptyState title="No unsent drafts"><p>Write a draft from a prospect record, or start with a controlled test message.</p><div className="ws-actions"><Link href="/dashboard/prospects" className={mailButtonClass}>Choose a prospect</Link><Link href="/dashboard/mail/new" className={mailPrimaryClass}>Write a draft</Link></div></EmptyState>}
      </section>
      <p className="ws-muted text-sm">Already attempted? Open <Link className="underline" href="/dashboard/mail/history">Sent & history</Link>. Attempted messages are never edited or resent.</p>
    </>}
  </div>;
}
