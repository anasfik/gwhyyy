import siteConfig from "@/config/site.json";

export default function ProcessSteps() {
  const steps = siteConfig.process;

  return (
    <section className="border-t border-outline-variant">
      <div className="max-w-[1200px] mx-auto px-6 md:px-[64px] py-[128px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4">
            <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[12px] text-secondary uppercase tracking-[0.15em] mb-3 block">
              [ HOW I WORK ]
            </span>
            <h2 className="font-[family-name:var(--font-ibm-plex-sans)] text-[32px] md:text-[48px] font-semibold leading-[1.2] tracking-[-0.01em]">
              Execution Protocol
            </h2>
          </div>

          <div className="md:col-span-8 flex flex-col gap-16">
            {steps.map((step, i) => (
              <div key={step.step} className="flex gap-8 items-start">
                <div className="flex flex-col items-center flex-shrink-0">
                  <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[20px] font-bold text-primary">
                    {step.step}
                  </span>
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 min-h-[96px] bg-outline-variant my-2" />
                  )}
                </div>
                <div className="pt-1">
                  <h5 className="font-[family-name:var(--font-ibm-plex-sans)] text-[24px] font-medium leading-[1.4] mb-2">
                    {step.title}
                  </h5>
                  <p className="font-[family-name:var(--font-inter)] text-[16px] leading-[1.6] text-secondary">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
