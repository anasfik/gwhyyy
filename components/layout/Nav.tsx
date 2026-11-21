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

export default function Nav({ copy, brand, availabilityLabel }: { copy: NavCopy; brand: { name: string; signature: string }; calendly?: string; availabilityLabel: string }) {
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
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur-md">
      <div className="shell flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-baseline gap-3" aria-label={`${brand.name} home`}>
          <span className="text-[1.35rem] font-semibold tracking-[-.06em]">{brand.name}</span>
          <span className="label hidden text-muted xl:inline">{brand.signature}</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <nav aria-label="Main navigation" className="flex items-center gap-6">
            {copy.links.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center text-sm transition-colors ${active ? "text-ink" : "text-muted hover:text-ink"}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center bg-ink px-5 text-sm font-medium text-paper transition-colors hover:bg-forest active:translate-y-px"
          >
            {copy.primaryCta}
          </Link>
        </div>

        <button
          type="button"
          className="relative -mr-2 h-11 w-11 md:hidden"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span className={`absolute left-2.5 top-[18px] h-px w-6 bg-ink transition-transform ${open ? "translate-y-[4px] rotate-45" : ""}`} />
          <span className={`absolute left-2.5 top-[26px] h-px w-6 bg-ink transition-transform ${open ? "-translate-y-[4px] -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <div id="mobile-navigation" className="fixed inset-x-0 top-16 min-h-[calc(100dvh-4rem)] border-t border-line bg-paper px-5 pb-8 md:hidden">
          <nav aria-label="Mobile navigation" className="divide-y divide-line">
            {copy.links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="flex min-h-16 items-center justify-between py-4 text-2xl tracking-[-.04em]">
                {link.label}
                <span className="label text-muted">0{copy.links.indexOf(link) + 1}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-8 grid gap-3">
            <Link href="/contact" onClick={() => setOpen(false)} className="bg-ink px-6 py-4 text-center text-sm font-medium text-paper">
              {copy.primaryCta}
            </Link>
            <Link href="/work" onClick={() => setOpen(false)} className="border border-line px-6 py-4 text-center text-sm">
              {copy.secondaryCta}
            </Link>
          </div>
          <p className="label mt-8 flex items-center gap-2 text-muted">
            <i className="h-1.5 w-1.5 rounded-full bg-forest" aria-hidden="true" />
            {availabilityLabel}
          </p>
        </div>
      )}
    </header>
  );
}
