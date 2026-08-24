import siteConfig from "@/config/site.json";

export default function ExperienceSection() {
  return (
    <section className="border-t border-outline-variant bg-surface-container-low" id="experience">
      <div className="max-w-[1200px] mx-auto px-6 md:px-[64px] py-[128px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-16">
          <div>
            <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[12px] text-secondary uppercase tracking-[0.15em] mb-3 block">
              [ VERIFIED ENGAGEMENTS ]
            </span>
            <h2 className="font-[family-name:var(--font-ibm-plex-sans)] text-[32px] md:text-[48px] font-semibold leading-[1.2] tracking-[-0.01em]">
              Selected Experience
            </h2>
          </div>
          <p className="font-[family-name:var(--font-inter)] text-[18px] leading-[1.6] text-secondary md:max-w-sm">
            Real companies. Production systems. Verifiable work.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {siteConfig.experience.map((exp) => (
            <a
              key={exp.id}
              href={exp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-outline-variant bg-surface p-8 hover:bg-surface-container-high transition-colors flex flex-col gap-6"
            >
              {/* Top row */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-[family-name:var(--font-ibm-plex-sans)] text-[24px] font-medium leading-[1.4] mb-1 group-hover:underline underline-offset-4">
                    {exp.company}
                  </h3>
                  <div className="font-[family-name:var(--font-inter)] text-[16px] text-secondary leading-[1.6]">
                    {exp.role}
                  </div>
                </div>
                <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors text-[20px]">
                  open_in_new
                </span>
              </div>

              {/* Period + type */}
              <div className="flex items-center gap-4">
                <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[12px] text-secondary uppercase tracking-[0.05em]">
                  {exp.period}
                </span>
                <span className="font-[family-name:var(--font-ibm-plex-sans)] text-[10px] uppercase tracking-[0.05em] border border-outline-variant px-2 py-1 text-secondary">
                  {exp.type}
                </span>
              </div>

              {/* Impact */}
              <p className="font-[family-name:var(--font-inter)] text-[16px] leading-[1.6] text-on-surface">
                {exp.impact}
              </p>

              {/* Stack chips */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-outline-variant">
                {exp.stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 border border-outline-variant font-[family-name:var(--font-ibm-plex-mono)] text-[10px] uppercase tracking-[0.05em] text-secondary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
