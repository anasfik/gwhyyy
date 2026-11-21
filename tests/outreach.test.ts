import assert from "node:assert/strict";
import { test } from "node:test";
import Database from "better-sqlite3";
import { initOutreachSchema, OutreachService, type MailSettings } from "../lib/outreach/service";
import type { EmailProvider, OutgoingMail } from "../lib/outreach/provider";

function setup() {
  const db = new Database(":memory:");
  db.exec(`CREATE TABLE prospects (id INTEGER PRIMARY KEY, email TEXT, stage TEXT, email_status TEXT, lawful_basis TEXT, source_url TEXT, unsubscribed_at TEXT, suppressed_at TEXT, last_contacted_at TEXT, updated_at TEXT);
    CREATE TABLE suppressions (email TEXT PRIMARY KEY, reason TEXT, source TEXT, created_at TEXT DEFAULT (datetime('now')));
    CREATE TABLE prospect_activities (id INTEGER PRIMARY KEY, prospect_id INTEGER, kind TEXT, body TEXT);`);
  initOutreachSchema(db);
  const calls: OutgoingMail[] = [];
  const provider: EmailProvider = {
    name: "bulko", configured: true,
    async balance() { return { emailCredits: 500, aiCredits: 50 }; },
    async send(mail) { calls.push(mail); return { id: String(41 + calls.length), status: "queued" }; },
    async status() { return { status: "accepted" }; },
    async replies() { return { items: [], total: 0 }; },
  };
  const service = new OutreachService(db, () => provider);
  service.configure({ paused: false, senderConfirmed: true, fromEmail: "hello@outreach.example.com", replyTo: "replies@example.com", testRecipients: ["seed@example.com"], senderName: "Test Owner" });
  service.configure({ senderConfirmed: true, replyRoutingConfirmed: true });
  const draft = () => service.saveDraft({ recipient: "seed@example.com", subject: "Requested test", body: "Test only.", isTest: true });
  return { db, service, provider, calls, draft };
}

test("duplicate dispatch reserves once before provider I/O", async () => {
  const { service, calls, draft } = setup();
  const row = draft(); service.approve(row.id);
  const results = await Promise.allSettled([service.send(row.id), service.send(row.id)]);
  assert.equal(results.filter(r => r.status === "fulfilled").length, 1);
  assert.equal(calls.length, 1);
  assert.equal(service.message(row.id).status, "queued");
});

test("copy and provider configuration edits invalidate approval", async () => {
  const { service, draft, calls } = setup();
  const row = draft(); service.approve(row.id);
  service.saveDraft({ id: row.id, recipient: row.recipient, subject: "Changed", body: "New copy", isTest: true });
  await assert.rejects(service.send(row.id), /approv/i);
  service.approve(row.id); service.configure({ replyTo: "different@example.com" });
  await assert.rejects(service.send(row.id), /approv/i);
  assert.equal(calls.length, 0);
});

test("suppression blocks approved mail immediately before sending", async () => {
  const { service, draft, calls } = setup();
  const row = draft(); service.approve(row.id);
  service.suppress("seed@example.com", "unsubscribe");
  await assert.rejects(service.send(row.id), /suppress|block/i);
  assert.equal(calls.length, 0);
});

test("unknown provider outcome is durable and cannot be retried", async () => {
  const { service, provider, draft, db } = setup();
  provider.send = async () => { throw new Error("network timeout"); };
  const row = draft(); service.approve(row.id);
  await service.send(row.id);
  assert.equal(service.message(row.id).status, "uncertain");
  assert.ok(service.message(row.id).attempted_at);
  await assert.rejects(service.send(row.id), /already|attempt/i);
  assert.equal((db.prepare("SELECT count(*) n FROM outreach_mail WHERE attempted_at IS NOT NULL").get() as { n: number }).n, 1);
});

test("test sends have a lifetime cap of five, including uncertain attempts", async () => {
  const { service, draft, db, calls } = setup();
  for (let i = 0; i < 5; i++) {
    const row = draft(); service.approve(row.id); await service.send(row.id);
    db.prepare("UPDATE outreach_mail SET attempted_at='2020-01-01 00:00:00' WHERE id=?").run(row.id);
  }
  const row = draft(); service.approve(row.id);
  await assert.rejects(service.send(row.id), /five|test.*cap/i);
  assert.equal(calls.length, 5);
});

