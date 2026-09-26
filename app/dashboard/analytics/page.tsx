"use client";

import { useEffect, useState } from "react";

type Stats = {
  totalViews: number;
  views7d: number;
  views30d: number;
  totalContacts: number;
  unreadContacts: number;
  leads30d: number;
  conversion30d: number;
  pipeline: { stage: string; count: number }[];
  dailyViews: { day: string; count: number }[];
  topPages: { path: string; count: number }[];
  topEvents?: { name: string; count: number }[];
};

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/analytics", { cache: "no-store" })
      .then(async (r) => { if (!r.ok) throw new Error(`Analytics failed (${r.status})`); return r.json(); })
      .then((d) => { setStats(d); setLoading(false); })
      .catch((e) => { setError(e instanceof Error ? e.message : "Load failed"); setLoading(false); });
  }, []);

  const maxViews = stats?.dailyViews.length ? Math.max(...stats.dailyViews.map((d) => d.count), 1) : 1;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="flex flex-shrink-0 items-center justify-between border-b border-outline-variant px-4 py-4 lg:px-12">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-secondary">Acquisition / Usage metrics</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">ANALYTICS</h1>
        </div>
      </header>

      <section className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="mx-auto max-w-[1200px]">
          {loading ? <p className="py-16 text-center font-mono text-xs uppercase text-secondary">Loading…</p> : error ? <p role="alert" className="border border-error px-4 py-3 text-sm text-error">{error}</p> : stats && (
            <>
              <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
                {[
                  { label: "Views · 7 days", value: stats.views7d, sub: "Short-term demand" },
                  { label: "Views · 30 days", value: stats.views30d, sub: "Discovery reach" },
                  { label: "Leads · 30 days", value: stats.leads30d, sub: `${stats.conversion30d}% visitor → lead` },
                  { label: "Total views", value: stats.totalViews, sub: "All time" },
                  { label: "Total leads", value: stats.totalContacts, sub: "Pipeline entries" },
                  { label: "Unread leads", value: stats.unreadContacts, sub: "Needs reply" },
                ].map((card) => (
                  <div key={card.label} className="border border-outline-variant bg-surface p-5">
                    <div className="mb-2 text-[11px] uppercase tracking-widest text-secondary">{card.label}</div>
                    <div className="text-4xl font-semibold leading-none">{card.value}</div>
                    <div className="mt-2 font-mono text-[11px] text-secondary">{card.sub}</div>
                  </div>
                ))}
              </div>

              <div className="mb-8 border border-outline-variant bg-surface p-5 lg:p-8">
                <div className="mb-6 text-[12px] uppercase tracking-widest text-secondary">Daily views · last 14 days (zeros included)</div>
                <div className="flex h-32 items-end gap-1 lg:gap-2">
                  {stats.dailyViews.map((d) => (
                    <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                      <div className="w-full bg-primary" style={{ height: `${(d.count / maxViews) * 100}%`, minHeight: d.count ? "4px" : "2px", opacity: d.count ? 1 : 0.25 }} title={`${d.day}: ${d.count}`} />
                      <span className="hidden font-mono text-[9px] text-secondary md:block">{d.day.slice(5)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="border border-outline-variant bg-surface">
                  <div className="border-b border-outline-variant px-6 py-4 text-[12px] uppercase tracking-widest text-secondary">Top events · 30 days</div>
                  {stats.topEvents?.length ? (
                    <table className="w-full"><tbody className="divide-y divide-outline-variant">
                      {stats.topEvents.map((e) => <tr key={e.name}><td className="px-6 py-3 font-mono text-[13px]">{e.name}</td><td className="px-6 py-3 text-right font-medium">{e.count}</td></tr>)}
                    </tbody></table>
                  ) : <p className="p-6 font-mono text-xs uppercase text-secondary">No events yet.</p>}
                </div>
                <div className="border border-outline-variant bg-surface">
                  <div className="border-b border-outline-variant px-6 py-4 text-[12px] uppercase tracking-widest text-secondary">Top pages · 30 days</div>
                  {stats.topPages.length ? (
                    <table className="w-full"><tbody className="divide-y divide-outline-variant">
                      {stats.topPages.map((p) => <tr key={p.path}><td className="px-6 py-3 font-mono text-[13px]">{p.path}</td><td className="px-6 py-3 text-right font-medium">{p.count}</td></tr>)}
                    </tbody></table>
                  ) : <p className="p-6 font-mono text-xs uppercase text-secondary">No page data yet.</p>}
                </div>
              </div>

              {stats.pipeline.length > 0 && (
                <div className="mt-6 border border-outline-variant bg-surface p-5 lg:p-8">
                  <div className="mb-4 text-[12px] uppercase tracking-widest text-secondary">Lead pipeline distribution</div>
                  <div className="flex flex-wrap gap-2">
                    {stats.pipeline.map((row) => <span key={row.stage} className="border border-outline-variant px-4 py-2 font-mono text-xs uppercase">{row.stage}: {row.count}</span>)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
