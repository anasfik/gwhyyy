"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: "◈", exact: true },
  { href: "/dashboard/content", label: "Site Content", icon: "✎" },
  { href: "/dashboard/projects", label: "Projects", icon: "▦" },
  { href: "/dashboard/messages", label: "Leads", icon: "✉" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "◊" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const active = (href: string, exact?: boolean) => (exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

  const nav = (
    <nav className="flex-grow px-2 space-y-1 overflow-y-auto">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setOpen(false)}
          aria-current={active(item.href, item.exact) ? "page" : undefined}
          className={`flex items-center gap-3 px-4 py-3 font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.05em] transition-all active:scale-95 ${
            active(item.href, item.exact) ? "bg-primary text-on-primary" : "text-secondary hover:bg-surface-container-high"
          }`}
        >
          <span className="w-5 font-mono text-[11px]" aria-hidden="true">{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      <div className="lg:hidden fixed inset-x-0 top-0 z-50 h-14 flex items-center justify-between px-4 border-b border-outline-variant bg-surface">
        <span className="font-bold tracking-tight">GWHYYY / ADMIN</span>
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label={open ? "Close dashboard navigation" : "Open dashboard navigation"} className="min-h-11 min-w-11 border border-outline-variant px-3 py-2 text-xs uppercase tracking-widest">
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 pt-14" onClick={() => setOpen(false)} aria-hidden="true">
          <div className="bg-surface border-b border-outline-variant pb-4 max-h-[80dvh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {nav}
            <div className="px-4 pt-4 grid gap-2">
              <Link href="/" target="_blank" rel="noopener noreferrer" className="border border-outline-variant px-4 py-3 text-center text-[11px] uppercase tracking-widest">View site ↗</Link>
              <button onClick={() => signOut({ callbackUrl: "/login" })} className="border border-outline-variant px-4 py-3 text-[11px] uppercase tracking-widest">Sign out</button>
            </div>
          </div>
        </div>
      )}

      <aside className="h-screen w-64 fixed left-0 top-0 z-50 hidden lg:flex flex-col py-8 border-r border-outline-variant bg-surface">
        <div className="px-6 mb-10">
          <div className="font-[family-name:var(--font-ibm-plex-sans)] text-[24px] font-bold tracking-[-0.03em] text-primary">GWHYYY</div>
          <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] uppercase tracking-[0.15em] text-secondary mt-1">Client Command Center</div>
        </div>
        {nav}
        <div className="px-4 mt-auto">
          <Link href="/" target="_blank" rel="noopener noreferrer" className="w-full border border-outline-variant text-secondary text-[11px] uppercase tracking-[0.1em] py-3 px-4 mb-4 hover:bg-surface-container-high transition-colors flex items-center gap-2 justify-center">
            <span aria-hidden="true">↗</span> View Site
          </Link>
          <div className="pt-4 border-t border-outline-variant flex items-center justify-between px-2">
            <div className="overflow-hidden">
              <p className="text-[12px] font-bold truncate uppercase">M. ANAS FIKHI</p>
              <p className="font-mono text-[10px] text-secondary">ADMINISTRATOR</p>
            </div>
            <button onClick={() => signOut({ callbackUrl: "/login" })} className="text-secondary hover:text-primary transition-colors" title="Sign out" aria-label="Sign out">
              <span className="font-mono text-[10px]">OUT</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
