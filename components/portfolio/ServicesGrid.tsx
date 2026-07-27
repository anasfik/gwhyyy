import siteConfig from "@/config/site.json";

export default function ServicesGrid() {
  return (
    <section className="border-t border-outline-variant bg-surface-container-low" id="services">
      <div className="max-w-[1200px] mx-auto px-6 md:px-[64px] py-[128px]">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-24">
          <h2 className="font-[family-name:var(--font-ibm-plex-sans)] text-[32px] md:text-[48px] font-semibold leading-[1.2] tracking-[-0.01em] md:w-1/2">
            Technical Capabilities
          </h2>
          <p className="font-[family-name:var(--font-inter)] text-[18px] leading-[1.6] text-secondary md:w-1/3">
            Deploying expertise across the full engineering lifecycle — from architectural validation to production-grade deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {siteConfig.services.map((service) => (
            <div
              key={service.id}
              className="border border-outline-variant p-8 bg-surface hover:bg-surface-container-high transition-colors flex flex-col h-full"
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-primary mb-8 flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[20px]">
                  {service.icon}
                </span>
              </div>

              {/* Title */}
              <h4 className="font-[family-name:var(--font-ibm-plex-sans)] text-[24px] font-medium leading-[1.4] mb-4">
                {service.title}
              </h4>

              {/* Description */}
              <p className="font-[family-name:var(--font-inter)] text-[16px] leading-[1.6] text-secondary flex-grow">
                {service.description}
              </p>

              {/* Bullets */}
              <ul className="mt-8 font-[family-name:var(--font-ibm-plex-mono)] text-[14px] leading-[1.5] space-y-2 border-t border-outline-variant pt-6">
                {service.bullets.map((bullet) => (
                  <li key={bullet} className="text-on-surface">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
