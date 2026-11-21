"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MailRow } from "@/lib/outreach/service";
import { mailReadiness } from "@/lib/dashboard";
import { prospectSendChecks, type ProspectGate } from "@/lib/mail-flow";
import { useConfirmation, useRetainedState, useUnsavedChanges } from "./WorkspaceUI";
import MailTabs from "./MailTabs";
import {
  mailButtonClass,
  mailDraftHref,
  mailEditorFrom,
  mailPrimaryClass,
  mailRequest,
  mailStepLabels,
  mailSteps,
  type MailEditor,
  type MailPreview,
  type MailState,
  type MailStep,
  type ProspectOption,
} from "./mail-client";

const descriptions: Record<MailStep, string> = {
  review: "Check the recipient and message. Nothing is approved or sent on this step.",
  approve: "Approve the exact saved copy. Approval does not send an email.",
  send: "Run the final checks and send one email. This cannot be undone.",
};

function DraftSteps({ id, step }: { id?: number; step: MailStep }) {
  const current = mailSteps.indexOf(step);
  return <nav aria-label="Sending steps"><ol className="ws-steps">{mailSteps.map((item, index) => {
    const label = mailStepLabels[item];
    const href = id && index <= current ? mailDraftHref(id, item) : undefined;
    return <li key={item} aria-current={step === item ? "step" : undefined}>
      <span className="ws-step-number" aria-hidden="true">{index + 1}</span>
      {href ? <Link href={href}>{label}</Link> : label}
    </li>;
  })}</ol></nav>;
}

function Attempted({ message }: { message: MailRow }) {
  return <section className="ws-card space-y-3"><h2>This message was already attempted</h2><p>Status: <strong>{message.status}</strong>{message.attempted_at ? ` at ${message.attempted_at} UTC` : ""}. Attempted messages are immutable and are never retried automatically.</p>{message.error && <p className="ws-muted break-words">{message.error}</p>}<div className="ws-actions"><Link href="/dashboard/mail/history" className={mailButtonClass}>Open history</Link><Link href="/dashboard/mail" className={mailButtonClass}>Back to drafts</Link></div></section>;
}