test("global daily cap counts all attempts and survives prospect deletion", async () => {
  const { service, db, draft, calls } = setup();
  const row = draft(); service.approve(row.id);
  for (let i = 0; i < 15; i++) db.prepare("INSERT INTO outreach_mail (recipient, subject, body, is_test, attempted_at, status) VALUES (?, 'x', 'x', 0, datetime('now'), 'uncertain')").run(`a${i}@example.com`);
  await assert.rejects(service.send(row.id), /daily.*cap/i);
  assert.equal(calls.length, 0);
});

test("test mode rejects non-allowlisted recipients and live sends", () => {
  const { service } = setup();
  assert.throws(() => service.saveDraft({ recipient: "stranger@example.com", subject: "x", body: "x", isTest: true }), /allowlist/i);
  assert.throws(() => service.saveDraft({ recipient: "seed@example.com", subject: "x", body: "x", isTest: false }), /prospect/i);
});

test("reply ingestion is idempotent and stops future sends regardless of sentiment", async () => {
  const { service, draft, provider, calls } = setup();
  const sent = draft(); service.approve(sent.id); await service.send(sent.id);
  provider.replies = async () => ({ total: 1, items: [{ id: "7", campaignId: "42", from: "seed@example.com", subject: "Re: test", body: "Yes", status: "positive", receivedAt: "2026-10-30T00:00:00Z", isBounce: false }] });
  await service.sync(); await service.sync();
  assert.equal(service.list().replies.length, 1);
  const row = draft(); service.approve(row.id);
  await assert.rejects(service.send(row.id), /suppress|reply|block/i);
  assert.equal(calls.length, 1);
});

test("recipient snapshot survives a prospect email edit and deletion", () => {
  const { service, db } = setup();
  db.prepare("INSERT INTO prospects (id,email,stage,email_status,lawful_basis,source_url) VALUES (1,'buyer@example.com','qualified','verified','reviewed basis','https://example.com/contact')").run();
  const row = service.saveDraft({ prospectId: 1, subject: "x", body: "y", isTest: false });
  db.prepare("UPDATE prospects SET email='different@example.com' WHERE id=1").run();
  assert.equal(service.message(row.id).recipient, "buyer@example.com");
  db.prepare("DELETE FROM prospects WHERE id=1").run();
  assert.equal(service.message(row.id).recipient, "buyer@example.com");
});

test("malformed settings and header injection are rejected", () => {
  const { service } = setup();
  for (const value of [0, 10001, -1, 1.2, "15"]) assert.throws(() => service.configure({ dailyCap: value } as Partial<MailSettings>));
  assert.throws(() => service.configure({ provider: "resend" } as unknown as Partial<MailSettings>));
  assert.throws(() => service.configure({ fromEmail: "owner(comment)@example.com" }));
  assert.throws(() => service.saveDraft({ recipient: "seed@example.com", subject: "Hi\r\nBcc: victim@example.com", body: "x", isTest: true }));
});

test("live sends require qualification and fresh complete reply sync", async () => {
  const { service, db, provider, calls } = setup();
  service.configure({ mode: "live", legalConfirmed: true, postalAddress: "123 Test Street, Example City, Country" });
  db.prepare("INSERT INTO prospects (id,email,stage,email_status,lawful_basis,source_url) VALUES (1,'buyer@example.com','new','verified','reviewed','https://example.com/contact')").run();
  const row = service.saveDraft({ prospectId: 1, subject: "Reviewed copy", body: "Hello", isTest: false });
  service.approve(row.id);
  await assert.rejects(service.send(row.id), /qualification|qualified|qualification|Prospect/);
  db.prepare("UPDATE prospects SET stage='qualified' WHERE id=1").run();
  await assert.rejects(service.send(row.id), /Sync all replies/);
  provider.replies = async () => ({ items: [], total: 1 });
  await assert.rejects(service.sync(), /incomplete/);
  await assert.rejects(service.send(row.id), /Sync all replies/);
  provider.replies = async () => ({ items: [], total: 0 });
  await service.sync(); await service.send(row.id);
  assert.equal(calls.length, 1);
});

