import { getSiteContent } from "@/lib/site-content";

export default function ServicesGrid() {
  const { capabilities, copy } = getSiteContent();
  return (
    <section className="section border-b border-line bg-panel" id="services" aria-labelledby="services-title">
      <div className="shell">
        <div className="max-w-3xl">
          <h2 id="services-title" className="text-balance text-4xl font-semibold tracking-[-.055em] md:text-6xl">{copy.services.heading}</h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">{copy.services.body}</p>
        </div>
        <div className="mt-16 grid gap-px bg-line lg:grid-cols-12">
          {capabilities.map((capability, index) => (
            <article key={capability.title} className={`bg-ink p-7 md:p-9 ${index < 2 ? "lg:col-span-6" : "lg:col-span-3"}`}>
              <div className="flex items-start justify-between gap-5"><span className="label text-muted">CAP / 0{index + 1}</span><span className="font-mono text-signal">+</span></div>
              <h3 className="mt-10 text-2xl font-medium tracking-[-.035em]">{capability.title}</h3>
              <p className="mt-4 text-pretty leading-7 text-muted">{capability.summary}</p>
              <ul className="mt-8 border-t border-line pt-5 text-sm leading-7 text-paper">
                {capability.outcomes.map((outcome) => <li key={outcome} className="flex gap-3"><span className="text-signal">/</span>{outcome}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
