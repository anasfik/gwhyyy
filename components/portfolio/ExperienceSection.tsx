import { getSiteContent } from "@/lib/site-content";

export default function ExperienceSection() {
  const { experience, copy } = getSiteContent();
  return (
    <section className="section border-b border-line" id="experience" aria-labelledby="experience-title">
      <div className="shell">
        <h2 id="experience-title" className="text-4xl font-semibold tracking-[-.055em] md:text-6xl">{copy.experience.heading}</h2>
        <div className="mt-16 border-t border-line">
          {experience.map((experience, index) => (
            <article key={experience.id} className="grid gap-7 border-b border-line py-9 md:grid-cols-[80px_1fr_1fr] md:gap-8">
              <span className="label text-muted">0{index + 1}</span>
              <div>
                <a href={experience.link} target="_blank" rel="noopener noreferrer" className="link-arrow text-3xl font-medium tracking-[-.04em] hover:text-signal">{experience.company} <span className="inline-block text-base">↗</span></a>
                <p className="mt-2 text-muted">{experience.role}</p>
                <p className="label mt-5 text-muted">{experience.period} / {experience.type}</p>
              </div>
              <div>
                <p className="text-pretty leading-7">{experience.scope}</p>
                <ul className="mt-6 flex flex-wrap gap-2">{experience.stack.map((item) => <li key={item} className="border border-line px-3 py-1.5 font-mono text-[11px] text-muted">{item}</li>)}</ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
