import assert from "node:assert/strict";
import { test } from "node:test";
import { createEmailProvider, type OutgoingMail } from "../lib/outreach/provider";

const mail: OutgoingMail = { attemptId: "abc", name: "Test", from: "hello@outreach.example.com", senderName: "Owner", replyTo: "replies@example.com", to: "seed@example.com", subject: "Delivery test", text: "<script>not HTML</script>", unsubscribeUrl: "https://example.com/unsubscribe?token=abc" };

test("Bulko payload sends exactly one recipient without tracking or AI and escapes HTML", async () => {
  let captured: RequestInit | undefined;
  const provider = createEmailProvider("bulko", { BULKO_API_KEY: "test-key" }, async (url, options) => {
    assert.equal(url, "https://bulko.io/api/v1/campaigns/launch"); captured = options;
    return new Response(JSON.stringify({ success: true, id: 42, recipients: 1, suppressed: 0 }), { status: 202 });
  });
  assert.deepEqual(await provider.send(mail), { id: "42", status: "queued" });
  const body = JSON.parse(captured!.body as string);
  assert.deepEqual(body.recipients, ["seed@example.com"]);
  assert.equal(body.enable_tracking, false); assert.equal(body.ai_rotation, false);
  assert.equal(body.reply_to, "replies@example.com");
  assert.match(body.body, /&lt;script&gt;/); assert.doesNotMatch(body.body, /<script>/);
  assert.equal(captured!.redirect, "error");
});

test("ambiguous acceptance and rejected authentication do not expose provider secrets", async () => {
  const provider = createEmailProvider("bulko", { BULKO_API_KEY: "hidden-secret" }, async () => new Response("hidden-secret", { status: 401 }));
  await assert.rejects(provider.send(mail), error => error instanceof Error && error.message === "Bulko rejected request (401)");
  const malformed = createEmailProvider("bulko", { BULKO_API_KEY: "test-key" }, async () => new Response(JSON.stringify({ success: true, id: 42, recipients: 0, suppressed: 1 }), { status: 202 }));
  await assert.rejects(malformed.send(mail), /count differs/);
});

test("reply API uses canonical non-trailing-slash path and rejects malformed content", async () => {
  const provider = createEmailProvider("bulko", { BULKO_API_KEY: "test-key" }, async url => {
    assert.equal(url, "https://bulko.io/api/v1/replies?limit=100&offset=0");
    return new Response(JSON.stringify({ success: true, total: 1, items: [{ id: 1, campaign_id: 42, from: "seed@example.com", subject: "Re", body: "Yes", status: "positive", received_at: "2026-10-30T00:00:00Z", is_bounce: false }] }));
  });
  assert.equal((await provider.replies!(0, 100)).items[0].campaignId, "42");
  const malformed = createEmailProvider("bulko", { BULKO_API_KEY: "test-key" }, async () => new Response(JSON.stringify({ success: true, total: 1, items: [{}] })));
  await assert.rejects(malformed.replies!(0, 100), /Invalid/);
});
