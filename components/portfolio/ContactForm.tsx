"use client";

import { useState } from "react";

const initialForm = { name: "", email: "", company: "", objective: "", situation: "", budget: "", timeline: "", website: "" };

type ContactCopy = {
  eyebrow: string;
  heading: string;
  body: string;
  emailLabel: string;
  callLabel: string;
  fitLabel: string;
  fitValue: string;
  successHeading: string;
  successBody: string;
  againLabel: string;
  submitLabel: string;
  sendingLabel: string;
  fieldName: string;
  fieldEmail: string;
  fieldCompany: string;
  fieldObjective: string;
  fieldSituation: string;
  fieldBudget: string;
  fieldTimeline: string;
  budgetEmpty: string;
};

export default function ContactForm({ budgetOptions, email, calendly, copy }: { budgetOptions: string[]; email: string; calendly: string; copy: ContactCopy }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState(initialForm);
  const [mountedAt] = useState(() => Date.now());

  const change = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
          name: form.name,
          email: form.email,
          subject: form.company || "Project inquiry",
          budget: form.budget,
          message: `What they want to build or automate:\n${form.objective}\n\nCurrent situation / problem:\n${form.situation}\n\nTimeline: ${form.timeline || "Not specified"}`,
          website: form.website,
          submittedAt: mountedAt,
        }),
      });
      if (!response.ok) throw new Error("Submission failed");
      setForm(initialForm);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="section border-b border-line" id="contact" aria-labelledby="contact-title">
      <div className="shell grid gap-14 lg:grid-cols-[.65fr_1fr]">
        <div>
          <p className="label mb-5 text-signal">{copy.eyebrow}</p>
          <h2 id="contact-title" className="text-balance text-4xl font-semibold tracking-[-.055em] md:text-6xl">{copy.heading}</h2>
          <p className="mt-6 max-w-md text-lg leading-8 text-muted">{copy.body}</p>
          <div className="mt-10 space-y-4 border-t border-line pt-6 text-sm">
            <p><span className="label mr-4 text-muted">{copy.emailLabel}</span><a href={`mailto:${email}`} className="hover:text-signal">{email}</a></p>
            <p><span className="label mr-4 text-muted">{copy.callLabel}</span><a href={calendly} target="_blank" rel="noopener noreferrer" className="hover:text-signal">Schedule 30 minutes ↗</a></p>
            <p><span className="label mr-4 text-muted">{copy.fitLabel}</span>{copy.fitValue}</p>
          </div>
        </div>

        {status === "sent" ? (
          <div className="flex min-h-[420px] flex-col justify-center border border-signal bg-signal/5 p-8" role="status" aria-live="polite">
            <span className="font-mono text-4xl text-signal">✓</span><h3 className="mt-8 text-3xl font-medium">{copy.successHeading}</h3><p className="mt-4 max-w-lg leading-7 text-muted">{copy.successBody}</p>
            <button type="button" onClick={() => setStatus("idle")} className="mt-8 self-start border-b border-signal pb-1 text-sm">{copy.againLabel}</button>
          </div>
        ) : (
          <form onSubmit={submit} className="grid gap-6 sm:grid-cols-2" aria-busy={status === "sending"}>
            <Field label={copy.fieldName} id="name"><input id="name" name="name" required autoComplete="name" maxLength={200} value={form.name} onChange={change} /></Field>
            <Field label={copy.fieldEmail} id="email"><input id="email" name="email" type="email" required autoComplete="email" maxLength={200} value={form.email} onChange={change} /></Field>
            <Field label={copy.fieldCompany} id="company" wide><input id="company" name="company" autoComplete="organization" maxLength={300} value={form.company} onChange={change} /></Field>
            <Field label={copy.fieldObjective} id="objective" wide><textarea id="objective" name="objective" required rows={4} maxLength={2500} value={form.objective} onChange={change} /></Field>
            <Field label={copy.fieldSituation} id="situation" wide><textarea id="situation" name="situation" required rows={4} maxLength={2500} value={form.situation} onChange={change} /></Field>
            <Field label={copy.fieldBudget} id="budget"><select id="budget" name="budget" value={form.budget} onChange={change}><option value="">{copy.budgetEmpty}</option>{budgetOptions.map((option) => <option key={option}>{option}</option>)}</select></Field>
            <Field label={copy.fieldTimeline} id="timeline"><input id="timeline" name="timeline" maxLength={100} placeholder="e.g. Q4 or flexible" value={form.timeline} onChange={change} /></Field>
            <div className="sr-only" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={change} /></div>
            <div className="sm:col-span-2">
              {status === "error" && <p className="mb-4 text-sm text-error" role="alert">Could not send brief. Try again or email {email}.</p>}
              <button type="submit" disabled={status === "sending"} className="w-full bg-signal px-7 py-5 text-sm font-semibold uppercase tracking-[.12em] text-ink transition-colors hover:bg-paper disabled:cursor-wait disabled:opacity-60">{status === "sending" ? copy.sendingLabel : copy.submitLabel}</button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({ label, id, wide, children }: { label: string; id: string; wide?: boolean; children: React.ReactElement }) {
  return <div className={wide ? "sm:col-span-2" : ""}><label htmlFor={id} className="label mb-2 block text-muted">{label}</label><div className="[&_input]:min-h-12 [&_input]:w-full [&_input]:border [&_input]:border-line [&_input]:bg-panel [&_input]:px-4 [&_input]:text-base [&_input]:outline-none [&_input]:transition-colors [&_input]:focus:border-signal [&_select]:min-h-12 [&_select]:w-full [&_select]:border [&_select]:border-line [&_select]:bg-panel [&_select]:px-4 [&_select]:text-base [&_select]:outline-none [&_select]:focus:border-signal [&_textarea]:w-full [&_textarea]:resize-y [&_textarea]:border [&_textarea]:border-line [&_textarea]:bg-panel [&_textarea]:p-4 [&_textarea]:text-base [&_textarea]:outline-none [&_textarea]:transition-colors [&_textarea]:focus:border-signal">{children}</div></div>;
}
