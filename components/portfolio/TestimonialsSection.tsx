import siteConfig from "@/config/site.json";

export default function TestimonialsSection() {
  const testimonials = siteConfig.testimonials ?? [];
  if (testimonials.length === 0) return null;

  return (
    <section className="border-t border-outline-variant bg-surface-container-low" id="testimonials">
      <div className="max-w-[1200px] mx-auto px-6 md:px-[64px] py-[128px]">
        <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[12px] text-secondary uppercase tracking-[0.15em] mb-3 block">
          [ WHAT CLIENTS SAY ]
        </span>
        <h2 className="font-[family-name:var(--font-ibm-plex-sans)] text-[32px] md:text-[48px] font-semibold leading-[1.2] tracking-[-0.01em] mb-16">
          Client Feedback
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <figure key={t.author} className="border border-outline-variant bg-surface p-8">
              <blockquote className="font-[family-name:var(--font-ibm-plex-sans)] text-[18px] leading-[1.6] text-on-surface mb-6">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-4">
                <div>
                  <cite className="font-[family-name:var(--font-ibm-plex-sans)] text-[14px] font-medium not-italic">
                    {t.author}
                  </cite>
                  <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[11px] text-secondary uppercase tracking-[0.05em]">
                    {t.role}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
