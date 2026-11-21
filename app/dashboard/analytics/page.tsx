"use client";

import { useCallback, useEffect, useState } from "react";
type Stats = { views7d: number; views30d: number; leads30d: number; contactRatePer100: number; inquiryStarts30d: number; qualifiedLeads30d: number; dailyViews: { day: string; count: number }[]; topPages: { path: string; count: number }[]; topEvents?: { name: string; count: number }[]; pipeline: { stage: string; count: number }[] };

export default function AnalyticsPage() {
  const [stats,setStats] = useState<Stats | null>(null);
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { const r = await fetch("/api/analytics", { cache: "no-store" }); if (!r.ok) throw new Error("Analytics could not load. Try again."); setStats(await r.json()); }
    catch(e) { setError(e instanceof Error ? e.message : "Could not load analytics."); }
    finally { setLoading(false); }
  }, []);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, [load]);
  const max = Math.max(1,...(stats?.dailyViews.map(day=>day.count) ?? []));
  return <div className="ws-page ws-stack"><header className="ws-page-header"><div><h1>Analytics</h1><p>Understand website activity and incoming work. Counts are pageviews, not unique visitors.</p></div><button className="ws-button" disabled={loading} onClick={load}>{loading ? "Refreshing…" : "Refresh"}</button></header>
    <div role="alert">{error}</div>{!stats && loading && <div className="ws-skeleton" aria-label="Loading analytics" aria-busy="true" />}
    {stats && <>
      <div className="ws-metrics">{[{ label:"Page views / 30 days",value:stats.views30d },{ label:"Inquiries / 30 days",value:stats.leads30d },{ label:"Inquiries per 100 views",value:stats.contactRatePer100 },{ label:"Qualified / 30 days",value:stats.qualifiedLeads30d }].map(metric=><div className="ws-metric" key={metric.label}><p>{metric.label}</p><strong>{metric.value.toLocaleString()}</strong></div>)}</div>
      <section className="ws-card"><div className="ws-section-heading"><h2>Daily page views</h2><span className="ws-muted">Last 14 days</span></div>
        <div className="ws-chart" aria-hidden="true">{stats.dailyViews.map(day=><div key={day.day}><div className="ws-chart-bar" style={{ height: `${Math.max(2,day.count/max*125)}px` }} title={`${day.day}: ${day.count}`} /><label>{day.day.slice(5)}</label></div>)}</div>
        <details className="mt-6"><summary>View daily numbers</summary><table className="w-full"><caption className="sr-only">Daily page views for the last 14 days</caption><thead><tr><th scope="col">Date</th><th scope="col">Views</th></tr></thead><tbody>{stats.dailyViews.map(day=><tr key={day.day}><th scope="row">{day.day}</th><td>{day.count}</td></tr>)}</tbody></table></details>
      </section>
      <div className="ws-columns"><section className="ws-card"><h2>Popular pages</h2><ul className="ws-list">{stats.topPages.map(page=><li key={page.path} className="ws-list-item"><span>{page.path}</span><strong>{page.count.toLocaleString()}</strong></li>)}</ul>{!stats.topPages.length && <p className="ws-muted mt-4">No page activity in the last 30 days.</p>}</section>
        <section className="ws-card"><h2>Conversion activity</h2><p className="ws-muted mt-2">Last 30 days. Archived inquiries are excluded from conversion counts.</p><dl className="ws-list"><div className="ws-list-item"><dt>Contact form starts</dt><dd>{stats.inquiryStarts30d}</dd></div><div className="ws-list-item"><dt>Received inquiries</dt><dd>{stats.leads30d}</dd></div><div className="ws-list-item"><dt>Page views / last 7 days</dt><dd>{stats.views7d}</dd></div></dl></section></div>
      <section className="ws-card"><h2>Tracked events</h2><ul className="ws-list">{stats.topEvents?.map(event=><li className="ws-list-item" key={event.name}><code className="break-all">{event.name}</code><strong>{event.count}</strong></li>)}</ul>{!stats.topEvents?.length && <p className="ws-muted mt-4">No tracked events in the last 30 days.</p>}</section>
    </>}
  </div>;
}
