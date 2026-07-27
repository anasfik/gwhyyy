"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/dashboard/messages", label: "Messages", icon: "mail" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "query_stats" },
  { href: "/dashboard/projects", label: "Projects", icon: "layers" },
  { href: "/dashboard/settings", label: "Settings", icon: "settings" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 z-50 flex flex-col py-8 border-r border-outline-variant bg-surface">
      {/* Brand */}
      <div className="px-6 mb-12">
        <div className="font-[family-name:var(--font-ibm-plex-sans)] text-[24px] font-bold tracking-[-0.03em] text-primary">
          GWHYYY
        </div>
        <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] uppercase tracking-[0.15em] text-secondary mt-1">
          Admin Dashboard
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-grow px-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.05em] transition-all active:scale-95 ${
                active
                  ? "bg-primary text-on-primary"
                  : "text-secondary hover:bg-surface-container-high"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 mt-auto">
        <Link
          href="/"
          target="_blank"
          className="w-full border border-outline-variant text-secondary font-[family-name:var(--font-ibm-plex-sans)] text-[11px] uppercase tracking-[0.1em] py-3 px-4 mb-4 hover:bg-surface-container-high transition-colors flex items-center gap-2 justify-center"
        >
          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          View Site
        </Link>

        <div className="pt-4 border-t border-outline-variant flex items-center justify-between px-2">
          <div className="overflow-hidden">
            <p className="font-[family-name:var(--font-ibm-plex-sans)] text-[12px] font-bold truncate uppercase">
              M. ANAS FIKHI
            </p>
            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] text-secondary">
              ADMINISTRATOR
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-secondary hover:text-primary transition-colors"
            title="Sign out"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
