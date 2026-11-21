import crypto from "node:crypto";
import type Database from "better-sqlite3";
import { createEmailProvider, ProviderRejection, type EmailProvider } from "./provider";

export type MailSettings = {
  provider: "bulko" | "smtp"; mode: "test" | "live"; paused: boolean;
  senderName: string; fromEmail: string; replyTo: string; postalAddress: string;
  senderConfirmed: boolean; replyRoutingConfirmed: boolean; legalConfirmed: boolean; dailyCap: number; domainCap: number; minIntervalSeconds: number;
  testRecipients: string[]; repliesReviewedAt: string | null; revision: number;
};
export type MailRow = {
  id: number; prospect_id: number | null; recipient: string; subject: string; body: string; is_test: number;
  status: string; approved_hash: string | null; approved_at: string | null; provider: "bulko" | "smtp" | null;
  provider_id: string | null; attempt_id: string | null; attempted_at: string | null; error: string | null;
  sender_snapshot: string | null; unsubscribe_token: string; created_at: string; updated_at: string;
};
type Prospect = { id: number; email: string | null; stage: string; email_status: string | null; lawful_basis: string | null; source_url: string | null; unsubscribed_at: string | null; suppressed_at: string | null };
const defaults: MailSettings = {
  provider: "bulko", mode: "test", paused: true, senderName: "Mohamed Anas FIKHI",
  fromEmail: "hello@outreach.gwhyyy.com", replyTo: "work@gwhyyy.com", postalAddress: "",
  senderConfirmed: false, replyRoutingConfirmed: false, legalConfirmed: false, dailyCap: 15, domainCap: 3, minIntervalSeconds: 60,
  testRecipients: [], repliesReviewedAt: null, revision: 1,
};
const address = (value: unknown) => {
  if (typeof value !== "string" || value.length > 254 || !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9.-]+$/.test(value)) throw new Error("Invalid email address");
  const [local, domain] = value.split("@");
  if (local.length > 64 || local.startsWith(".") || local.endsWith(".") || local.includes("..") || !domain.includes(".") || domain.split(".").some(label => !/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/.test(label))) throw new Error("Invalid email address");
  return value.toLowerCase();
};
const text = (value: unknown, max: number, name: string) => {
  if (typeof value !== "string" || !value.trim() || value.length > max) throw new Error(`Invalid ${name}`);
  return value.trim();
};
const numericId = (id: unknown) => {
  if (!Number.isSafeInteger(id) || Number(id) < 1) throw new Error("Invalid message id");
  return Number(id);
};
export function initOutreachSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS outreach_settings (id INTEGER PRIMARY KEY CHECK(id=1), document TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS outreach_mail (
      id INTEGER PRIMARY KEY AUTOINCREMENT, prospect_id INTEGER,
      recipient TEXT NOT NULL, subject TEXT NOT NULL, body TEXT NOT NULL,
      is_test INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'draft',
      approved_hash TEXT, approved_at TEXT, provider TEXT, provider_id TEXT,
      attempt_id TEXT UNIQUE, attempted_at TEXT, error TEXT, sender_snapshot TEXT,
      unsubscribe_token TEXT NOT NULL UNIQUE DEFAULT (lower(hex(randomblob(24)))),
      created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_outreach_mail_attempt ON outreach_mail(attempted_at);
    CREATE INDEX IF NOT EXISTS idx_outreach_mail_recipient ON outreach_mail(recipient);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_outreach_mail_provider ON outreach_mail(provider,provider_id) WHERE provider_id IS NOT NULL;
    CREATE TABLE IF NOT EXISTS outreach_replies (
      id INTEGER PRIMARY KEY AUTOINCREMENT, provider TEXT NOT NULL, external_id TEXT NOT NULL,
      mail_id INTEGER NOT NULL, sender TEXT NOT NULL, subject TEXT NOT NULL, body TEXT NOT NULL,
      status TEXT NOT NULL, received_at TEXT NOT NULL, UNIQUE(provider, external_id)
    );
    CREATE TABLE IF NOT EXISTS outreach_sync (provider TEXT PRIMARY KEY, completed_at TEXT, error TEXT);
  `);
  db.prepare("INSERT OR IGNORE INTO outreach_settings (id,document) VALUES (1,?)").run(JSON.stringify(defaults));
}

export class OutreachService {
  constructor(private db: Database.Database, private providerFactory: (settings: MailSettings) => EmailProvider = s => createEmailProvider(s.provider)) {}

  settings(): MailSettings {
    return { ...defaults, ...JSON.parse((this.db.prepare("SELECT document FROM outreach_settings WHERE id=1").get() as { document: string }).document) };
  }

  configure(input: Partial<MailSettings>): MailSettings {
    if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Invalid settings");
    return this.db.transaction(() => {
    const current = this.settings(), next = { ...current };
    if (input.revision !== undefined && input.revision !== current.revision) throw new Error("Sender settings changed; reload before saving");
    for (const [key, value] of Object.entries(input)) {
      if (key === "revision") continue;
      if (!(key in defaults)) throw new Error(`Unknown setting: ${key}`);
      if (["paused", "senderConfirmed", "replyRoutingConfirmed", "legalConfirmed"].includes(key) && typeof value !== "boolean") throw new Error(`Invalid ${key}`);
      if (key === "provider" && !["bulko", "smtp"].includes(String(value))) throw new Error("Unsupported provider");
      if (key === "mode" && !["test", "live"].includes(String(value))) throw new Error("Invalid mode");
      if (["dailyCap", "domainCap"].includes(key) && (!Number.isInteger(value) || Number(value) < 1 || Number(value) > 10000)) throw new Error("Cap must be 1–10000");
      if (key === "minIntervalSeconds" && (!Number.isInteger(value) || Number(value) < 0 || Number(value) > 3600)) throw new Error("Send interval must be 0–3600 seconds");
      if (["senderName", "postalAddress"].includes(key) && (typeof value !== "string" || value.length > 500 || (key === "senderName" && (!value.trim() || /[\r\n]/.test(value))))) throw new Error(`Invalid ${key}`);
      if (["fromEmail", "replyTo"].includes(key)) address(value);
      if (key === "testRecipients" && (!Array.isArray(value) || value.length > 5)) throw new Error("At most five test recipients");
      if (key === "testRecipients") (value as unknown[]).forEach(address);
      if (key === "repliesReviewedAt" && value !== null && (typeof value !== "string" || !Number.isFinite(Date.parse(value)) || Math.abs(Date.now() - Date.parse(value)) > 60000)) throw new Error("Reply review must be recorded now");
      Object.assign(next, { [key]: value });
    }
    next.fromEmail = address(next.fromEmail); next.replyTo = address(next.replyTo);
    next.testRecipients = next.testRecipients.map(address);
    if (next.provider !== current.provider || next.fromEmail !== current.fromEmail || next.replyTo !== current.replyTo) {
      next.senderConfirmed = false; next.replyRoutingConfirmed = false;
    }
    if (next.provider !== current.provider) next.legalConfirmed = false;
    const relevant = (s: MailSettings) => JSON.stringify([s.provider, s.mode, s.senderName, s.fromEmail, s.replyTo, s.postalAddress, s.testRecipients, s.senderConfirmed, s.replyRoutingConfirmed, s.legalConfirmed]);
    if (relevant(next) !== relevant(current)) { next.revision++; next.repliesReviewedAt = null; }
    this.db.prepare("UPDATE outreach_settings SET document=? WHERE id=1").run(JSON.stringify(next));
    return next;
    }).immediate();
  }

  message(id: number): MailRow {
    const row = this.db.prepare("SELECT * FROM outreach_mail WHERE id=?").get(numericId(id)) as MailRow | undefined;
    if (!row) throw new Error("Message not found");
    return row;
  }

  saveDraft(input: { id?: number; prospectId?: number; recipient?: string; subject: string; body: string; isTest: boolean }): MailRow {
    if (typeof input.isTest !== "boolean") throw new Error("isTest is required");
    const subject = text(input.subject, 255, "subject"), body = text(input.body, 20000, "body");
    if (/[\r\n]/.test(subject)) throw new Error("Invalid subject header");
    let prospect: Prospect | undefined;
    if (input.prospectId !== undefined) prospect = this.db.prepare("SELECT * FROM prospects WHERE id=?").get(numericId(input.prospectId)) as Prospect | undefined;
    if (!input.isTest && !prospect) throw new Error("A prospect is required for live outreach");
    const recipient = address(input.isTest ? input.recipient : prospect?.email);
    if (input.isTest && !this.settings().testRecipients.includes(recipient)) throw new Error("Test recipient is not on the allowlist");
    if (input.id !== undefined) return this.db.transaction(() => {
      if (this.message(input.id!).attempted_at) throw new Error("Attempted messages cannot be edited or retried");
      this.db.prepare("UPDATE outreach_mail SET prospect_id=?, recipient=?, subject=?, body=?, is_test=?, status='draft', approved_at=NULL, approved_hash=NULL, updated_at=datetime('now') WHERE id=?")
        .run(input.isTest ? null : prospect!.id, recipient, subject, body, Number(input.isTest), input.id);
      return this.message(input.id!);
    }).immediate();
    const result = this.db.prepare("INSERT INTO outreach_mail (prospect_id,recipient,subject,body,is_test) VALUES (?,?,?,?,?)").run(input.isTest ? null : prospect!.id, recipient, subject, body, Number(input.isTest));
    return this.message(Number(result.lastInsertRowid));
  }

  private hash(row: MailRow, settings: MailSettings) {
    return crypto.createHash("sha256").update(JSON.stringify([row.recipient, row.subject, row.body, row.is_test, settings.revision, settings.provider, settings.fromEmail, settings.senderName, settings.replyTo, settings.postalAddress])).digest("hex");
  }

  approve(id: number, expectedHash?: string): MailRow {
    return this.db.transaction(() => {
      const row = this.message(id);
      if (row.attempted_at) throw new Error("Message already attempted");
      const hash = this.hash(row, this.settings());
      if (expectedHash !== undefined && expectedHash !== hash) throw new Error("Preview changed; review the current message");
      this.db.prepare("UPDATE outreach_mail SET status='approved', approved_at=datetime('now'), approved_hash=?, updated_at=datetime('now') WHERE id=?").run(hash, id);
      return this.message(id);
    }).immediate();
  }

  private blocked(email: string) {
    return this.db.prepare("SELECT email FROM suppressions WHERE lower(email)=?").get(email) || this.db.prepare("SELECT id FROM outreach_replies WHERE sender=? LIMIT 1").get(email);
  }

  suppress(email: string, reason: string) {
    email = address(email); reason = text(reason, 200, "suppression reason");
    this.db.transaction(() => {
      this.db.prepare("INSERT OR IGNORE INTO suppressions (email,reason,source) VALUES (?,?,'outreach-service')").run(email, reason);
      this.db.prepare("UPDATE prospects SET suppressed_at=COALESCE(suppressed_at,datetime('now')),updated_at=datetime('now') WHERE lower(email)=?").run(email);
    }).immediate();
  }

  unsubscribe(token: string) {
    if (!/^[a-f0-9]{48}$/.test(token)) throw new Error("Invalid unsubscribe link");
    const row = this.db.prepare("SELECT recipient FROM outreach_mail WHERE unsubscribe_token=?").get(token) as { recipient: string } | undefined;
    if (!row) throw new Error("Unsubscribe link not found");
    this.suppress(row.recipient, "unsubscribe");
  }

  preview(id: number) {
    const row = this.message(id), s = this.settings();
    const snapshot = row.sender_snapshot ? JSON.parse(row.sender_snapshot) as { from: string; name: string; replyTo: string; postalAddress: string } : null;
    if (snapshot) { s.fromEmail = snapshot.from; s.senderName = snapshot.name; s.replyTo = snapshot.replyTo; s.postalAddress = snapshot.postalAddress; }
    const url = `https://gwhyyy.com/api/outreach/unsubscribe?token=${row.unsubscribe_token}`;
    return { hash: this.hash(row, s), from: `${s.senderName} <${s.fromEmail}>`, to: row.recipient, replyTo: s.replyTo, subject: row.subject,
      text: `${row.body}\n\n${s.senderName}\n${s.postalAddress || (row.is_test ? "Controlled delivery test; not prospect outreach." : "[Postal address required]")}\n${s.replyTo}\n\nUnsubscribe: ${url}`, unsubscribeUrl: url };
  }

  async send(id: number, expectedHash?: string): Promise<MailRow> {
    const reserved = this.db.transaction(() => {
      const settings = this.settings(), row = this.message(id);
      const provider = this.providerFactory(settings);
      if (!provider.configured) throw new Error("Provider credentials are not configured");
      if (row.attempted_at) throw new Error("Message already attempted; never retry automatically");
      if (settings.paused) throw new Error("Sending is paused");
      if (row.status !== "approved" || !row.approved_hash || row.approved_hash !== this.hash(row, settings)) throw new Error("Message needs approval for current copy and sender settings");
      if (expectedHash !== undefined && expectedHash !== row.approved_hash) throw new Error("Approved message changed; review again");
      if (!settings.senderConfirmed) throw new Error("Confirm verified sender and provider default domain first");
      if (this.blocked(row.recipient)) throw new Error("Address is suppressed or has replied; further cold sends blocked");
      if (row.is_test) {
        if (!settings.testRecipients.includes(row.recipient)) throw new Error("Test recipient not allowlisted");
        const used = (this.db.prepare("SELECT count(*) n FROM outreach_mail WHERE is_test=1 AND attempted_at IS NOT NULL").get() as { n: number }).n;
        if (used >= 5) throw new Error("Five-message lifetime test cap reached");
      } else {
        if (settings.mode !== "live") throw new Error("Live prospect sends are disabled in test mode");
        if (!settings.legalConfirmed || settings.postalAddress.trim().length < 15) throw new Error("Legal review and complete postal address required");
        const prospect = this.db.prepare("SELECT * FROM prospects WHERE id=?").get(row.prospect_id) as Prospect | undefined;
        if (!prospect || prospect.email?.toLowerCase() !== row.recipient || !["qualified", "contacted"].includes(prospect.stage) || !["verified", "risky"].includes(prospect.email_status ?? "") || !prospect.lawful_basis?.trim() || !/^https?:\/\//.test(prospect.source_url ?? "") || prospect.unsubscribed_at || prospect.suppressed_at) throw new Error("Prospect must have unchanged verified or risky email, qualification, source and reviewed lawful basis");
        const manualReviewed = Boolean(settings.repliesReviewedAt && Date.now() - Date.parse(settings.repliesReviewedAt) <= 600000);
        if (!manualReviewed) {
          if (provider.replies && !settings.replyRoutingConfirmed) throw new Error("Automatic reply sync is not confirmed; record a manual inbox review before live sending");
          const synced = this.db.prepare("SELECT completed_at FROM outreach_sync WHERE provider=? AND error IS NULL").get(settings.provider) as { completed_at: string } | undefined;
          const reviewed = provider.replies ? synced?.completed_at : settings.repliesReviewedAt;
          if (!reviewed || Date.now() - Date.parse(reviewed) > 600000) throw new Error("Sync all replies or confirm manual inbox review within ten minutes before live sends");
        }
        const recent = this.db.prepare("SELECT id FROM outreach_mail WHERE attempted_at > datetime('now', ?) LIMIT 1").get(`-${settings.minIntervalSeconds} seconds`);
        if (recent) throw new Error(`Wait ${settings.minIntervalSeconds} seconds between live sends`);
      }
      const used = (this.db.prepare("SELECT count(*) n FROM outreach_mail WHERE attempted_at >= date('now')").get() as { n: number }).n;
      if (used >= settings.dailyCap) throw new Error("Global daily cap reached (UTC; all attempts and follow-ups)");
      const domain = row.recipient.split("@")[1];
      const domainUsed = (this.db.prepare("SELECT count(*) n FROM outreach_mail WHERE substr(recipient,instr(recipient,'@')+1)=? AND attempted_at >= date('now')").get(domain) as { n: number }).n;
      if (!row.is_test && domainUsed >= settings.domainCap) throw new Error("Recipient-domain daily cap reached");
      this.db.prepare("UPDATE outreach_mail SET status='sending',attempt_id=?,attempted_at=datetime('now'),provider=?,sender_snapshot=?,updated_at=datetime('now') WHERE id=?")
        .run(crypto.randomUUID(), settings.provider, JSON.stringify({ from: settings.fromEmail, name: settings.senderName, replyTo: settings.replyTo, postalAddress: settings.postalAddress, revision: settings.revision }), id);
      return { row: this.message(id), settings, provider };
    }).immediate();
    const { row, settings: s, provider } = reserved;
    const preview = this.preview(id);
    try {
      const result = await provider.send({ attemptId: row.attempt_id!, name: `GWHYYY ${row.is_test ? "test" : "reviewed"} ${row.id} ${row.attempt_id!.slice(0, 8)}`, from: s.fromEmail, senderName: s.senderName, replyTo: s.replyTo, to: row.recipient, subject: row.subject, text: preview.text, unsubscribeUrl: preview.unsubscribeUrl });
      if (!result.id || !["queued", "accepted"].includes(result.status)) throw new Error("Invalid provider acceptance");
      this.db.prepare("UPDATE outreach_mail SET status=?,provider_id=?,updated_at=datetime('now') WHERE id=?").run(result.status, result.id, id);
      if (row.prospect_id) this.db.prepare("INSERT INTO prospect_activities (prospect_id,kind,body) SELECT id,'email',? FROM prospects WHERE id=?").run(`Outreach ${row.id} queued through ${s.provider}; not proof of delivery.`, row.prospect_id);
    } catch (error) {
      const status = error instanceof ProviderRejection ? "rejected" : "uncertain";
      this.db.prepare("UPDATE outreach_mail SET status=?,error=?,updated_at=datetime('now') WHERE id=?").run(status, error instanceof ProviderRejection ? error.message : "Provider outcome unknown. Inspect provider dashboard; do not resend.", id);
    }
    return this.message(id);
  }

  reconcile(id: number, providerId: string) {
    return this.db.transaction(() => {
      const row = this.message(id);
      const stalled = row.status === "sending" && row.attempted_at && Date.now() - Date.parse(row.attempted_at.replace(" ", "T") + "Z") > 60000;
      if ((row.status !== "uncertain" && !stalled) || row.provider !== "bulko" || typeof providerId !== "string" || !/^\d{1,20}$/.test(providerId)) throw new Error("Only uncertain or stalled Bulko attempts can be linked to a confirmed campaign ID");
      if (this.db.prepare("SELECT id FROM outreach_mail WHERE provider='bulko' AND provider_id=? AND id<>?").get(providerId, id)) throw new Error("Campaign is already linked to another message");
      this.db.prepare("UPDATE outreach_mail SET provider_id=?,status='queued',error=NULL,updated_at=datetime('now') WHERE id=?").run(providerId, id);
      return this.message(id);
    }).immediate();
  }

  async sync() {
    const settings = this.settings(), provider = this.providerFactory(settings);
    if (!provider.replies) throw new Error("SMTP reply and bounce handling is manual. Review your inbox and add suppressions.");
    this.db.prepare("INSERT INTO outreach_sync (provider,error) VALUES (?,'Sync in progress') ON CONFLICT(provider) DO UPDATE SET error='Sync in progress'").run(settings.provider);
    try {
      let offset = 0, total = 0;
      do {
        const page = await provider.replies(offset, 100); total = page.total;
        if (offset < total && page.items.length === 0) throw new Error("Incomplete reply pagination");
        for (const reply of page.items) {
          const mail = this.db.prepare("SELECT * FROM outreach_mail WHERE provider=? AND provider_id=?").get(settings.provider, reply.campaignId) as MailRow | undefined;
          if (!mail) continue;
          this.db.transaction(() => {
            this.db.prepare("INSERT OR IGNORE INTO outreach_replies (provider,external_id,mail_id,sender,subject,body,status,received_at) VALUES (?,?,?,?,?,?,?,?)").run(settings.provider, reply.id, mail.id, mail.recipient, reply.subject, reply.body, reply.status, reply.receivedAt);
            this.suppress(mail.recipient, reply.isBounce ? "bounce" : "reply-stop");
          }).immediate();
        }
        offset += page.items.length;
        if (offset < total && offset >= 2000) throw new Error("Reply backlog exceeds safe sync window; inspect provider");
      } while (offset < total);
      if (provider.status) {
        const pending = this.db.prepare("SELECT * FROM outreach_mail WHERE provider=? AND provider_id IS NOT NULL AND status IN ('queued','accepted') ORDER BY updated_at LIMIT 50").all(settings.provider) as MailRow[];
        for (const row of pending) {
          const status = await provider.status(row.provider_id!);
          this.db.prepare("UPDATE outreach_mail SET status=?,updated_at=datetime('now') WHERE id=?").run(status.bounced ? "bounced" : status.unsubscribed ? "unsubscribed" : status.status, row.id);
          if (status.bounced || status.unsubscribed) this.suppress(row.recipient, status.bounced ? "bounce" : "unsubscribe");
          if (status.status === "accepted" && row.prospect_id) this.db.prepare("UPDATE prospects SET stage=CASE WHEN stage='qualified' THEN 'contacted' ELSE stage END,last_contacted_at=COALESCE(last_contacted_at,datetime('now')),updated_at=datetime('now') WHERE id=? AND email=?").run(row.prospect_id, row.recipient);
        }
      }
      this.db.prepare("UPDATE outreach_sync SET completed_at=?,error=NULL WHERE provider=?").run(new Date().toISOString(), settings.provider);
      return { ok: true, repliesChecked: offset };
    } catch {
      this.db.prepare("UPDATE outreach_sync SET error='Sync incomplete; live sends blocked until a full successful sync' WHERE provider=?").run(settings.provider);
      throw new Error("Reply/delivery sync incomplete. Inspect provider; live sends are blocked.");
    }
  }

  list() {
    const settings = this.settings(), provider = this.providerFactory(settings);
    return {
      settings, providerConfigured: provider.configured, replySyncSupported: Boolean(provider.replies),
      todayAttempts: (this.db.prepare("SELECT count(*) n FROM outreach_mail WHERE attempted_at>=date('now')").get() as { n: number }).n,
      testAttempts: (this.db.prepare("SELECT count(*) n FROM outreach_mail WHERE is_test=1 AND attempted_at IS NOT NULL").get() as { n: number }).n,
      messages: this.db.prepare("SELECT * FROM outreach_mail ORDER BY id DESC LIMIT 100").all() as MailRow[],
      replies: this.db.prepare("SELECT * FROM outreach_replies ORDER BY id DESC LIMIT 100").all(),
      suppressions: this.db.prepare("SELECT email,reason,created_at FROM suppressions ORDER BY created_at DESC LIMIT 100").all(),
      sync: this.db.prepare("SELECT * FROM outreach_sync WHERE provider=?").get(settings.provider) ?? null,
    };
  }

  async balance() { return this.providerFactory(this.settings()).balance(); }
}
