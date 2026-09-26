import { getSiteContent } from "@/lib/site-content";

export default function ProcessSteps() {
  const { process, copy } = getSiteContent();
  return (
    <section className="section border-b border-line" aria-labelledby="process-title">
      <div className="shell grid gap-14 lg:grid-cols-[.7fr_1.3fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="label mb-5 text-signal">{copy.process.eyebrow}</p>
          <h2 id="process-title" className="text-4xl font-semibold tracking-[-.055em] md:text-5xl">{copy.process.heading}</h2>
          <p className="mt-6 max-w-md leading-7 text-muted">{copy.process.body}</p>
        </div>
        <ol className="border-t border-line">
          {process.map((step) => (
            <li key={step.step} className="grid gap-4 border-b border-line py-8 sm:grid-cols-[64px_180px_1fr] sm:items-start">
              <span className="label text-signal">{step.step}</span>
              <h3 className="text-xl font-medium">{step.title}</h3>
              <p className="max-w-lg leading-7 text-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
