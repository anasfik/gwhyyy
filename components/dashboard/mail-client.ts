import type { MailRow, MailSettings } from "@/lib/outreach/service";

export type MailState = {
  settings: MailSettings;
  providerConfigured: boolean;
  replySyncSupported: boolean;
  todayAttempts: number;
  testAttempts: number;
  messages: MailRow[];
  replies: { id: number; sender: string; subject: string; body: string; status: string; received_at: string }[];
  suppressions: { email: string; reason: string; created_at: string }[];
  sync: { completed_at: string | null; error: string | null } | null;
};

export type MailPreview = { hash: string; from: string; to: string; replyTo: string; subject: string; text: string };
export type MailStep = "review" | "approve" | "send";
export type MailEditor = { id?: number; prospectId: string; recipient: string; subject: string; body: string; isTest: boolean };
export type ProspectOption = {
  id: number;
  name: string;
  company: string;
  email: string | null;
  stage: string;
  email_status: string | null;
  lawful_basis: string | null;
  source_url: string | null;
  suppressed_at: string | null;
  unsubscribed_at: string | null;
};

export const mailSteps: MailStep[] = ["review", "approve", "send"];
export const mailStepLabels: Record<MailStep, string> = { review: "Review", approve: "Approve", send: "Send" };
export const mailSections = [
  { key: "drafts", label: "Drafts", href: "/dashboard/mail" },
  { key: "history", label: "Sent & history", href: "/dashboard/mail/history" },
  { key: "replies", label: "Replies", href: "/dashboard/mail/replies" },
  { key: "blocked", label: "Blocked addresses", href: "/dashboard/mail/blocked" },
  { key: "settings", label: "Sender settings", href: "/dashboard/mail/settings" },
] as const;

export const mailInputClass = "mt-2 w-full min-w-0 border border-outline-variant bg-surface px-3 py-3 text-sm text-on-surface placeholder:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary";
export const mailButtonClass = "min-h-11 border border-outline-variant px-4 py-2 text-sm hover:bg-surface-container-high focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50";
export const mailPrimaryClass = `${mailButtonClass} bg-primary text-on-primary hover:bg-primary/90`;

export async function mailRequest<T>(path: string, body?: Record<string, unknown>): Promise<T> {
  const response = await fetch(path, { cache: "no-store", ...(body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {}) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? `Request failed (${response.status})`);
  return data as T;
}

export function mailEditorFrom(row: MailRow): MailEditor {
  return { id: row.id, prospectId: row.prospect_id ? String(row.prospect_id) : "", recipient: row.recipient, subject: row.subject, body: row.body, isTest: Boolean(row.is_test) };
}

export function mailDraftHref(id: number, step: MailStep) {
  return step === "review" ? `/dashboard/mail/draft/${id}` : `/dashboard/mail/draft/${id}/${step}`;
}
