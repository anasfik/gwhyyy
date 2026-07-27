"use client";

import { useEffect, useState, useCallback } from "react";

type Contact = {
  id: number;
  name: string;
  email: string;
  subject: string;
  budget: string;
  message: string;
  status: "unread" | "read" | "archived";
  created_at: string;
};

type ApiResponse = {
  rows: Contact[];
  total: number;
  page: number;
  perPage: number;
};

export default function MessagesPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/messages?status=${filter}&page=${page}`);
    if (res.ok) setData(await res.json());
    setLoading(false);
  }, [filter, page]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const updateStatus = async (id: number, status: string) => {
    await fetch("/api/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchMessages();
    if (selected?.id === id) setSelected(null);
  };

  const exportCsv = () => {
    if (!data?.rows.length) return;
    const headers = ["ID", "Name", "Email", "Subject", "Budget", "Message", "Status", "Date"];
    const rows = data.rows.map((r) => [
      r.id, r.name, r.email, r.subject, r.budget,
      `"${r.message.replace(/"/g, '""')}"`, r.status, r.created_at,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `messages-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = data ? Math.ceil(data.total / data.perPage) : 1;

  return (
    <div className="flex flex-col flex-grow overflow-hidden">
      {/* Top bar */}
      <header className="h-20 w-full flex items-center justify-between px-[64px] bg-surface border-b border-outline-variant flex-shrink-0">
        <h1 className="font-[family-name:var(--font-ibm-plex-sans)] text-[24px] font-bold tracking-[-0.02em] text-primary">
          INBOX_01
        </h1>
      </header>

      <section className="flex-grow overflow-y-auto p-12">
        <div className="max-w-[1200px] mx-auto">
          {/* Section header */}
          <div className="flex justify-between items-end mb-8 border-b border-outline-variant pb-4">
            <div>
              <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[11px] text-secondary uppercase tracking-[0.15em]">
                Live Stream / Incoming Requests
              </span>
              <h2 className="font-[family-name:var(--font-ibm-plex-sans)] text-[32px] font-semibold mt-1">
                Pending Interaction
              </h2>
            </div>
            <div className="flex gap-4">
              {/* Filters */}
              <div className="flex gap-1">
                {["all", "unread", "read", "archived"].map((f) => (
                  <button
                    key={f}
                    onClick={() => { setFilter(f); setPage(1); }}
                    className={`px-3 py-2 font-[family-name:var(--font-ibm-plex-sans)] text-[11px] uppercase tracking-[0.05em] transition-colors ${
                      filter === f ? "bg-primary text-on-primary" : "border border-outline-variant hover:bg-surface-container-high"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <button
                onClick={exportCsv}
                className="px-4 py-2 border border-outline-variant font-[family-name:var(--font-ibm-plex-sans)] text-[11px] uppercase tracking-widest hover:bg-surface-container-high transition-colors"
              >
                Export .CSV
              </button>
            </div>
          </div>

          {/* Detail view */}
          {selected && (
            <div className="border border-primary mb-8 p-8 bg-surface">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="font-[family-name:var(--font-ibm-plex-sans)] text-[20px] font-semibold mb-1">{selected.name}</div>
                  <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[13px] text-secondary">{selected.email}</div>
                </div>
                <button onClick={() => setSelected(null)} className="text-secondary hover:text-primary">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6 border-t border-outline-variant pt-4">
                <div>
                  <span className="font-[family-name:var(--font-ibm-plex-sans)] text-[11px] uppercase tracking-[0.05em] text-secondary block mb-1">Subject</span>
                  <span className="font-[family-name:var(--font-inter)] text-[15px]">{selected.subject || "—"}</span>
                </div>
                <div>
                  <span className="font-[family-name:var(--font-ibm-plex-sans)] text-[11px] uppercase tracking-[0.05em] text-secondary block mb-1">Budget</span>
                  <span className="font-[family-name:var(--font-inter)] text-[15px]">{selected.budget || "—"}</span>
                </div>
                <div>
                  <span className="font-[family-name:var(--font-ibm-plex-sans)] text-[11px] uppercase tracking-[0.05em] text-secondary block mb-1">Received</span>
                  <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[12px]">{selected.created_at}</span>
                </div>
              </div>
              <div className="mb-6">
                <span className="font-[family-name:var(--font-ibm-plex-sans)] text-[11px] uppercase tracking-[0.05em] text-secondary block mb-2">Message</span>
                <p className="font-[family-name:var(--font-inter)] text-[16px] leading-[1.7] whitespace-pre-wrap">{selected.message}</p>
              </div>
              <div className="flex gap-3 border-t border-outline-variant pt-4">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  className="bg-primary text-on-primary font-[family-name:var(--font-ibm-plex-sans)] text-[11px] uppercase tracking-[0.1em] px-5 py-3 hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">reply</span> Reply
                </a>
                <button
                  onClick={() => updateStatus(selected.id, "archived")}
                  className="border border-outline-variant font-[family-name:var(--font-ibm-plex-sans)] text-[11px] uppercase tracking-[0.1em] px-5 py-3 hover:bg-surface-container-high transition-colors"
                >
                  Archive
                </button>
                <button
                  onClick={() => updateStatus(selected.id, selected.status === "read" ? "unread" : "read")}
                  className="border border-outline-variant font-[family-name:var(--font-ibm-plex-sans)] text-[11px] uppercase tracking-[0.1em] px-5 py-3 hover:bg-surface-container-high transition-colors"
                >
                  Mark {selected.status === "read" ? "Unread" : "Read"}
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          {loading ? (
            <div className="py-16 text-center font-[family-name:var(--font-ibm-plex-mono)] text-[12px] text-secondary uppercase">
              Loading...
            </div>
          ) : !data?.rows.length ? (
            <div className="py-16 text-center font-[family-name:var(--font-ibm-plex-mono)] text-[12px] text-secondary uppercase">
              No messages found.
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left border-b border-outline-variant bg-surface-container-low">
                  {["Status", "Sender", "Subject", "Budget", "Timestamp", "Action"].map((h, i) => (
                    <th key={h} className={`py-4 px-6 font-[family-name:var(--font-ibm-plex-mono)] text-[11px] uppercase text-secondary ${i === 5 ? "text-right" : ""}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {data.rows.map((row) => (
                  <tr
                    key={row.id}
                    className="group hover:bg-surface-container-high transition-colors cursor-pointer"
                    onClick={() => { setSelected(row); updateStatus(row.id, "read"); }}
                  >
                    <td className="py-5 px-6">
                      <span className="flex items-center gap-2 font-[family-name:var(--font-ibm-plex-mono)] text-[11px]">
                        <span className={`w-2 h-2 ${row.status === "unread" ? "bg-error" : "bg-outline-variant"}`} />
                        {row.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[14px] font-medium">{row.email}</div>
                      <div className="font-[family-name:var(--font-inter)] text-[12px] text-secondary">{row.name}</div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="font-[family-name:var(--font-inter)] text-[15px]">{row.subject || "—"}</div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[12px] text-secondary">{row.budget || "—"}</div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[11px] text-secondary">{row.created_at}</div>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <button className="px-4 py-2 border border-primary font-[family-name:var(--font-ibm-plex-sans)] text-[11px] uppercase tracking-widest group-hover:bg-primary group-hover:text-on-primary transition-all">
                        VIEW
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {data && data.total > 0 && (
            <div className="mt-12 flex justify-between items-center py-6 border-t border-outline-variant font-[family-name:var(--font-ibm-plex-mono)] text-[11px] text-secondary">
              <div>
                SHOWING {Math.min((page - 1) * data.perPage + 1, data.total)}–{Math.min(page * data.perPage, data.total)} OF {data.total} ENTRIES
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="hover:text-primary transition-colors flex items-center gap-1 disabled:opacity-30"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_left</span> PREV
                </button>
                <span className="text-primary font-bold">{String(page).padStart(2, "0")}</span>
                <span>/ {String(totalPages).padStart(2, "0")}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="hover:text-primary transition-colors flex items-center gap-1 disabled:opacity-30"
                >
                  NEXT <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
