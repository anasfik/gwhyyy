import type { Metadata } from "next";
import siteConfig from "@/config/site.json";

export const metadata: Metadata = {
  title: "Resume — Flutter Developer & AI Engineer",
  description: `Resume of ${siteConfig.personal.name}: Flutter development, AI systems, RAG pipelines, SDK engineering, and selected production experience.`,
  alternates: { canonical: `${siteConfig.seo.url}/resume` },
};

export default function ResumePage() {
  const projects = siteConfig.projects
    .filter((project) => project.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <main className="max-w-[900px] mx-auto px-6 py-16 md:py-24 text-on-surface">
      <header className="border-b border-outline-variant pb-10 mb-12">
        <p className="font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider mb-4">
          Resume · Available for remote contract work
        </p>
        <h1 className="font-[family-name:var(--font-ibm-plex-sans)] text-4xl md:text-6xl font-semibold leading-tight">
          {siteConfig.personal.name} — Flutter Developer &amp; AI Engineer
        </h1>
        <p className="text-lg text-secondary leading-relaxed mt-6 max-w-3xl">
          {siteConfig.seo.description}
        </p>
        <address className="not-italic flex flex-wrap gap-x-6 gap-y-2 mt-6 text-sm">
          <span>{siteConfig.personal.location}</span>
          <a className="underline" href={siteConfig.links.email}>{siteConfig.personal.email}</a>
          <a className="underline" href={siteConfig.links.github}>GitHub</a>
          <a className="underline" href={siteConfig.links.linkedin}>LinkedIn</a>
        </address>
      </header>

      <section className="mb-14" aria-labelledby="capabilities-heading">
        <h2 id="capabilities-heading" className="text-3xl font-semibold mb-7">Core Technical Capabilities</h2>
        <div className="space-y-8">
          {siteConfig.services.map((service) => (
            <article key={service.id}>
              <h3 className="text-xl font-semibold">{service.title}</h3>
              <p className="text-secondary leading-relaxed mt-2">{service.description}</p>
              <ul className="list-disc pl-5 mt-3 space-y-1">
                {service.bullets.map((bullet) => <li key={bullet}>{bullet.replace(/^\+\s*/, "")}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-14" aria-labelledby="experience-heading">
        <h2 id="experience-heading" className="text-3xl font-semibold mb-7">Professional Experience</h2>
        <div className="space-y-9">
          {siteConfig.experience.map((experience) => (
            <article key={experience.id}>
              <h3 className="text-xl font-semibold">{experience.role} — {experience.company}</h3>
              <p className="text-sm text-secondary mt-1">{experience.period} · {experience.type}</p>
              <p className="leading-relaxed mt-3">{experience.impact}</p>
              <p className="text-sm mt-2"><strong>Technologies:</strong> {experience.stack.join(", ")}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-14" aria-labelledby="projects-heading">
        <h2 id="projects-heading" className="text-3xl font-semibold mb-7">Selected Projects &amp; Open Source</h2>
        <div className="space-y-8">
          {projects.map((project) => (
            <article key={project.id}>
              <h3 className="text-xl font-semibold"><a className="underline" href={project.url}>{project.title}</a></h3>
              <p className="text-sm text-secondary mt-1">{project.category} · {project.tags.join(", ")}</p>
              <p className="leading-relaxed mt-2">{project.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-outline-variant pt-10" aria-labelledby="contact-heading">
        <h2 id="contact-heading" className="text-3xl font-semibold">Project Inquiries</h2>
        <p className="mt-4 leading-relaxed">For Flutter, AI systems, RAG, SDK, or technical consulting work, email <a className="underline" href={siteConfig.links.email}>{siteConfig.personal.email}</a> or <a className="underline" href={siteConfig.links.calendly}>schedule a 30-minute call</a>.</p>
        <p className="mt-6 text-sm"><a className="underline" href="/">Return to portfolio</a> · <a className="underline" href="/llms.md">Markdown version</a> · <a className="underline" href="/profile.json">JSON profile</a></p>
      </section>
    </main>
  );
}
