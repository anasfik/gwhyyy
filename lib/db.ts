import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { initOutreachSchema } from "./outreach/service";

const DB_PATH = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "portfolio.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;

  // Ensure data directory exists
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  _db = new Database(DB_PATH);
  _db.pragma("busy_timeout = 10000");
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");

  _db.transaction(() => initSchema(_db!)).immediate();
  return _db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      budget TEXT,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'unread',
      ip_hash TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS prospects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      external_id TEXT,
      name TEXT NOT NULL DEFAULT '',
      email TEXT,
      company TEXT NOT NULL DEFAULT '',
      role TEXT,
      website TEXT,
      source TEXT NOT NULL DEFAULT 'manual',
      source_url TEXT,
      stage TEXT NOT NULL DEFAULT 'new',
      notes TEXT NOT NULL DEFAULT '',
      last_contacted_at TEXT,
      follow_up_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS mcp_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL DEFAULT '',
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_used_at TEXT
    );

    CREATE TABLE IF NOT EXISTS suppressions (
      email TEXT PRIMARY KEY,
      reason TEXT NOT NULL DEFAULT 'unsubscribe',
      source TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS outreach_campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      daily_cap INTEGER NOT NULL DEFAULT 30,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS outreach_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      campaign_id INTEGER NOT NULL REFERENCES outreach_campaigns(id) ON DELETE CASCADE,
      prospect_id INTEGER NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
      subject TEXT NOT NULL DEFAULT '',
      body TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'draft',
      approved_at TEXT,
      sent_at TEXT,
      resend_id TEXT,
      error TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE (campaign_id, prospect_id)
    );

    CREATE TABLE IF NOT EXISTS prospect_activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prospect_id INTEGER NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
      kind TEXT NOT NULL DEFAULT 'note',
      body TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS page_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL,
      referrer TEXT,
      country TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      path TEXT,
      referrer TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS rate_limits (
      key TEXT PRIMARY KEY,
      hits INTEGER NOT NULL DEFAULT 0,
      window_start INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS site_content (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      document TEXT NOT NULL,
      version INTEGER NOT NULL DEFAULT 1,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS site_content_revisions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version INTEGER NOT NULL,
      document TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
    CREATE INDEX IF NOT EXISTS idx_contacts_created ON contacts(created_at);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_prospects_external ON prospects(external_id) WHERE external_id IS NOT NULL;
    CREATE UNIQUE INDEX IF NOT EXISTS idx_prospects_email ON prospects(email) WHERE email IS NOT NULL AND email <> '';
    CREATE INDEX IF NOT EXISTS idx_prospects_stage ON prospects(stage);
    CREATE INDEX IF NOT EXISTS idx_prospects_follow_up ON prospects(follow_up_at);
    CREATE INDEX IF NOT EXISTS idx_prospect_activities_prospect ON prospect_activities(prospect_id);
    CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);
    CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views(created_at);
    CREATE INDEX IF NOT EXISTS idx_events_name ON events(name);
    CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at);
  `);

  const columns = new Set((db.prepare("PRAGMA table_info(contacts)").all() as { name: string }[]).map((column) => column.name));
  if (!columns.has("lead_stage")) db.exec("ALTER TABLE contacts ADD COLUMN lead_stage TEXT NOT NULL DEFAULT 'new'");
  if (!columns.has("notes")) db.exec("ALTER TABLE contacts ADD COLUMN notes TEXT NOT NULL DEFAULT ''");
  if (!columns.has("follow_up_at")) db.exec("ALTER TABLE contacts ADD COLUMN follow_up_at TEXT");
  if (!columns.has("updated_at")) db.exec("ALTER TABLE contacts ADD COLUMN updated_at TEXT");
  if (!columns.has("service")) db.exec("ALTER TABLE contacts ADD COLUMN service TEXT");
  if (!columns.has("stage")) db.exec("ALTER TABLE contacts ADD COLUMN stage TEXT");
  if (!columns.has("company")) db.exec("ALTER TABLE contacts ADD COLUMN company TEXT");
  if (!columns.has("company_website")) db.exec("ALTER TABLE contacts ADD COLUMN company_website TEXT");
  if (!columns.has("timeframe")) db.exec("ALTER TABLE contacts ADD COLUMN timeframe TEXT");
  if (!columns.has("contact_method")) db.exec("ALTER TABLE contacts ADD COLUMN contact_method TEXT");
  if (!columns.has("source")) db.exec("ALTER TABLE contacts ADD COLUMN source TEXT");
  if (!columns.has("submission_id")) db.exec("ALTER TABLE contacts ADD COLUMN submission_id TEXT");
  if (!columns.has("email_status")) db.exec("ALTER TABLE contacts ADD COLUMN email_status TEXT");
  if (!columns.has("notified_at")) db.exec("ALTER TABLE contacts ADD COLUMN notified_at TEXT");

  const prospectColumns = new Set((db.prepare("PRAGMA table_info(prospects)").all() as { name: string }[]).map((column) => column.name));
  const prospectMigrations: [string, string][] = [
    ["email_status", "TEXT"],
    ["unsubscribe_token", "TEXT"],
    ["unsubscribed_at", "TEXT"],
    ["suppressed_at", "TEXT"],
    ["lawful_basis", "TEXT"],
    ["source_detail", "TEXT"],
    ["domain", "TEXT"],
  ];
  for (const [name, type] of prospectMigrations) {
    if (!prospectColumns.has(name)) db.exec(`ALTER TABLE prospects ADD COLUMN ${name} ${type}`);
  }
  db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_prospects_unsubscribe ON prospects(unsubscribe_token) WHERE unsubscribe_token IS NOT NULL");
  db.exec("CREATE INDEX IF NOT EXISTS idx_prospects_domain ON prospects(domain)");
  db.exec("CREATE INDEX IF NOT EXISTS idx_outreach_messages_campaign ON outreach_messages(campaign_id, status)");
  db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_contacts_submission ON contacts(submission_id) WHERE submission_id IS NOT NULL");
  initOutreachSchema(db);
}
