"use client";

import { useEffect, useState } from "react";

type Stats = {
  totalViews: number;
  views7d: number;
  totalContacts: number;
  unreadContacts: number;
  dailyViews: { day: string; count: number }[];
  topPages: { path: string; count: number }[];
};

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); });
  }, []);

  const maxViews = stats?.dailyViews.length
    ? Math.max(...stats.dailyViews.map((d) => d.count), 1)
    : 1;

  return (
    <div className="flex flex-col flex-grow overflow-hidden">
      <header className="h-20 flex items-center px-[64px] bg-surface border-b border-outline-variant flex-shrink-0">
        <h1 className="font-[family-name:var(--font-ibm-plex-sans)] text-[24px] font-bold tracking-[-0.02em] text-primary">
          ANALYTICS_02
        </h1>
      </header>

      <section className="flex-grow overflow-y-auto p-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-8 border-b border-outline-variant pb-4">
            <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[11px] text-secondary uppercase tracking-[0.15em]">
              Site Performance / Usage Metrics
            </span>
            <h2 className="font-[family-name:var(--font-ibm-plex-sans)] text-[32px] font-semibold mt-1">
              Overview
            </h2>
          </div>

          {loading ? (
            <div className="py-16 text-center font-[family-name:var(--font-ibm-plex-mono)] text-[12px] text-secondary uppercase">Loading...</div>
          ) : (
            <>
              {/* Stats cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {[
                  { label: "Total Page Views", value: stats!.totalViews, sub: "All time" },
                  { label: "Views (7 days)", value: stats!.views7d, sub: "Last 7 days" },
                  { label: "Contact Forms", value: stats!.totalContacts, sub: "Total submissions" },
                  { label: "Unread Messages", value: stats!.unreadContacts, sub: "Awaiting review" },
                ].map((card) => (
                  <div key={card.label} className="border border-outline-variant p-6 bg-surface">
                    <div className="font-[family-name:var(--font-ibm-plex-sans)] text-[11px] uppercase tracking-[0.05em] text-secondary mb-3">
                      {card.label}
                    </div>
                    <div className="font-[family-name:var(--font-ibm-plex-sans)] text-[40px] font-semibold tracking-[-0.02em] leading-none mb-2">
                      {card.value}
                    </div>
                    <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[11px] text-secondary">
                      {card.sub}
                    </div>
                  </div>
                ))}
              </div>

              {/* Daily views chart */}
              <div className="border border-outline-variant p-8 bg-surface mb-8">
                <div className="font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.05em] text-secondary mb-6">
                  Daily Page Views — Last 14 Days
                </div>
                {stats!.dailyViews.length === 0 ? (
                  <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[12px] text-secondary uppercase">No data yet.</p>
                ) : (
                  <div className="flex items-end gap-2 h-32">
                    {stats!.dailyViews.map((d) => (
                      <div key={d.day} className="flex flex-col items-center gap-1 flex-1">
                        <div
                          className="w-full bg-primary transition-all"
                          style={{ height: `${(d.count / maxViews) * 100}%`, minHeight: "2px" }}
                          title={`${d.day}: ${d.count} views`}
                        />
                        <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[9px] text-secondary rotate-90 md:rotate-0 whitespace-nowrap overflow-hidden">
                          {d.day.slice(5)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top pages */}
              <div className="border border-outline-variant bg-surface">
                <div className="px-6 py-4 border-b border-outline-variant">
                  <span className="font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.05em] text-secondary">
                    Top Pages — Last 30 Days
                  </span>
                </div>
                {stats!.topPages.length === 0 ? (
                  <p className="p-6 font-[family-name:var(--font-ibm-plex-mono)] text-[12px] text-secondary uppercase">No data yet.</p>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-outline-variant bg-surface-container-low">
                        <th className="text-left py-3 px-6 font-[family-name:var(--font-ibm-plex-mono)] text-[11px] uppercase text-secondary">Path</th>
                        <th className="text-right py-3 px-6 font-[family-name:var(--font-ibm-plex-mono)] text-[11px] uppercase text-secondary">Views</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {stats!.topPages.map((p) => (
                        <tr key={p.path} className="hover:bg-surface-container-high transition-colors">
                          <td className="py-4 px-6 font-[family-name:var(--font-ibm-plex-mono)] text-[13px]">{p.path}</td>
                          <td className="py-4 px-6 text-right font-[family-name:var(--font-ibm-plex-sans)] text-[16px] font-medium">{p.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
