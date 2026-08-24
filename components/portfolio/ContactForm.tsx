"use client";

import { useState } from "react";
import siteConfig from "@/config/site.json";

const BUDGET_OPTIONS = [
  "Under $5,000",
  "$5,000 – $15,000",
  "$15,000 – $50,000",
  "$50,000+",
  "Not sure yet",
];

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    budget: "",
    message: "",
    website: "", // honeypot
  });  const [mountedAt] = useState(() => Date.now());

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, submittedAt: mountedAt }),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", subject: "", budget: "", message: "", website: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="border-t border-outline-variant bg-surface" id="contact">
      <div className="max-w-[1200px] mx-auto px-6 md:px-[64px] py-[128px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left */}
          <div className="md:col-span-5 mb-16 md:mb-0">
            <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[12px] text-secondary uppercase tracking-[0.15em] mb-3 block">
              [ GET IN TOUCH ]
            </span>
            <h2 className="font-[family-name:var(--font-ibm-plex-sans)] text-[32px] md:text-[48px] font-semibold leading-[1.2] tracking-[-0.01em] mb-8">
              Start a Project
            </h2>
            <p className="font-[family-name:var(--font-inter)] text-[18px] leading-[1.6] text-secondary mb-12">
              Looking to integrate AI or build a flagship Flutter product? Send me a brief and I&apos;ll get back to you within 24 hours.
            </p>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
                <span className="font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.05em]">
                  {siteConfig.personal.location}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary text-[20px]">mail</span>
                <a
                  href={`mailto:${siteConfig.personal.email}`}
                  className="font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.05em] hover:underline"
                >
                  {siteConfig.personal.email}
                </a>
              </div>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary text-[20px]">calendar_month</span>
                <a
                  href={siteConfig.links.calendly}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.05em] hover:underline"
                >
                  Book a 30-min call
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-7">
            {status === "sent" ? (
              <div className="border border-outline-variant p-12 flex flex-col items-start gap-4 h-full">
                <span className="material-symbols-outlined text-primary text-[32px]">check_circle</span>
                <h3 className="font-[family-name:var(--font-ibm-plex-sans)] text-[24px] font-medium">
                  Brief received.
                </h3>
                <p className="font-[family-name:var(--font-inter)] text-[16px] text-secondary leading-[1.6]">
                  I&apos;ll review your project and get back to you within 24 hours. If it&apos;s urgent, schedule a call directly.
                </p>
                <a
                  href={siteConfig.links.calendly}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 border border-primary text-primary font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.1em] px-6 py-3 hover:bg-surface-container-high transition-colors"
                >
                  Schedule a Call
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label className="font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.05em] text-secondary">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="border border-outline-variant bg-transparent p-4 focus:outline-none focus:border-primary font-[family-name:var(--font-inter)] text-[16px] transition-colors"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label className="font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.05em] text-secondary">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@company.com"
                    className="border border-outline-variant bg-transparent p-4 focus:outline-none focus:border-primary font-[family-name:var(--font-inter)] text-[16px] transition-colors"
                  />
                </div>

                {/* Project Title */}
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.05em] text-secondary">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="AI Infrastructure Audit / Flutter App MVP"
                    className="border border-outline-variant bg-transparent p-4 focus:outline-none focus:border-primary font-[family-name:var(--font-inter)] text-[16px] transition-colors"
                  />
                </div>

                {/* Budget */}
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.05em] text-secondary">
                    Budget Range
                  </label>
                  <select
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    className="border border-outline-variant bg-surface p-4 focus:outline-none focus:border-primary font-[family-name:var(--font-inter)] text-[16px] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Select budget range</option>
                    {BUDGET_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.05em] text-secondary">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    value={form.message}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Tell me about your technical requirements, timeline, and what success looks like..."
                    className="border border-outline-variant bg-transparent p-4 focus:outline-none focus:border-primary font-[family-name:var(--font-inter)] text-[16px] resize-none transition-colors"
                  />
                </div>

                {/* Honeypot — hidden from humans, bots fill it */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website ?? ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Submit */}
                <div className="md:col-span-2">
                  {status === "error" && (
                    <p className="text-error font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.05em] mb-4">
                      Something went wrong. Please try again or email directly.
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full bg-primary text-on-primary font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.2em] py-6 hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {status === "sending" ? "Sending..." : "Send Brief"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
