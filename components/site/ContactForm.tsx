"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Option = { slug: string; label: string };

type ContactCopy = {
  eyebrow: string;
  heading: string;
  body: string;
  successHeading: string;
  successBody: string;
  againLabel: string;
  submitLabel: string;
  sendingLabel: string;
  errorMessage: string;
  fieldName: string;
  fieldEmail: string;
  fieldService: string;
  fieldStage: string;
  fieldDescription: string;
  fieldCompany: string;
  fieldWebsite: string;
  fieldTimeframe: string;
  fieldContactMethod: string;
  fieldExtra: string;
  optional: string;
  privacyNote: string;
};

type Props = {
  copy: ContactCopy;
  email: string;
  services: Option[];
  stages: Option[];
  contactMethods: string[];
  defaultService?: string;
  source?: string;
  sourceName?: string;
};

const emptyForm = {
  name: "",
  email: "",
  service: "",
  stage: "",
  description: "",
  company: "",
  companyWebsite: "",
  timeframe: "",
  contactMethod: "",
  extra: "",
  website: "",
};

function track(event: string) {
  if (typeof navigator !== "undefined" && navigator.doNotTrack === "1") return;
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: "/contact", event, referrer: "" }),
    keepalive: true,
  }).catch(() => {});
}

export default function ContactForm({ copy, email, services, stages, contactMethods, defaultService, source, sourceName }: Props) {
  const initialService = services.some((option) => option.slug === defaultService) ? defaultService ?? "" : "";
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({ ...emptyForm, service: initialService });
  const [mountedAt] = useState(() => Date.now());
  const [submissionId, setSubmissionId] = useState(() => crypto.randomUUID());
  const started = useRef(false);
  const successRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (status !== "sent" && status !== "error") return;
    const target = status === "sent" ? successRef.current : errorRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  }, [status]);

  const change = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!started.current) {
      started.current = true;
      track("inquiry_start");
    }
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    if (status === "error") setStatus("idle");
  };

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          submissionId,
          source: source ?? "",
          submittedAt: mountedAt,
        }),
      });
      if (!response.ok) throw new Error("Submission failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    setForm({ ...emptyForm });
    setSubmissionId(crypto.randomUUID());
    setStatus("idle");
  }

  if (status === "sent") {
    return (
      <div ref={successRef} className="border border-forest bg-raised p-7 md:p-10" role="status" aria-live="polite">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-signal text-xl text-ink" aria-hidden="true">
          ✓
        </span>
        <h2 className="mt-7 text-3xl font-semibold tracking-[-.05em]">{copy.successHeading}</h2>
        <p className="mt-4 max-w-lg leading-7 text-muted">{copy.successBody}</p>
        <div className="mt-8 flex flex-wrap items-center gap-5">
          <button type="button" onClick={reset} className="border-b border-ink pb-1 text-sm font-medium">
            {copy.againLabel}
          </button>
          <a href={`mailto:${email}`} className="text-sm text-muted underline underline-offset-4 hover:text-ink">
            {email}
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} aria-busy={status === "sending"} className="grid gap-7">
      {sourceName && (
        <p className="border-l-2 border-forest bg-panel px-4 py-3 text-sm text-muted">
          Referring from the <strong className="font-medium text-ink">{sourceName}</strong> case study.
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={copy.fieldName} id="name" required>
          <input id="name" name="name" required autoComplete="name" maxLength={200} value={form.name} onChange={change} className="field" />
        </Field>
        <Field label={copy.fieldEmail} id="email" required>
          <input id="email" name="email" type="email" required autoComplete="email" maxLength={200} value={form.email} onChange={change} className="field" />
        </Field>
      </div>

      <fieldset>
        <legend className="label mb-3 text-muted">
          {copy.fieldService} <span className="text-danger">*</span>
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {services.map((service) => (
            <label key={service.slug} className={`flex min-h-12 cursor-pointer items-center gap-3 border px-3.5 py-2 text-sm transition-colors ${form.service === service.slug ? "border-forest bg-forest text-paper" : "border-line bg-raised hover:border-forest"}`}>
              <input
                type="radio"
                name="service"
                value={service.slug}
                required
                checked={form.service === service.slug}
                onChange={change}
                className="h-4 w-4 accent-forest"
              />
              {service.label}
            </label>
          ))}
        </div>
      </fieldset>

      <Field label={copy.fieldStage} id="stage" required>
        <select id="stage" name="stage" required value={form.stage} onChange={change} className="field">
          <option value="">Choose one</option>
          {stages.map((stage) => (
            <option key={stage.slug} value={stage.slug}>{stage.label}</option>
          ))}
        </select>
      </Field>

      <Field label={copy.fieldDescription} id="description" required hint="What are you building, what is failing, or what should change?">
        <textarea id="description" name="description" required minLength={20} maxLength={5000} rows={6} value={form.description} onChange={change} className="field resize-y" aria-describedby="description-hint" />
      </Field>

      <details className="border border-line bg-raised">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm">
          <span>{copy.optional} context</span>
          <span className="label hidden text-muted sm:inline">{copy.fieldCompany} / {copy.fieldWebsite} / {copy.fieldTimeframe}</span>
        </summary>
        <div className="grid gap-5 border-t border-line p-4 sm:grid-cols-2">
          <Field label={copy.fieldCompany} id="company">
            <input id="company" name="company" autoComplete="organization" maxLength={300} value={form.company} onChange={change} className="field" />
          </Field>
          <Field label={copy.fieldWebsite} id="companyWebsite">
            <input id="companyWebsite" name="companyWebsite" type="url" inputMode="url" placeholder="https://" maxLength={500} value={form.companyWebsite} onChange={change} className="field" />
          </Field>
          <Field label={copy.fieldTimeframe} id="timeframe">
            <input id="timeframe" name="timeframe" placeholder="e.g. next month, Q1, flexible" maxLength={200} value={form.timeframe} onChange={change} className="field" />
          </Field>
          <Field label={copy.fieldContactMethod} id="contactMethod">
            <select id="contactMethod" name="contactMethod" value={form.contactMethod} onChange={change} className="field">
              <option value="">No preference</option>
              {contactMethods.map((method) => <option key={method} value={method}>{method}</option>)}
            </select>
          </Field>
          <div className="sm:col-span-2">
            <Field label={copy.fieldExtra} id="extra">
              <textarea id="extra" name="extra" rows={3} maxLength={3000} value={form.extra} onChange={change} className="field resize-y" />
            </Field>
          </div>
        </div>
      </details>

      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={change} />
      </div>

      {status === "error" && (
        <p ref={errorRef} className="border border-danger bg-raised px-4 py-3 text-sm text-danger" role="alert">
          {copy.errorMessage}
        </p>
      )}

      <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-xs leading-5 text-muted">
          {copy.privacyNote}{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-ink">Privacy notice</Link>.
        </p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex min-h-12 items-center justify-center bg-ink px-7 py-3 text-sm font-medium text-paper transition-colors hover:bg-forest disabled:cursor-wait disabled:opacity-60"
        >
          {status === "sending" ? copy.sendingLabel : copy.submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({ label, id, required, hint, children }: { label: string; id: string; required?: boolean; hint?: string; children: React.ReactElement }) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label} {required ? <span className="text-danger" aria-hidden="true">*</span> : <span className="text-xs font-normal text-muted">({hint ? "optional" : "optional"})</span>}
      </label>
      {hint && <p id={`${id}-hint`} className="text-xs leading-5 text-muted">{hint}</p>}
      {children}
    </div>
  );
}
