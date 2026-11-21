import nodemailer from "outreach-smtp";

export type OutgoingMail = { attemptId: string; name: string; from: string; senderName: string; replyTo: string; to: string; subject: string; text: string; unsubscribeUrl: string };
export type IncomingReply = { id: string; campaignId: string | null; from: string; subject: string; body: string; status: string; receivedAt: string; isBounce: boolean };
export type DeliveryStatus = { status: "queued" | "accepted" | "failed"; bounced?: boolean; unsubscribed?: boolean };
export interface EmailProvider {
  name: "bulko" | "smtp";
  configured: boolean;
  balance(): Promise<{ emailCredits?: number; aiCredits?: number }>;
  send(mail: OutgoingMail): Promise<{ id: string; status: "queued" | "accepted" }>;
  status?(id: string): Promise<DeliveryStatus>;
  replies?(offset: number, limit: number): Promise<{ items: IncomingReply[]; total: number }>;
}

export class ProviderRejection extends Error {}

const record = (v: unknown): Record<string, unknown> => {
  if (!v || typeof v !== "object" || Array.isArray(v)) throw new Error("Invalid provider response");
  return v as Record<string, unknown>;
};
const integer = (v: unknown) => {
  if (!Number.isSafeInteger(v) || Number(v) < 0) throw new Error("Invalid provider count");
  return Number(v);
};
const identifier = (v: unknown) => {
  if ((typeof v !== "string" && typeof v !== "number") || !/^[a-zA-Z0-9<>@._-]{1,250}$/.test(String(v))) throw new Error("Invalid provider identifier");
  return String(v);
};
const escapeHtml = (text: string) => text.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function createEmailProvider(name: "bulko" | "smtp", env: Record<string, string | undefined> = process.env, request = fetch): EmailProvider {
  if (name === "smtp") {
    const port = Number(env.OUTREACH_SMTP_PORT ?? "587");
    if (![465, 587, 2525].includes(port)) throw new Error("SMTP port must be 465, 587 or 2525");
    const configured = Boolean(env.OUTREACH_SMTP_HOST && env.OUTREACH_SMTP_USER && env.OUTREACH_SMTP_PASSWORD);
    const transport = () => {
      if (!configured) throw new Error("SMTP credentials are not configured on the server");
      return nodemailer.createTransport({
        host: env.OUTREACH_SMTP_HOST, port, secure: port === 465, requireTLS: true,
        auth: { user: env.OUTREACH_SMTP_USER, pass: env.OUTREACH_SMTP_PASSWORD },
        connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000,
        disableFileAccess: true, disableUrlAccess: true, logger: false, debug: false,
      });
    };
    return {
      name, configured,
      async balance() { await transport().verify(); return {}; },
      async send(mail) {
        const result = await transport().sendMail({
          from: { name: mail.senderName, address: mail.from }, to: mail.to, replyTo: mail.replyTo,
          subject: mail.subject, text: mail.text,
          messageId: `<${mail.attemptId}@${mail.from.split("@")[1]}>`,
          headers: { "List-Unsubscribe": `<${mail.unsubscribeUrl}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
        });
        if (!result.accepted.some(address => String(address).toLowerCase() === mail.to)) throw new ProviderRejection("SMTP rejected recipient");
        return { id: result.messageId, status: "accepted" };
      },
    };
  }
  const key = env.BULKO_API_KEY ?? "";
  async function api(path: string, payload?: Record<string, unknown>) {
    if (!key) throw new Error("Bulko key is not configured on the server");
    const response = await request(`https://bulko.io/api/v1${path}`, {
      method: payload ? "POST" : "GET", redirect: "error",
      headers: { Authorization: `Bearer ${key}`, Accept: "application/json", ...(payload ? { "Content-Type": "application/json" } : {}) },
      body: payload ? JSON.stringify(payload) : undefined, signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      if (response.status >= 400 && response.status < 500 && ![408, 429].includes(response.status)) throw new ProviderRejection(`Bulko rejected request (${response.status})`);
      throw new Error(`Bulko request outcome unknown (${response.status})`);
    }
    const body = record(await response.json());
    if (body.success !== true) throw new Error("Provider did not confirm success");
    return body;
  }
  return {
    name, configured: Boolean(key),
    async balance() {
      const b = record((await api("/account/balance")).balance);
      return { emailCredits: integer(b.email_credits), aiCredits: integer(b.ai_credits) };
    },
    async send(mail) {
      const response = await api("/campaigns/launch", {
        name: mail.name, subject: mail.subject,
        body: `<div style="white-space:pre-wrap">${escapeHtml(mail.text)}</div><p><a href="${escapeHtml(mail.unsubscribeUrl)}">Unsubscribe</a></p>`,
        recipients: [mail.to], reply_to: mail.replyTo, sender_name: mail.senderName,
        enable_tracking: false, ai_rotation: false, language: "en",
      });
      if (integer(response.recipients) !== 1 || integer(response.suppressed) !== 0) throw new Error("Provider recipient count differs; inspect campaign before retrying");
      return { id: identifier(response.id), status: "queued" };
    },
    async status(id) {
      if (!/^\d+$/.test(id)) throw new Error("Invalid campaign id");
      const campaign = record((await api(`/campaigns/${id}/stats`)).campaign);
      const sent = integer(campaign.sent), failed = integer(campaign.failed);
      return {
        status: failed > 0 || campaign.status === "failed" ? "failed" : sent > 0 ? "accepted" : "queued",
        bounced: integer(campaign.bounces) > 0, unsubscribed: integer(campaign.unsubscribed) > 0,
      };
    },
    async replies(offset, limit) {
      const response = await api(`/replies?limit=${limit}&offset=${offset}`);
      if (!Array.isArray(response.items)) throw new Error("Invalid reply list");
      const total = integer(response.total);
      const items = response.items.map(value => {
        const r = record(value);
        if (typeof r.from !== "string" || typeof r.body !== "string" || typeof r.subject !== "string" || typeof r.status !== "string" || typeof r.received_at !== "string" || typeof r.is_bounce !== "boolean") throw new Error("Invalid reply data");
        return { id: identifier(r.id), campaignId: r.campaign_id == null ? null : identifier(r.campaign_id), from: r.from.trim().toLowerCase(), subject: r.subject.slice(0, 500), body: r.body.slice(0, 30000), status: r.status.slice(0, 100), receivedAt: r.received_at, isBounce: r.is_bounce };
      });
      return { items, total };
    },
  };
}
