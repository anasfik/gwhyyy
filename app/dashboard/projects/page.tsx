"use client";

import { useState } from "react";
import siteConfig from "@/config/site.json";

export default function ProjectsPage() {
  const [projects] = useState(siteConfig.projects.sort((a, b) => a.order - b.order));

  return (
    <div className="flex flex-col flex-grow overflow-hidden">
      <header className="h-20 flex items-center justify-between px-[64px] bg-surface border-b border-outline-variant flex-shrink-0">
        <h1 className="font-[family-name:var(--font-ibm-plex-sans)] text-[24px] font-bold tracking-[-0.02em] text-primary">
          PROJECTS_03
        </h1>
        <a
          href="/"
          target="_blank"
          className="font-[family-name:var(--font-ibm-plex-sans)] text-[11px] uppercase tracking-[0.1em] text-secondary border border-outline-variant px-4 py-2 hover:bg-surface-container-high transition-colors"
        >
          View Live
        </a>
      </header>

      <section className="flex-grow overflow-y-auto p-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-8 border-b border-outline-variant pb-4">
            <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[11px] text-secondary uppercase tracking-[0.15em]">
              Content Management / Projects
            </span>
            <h2 className="font-[family-name:var(--font-ibm-plex-sans)] text-[32px] font-semibold mt-1">
              Project Index
            </h2>
            <p className="font-[family-name:var(--font-inter)] text-[15px] text-secondary mt-2">
              Edit project content by modifying <code className="font-[family-name:var(--font-ibm-plex-mono)] text-[13px] bg-surface-container px-2 py-0.5">config/site.json</code> in your project files.
            </p>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b border-outline-variant bg-surface-container-low">
                {["#", "Title", "Category", "Tags", "Status", "URL"].map((h) => (
                  <th key={h} className="py-4 px-6 font-[family-name:var(--font-ibm-plex-mono)] text-[11px] uppercase text-secondary">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-surface-container-high transition-colors">
                  <td className="py-5 px-6 font-[family-name:var(--font-ibm-plex-mono)] text-[13px] text-secondary">
                    {String(p.order).padStart(2, "0")}
                  </td>
                  <td className="py-5 px-6">
                    <div className="font-[family-name:var(--font-ibm-plex-sans)] text-[16px] font-medium">{p.title}</div>
                  </td>
                  <td className="py-5 px-6 font-[family-name:var(--font-inter)] text-[14px] text-secondary">{p.category}</td>
                  <td className="py-5 px-6">
                    <div className="flex flex-wrap gap-1">
                      {p.tags.map((t) => (
                        <span key={t} className="border border-outline-variant font-[family-name:var(--font-ibm-plex-mono)] text-[10px] uppercase px-2 py-0.5">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <span className={`flex items-center gap-1.5 font-[family-name:var(--font-ibm-plex-mono)] text-[11px] uppercase ${p.visible ? "text-on-surface" : "text-secondary"}`}>
                      <span className={`w-2 h-2 ${p.visible ? "bg-green-500" : "bg-outline-variant"}`} />
                      {p.visible ? "Visible" : "Hidden"}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-[family-name:var(--font-ibm-plex-mono)] text-[12px] text-secondary hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'wght' 300" }}>open_in_new</span>
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
