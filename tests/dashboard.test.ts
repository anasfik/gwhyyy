import test from "node:test";
import assert from "node:assert/strict";
import { mailReadiness, workspaceNavigation } from "../lib/dashboard";

test("workspace navigation gives every mail and content task its own destination", () => {
  const routes = workspaceNavigation.flatMap(group => group.items.map(item => item.href));
  assert.equal(new Set(routes).size, routes.length);
  for (const route of ["/dashboard/messages", "/dashboard/prospects", "/dashboard/mail", "/dashboard/mail/history", "/dashboard/mail/replies", "/dashboard/mail/blocked", "/dashboard/mail/settings", "/dashboard/content/copy", "/dashboard/content/services"]) assert.ok(routes.includes(route));
});

const settings = { paused: false, senderConfirmed: true, legalConfirmed: true, mode: "live", dailyCap: 15, repliesReviewedAt: "2026-11-03T10:00:00Z" };
const mail = { status: "approved", approved_hash: "abc", attempted_at: null, is_test: 0 };
test("readiness is advisory but never labels attempted mail ready", () => {
  const result = mailReadiness({ ...mail, attempted_at: "2026-11-03 09:00:00" }, settings, 0, Date.parse("2026-11-03T10:01:00Z"));
  assert.ok(result.some(item => !item.ready && item.label.includes("attempted")));
});
test("readiness explains pause, exhausted cap, stale review and missing approval", () => {
  const result = mailReadiness({ ...mail, status: "draft", approved_hash: null }, { ...settings, paused: true }, 15, Date.parse("2026-11-03T10:11:00Z"));
  assert.ok(result.filter(item => !item.ready).length >= 4);
});
test("fresh review cannot be in the future and tests do not need an inbox attestation", () => {
  const result = mailReadiness(mail, settings, 0, Date.parse("2026-11-03T09:59:00Z"));
  assert.ok(result.some(item => item.label.includes("Inbox") && !item.ready));
  assert.ok(!mailReadiness({ ...mail, is_test: 1 }, settings, 0).some(item => item.label.includes("Inbox")));
});
