import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import PageTracker from "@/components/portfolio/PageTracker";
import FaqSection from "@/components/portfolio/FaqSection";
import siteConfig from "@/config/site.json";

export const metadata: Metadata = {
  title: "Hire Me",
  description: `Hire ${siteConfig.personal.name} — Flutter developer and AI engineer. Technical audits, SDK builds, and full product development. Available for contract work worldwide.`,
  alternates: { canonical: `${siteConfig.seo.url}/hire` },
  openGraph: {
    url: `${siteConfig.seo.url}/hire`,
    title: `Hire ${siteConfig.personal.name} — GWHYYY`,
    description: "Flutter developer and AI engineer. Technical audits, SDK builds, and full product development.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "GWHYYY — Hire Flutter & AI Engineer",
  url: `${siteConfig.seo.url}/hire`,
  provider: { "@id": `${siteConfig.seo.url}/#person` },
  description: siteConfig.hire.subheadline,
  areaServed: { "@type": "AdministrativeArea", name: "Worldwide" },
  offers: siteConfig.hire.tiers.map((t) => ({
    "@type": "Offer",
    name: t.name,
    description: t.description,
    price: t.price,
    priceCurrency: "USD",
  })),
};

export default function HirePage() {
  return (
    <>
      <PageTracker />
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main id="main" className="pt-20">
        {/* Hero */}
        <section className="max-w-[1200px] mx-auto px-6 md:px-[64px] py-[128px]">
          <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[12px] text-secondary uppercase tracking-[0.15em] mb-3 block">
            [ HIRE ME ]
          </span>
          <h1 className="font-[family-name:var(--font-ibm-plex-sans)] text-[40px] md:text-[64px] font-semibold leading-[1.1] tracking-[-0.02em] mb-8 max-w-3xl">
            {siteConfig.hire.headline}
          </h1>
          <p className="font-[family-name:var(--font-inter)] text-[18px] leading-[1.6] text-secondary max-w-2xl mb-12">
            {siteConfig.hire.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={siteConfig.links.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-on-primary font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.15em] px-8 py-5 text-center hover:opacity-90 transition-opacity"
            >
              Schedule a Call
            </a>
            <a
              href={siteConfig.links.email}
              className="border border-primary text-primary font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.15em] px-8 py-5 text-center hover:bg-surface-container-high transition-colors"
            >
              Send a Brief
            </a>
          </div>
        </section>

        {/* Pricing tiers */}
        <section className="border-t border-outline-variant" id="tiers">
          <div className="max-w-[1200px] mx-auto px-6 md:px-[64px] py-[128px]">
            <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[12px] text-secondary uppercase tracking-[0.15em] mb-3 block">
              [ ENGAGEMENT MODELS ]
            </span>
            <h2 className="font-[family-name:var(--font-ibm-plex-sans)] text-[32px] md:text-[48px] font-semibold leading-[1.2] tracking-[-0.01em] mb-16">
              How We Work
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {siteConfig.hire.tiers.map((tier, i) => (
                <div
                  key={tier.name}
                  className={`border border-outline-variant bg-surface p-8 flex flex-col ${i === 1 ? "md:-mt-8 md:mb-0 border-primary" : ""}`}
                >
                  <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[11px] uppercase tracking-[0.15em] text-secondary mb-3">
                    TIER 0{i + 1}
                  </span>
                  <h3 className="font-[family-name:var(--font-ibm-plex-sans)] text-[24px] font-medium mb-2">
                    {tier.name}
                  </h3>
                  <div className="font-[family-name:var(--font-ibm-plex-sans)] text-[32px] font-semibold mb-1">
                    {tier.price}
                  </div>
                  <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[11px] text-secondary uppercase tracking-[0.05em] mb-6">
                    {tier.timeline}
                  </span>
                  <p className="font-[family-name:var(--font-inter)] text-[15px] leading-[1.6] text-secondary mb-8 flex-grow">
                    {tier.description}
                  </p>
                  <ul className="space-y-3 mb-8 border-t border-outline-variant pt-6">
                    {tier.deliverables.map((d) => (
                      <li key={d} className="font-[family-name:var(--font-ibm-plex-mono)] text-[12px] flex gap-3">
                        <span className="text-primary">+</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    className={`block text-center font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.15em] py-5 hover:opacity-90 transition-opacity ${
                      i === 1
                        ? "bg-primary text-on-primary"
                        : "border border-outline-variant text-primary hover:bg-surface-container-high"
                    }`}
                  >
                    Get Started
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ reuse */}
        <FaqSection />

        {/* CTA */}
        <section className="border-t border-outline-variant bg-surface" id="contact">
          <div className="max-w-[1200px] mx-auto px-6 md:px-[64px] py-[128px]">
            <h2 className="font-[family-name:var(--font-ibm-plex-sans)] text-[32px] md:text-[48px] font-semibold leading-[1.2] tracking-[-0.01em] mb-8">
              Ready to Start?
            </h2>
            <p className="font-[family-name:var(--font-inter)] text-[18px] leading-[1.6] text-secondary max-w-2xl mb-12">
              Book a free 30-minute call to discuss your project. No commitment — just a conversation about what you need and how I can help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={siteConfig.links.calendly}
                target="_blank"
                rel="noopener noreferrer"
                data-track="cta_calendly_click"
                className="bg-primary text-on-primary font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.15em] px-8 py-5 text-center hover:opacity-90 transition-opacity"
              >
                Book a 30-min Call
              </a>
              <a
                href={siteConfig.links.email}
                className="border border-primary text-primary font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.15em] px-8 py-5 text-center hover:bg-surface-container-high transition-colors"
              >
                Send a Brief
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
