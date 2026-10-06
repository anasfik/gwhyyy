"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavCopy = {
  links: { label: string; href: string }[];
  availableLabel: string;
  primaryCta: string;
  secondaryCta: string;
};

export default function Nav({ copy, brand, calendly, availabilityLabel }: { copy: NavCopy; brand: { name: string; signature: string }; calendly: string; availabilityLabel: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/95 backdrop-blur-md">
      <div className="shell flex h-[72px] items-center justify-between">
        <Link href="/" className="flex items-baseline gap-3" aria-label={`${brand.name} home`}>
          <span className="text-xl font-semibold tracking-[-.05em]">{brand.name}</span>
          <span className="label hidden text-muted sm:inline">{brand.signature}</span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          <nav aria-label="Main navigation" className="flex items-center gap-6">
            {copy.links.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className="inline-flex min-h-[44px] items-center text-sm text-muted transition-colors duration-200 hover:text-paper"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <span className="h-5 w-px bg-line" />
          <span className="label flex items-center gap-2 text-muted">
            <i className="status-dot h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
            {copy.availableLabel}
          </span>
          <Link href="/#contact" className="bg-signal px-5 py-3 text-xs font-semibold uppercase tracking-[.1em] text-ink transition-colors hover:bg-paper active:translate-y-px">
            {copy.primaryCta}
          </Link>
        </div>

        <button
          type="button"
          className="relative h-11 w-11 lg:hidden"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span className={`absolute left-2.5 top-[17px] h-px w-6 bg-paper transition-transform ${open ? "translate-y-[4px] rotate-45" : ""}`} />
          <span className={`absolute left-2.5 top-[25px] h-px w-6 bg-paper transition-transform ${open ? "-translate-y-[4px] -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <div id="mobile-navigation" className="fixed inset-x-0 top-[72px] min-h-[calc(100dvh-72px)] border-t border-line bg-ink px-4 pb-8 lg:hidden">
          <nav aria-label="Mobile navigation" className="divide-y divide-line">
            {copy.links.map((link, index) => (
              <Link key={link.href + link.label} href={link.href} onClick={() => setOpen(false)} className="flex min-h-16 items-center justify-between py-4 text-2xl tracking-[-.03em]">
                {link.label}<span className="label text-muted">0{index + 1}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-8 grid gap-3">
            <Link href="/#contact" onClick={() => setOpen(false)} className="bg-signal px-6 py-4 text-center text-sm font-semibold uppercase tracking-[.1em] text-ink">{copy.primaryCta}</Link>
            <a href={calendly} target="_blank" rel="noopener noreferrer" className="border border-line px-6 py-4 text-center text-sm uppercase tracking-[.1em]">{copy.secondaryCta}</a>
          </div>
          <p className="label mt-8 flex items-center gap-2 text-muted"><i className="h-1.5 w-1.5 rounded-full bg-signal" />{availabilityLabel}</p>
        </div>
      )}
    </header>
  );
}