export default function MailDraftFlow({ id, prospectId, initialEmail, step }: { id?: number; prospectId?: number; initialEmail?: string; step: MailStep }) {
  const router = useRouter();
  const confirm = useConfirmation();
  const [data, setData] = useState<MailState | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<MailPreview | null>(null);
  const [previewError, setPreviewError] = useState("");
  const [previewReload, setPreviewReload] = useState(0);
  const [prospectOptions, setProspectOptions] = useState<ProspectOption[]>([]);
  const [lookupProspect, setLookupProspect] = useState<ProspectOption | null>(null);
  const [prospectError, setProspectError] = useState("");
  const [prospectLoading, setProspectLoading] = useState(false);
  const [prospectQuery, setProspectQuery] = useState("");
  const [prospectReload, setProspectReload] = useState(0);
  const [sent, setSent] = useState<MailRow | null>(null);
  const editorKey = `mail-flow:${id ?? `new-${prospectId ?? "blank"}-${initialEmail ?? ""}`}`;
  const initialProspectId = prospectId ? String(prospectId) : "";
  const initialIsTest = !prospectId && !initialEmail;
  const [editor, setEditor] = useRetainedState<MailEditor>(editorKey, id
    ? { id: undefined, prospectId: "", recipient: "", subject: "", body: "", isTest: false }
    : { prospectId: initialProspectId, recipient: "", subject: "", body: "", isTest: initialIsTest });

  const load = useCallback(async () => {
    const next = await mailRequest<MailState>("/api/outreach");
    setData(next);
    return next;
  }, []);

  // Initial remote state belongs to this effect; load resolves asynchronously.
  useEffect(() => {
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load().catch(e => { if (active) setError(e instanceof Error ? e.message : "Could not load this draft."); });
    return () => { active = false; };
  }, [load]);

  const message = data?.messages.find(row => row.id === id);
  useEffect(() => {
    if (!message) return;
    setEditor(current => current.id === message.id ? current : mailEditorFrom(message));
  }, [message, setEditor]);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      setProspectLoading(true);
      void mailRequest<{ rows: ProspectOption[] }>(`/api/prospects?q=${encodeURIComponent(prospectQuery)}&perPage=100`)
        .then(result => { if (active) { setProspectOptions(result.rows); setProspectError(""); } })
        .catch(() => { if (active) setProspectError("Could not load prospects. Retry below."); })
        .finally(() => { if (active) setProspectLoading(false); });
    }, 250);
    return () => { active = false; clearTimeout(timer); };
  }, [prospectQuery, prospectReload]);

  const lookupEmail = message && !message.is_test ? message.recipient : (!editor.isTest ? initialEmail ?? "" : "");
  useEffect(() => {
    if (!lookupEmail) return;
    let active = true;
    void mailRequest<{ rows: ProspectOption[] }>(`/api/prospects?q=${encodeURIComponent(lookupEmail)}&perPage=25`)
      .then(result => { if (active) setLookupProspect(result.rows.find(prospect => prospect.email?.toLowerCase() === lookupEmail.toLowerCase()) ?? null); })
      .catch(() => { if (active) setProspectError("Could not check recipient eligibility. Retry below."); });
    return () => { active = false; };
  }, [lookupEmail, prospectReload]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!id || step === "review") { setPreview(null); return; }
    let active = true;
    setPreview(null); setPreviewError("");
    void mailRequest<MailPreview>(`/api/outreach?action=preview&id=${id}`)
      .then(result => { if (active) setPreview(result); })
      .catch(e => { if (active) setPreviewError(e instanceof Error ? e.message : "Could not load the saved preview."); });
    return () => { active = false; };
  }, [id, step, previewReload, message?.approved_hash]);

  const selectedProspect = prospectOptions.find(prospect => String(prospect.id) === editor.prospectId)
    ?? (lookupProspect && String(lookupProspect.id) === editor.prospectId ? lookupProspect : null);
  const activeProspect = editor.isTest ? null : selectedProspect;
  const prospectGate = activeProspect as ProspectGate | null;
  const eligibilityEmail = activeProspect?.email ?? message?.recipient ?? "";
  const dirty = message
    ? editor.isTest !== Boolean(message.is_test) || editor.subject !== message.subject || editor.body !== message.body || (editor.isTest ? editor.recipient !== message.recipient : editor.prospectId !== String(message.prospect_id ?? ""))
    : editor.isTest !== initialIsTest || editor.prospectId !== initialProspectId || editor.recipient !== "" || editor.subject !== "" || editor.body !== "";
  const canContinue = Boolean(editor.subject.trim() && editor.body.trim() && (editor.isTest ? editor.recipient : editor.prospectId));
  const editorReady = !id || Boolean(message && editor.id === message.id);
  const missing = Boolean(data && id && !message);
  const approved = Boolean(message?.status === "approved" && message.approved_hash && preview?.hash === message.approved_hash);
  useUnsavedChanges(Boolean(editorReady) && dirty && step === "review" && !message?.attempted_at);

  const checks = useMemo(() => {
    if (!message) return [];
    const freshness = data?.settings.replyRoutingConfirmed && data.replySyncSupported && data.sync?.completed_at && !data.sync.error ? data.sync.completed_at : data?.settings.repliesReviewedAt;
    const today = new Date().toISOString().slice(0, 10);
    const domain = message.recipient.split("@")[1] ?? "";
    const domainAttempts = data?.messages.filter(row => row.attempted_at?.startsWith(today) && domain && row.recipient.endsWith(`@${domain}`)).length ?? 0;
    const base = data ? mailReadiness(message, { ...data.settings, repliesReviewedAt: freshness ?? null }, data.todayAttempts).map(check => ({ ...check, ready: check.label === "Exact saved preview approved" ? approved : check.ready, href: checkHref(check.label, id) })) : [];
    if (!data) return base;
    base.push({ label: "Provider credentials configured", ready: data.providerConfigured, href: "/dashboard/mail/settings" });
    if (message.is_test) {
      base.push({ label: "Test allowance available", ready: data.testAttempts < 5, href: undefined });
      base.push({ label: "Recipient is on the approved test list", ready: data.settings.testRecipients.includes(message.recipient), href: "/dashboard/mail/settings" });
    } else {
      base.push({ label: "Complete postal address on file", ready: data.settings.postalAddress.trim().length >= 15, href: "/dashboard/mail/settings" });
      base.push(...prospectSendChecks(prospectGate, message.recipient).map(check => ({ ...check, href: `/dashboard/prospects?q=${encodeURIComponent(message.recipient)}` })));
      base.push({ label: "Recipient-domain allowance available", ready: domainAttempts < data.settings.domainCap, href: undefined });
    }
    return base;
  }, [approved, data, id, message, prospectGate]);
  const sendReady = Boolean(preview && message && approved && !message.attempted_at && checks.every(check => check.ready));

  const edit = (value: Partial<MailEditor>) => { setEditor(current => ({ ...current, ...value })); setNotice(""); setError(""); };

  async function save(navigate: boolean) {
    if (!canContinue) { setError("Choose a recipient and add a subject and message."); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      const row = await mailRequest<MailRow>("/api/outreach", { action: "draft", ...editor, prospectId: editor.isTest ? undefined : Number(editor.prospectId), recipient: editor.isTest ? editor.recipient : undefined });
      setEditor(current => ({ ...current, id: row.id, prospectId: row.prospect_id ? String(row.prospect_id) : "", recipient: row.recipient, subject: row.subject, body: row.body, isTest: Boolean(row.is_test) }));
      await load();
      if (!id) {
        if (navigate) router.push(`/dashboard/mail/draft/${row.id}/approve`);
        else router.replace(`/dashboard/mail/draft/${row.id}`);
      } else if (navigate) router.push(`/dashboard/mail/draft/${id}/approve`);
      else setNotice("Draft saved. Nothing sent.");
    } catch (e) { setError(e instanceof Error ? e.message : "Could not save the draft."); }
    finally { setBusy(false); }
  }

  async function approve() {
    if (!id || !preview) return;
    if (!await confirm({ title: "Approve this exact message?", description: `To: ${preview.to}. Subject: ${preview.subject}. Approval does not send an email.`, action: "Approve message" })) return;
    setBusy(true); setError(""); setNotice("");
    try { await mailRequest("/api/outreach", { action: "approve", id, confirm: true, expectedHash: preview.hash }); await load(); router.push(`/dashboard/mail/draft/${id}/send`); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not approve the message."); }
    finally { setBusy(false); }
  }

  async function send() {
    if (!id || !preview || !sendReady) return;
    if (!await confirm({ title: "Send one email now?", description: `To: ${preview.to}. Subject: ${preview.subject}. This cannot be undone. All eligibility, suppression, spacing and allowance checks run again on the server.`, action: "Send one email", danger: true })) return;
    setBusy(true); setError(""); setNotice("");
    try { const row = await mailRequest<MailRow>("/api/outreach", { action: "send", id, confirm: true, expectedHash: preview.hash }); setSent(row); await load(); }
    catch (e) { setError(e instanceof Error ? e.message : "The provider did not confirm the send."); try { await load(); } catch { /* Keep the attempted state visible even if refresh fails. */ } }
    finally { setBusy(false); }
  }

  const heading = step === "review" ? (id ? "Review draft" : "Write a draft") : step === "approve" ? "Approve message" : "Send message";
  return <div className="ws-page ws-stack">
    <header className="ws-page-header"><div><h1>{heading}</h1><p>{descriptions[step]}</p></div><Link href="/dashboard/mail" className={mailButtonClass}>Back to drafts</Link></header>
    <MailTabs active="drafts" />
    <DraftSteps id={id} step={step} />
    <div role="alert">{error}</div>
    <p role="status" aria-live="polite">{notice}</p>
    {!data || !editorReady ? <div className="ws-skeleton" aria-label="Loading draft" aria-busy="true" /> : missing ? <section className="ws-empty"><h2>This draft could not be found</h2><p>It may have been removed, or it no longer belongs to this workspace.</p><div className="ws-actions"><Link href="/dashboard/mail" className={mailButtonClass}>Back to drafts</Link></div></section> : <>

      {step === "review" && (message?.attempted_at ? <Attempted message={message} /> : <>
        <form className="ws-card space-y-5" onSubmit={event => { event.preventDefault(); void (id && !dirty ? router.push(`/dashboard/mail/draft/${id}/approve`) : save(true)); }}>
          <div className="ws-section-heading"><h2>{id ? `Message #${id}` : "New message"}</h2>{dirty && <span className="ws-badge">Unsaved edits</span>}</div>
          <fieldset disabled={busy} className="space-y-5">
            <legend className="sr-only">Message content</legend>
            <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" className="size-5" checked={editor.isTest} onChange={event => edit({ isTest: event.target.checked, recipient: "" })} />Controlled test email</label>
            {editor.isTest ? <div className="space-y-2">
              <label className="ws-field">Test recipient<select required value={editor.recipient} onChange={event => edit({ recipient: event.target.value })}><option value="">Choose an approved inbox</option>{data.settings.testRecipients.map(email => <option key={email}>{email}</option>)}</select></label>
              {!data.settings.testRecipients.length && <p className="text-sm ws-muted">No approved test inboxes yet. <Link className="underline" href="/dashboard/mail/settings">Add one in Sender settings</Link>.</p>}
            </div> : <div className="space-y-3">
              <label className="ws-field">Find prospect<input type="search" value={prospectQuery} onChange={event => setProspectQuery(event.target.value)} placeholder="Company, person or email" /></label>
              {prospectError && <p role="alert">{prospectError} <button type="button" className="underline" onClick={() => setProspectReload(value => value + 1)}>Retry</button></p>}
              <label className="ws-field">Recipient<select required value={editor.prospectId} onChange={event => edit({ prospectId: event.target.value })}><option value="">Choose a prospect</option>{editor.prospectId && !activeProspect && <option value={editor.prospectId}>{message?.recipient ?? `Selected prospect #${editor.prospectId}`}</option>}{prospectOptions.filter(prospect => prospect.email).map(prospect => <option key={prospect.id} value={prospect.id}>{prospect.company || prospect.name} / {prospect.email}</option>)}</select></label>
              <p className="text-sm ws-muted">Selecting a prospect does not verify the address or a lawful basis. Eligibility is shown below and rechecked by the server at send time.</p>
            </div>}
            <label className="ws-field">Subject<input required maxLength={255} value={editor.subject} onChange={event => edit({ subject: event.target.value })} /></label>
            <label className="ws-field">Plain-text message<textarea required maxLength={20000} rows={9} value={editor.body} onChange={event => edit({ body: event.target.value })} /><span className="mt-2 block text-sm ws-muted">The server appends identity, postal address and an unsubscribe link. No AI rewriting, tracking or automatic follow-ups.</span></label>
          </fieldset>
          <div className="ws-actions"><button className={mailPrimaryClass} disabled={busy || !canContinue}>{busy ? "Saving…" : id ? (dirty ? "Save changes and continue" : "Continue to approval") : "Save draft and continue"}</button>{id && dirty && <button type="button" className={mailButtonClass} disabled={busy} onClick={() => void save(false)}>Save draft</button>}<Link href="/dashboard/mail" className={mailButtonClass}>Back to drafts</Link></div>
        </form>
        {!editor.isTest && editor.prospectId && <section className="ws-card space-y-4"><div className="ws-section-heading"><h2>Recipient eligibility</h2><Link className="text-sm underline" href={`/dashboard/prospects?q=${encodeURIComponent(eligibilityEmail)}`}>Open prospect record</Link></div>{prospectLoading && <p className="ws-muted text-sm">Checking the prospect record…</p>}<ul className="ws-checks">{prospectSendChecks(prospectGate, message?.recipient ?? null).map(check => <li key={check.label} className={check.ready ? "ready" : "missing"}><span aria-hidden="true">{check.ready ? "✓" : "○"}</span>{check.label}</li>)}</ul><p className="text-xs ws-muted">This is advisory. The server checks the unchanged verified address, qualification, source, lawful basis and suppression again at send time.</p></section>}
      </>)}

      {step === "approve" && (message?.attempted_at ? <Attempted message={message} /> : previewError ? <section className="ws-empty"><h2>The saved preview could not load</h2><p role="alert">{previewError}</p><div className="ws-actions"><button className={mailButtonClass} onClick={() => setPreviewReload(value => value + 1)}>Retry preview</button><Link href="/dashboard/mail" className={mailButtonClass}>Back to drafts</Link></div></section> : !preview ? <div className="ws-skeleton" aria-label="Loading saved preview" aria-busy="true" /> : <>
        <section className="ws-card space-y-4">
          <div className="ws-section-heading"><h2>Exact saved message</h2><span className={`ws-badge ${approved ? "good" : ""}`}>{approved ? "Approved" : "Not approved"}</span></div>
          <dl className="ws-message-meta"><div><dt>From</dt><dd>{preview.from}</dd></div><div><dt>To</dt><dd>{preview.to}</dd></div><div><dt>Reply-to</dt><dd>{preview.replyTo}</dd></div><div><dt>Subject</dt><dd>{preview.subject}</dd></div></dl>
          <pre className="ws-email-preview">{preview.text}</pre>
          <p className="text-sm ws-muted">Approval locks this saved copy and the current sender settings. It does not send an email.</p>
        </section>
        <div className="ws-actions">{approved ? <Link href={`/dashboard/mail/draft/${id}/send`} className={mailPrimaryClass}>Continue to send</Link> : <button className={mailPrimaryClass} disabled={busy} onClick={() => void approve()}>{busy ? "Approving…" : "Approve this message"}</button>}<Link href={`/dashboard/mail/draft/${id}`} className={mailButtonClass}>Back to review</Link><Link href="/dashboard/mail" className={mailButtonClass}>Back to drafts</Link></div>
      </>)}

      {step === "send" && (sent ? <section className="ws-card space-y-3"><h2>Send request accepted</h2><p>Provider status: <strong>{sent.status}</strong>. This means the provider accepted the request. It does not prove inbox delivery, reading, or a reply.</p><p>Message #{sent.id} is now recorded and cannot be resent. Do not retry an uncertain or failed attempt.</p><div className="ws-actions"><Link href="/dashboard/mail/history" className={mailPrimaryClass}>Open history</Link><Link href="/dashboard/mail" className={mailButtonClass}>Back to drafts</Link></div></section> : message?.attempted_at ? <Attempted message={message} /> : <>
        {message && !approved && <p className="ws-notice">This message is not approved yet. <Link className="underline" href={`/dashboard/mail/draft/${id}/approve`}>Approve the exact saved copy</Link> before sending.</p>}
        <section className="ws-card space-y-3"><h2>Final check</h2><dl className="ws-message-meta"><div><dt>To</dt><dd>{preview?.to ?? message?.recipient}</dd></div><div><dt>Subject</dt><dd>{preview?.subject ?? message?.subject}</dd></div></dl><Link className="text-sm underline" href={`/dashboard/mail/draft/${id}/approve`}>View approval</Link></section>
        <section className="ws-card space-y-4"><h2>Before sending</h2>{!preview && !previewError && <div className="ws-skeleton" aria-label="Loading final preview" aria-busy="true" />}{previewError && <p role="alert">{previewError} <button className="underline" onClick={() => setPreviewReload(value => value + 1)}>Retry</button></p>}<ul className="ws-checks">{checks.map(check => <li key={check.label} className={check.ready ? "ready" : "missing"}><span aria-hidden="true">{check.ready ? "✓" : "○"}</span><span>{check.label}{!check.ready && check.href && <> <Link className="underline" href={check.href}>Fix</Link></>}</span></li>)}</ul><p className="text-xs ws-muted">This checklist is advisory. The server rechecks qualification, suppression, provider routing, recent-send spacing and preview hashes immediately before sending and may still block it.</p></section>
        <div className="ws-actions"><button className={mailPrimaryClass} disabled={busy || !sendReady} onClick={() => void send()}>{busy ? "Sending…" : "Send one email"}</button><Link href={`/dashboard/mail/draft/${id}`} className={mailButtonClass}>Back to review</Link><Link href="/dashboard/mail" className={mailButtonClass}>Back to drafts</Link></div>
        <p className="text-xs ws-muted">One email only. No bulk send, tracking, AI rewriting or automatic follow-up. Failed and uncertain attempts are never retried automatically.</p>
      </>)}
    </>}
  </div>;
}

function checkHref(label: string, id?: number) {
  if (/domain|daily allowance/i.test(label)) return undefined;
  if (/test list|test allowance|inbox|dispatch|sender|provider|legal|postal/i.test(label)) return "/dashboard/mail/settings";
  if (/approved|preview/i.test(label)) return id ? `/dashboard/mail/draft/${id}/approve` : undefined;
  if (/attempted/i.test(label)) return "/dashboard/mail/history";
  if (/prospect|recipient|email|lawful|source|stage|suppressed/i.test(label)) return "/dashboard/prospects";
  return undefined;
}
