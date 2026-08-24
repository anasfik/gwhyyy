"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import siteConfig from "@/config/site.json";

export default function StickyCTA() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const timer = setTimeout(() => setShow(true), 45000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  // Hide on dashboard/login/contact
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/login") ||
    pathname === "/hire"
  ) {
    return null;
  }

  if (dismissed || !show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-primary text-on-primary py-4 px-6 md:px-[64px] flex items-center justify-between gap-4 shadow-lg">
      <p className="font-[family-name:var(--font-ibm-plex-sans)] text-[12px] md:text-[14px] uppercase tracking-[0.05em] truncate">
        {siteConfig.availability.available
          ? "Currently accepting new projects — let's talk about yours"
          : "Check back soon for new availability"}
      </p>
      <div className="flex items-center gap-3 flex-shrink-0">
        <a
          href="#contact"
          data-track="cta_sticky_click"
          className="bg-on-primary text-primary font-[family-name:var(--font-ibm-plex-sans)] text-[11px] uppercase tracking-[0.15em] px-5 py-3 hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Start a Project
        </a>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="text-on-primary/60 hover:text-on-primary transition-colors p-1"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
    </div>
  );
}
