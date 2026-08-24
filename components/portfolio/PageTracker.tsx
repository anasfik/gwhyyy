"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function track(payload: Record<string, unknown>) {
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}

export default function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    track({ path: pathname, referrer: document.referrer });

    // One delegated listener captures all CTA/outbound clicks.
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest?.("a, button") as HTMLElement | null;
      if (!el) return;

      const explicit = el.getAttribute("data-track");
      if (explicit) return void track({ path: pathname, event: explicit, referrer: "" });

      const anchor = el.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      if (href.startsWith("/#contact")) {
        track({ path: pathname, event: "cta_contact_click", referrer: "" });
      } else if (href.includes("calendly.com")) {
        track({ path: pathname, event: "cta_calendly_click", referrer: "" });
      } else if (/^https?:\/\//.test(href)) {
        track({ path: pathname, event: `outbound:${hostnameOf(href)}`, referrer: "" });
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname]);

  return null;
}

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/\./g, "-");
  } catch {
    return "unknown";
  }
}
