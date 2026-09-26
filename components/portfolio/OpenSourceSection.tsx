import { getProjects, getSiteContent } from "@/lib/site-content";

export default function OpenSourceSection() {
  const { copy } = getSiteContent();
  const openSource = getProjects(getSiteContent()).filter((project) => project.category.includes("Open Source"));
  return (
    <section className="section border-b border-line bg-signal text-ink" aria-labelledby="oss-title">
      <div className="shell">
        <p className="label mb-5">{copy.openSource.eyebrow}</p>
        <h2 id="oss-title" className="max-w-4xl text-balance text-4xl font-semibold tracking-[-.06em] md:text-7xl">{copy.openSource.heading}</h2>
        <div className="mt-16 grid gap-px bg-ink/30 md:grid-cols-2">
          {openSource.map((project) => <a key={project.slug} href={project.link} target="_blank" rel="noopener noreferrer" data-track={`project_external:${project.slug}`} className="group bg-signal p-7 transition-colors hover:bg-paper md:p-10"><span className="label">{project.category}</span><h3 className="mt-10 text-4xl font-semibold tracking-[-.05em]">{project.name}</h3><p className="mt-4 max-w-lg leading-7 text-ink/70">{project.summary}</p><div className="mt-8 flex items-end justify-between border-t border-ink/25 pt-5"><strong>{project.signal}</strong><span className="transition-transform group-hover:translate-x-1">↗</span></div></a>)}
        </div>
      </div>
    </section>
  );
}
