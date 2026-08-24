import siteConfig from "@/config/site.json";

const FAQS = [
  {
    q: "What services do you offer?",
    a: "Flutter mobile app development (iOS, Android, Web), custom AI/LLM systems (RAG pipelines, prompt engineering, vector databases), and developer SDK/tooling design.",
  },
  {
    q: "Are you available for new projects?",
    a: siteConfig.availability.available
      ? `Yes — currently accepting new contract work. ${siteConfig.availability.label}.`
      : "I'm currently at capacity, but you can join my waitlist by sending a brief.",
  },
  {
    q: "How do you work with clients?",
    a: "Remote-first from Casablanca, Morocco (GMT+1), overlapping with EU and US timezones. Typical flow: discovery call → technical audit & proposal → milestone-based delivery.",
  },
  {
    q: "What does a typical project cost?",
    a: "It depends on scope. Small SDKs or audits start around $3–5k; full production apps or AI systems range higher. Send a brief with your budget range for an exact quote within 24 hours.",
  },
  {
    q: "How fast can you start?",
    a: "Usually within 1–2 weeks depending on current commitments. Urgent audits or consulting can often begin sooner.",
  },
  {
    q: "Can you take over an existing codebase?",
    a: "Yes. Codebase audits, refactoring, performance optimization, and feature continuation on existing Flutter or Node.js projects are all standard engagements.",
  },
];

export default function FaqSection() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section className="border-t border-outline-variant" id="faq">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-[1200px] mx-auto px-6 md:px-[64px] py-[128px] grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[12px] text-secondary uppercase tracking-[0.15em] mb-3 block">
            [ FAQ ]
          </span>
          <h2 className="font-[family-name:var(--font-ibm-plex-sans)] text-[32px] md:text-[48px] font-semibold leading-[1.2] tracking-[-0.01em]">
            Common Questions
          </h2>
        </div>
        <div className="md:col-span-8 flex flex-col">
          {FAQS.map((f) => (
            <details key={f.q} className="group border-b border-outline-variant py-6">
              <summary className="flex justify-between items-center cursor-pointer list-none font-[family-name:var(--font-ibm-plex-sans)] text-[18px] font-medium hover:text-secondary transition-colors">
                {f.q}
                <span className="material-symbols-outlined text-[20px] text-secondary group-open:rotate-45 transition-transform">add</span>
              </summary>
              <p className="mt-4 font-[family-name:var(--font-inter)] text-[16px] leading-[1.7] text-secondary max-w-2xl">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
