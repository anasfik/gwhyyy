import assert from "node:assert/strict";
import { test } from "node:test";
import { defaultSiteContent } from "../config/site";
import { refreshPublicCopy } from "../lib/public-copy";

test("refreshes old dashboard copy without resetting content or changing the stored object", () => {
  const stored = structuredClone(defaultSiteContent);
  stored.copy.hero.title = "I build software. From complex integrations to complete products.";
  stored.copy.hero.subline = "I help startups and businesses turn ideas, technical challenges, and unfinished products into reliable, production-ready software.";
  stored.copy.nav.primaryCta = "Discuss your project";
  stored.copy.hero.ctaPrimary = "Discuss your project";
  stored.copy.footer.linkContact = "Discuss your project";
  stored.copy.contactPage.heading = "Discuss your project";
  stored.copy.services.heading = "What I can build for you";
  stored.copy.work.heading = "Selected work";
  const before = structuredClone(stored);
  const result = refreshPublicCopy(stored);
  assert.equal(result.copy.hero.title, "AI-supercharged engineer who actually ships.");
  assert.equal(result.copy.hero.subline, "Quality work, built efficiently and shipped fast.");
  assert.equal(result.copy.nav.primaryCta, "Reach out");
  assert.equal(result.copy.hero.ctaPrimary, "Reach out");
  assert.equal(result.copy.footer.linkContact, "Reach out");
  assert.equal(result.copy.contactPage.heading, "Reach out");
  assert.equal(result.copy.services.heading, "Ready to work with you.");
  assert.equal(result.copy.work.heading, "What I made and work(ed) at");
  assert.deepEqual(result.projects, stored.projects);
  assert.equal(result.schemaVersion, 4);
  assert.deepEqual(stored, before);
});

test("keeps custom dashboard text and makes repeated reads idempotent", () => {
  const stored = structuredClone(defaultSiteContent);
  stored.copy.hero.title = "A headline written in the dashboard";
  stored.copy.hero.subline = "A custom introduction";
  stored.copy.work.heading = "My own heading";
  const result = refreshPublicCopy(stored);
  assert.equal(result.copy.hero.title, stored.copy.hero.title);
  assert.equal(result.copy.hero.subline, stored.copy.hero.subline);
  assert.equal(result.copy.work.heading, stored.copy.work.heading);
  assert.deepEqual(refreshPublicCopy(result), result);
});
