import test from "node:test";
import assert from "node:assert/strict";
import { prospectSendChecks } from "../lib/mail-flow";

const qualified = {
  email: "person@example.com",
  stage: "qualified",
  email_status: "verified",
  lawful_basis: "Reviewed legitimate interest",
  source_url: "https://example.com/team",
  suppressed_at: null,
  unsubscribed_at: null,
};

test("a missing prospect is never send-ready", () => {
  assert.ok(prospectSendChecks(null, "person@example.com").some(check => !check.ready));
});

test("qualification, verification, source and lawful basis are all required", () => {
  assert.ok(prospectSendChecks({ ...qualified, stage: "new" }, "person@example.com").some(check => !check.ready));
  assert.ok(prospectSendChecks({ ...qualified, email_status: "unknown" }, "person@example.com").some(check => !check.ready));
  assert.ok(prospectSendChecks({ ...qualified, lawful_basis: null }, "person@example.com").some(check => !check.ready));
  assert.ok(prospectSendChecks({ ...qualified, source_url: null }, "person@example.com").some(check => !check.ready));
});

test("changing the saved recipient or suppression blocks the send", () => {
  assert.ok(prospectSendChecks(qualified, "other@example.com").some(check => !check.ready));
  assert.ok(prospectSendChecks({ ...qualified, suppressed_at: "2026-11-03" }, "person@example.com").some(check => !check.ready));
  assert.ok(prospectSendChecks(qualified, "person@example.com").every(check => check.ready));
});