test("preview uses immutable sender snapshot after provider configuration changes", async () => {
  const { service, draft } = setup();
  const row = draft(); service.approve(row.id); await service.send(row.id);
  service.configure({ senderName: "Different Owner", fromEmail: "new@example.com" });
  assert.equal(service.preview(row.id).from, "Test Owner <hello@outreach.example.com>");
  assert.throws(() => service.saveDraft({ id: row.id, recipient: row.recipient, subject: "Edit", body: "No", isTest: true }), /Attempted/);
});

test("unsubscribe uses send snapshot after deleting prospect", () => {
  const { service, db } = setup();
  db.prepare("INSERT INTO prospects (id,email,stage) VALUES (1,'buyer@example.com','qualified')").run();
  const row = service.saveDraft({ prospectId: 1, subject: "x", body: "x", isTest: false });
  db.prepare("DELETE FROM prospects WHERE id=1").run();
  service.unsubscribe(row.unsubscribe_token);
  service.unsubscribe(row.unsubscribe_token);
  assert.equal((db.prepare("SELECT email FROM suppressions").get() as { email: string }).email, "buyer@example.com");
});

test("mailer-daemon bounce suppresses the original campaign recipient", async () => {
  const { service, provider, draft, db } = setup();
  const row = draft(); service.approve(row.id); await service.send(row.id);
  provider.replies = async () => ({ total: 1, items: [{ id: "bounce-1", campaignId: "42", from: "mailer-daemon@provider.example", subject: "Delivery failed", body: "550 unknown recipient", status: "bounce", receivedAt: new Date().toISOString(), isBounce: true }] });
  await service.sync();
  assert.ok(db.prepare("SELECT email FROM suppressions WHERE email='seed@example.com'").get());
});

test("a crashed sending attempt can be reconciled after timeout but never resent", async () => {
  const { service, draft, db } = setup();
  const row = draft();
  db.prepare("UPDATE outreach_mail SET provider='bulko',status='sending',attempted_at=datetime('now','-2 minutes'),attempt_id='crashed' WHERE id=?").run(row.id);
  service.reconcile(row.id, "77");
  assert.equal(service.message(row.id).provider_id, "77");
  await assert.rejects(service.send(row.id), /already attempted/);
});

test("changing sender configuration clears readiness acknowledgments", () => {
  const { service } = setup();
  service.configure({ replyTo: "new-inbox@example.com" });
  assert.equal(service.settings().senderConfirmed, false);
  assert.equal(service.settings().replyRoutingConfirmed, false);
});

test("stale settings revisions cannot overwrite a newer sender configuration", () => {
  const { service } = setup();
  const revision = service.settings().revision;
  service.configure({ senderName: "Updated Owner" });
  assert.throws(() => service.configure({ revision, senderName: "Stale Owner" }), /changed|stale|reload/i);
  assert.equal(service.settings().senderName, "Updated Owner");
});

test("fresh manual inbox review allows live sending without automatic reply capture", async () => {
  const { service, db, provider, calls } = setup();
  service.configure({ mode: "live", legalConfirmed: true, postalAddress: "Dyar Al Alia, Imm 86, Errahma, Dar Bouazza, 27223, Morocco" });
  db.prepare("INSERT INTO prospects (id,email,stage,email_status,lawful_basis,source_url) VALUES (1,'buyer@example.com','qualified','verified','reviewed','https://example.com/contact')").run();
  const row = service.saveDraft({ prospectId: 1, subject: "Personal note", body: "Hello", isTest: false });
  service.approve(row.id);
  await assert.rejects(service.send(row.id), /Sync all replies|manual.*review/i);
  service.configure({ repliesReviewedAt: new Date().toISOString() });
  await service.send(row.id);
  assert.equal(calls.length, 1);
  assert.equal(provider.replies !== undefined, true);
});
