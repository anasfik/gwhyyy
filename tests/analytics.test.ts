import assert from "node:assert/strict";
import { test } from "node:test";
import Database from "better-sqlite3";
import { countLiveContacts, contactRatePer100 } from "../lib/analytics";

function setup() {
  const db = new Database(":memory:");
  db.exec(`CREATE TABLE contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_stage TEXT NOT NULL DEFAULT 'new',
    status TEXT NOT NULL DEFAULT 'unread',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`);
  const add = (stage: string, status: string, daysAgo: number) =>
    db.prepare("INSERT INTO contacts (lead_stage, status, created_at) VALUES (?, ?, datetime('now', ?))")
      .run(stage, status, `-${daysAgo} days`);
  return { db, add };
}

test("archived inquiries are not counted as leads", () => {
  const { db, add } = setup();
  add("new", "unread", 1);
  add("qualified", "read", 2);
  add("archived", "archived", 3);
  add("new", "archived", 4);
  add("archived", "unread", 5);

  assert.equal(countLiveContacts(db, 30), 2, "30-day window excludes both archive paths");
  assert.equal(countLiveContacts(db), 2, "all-time count excludes both archive paths");
});

test("30-day window excludes older leads but keeps them in the all-time count", () => {
  const { db, add } = setup();
  add("new", "unread", 1);
  add("won", "read", 45);

  assert.equal(countLiveContacts(db, 30), 1);
  assert.equal(countLiveContacts(db), 2);
});

test("contact rate is contacts per 100 pageviews and never divides by zero", () => {
  assert.equal(contactRatePer100(3, 400), 0.8);
  assert.equal(contactRatePer100(1, 3), 33.3);
  assert.equal(contactRatePer100(0, 400), 0);
  assert.equal(contactRatePer100(4, 0), 0);
});
