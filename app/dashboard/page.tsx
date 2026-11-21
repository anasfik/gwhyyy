import Link from "next/link";
import { getDb } from "@/lib/db";
import { getSiteContentRecord } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default function DashboardOverview() {
  const db = getDb();
  const count = (sql: string) => (db.prepare(sql).get() as { n: number }).n;
  const unread = count("SELECT count(*) n FROM contacts WHERE status='unread'");
  const due = count("SELECT count(*) n FROM prospects WHERE follow_up_at<=date('now') AND stage NOT IN ('won','lost','archived')");
  const drafts = count("SELECT count(*) n FROM outreach_mail WHERE status IN ('draft','approved') AND attempted_at IS NULL");
  const attempts = count("SELECT count(*) n FROM outreach_mail WHERE attempted_at>=date('now')");
  const views = count("SELECT count(*) n FROM page_views WHERE created_at>=datetime('now','-7 days')");
  const recent = db.prepare("SELECT id,name,email,service,created_at,status FROM contacts WHERE status!='archived' ORDER BY created_at DESC LIMIT 5").all() as { id: number; name: string; email: string; service: string; created_at: string; status: string }[];
  const pending = db.prepare("SELECT id,recipient,subject,status FROM outreach_mail WHERE attempted_at IS NULL ORDER BY id DESC LIMIT 4").all() as { id: number; recipient: string; subject: string; status: string }[];
  const { content, version, updatedAt } = getSiteContentRecord();
  return <div className="ws-page ws-stack">
    <header className="ws-page-header"><div><h1>A clear place to start.</h1><p>Review incoming work, keep conversations moving, and look after your website.</p></div><Link className="ws-button" href="/dashboard/mail">Review drafts</Link></header>
    <div className="ws-metrics">{[
      { label: "Unread inquiries", value: unread, href: "/dashboard/messages?status=unread" },
      { label: "Follow-ups due", value: due, href: "/dashboard/prospects?due=1" },
      { label: "Unsent drafts", value: drafts, href: "/dashboard/mail" },
      { label: "Page views this week", value: views, href: "/dashboard/analytics" },
    ].map(item => <Link key={item.label} href={item.href} className="ws-metric"><p>{item.label}</p><strong>{item.value.toLocaleString()}</strong></Link>)}</div>
    <div className="ws-columns">
      <section className="ws-card"><div className="ws-section-heading"><h2>Recent inquiries</h2><Link href="/dashboard/messages">View inquiries</Link></div>
        {recent.length ? <ul className="ws-list">{recent.map(row => <li key={row.id}><Link href={`/dashboard/messages?q=${encodeURIComponent(row.email)}`} className="ws-list-item"><div><strong>{row.name}</strong><p>{row.service || "General inquiry"} / {row.created_at.slice(0,10)}</p></div><span className={`ws-badge ${row.status === "unread" ? "good" : ""}`}>{row.status}</span></Link></li>)}</ul> : <p className="ws-muted">No inquiries yet. Requests from your contact form will appear here.</p>}
      </section>
      <section className="ws-card"><div className="ws-section-heading"><h2>Next up</h2></div><div className="ws-list">
        <Link href="/dashboard/prospects?due=1" className="ws-list-item"><div><strong>Follow up with prospects</strong><p>{due ? `${due} records need your attention.` : "No follow-ups due today."}</p></div><span aria-hidden="true">→</span></Link>
        <Link href="/dashboard/mail" className="ws-list-item"><div><strong>Review before sending</strong><p>{drafts} unsent drafts. {attempts} attempts today, UTC.</p></div><span aria-hidden="true">→</span></Link>
        <Link href="/dashboard/content" className="ws-list-item"><div><strong>Check your availability</strong><p>{content.availability.available ? content.availability.label : "Not accepting projects"}</p></div><span aria-hidden="true">→</span></Link>
      </div></section>
    </div>
    <section className="ws-card"><div className="ws-section-heading"><h2>Drafts waiting for review</h2><Link href="/dashboard/mail">Open drafts</Link></div>{pending.length ? <ul className="ws-list">{pending.map(row => <li key={row.id}><Link className="ws-list-item" href={`/dashboard/mail/draft/${row.id}`}><div><strong>{row.subject}</strong><p>{row.recipient}</p></div><span className="ws-badge">{row.status}</span></Link></li>)}</ul> : <p className="ws-muted">No drafts waiting. Start a message from a prospect record when you have a reason to reach out.</p>}</section>
    <section className="ws-card ws-list-item"><div><h2>Your public website</h2><p>{content.projects.length} projects. Content version {version}. Updated {updatedAt.slice(0,10)}.</p></div><Link className="ws-button" href="/dashboard/projects">Manage projects</Link></section>
  </div>;
}
