import { getSiteContent } from "@/lib/site-content";

export default function FaqSection() {
  const { faq, copy } = getSiteContent();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  };

  return (
    <section className="section border-b border-line bg-panel" id="faq" aria-labelledby="faq-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="shell grid gap-12 lg:grid-cols-[.55fr_1fr]">
        <div><p className="label mb-5 text-signal">{copy.faq.eyebrow}</p><h2 id="faq-title" className="text-4xl font-semibold tracking-[-.055em] md:text-5xl">{copy.faq.heading}</h2></div>
        <div className="border-t border-line">
          {faq.map((item) => (
            <details key={item.question} className="group border-b border-line py-6">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium"><span>{item.question}</span><span className="font-mono text-signal transition-transform group-open:rotate-45" aria-hidden="true">+</span></summary>
              <p className="max-w-2xl pb-2 pt-4 leading-7 text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
