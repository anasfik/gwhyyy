"use client";

import { useState } from "react";
import siteConfig from "@/config/site.json";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col flex-grow overflow-hidden">
      <header className="h-20 flex items-center justify-between px-[64px] bg-surface border-b border-outline-variant flex-shrink-0">
        <h1 className="font-[family-name:var(--font-ibm-plex-sans)] text-[24px] font-bold tracking-[-0.02em] text-primary">
          SETTINGS_04
        </h1>
        {saved && (
          <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[11px] uppercase tracking-[0.1em] text-green-600 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            Changes noted — update config/site.json
          </span>
        )}
      </header>

      <section className="flex-grow overflow-y-auto p-12">
        <div className="max-w-[800px] mx-auto">
          <div className="mb-8 border-b border-outline-variant pb-4">
            <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[11px] text-secondary uppercase tracking-[0.15em]">
              Configuration / Site Settings
            </span>
            <h2 className="font-[family-name:var(--font-ibm-plex-sans)] text-[32px] font-semibold mt-1">
              Site Configuration
            </h2>
            <p className="font-[family-name:var(--font-inter)] text-[15px] text-secondary mt-2">
              All settings are controlled via <code className="font-[family-name:var(--font-ibm-plex-mono)] text-[13px] bg-surface-container px-2 py-0.5">config/site.json</code>. The values below reflect the current configuration.
            </p>
          </div>

          {/* Current config display */}
          <div className="space-y-6">
            {/* Availability */}
            <div className="border border-outline-variant p-6 bg-surface">
              <div className="font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.05em] text-secondary mb-4">
                Availability
              </div>
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 ${siteConfig.availability.available ? "bg-green-500" : "bg-outline-variant"}`} />
                <span className="font-[family-name:var(--font-inter)] text-[16px]">
                  {siteConfig.availability.available ? "Available for Projects" : "Not Available"}
                </span>
              </div>
              <p className="mt-3 font-[family-name:var(--font-ibm-plex-mono)] text-[12px] text-secondary">
                To change: set <code>availability.available</code> in site.json
              </p>
            </div>

            {/* Contact */}
            <div className="border border-outline-variant p-6 bg-surface">
              <div className="font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.05em] text-secondary mb-4">
                Contact Details
              </div>
              <div className="grid grid-cols-2 gap-4 font-[family-name:var(--font-ibm-plex-mono)] text-[13px]">
                <div><span className="text-secondary">Email:</span> {siteConfig.personal.email}</div>
                <div><span className="text-secondary">Phone:</span> {siteConfig.personal.phone}</div>
                <div><span className="text-secondary">Location:</span> {siteConfig.personal.location}</div>
              </div>
            </div>

            {/* Links */}
            <div className="border border-outline-variant p-6 bg-surface">
              <div className="font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.05em] text-secondary mb-4">
                Social & Links
              </div>
              <div className="space-y-2 font-[family-name:var(--font-ibm-plex-mono)] text-[13px]">
                <div><span className="text-secondary">GitHub:</span> {siteConfig.links.github}</div>
                <div><span className="text-secondary">LinkedIn:</span> {siteConfig.links.linkedin}</div>
                <div><span className="text-secondary">Calendly:</span> {siteConfig.links.calendly}</div>
              </div>
            </div>

            {/* SEO */}
            <div className="border border-outline-variant p-6 bg-surface">
              <div className="font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.05em] text-secondary mb-4">
                SEO
              </div>
              <div className="space-y-2 font-[family-name:var(--font-ibm-plex-mono)] text-[13px]">
                <div><span className="text-secondary">Title:</span> {siteConfig.seo.title}</div>
                <div><span className="text-secondary">Description:</span> <span className="text-on-surface font-[family-name:var(--font-inter)] text-[14px]">{siteConfig.seo.description}</span></div>
                <div><span className="text-secondary">Keywords:</span> {siteConfig.seo.keywords.join(", ")}</div>
              </div>
            </div>

            {/* Config file path */}
            <div className="border border-primary p-6 bg-surface">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5" style={{ fontVariationSettings: "'wght' 300" }}>info</span>
                <div>
                  <div className="font-[family-name:var(--font-ibm-plex-sans)] text-[14px] font-medium mb-1">
                    How to update settings
                  </div>
                  <p className="font-[family-name:var(--font-inter)] text-[14px] text-secondary leading-[1.6]">
                    Edit <code className="font-[family-name:var(--font-ibm-plex-mono)] text-[13px] bg-surface-container px-2 py-0.5">config/site.json</code> in your project root. All changes take effect on next build/deploy. For availability status, changing <code className="font-[family-name:var(--font-ibm-plex-mono)] text-[13px] bg-surface-container px-2 py-0.5">&quot;available&quot;: true/false</code> and redeploying is all that&apos;s needed.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="bg-primary text-on-primary font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.15em] px-8 py-4 hover:opacity-90 transition-opacity"
            >
              Acknowledged
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
