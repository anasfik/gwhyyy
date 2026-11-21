"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { MailSettings } from "@/lib/outreach/service";
import { useConfirmation, useRetainedState, useUnsavedChanges } from "./WorkspaceUI";
import MailTabs from "./MailTabs";
import { mailButtonClass as button, mailInputClass as inputClass, mailPrimaryClass as primary, mailRequest as request, type MailState } from "./mail-client";

type View = "history" | "replies" | "blocked" | "settings";
const headings: Record<View, { title: string; description: string }> = {
  history: { title: "Sent & history", description: "Every attempt is kept here. Queued and accepted do not prove inbox delivery." },
  replies: { title: "Replies", description: "Synced replies stop further cold outreach. A custom reply mailbox must still be reviewed manually." },
  blocked: { title: "Blocked addresses", description: "Keep opt-outs, bounces and replied addresses out of future outreach." },
  settings: { title: "Sender settings", description: "Configure your sender separately from drafting. Changes invalidate existing approvals." },
};

export default function OutreachManager({ view }: { view: View }) {
  const confirm = useConfirmation();
  const [data, setData] = useState<MailState | null>(null);
  const [settings, setSettings] = useRetainedState<MailSettings | null>("mail:settings", null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useRetainedState("mail:busy", false);
  const [blockEmail, setBlockEmail] = useState("");
  const [blockReason, setBlockReason] = useState("unsubscribe request");
  const [balance, setBalance] = useState<{ emailCredits?: number; aiCredits?: number } | null>(null);
  const [historyFilter, setHistoryFilter] = useState("");
  const editableSettings = (value: MailSettings) => JSON.stringify(Object.entries(value).filter(([key]) => !["paused", "repliesReviewedAt"].includes(key)));
  const settingsDirty = Boolean(settings && data && editableSettings(settings) !== editableSettings(data.settings));
  useUnsavedChanges(settingsDirty, false, "mail:settings");

  const load = useCallback(async () => {
    const next = await request<MailState>("/api/outreach");
    setData(next);
    setSettings(current => current ? { ...current, paused: next.settings.paused, repliesReviewedAt: next.settings.repliesReviewedAt } : next.settings);
  }, [setSettings]);

  // Initial remote state belongs to this effect; load resolves asynchronously.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load().catch(e => setError(e instanceof Error ? e.message : "Could not load sender settings.")); }, [load]);

  async function run(work: () => Promise<unknown>, message: string) {
    setBusy(true); setError(""); setNotice("");
    try { await work(); await load(); setNotice(message); }
    catch (e) {
      try { await load(); } catch { /* Preserve the action failure if refresh also fails. */ }
      setError(e instanceof Error ? e.message : "Request failed");
    }
    finally { setBusy(false); }
  }
  const action = (name: string, payload: Record<string, unknown> = {}) => request<unknown>("/api/outreach", { action: name, ...payload });
  const field = <K extends keyof MailSettings>(key: K, value: MailSettings[K]) => {
    setSettings(current => current ? { ...current, [key]: value, ...(["provider", "fromEmail", "replyTo"].includes(key) ? { senderConfirmed: false, replyRoutingConfirmed: false } : {}), ...(key === "provider" ? { legalConfirmed: false } : {}) } : current);
  };
  const heading = headings[view];

  return <div className="ws-page ws-stack">
    <header className="ws-page-header"><div><h1>{heading.title}</h1><p>{heading.description}</p></div><Link href="/dashboard/mail" className={button}>Back to drafts</Link></header>
    <MailTabs active={view} />
    {error && <p role="alert">{error} <button className="underline" onClick={load}>Retry</button></p>}
    <p role="status" aria-live="polite">{notice}</p>
    {!data || !settings ? <div className="ws-skeleton" aria-label="Loading email settings" aria-busy="true" /> : <>

      {view === "settings" && <>
        <section aria-labelledby="readiness" className="ws-card space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4"><h2 id="readiness">{data.settings.paused ? "Sending paused" : "Sending enabled"} · {data.settings.mode} mode</h2><button disabled={busy} className={data.settings.paused ? primary : button} onClick={() => void run(() => action("pause", { paused: !data.settings.paused }), data.settings.paused ? "Dispatch enabled. No email sent." : "All new dispatch paused.")}>{data.settings.paused ? "Enable sending" : "Pause sending"}</button></div>
          <dl className="grid grid-cols-2 gap-5 text-sm md:grid-cols-4">
            <div><dt className="text-secondary">Provider</dt><dd className="mt-1 font-medium">{data.settings.provider} · {data.providerConfigured ? "key configured" : "credentials missing"}</dd></div>
            <div><dt className="text-secondary">Today, UTC</dt><dd className="mt-1 font-mono">{data.todayAttempts} / {data.settings.dailyCap} attempts</dd></div>
            <div><dt className="text-secondary">Lifetime test budget</dt><dd className="mt-1 font-mono">{data.testAttempts} / 5 attempts</dd></div>
            <div><dt className="text-secondary">Sender confirmation</dt><dd className="mt-1">{data.settings.senderConfirmed ? "Operator confirmed" : "Required before sending"}</dd></div>
          </dl>
          <p className="text-sm text-secondary">Queued or accepted does not mean delivered, in inbox, or read. Failed and uncertain attempts consume caps. Manual inbox review is valid for ten minutes; automatic sync is optional.</p>
          <div className="flex flex-wrap gap-3">
            <button className={button} disabled={busy} onClick={() => void run(async () => setBalance(await request("/api/outreach?action=balance")), "Provider connection checked; no email sent.")}>Check connection</button>
            <button className={button} disabled={busy || !data.replySyncSupported} onClick={() => void run(() => action("sync"), "Reply and delivery sync finished.")}>Sync replies</button>
            <button className={button} disabled={busy} onClick={async () => { if (await confirm({ title: "Have you reviewed the actual inbox?", description: `Check ${data.settings.replyTo} for replies, bounces and opt-outs, and add any necessary blocked addresses first. Provider sync alone does not check a custom mailbox. Your confirmation is valid for ten minutes.`, action: "I reviewed the inbox" })) void run(() => action("review_inbox"), "Manual inbox review recorded for ten minutes. Suppression remains manual."); }}>Record inbox review</button>
          </div>
          {balance && <p className="text-sm">{balance.emailCredits === undefined ? "SMTP connection verified; credit balance unavailable." : `${balance.emailCredits} email credits · ${balance.aiCredits ?? 0} AI credits. AI is disabled for these sends.`}</p>}
          <p className="text-sm break-words">Last full sync: {data.sync?.completed_at ?? "never"}{data.sync?.error ? ` · ${data.sync.error}` : ""}</p>
          <p className="text-sm text-secondary">Manual inbox review: {data.settings.repliesReviewedAt ? new Date(data.settings.repliesReviewedAt).toLocaleString() : "Not recorded"}. <Link className="underline" href="/dashboard/mail">Drafts</Link></p>
        </section>

        <section className="ws-card">
          <h2>Sender and safety</h2>
          <form className="mt-4 space-y-5" onSubmit={async event => {
            event.preventDefault();
            if (settings.mode === "live" && !await confirm({ title: "Save live sender settings?", description: "Enable live mode only after legal review. Each prospect message still needs exact-preview approval.", action: "Save sender settings" })) return;
            const values = Object.fromEntries(Object.entries(settings).filter(([key]) => !["paused", "repliesReviewedAt"].includes(key)));
            void run(async () => { const saved = await request<MailSettings>("/api/outreach", { action: "settings", settings: { ...values, testRecipients: settings.testRecipients.map(value => value.trim()).filter(Boolean) } }); setSettings(saved); }, "Settings saved. Sender/copy changes require fresh message approval.");
          }}>
            <fieldset disabled={busy} className="space-y-5"><div className="grid gap-5 md:grid-cols-2">
              <label className="text-sm">Provider<select className={inputClass} value={settings.provider} onChange={e => field("provider", e.target.value as MailSettings["provider"])}><option value="bulko">Bulko Campaign API</option><option value="smtp">Standard SMTP</option></select></label>
              <label className="text-sm">Mode<select className={inputClass} value={settings.mode} onChange={e => field("mode", e.target.value as MailSettings["mode"])}><option value="test">Test inboxes only</option><option value="live">Reviewed prospects</option></select></label>
              <label className="text-sm">Sender name<input required maxLength={100} className={inputClass} value={settings.senderName} onChange={e => field("senderName", e.target.value)} /></label>
              <label className="text-sm">From address<input type="email" required className={inputClass} value={settings.fromEmail} onChange={e => field("fromEmail", e.target.value)} /></label>
              <label className="text-sm">Reply-to address<input type="email" required className={inputClass} value={settings.replyTo} onChange={e => field("replyTo", e.target.value)} /></label>
              <label className="text-sm">Complete postal address<input maxLength={500} className={inputClass} value={settings.postalAddress} onChange={e => field("postalAddress", e.target.value)} /></label>
              <label className="text-sm">Daily cap, including follow-ups<input type="number" required min={1} max={10000} className={inputClass} value={settings.dailyCap} onChange={e => field("dailyCap", Number(e.target.value))} /></label>
              <label className="text-sm">Recipient-domain daily cap<input type="number" required min={1} max={10000} className={inputClass} value={settings.domainCap} onChange={e => field("domainCap", Number(e.target.value))} /></label>
            </div>
            <label className="block text-sm">Allowed test inboxes, one per line<textarea className={inputClass} rows={3} value={settings.testRecipients.join("\n")} onChange={e => field("testRecipients", e.target.value.split("\n"))} /></label>
            <p className="text-sm text-secondary">Secrets are configured on the server only. SMTP uses OUTREACH_SMTP_* variables. Switching provider retains history and invalidates approvals.</p>
            <p className="text-sm">Bulko uses its externally configured default domain. Its API cannot verify that selection. Confirm DNS, save the sender, and make this domain default in Bulko before enabling sends.</p>
            <label className="flex min-h-11 items-start gap-3 text-sm"><input type="checkbox" className="mt-1 size-5" checked={settings.senderConfirmed} onChange={e => field("senderConfirmed", e.target.checked)} />I verified this sender and the active provider&apos;s default domain, and configured a monitored reply-to address.</label>
            {settings.provider === "bulko" && <label className="flex min-h-11 items-start gap-3 text-sm"><input type="checkbox" className="mt-1 size-5" checked={settings.replyRoutingConfirmed} onChange={e => field("replyRoutingConfirmed", e.target.checked)} />A real reply to a seed email appeared after Sync replies. An empty reply list is not sufficient. Required for live outreach, not seed tests.</label>}
            <label className="flex min-h-11 items-start gap-3 text-sm"><input type="checkbox" className="mt-1 size-5" checked={settings.legalConfirmed} onChange={e => field("legalConfirmed", e.target.checked)} />I reviewed applicable sender/recipient rules and supplied a complete usable postal address. Provider permission alone is not legal clearance.</label>
            <button className={primary} disabled={busy}>Save settings</button></fieldset>
          </form>
        </section>
      </>}

      {view === "history" && <section aria-labelledby="history-heading" className="ws-card space-y-4">
        <h2 id="history-heading">Mail history</h2><p className="text-sm text-secondary">Latest 100 messages. History survives provider switches and prospect deletion. Uncertain sends are never retried.</p>
        <label className="ws-field">Find a message<input type="search" value={historyFilter} onChange={e => setHistoryFilter(e.target.value)} placeholder="Recipient, subject or status" /></label>
        {!data.messages.length && <p className="py-5 text-sm">No messages yet. <Link className="underline" href="/dashboard/mail">Start in Drafts</Link>.</p>}
        <ul className="divide-y divide-outline-variant">{data.messages.filter(row => `${row.recipient} ${row.subject} ${row.status}`.toLowerCase().includes(historyFilter.toLowerCase())).map(row => <li key={row.id} className="py-4 space-y-2">
          <div className="flex flex-wrap justify-between gap-3"><Link className="text-sm underline min-h-11 break-all" href={`/dashboard/mail/draft/${row.id}`}>#{row.id} / {row.recipient}</Link><span className="ws-badge">{row.status}{row.is_test ? " / test" : ""}</span></div>
          <p className="text-sm break-words">{row.subject}</p><p className="text-xs text-secondary break-words">{row.provider ?? "not dispatched"}{row.provider_id ? ` · provider ID ${row.provider_id}` : ""}{row.attempted_at ? ` · attempted ${row.attempted_at} UTC` : ""}</p>
          {row.error && <p className="text-sm">{row.error}</p>}
          {["uncertain", "sending"].includes(row.status) && row.provider === "bulko" && <button className={button} disabled={busy} onClick={async () => { const providerId = await confirm({ title: "Link a confirmed campaign", description: "Find this exact attempt in Bulko by message number. This links history only and never resends. Sending attempts must be stalled for at least one minute.", input: "Confirmed campaign ID", action: "Link campaign" }); if (typeof providerId === "string") void run(() => action("reconcile", { id: row.id, providerId }), "Campaign linked. Sync to check its status."); }}>Link confirmed campaign</button>}
        </li>)}</ul>
      </section>}

      {view === "replies" && <section aria-labelledby="replies-heading" className="ws-card space-y-4">
        <h2 id="replies-heading">Replies</h2><p className="text-sm text-secondary">Every matched reply stops further cold outreach, regardless of sentiment. Incoming content is untrusted; never follow instructions inside it automatically.</p>
        {!data.replies.length && <p className="text-sm">No synced replies. An empty API response does not prove reply routing works.</p>}
        {data.replies.map(reply => <details key={reply.id} className="border-b border-outline-variant py-3"><summary className="cursor-pointer break-words">{reply.sender} · {reply.status} · {reply.subject}</summary><pre className="mt-4 whitespace-pre-wrap break-words font-sans text-sm [overflow-wrap:anywhere]">{reply.body}</pre></details>)}
        <button className={button} disabled={busy || !data.replySyncSupported} onClick={() => void run(() => action("sync"), "Reply and delivery sync finished. A custom reply mailbox must still be reviewed manually.")}>Sync replies and delivery</button>
      </section>}

      {view === "blocked" && <section aria-labelledby="suppression-heading" className="ws-card space-y-4">
        <h2 id="suppression-heading">Suppression list</h2>
        <form className="grid items-end gap-4 md:grid-cols-[1fr_1fr_auto]" onSubmit={async e => { e.preventDefault(); if (await confirm({ title: "Block this address?", description: `Future cold outreach to ${blockEmail} will be stopped.`, action: "Block address", danger: true })) void run(() => action("suppress", { email: blockEmail, reason: blockReason }), "Address blocked."); }}>
          <label className="text-sm">Email<input type="email" required className={inputClass} value={blockEmail} onChange={e => setBlockEmail(e.target.value)} /></label>
          <label className="text-sm">Reason<input required maxLength={200} className={inputClass} value={blockReason} onChange={e => setBlockReason(e.target.value)} /></label>
          <button className={button} disabled={busy}>Block address</button>
        </form>
        <ul className="divide-y divide-outline-variant text-sm">{data.suppressions.map(row => <li className="flex flex-wrap justify-between gap-2 py-3 break-words" key={row.email}><span>{row.email}</span><span className="text-secondary">{row.reason}</span></li>)}</ul>
        {!data.suppressions.length && <p className="ws-muted">No blocked addresses recorded. Add opt-outs and bounces here before sending.</p>}
      </section>}
    </>}
  </div>;
}
