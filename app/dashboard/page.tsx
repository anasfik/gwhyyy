import Link from "next/link";
import { getDb } from "@/lib/db";
import { getProjects, getSiteContentRecord } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default function DashboardOverview() {
  const db = getDb();
  const { content, version, updatedAt } = getSiteContentRecord();
  const projects = getProjects(content);
  const totalViews = (db.prepare("SELECT COUNT(*) as c FROM page_views").get() as { c: number }).c;
  const views7d = (db.prepare("SELECT COUNT(*) as c FROM page_views WHERE created_at >= datetime('now', '-7 days')").get() as { c: number }).c;
  const totalLeads = (db.prepare("SELECT COUNT(*) as c FROM contacts").get() as { c: number }).c;
  const unread = (db.prepare("SELECT COUNT(*) as c FROM contacts WHERE status = 'unread'").get() as { c: number }).c;
  const pipeline = db.prepare("SELECT lead_stage as stage, COUNT(*) as count FROM contacts GROUP BY lead_stage ORDER BY count DESC").all() as { stage: string; count: number }[];
  const recent = db.prepare("SELECT id, name, email, budget, lead_stage, created_at FROM contacts ORDER BY created_at DESC LIMIT 5").all() as { id: number; name: string; email: string; budget: string; lead_stage: string; created_at: string }[];
  const topEvents = db.prepare("SELECT name, COUNT(*) as count FROM events WHERE created_at >= datetime('now', '-30 days') GROUP BY name ORDER BY count DESC LIMIT 6").all() as { name: string; count: number }[];

  const cards = [
    { label: "Views · 7 days", value: views7d, href: "/dashboard/analytics" },
    { label: "Total views", value: totalViews, href: "/dashboard/analytics" },
    { label: "Total leads", value: totalLeads, href: "/dashboard/messages" },
    { label: "Unread leads", value: unread, href: "/dashboard/messages?status=unread" },
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="flex flex-shrink-0 flex-wrap items-center justify-between gap-3 border-b border-outline-variant px-4 py-4 lg:px-12">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-secondary">Client acquisition / Command center</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">OVERVIEW</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/content" className="bg-primary px-4 py-2 text-[11px] uppercase tracking-widest text-on-primary">Edit site</Link>
          <Link href="/" target="_blank" rel="noopener noreferrer" className="border border-outline-variant px-4 py-2 text-[11px] uppercase tracking-widest">View live ↗</Link>
        </div>
      </header>
      <section className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="mx-auto grid max-w-[1200px] gap-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {cards.map((card) => (
              <Link key={card.label} href={card.href} className="border border-outline-variant bg-surface p-5 hover:bg-surface-container-high">
                <p className="text-[11px] uppercase tracking-widest text-secondary">{card.label}</p>
                <p className="mt-2 text-4xl font-semibold tracking-tight">{card.value}</p>
              </Link>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="border border-outline-variant bg-surface p-6 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[12px] uppercase tracking-widest text-secondary">Latest leads</h2>
                <Link href="/dashboard/messages" className="text-[11px] uppercase tracking-widest underline">Open inbox</Link>
              </div>
              {recent.length === 0 ? <p className="text-sm text-secondary">No leads yet. Share /hire and #contact to start pipeline.</p> : (
                <ul className="divide-y divide-outline-variant">
                  {recent.map((lead) => (
                    <li key={lead.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                      <span><strong>{lead.name}</strong> <span className="text-secondary">· {lead.email}</span></span>
                      <span className="font-mono text-xs text-secondary">{lead.lead_stage} · {lead.budget || "no budget"} · {lead.created_at.slice(0, 10)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="grid gap-6 content-start">
              <div className="border border-outline-variant bg-surface p-6">
                <h2 className="mb-4 text-[12px] uppercase tracking-widest text-secondary">Pipeline</h2>
                {pipeline.length === 0 ? <p className="text-sm text-secondary">No stages yet.</p> : (
                  <ul className="grid gap-2 text-sm">
                    {pipeline.map((row) => (
                      <li key={row.stage} className="flex items-center justify-between border-b border-outline-variant py-1.5"><span className="uppercase">{row.stage}</span><strong>{row.count}</strong></li>
                    ))}
                  </ul>
                )}
                <Link href="/dashboard/messages" className="mt-4 inline-block text-[11px] uppercase tracking-widest underline">Qualify leads</Link>
              </div>
              <div className="border border-outline-variant bg-surface p-6">
                <h2 className="mb-2 text-[12px] uppercase tracking-widest text-secondary">Live content</h2>
                <p className="text-sm">v{version} · {projects.length} projects · updated {updatedAt}</p>
                <p className="mt-1 text-sm text-secondary">{content.availability.available ? content.availability.label : "Currently unavailable"}</p>
                <Link href="/dashboard/content" className="mt-4 inline-block text-[11px] uppercase tracking-widest underline">Open editor</Link>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="border border-outline-variant bg-surface p-6">
              <h2 className="mb-4 text-[12px] uppercase tracking-widest text-secondary">Conversion events · 30 days</h2>
              {topEvents.length === 0 ? <p className="text-sm text-secondary">No events yet.</p> : (
                <ul className="grid gap-2 text-sm">
                  {topEvents.map((e) => <li key={e.name} className="flex items-center justify-between border-b border-outline-variant py-1.5"><span className="font-mono text-[13px]">{e.name}</span><strong>{e.count}</strong></li>)}
                </ul>
              )}
            </div>
            <div className="border border-outline-variant bg-surface p-6">
              <h2 className="mb-4 text-[12px] uppercase tracking-widest text-secondary">Bot & client discovery feeds</h2>
              <ul className="grid gap-2 text-sm">
                {[["/llms.txt", "AI crawler index"], ["/llms.md", "Full AI profile"], ["/profile.json", "Structured profile"], ["/sitemap.xml", "Search sitemap"]].map(([href, label]) => (
                  <li key={href} className="flex items-center justify-between border-b border-outline-variant py-1.5"><span>{label}</span><a href={href} target="_blank" rel="noopener noreferrer" className="text-[11px] uppercase tracking-widest underline">{href} ↗</a></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
