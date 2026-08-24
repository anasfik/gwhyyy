import siteConfig from "@/config/site.json";

export default function Hero() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 md:px-[64px] py-[128px]" aria-label="Introduction">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-10">
          <h1 className="font-[family-name:var(--font-ibm-plex-sans)] text-[40px] md:text-[72px] font-semibold leading-[1.1] tracking-[-0.02em] text-primary mb-8">
            <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[14px] text-secondary mb-8 block tracking-tight uppercase">
              {siteConfig.personal.name} — Flutter Developer &amp; AI Engineer
            </span>
            {siteConfig.personal.tagline}
          </h1>
          <p className="font-[family-name:var(--font-inter)] text-[18px] leading-[1.6] text-secondary max-w-2xl mb-12">
            {siteConfig.personal.subTagline}
          </p>

          {/* Credential strip — driven by config for easy updates */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 mb-12 border-t border-outline-variant pt-8">
            {siteConfig.metrics.map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] uppercase tracking-[0.15em] text-secondary">
                  {label}
                </span>
                <span className="font-[family-name:var(--font-ibm-plex-sans)] text-[13px] font-medium text-on-surface">
                  {value}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#contact"
              className="bg-primary text-on-primary font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.15em] px-8 py-5 text-center hover:opacity-90 transition-opacity"
            >
              Send a Brief
            </a>
            <a
              href={siteConfig.links.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-primary text-primary font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.15em] px-8 py-5 text-center hover:bg-surface-container-high transition-colors"
            >
              Schedule a Call
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
