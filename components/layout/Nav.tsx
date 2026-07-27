"use client";

import { useState } from "react";
import siteConfig from "@/config/site.json";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 h-20 flex items-center justify-between px-6 md:px-[64px] bg-surface border-b border-outline-variant">
        {/* Brand — left */}
        <a
          href="/"
          className="font-[family-name:var(--font-ibm-plex-sans)] text-[24px] font-bold tracking-[-0.03em] text-primary flex-shrink-0"
        >
          GWHYYY
        </a>

        {/* Desktop: all items right-aligned in one row */}
        <div className="hidden md:flex items-center gap-8">
          {/* Nav links */}
          <nav className="flex items-center gap-8">
            {["work", "services", "contact"].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className="font-[family-name:var(--font-ibm-plex-sans)] text-[12px] font-medium uppercase tracking-[0.08em] text-secondary hover:text-primary transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Divider */}
          <div className="w-px h-5 bg-outline-variant" />

          {/* Availability badge */}
          {siteConfig.availability.available && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-scale-pulse flex-shrink-0" />
              <span className="font-[family-name:var(--font-ibm-plex-sans)] text-[11px] uppercase tracking-[0.08em] text-secondary whitespace-nowrap">
                {siteConfig.availability.label}
              </span>
            </div>
          )}

          {/* CTA */}
          <a
            href={siteConfig.links.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-on-primary font-[family-name:var(--font-ibm-plex-sans)] text-[11px] uppercase tracking-[0.12em] px-5 py-3 hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Schedule a Call
          </a>
        </div>

        {/* Mobile: hamburger only */}
        <button
          className="md:hidden text-primary p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-[24px]">
            {menuOpen ? "close" : "menu"}
          </span>
        </button>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-surface pt-20 flex flex-col px-6 md:hidden">
          <nav className="flex flex-col border-t border-outline-variant mt-4">
            {["work", "services", "contact"].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                onClick={() => setMenuOpen(false)}
                className="font-[family-name:var(--font-ibm-plex-sans)] text-[14px] uppercase tracking-[0.05em] text-on-surface py-5 border-b border-outline-variant hover:text-primary transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="mt-8 flex flex-col gap-5">
            {siteConfig.availability.available && (
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-scale-pulse flex-shrink-0" />
                <span className="font-[family-name:var(--font-ibm-plex-sans)] text-[11px] uppercase tracking-[0.08em] text-secondary">
                  {siteConfig.availability.label}
                </span>
              </div>
            )}
            <a
              href={siteConfig.links.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-on-primary font-[family-name:var(--font-ibm-plex-sans)] text-[11px] uppercase tracking-[0.12em] px-5 py-4 text-center hover:opacity-90 transition-opacity"
            >
              Schedule a Call
            </a>
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="border border-primary text-primary font-[family-name:var(--font-ibm-plex-sans)] text-[11px] uppercase tracking-[0.12em] px-5 py-4 text-center hover:bg-surface-container-high transition-colors"
            >
              Send a Brief
            </a>
          </div>
        </div>
      )}
    </>
  );
}
