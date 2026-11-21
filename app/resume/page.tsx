import type { Metadata } from "next";
import Link from "next/link";
import PrintButton from "@/components/portfolio/PrintButton";
import { getProjects, getSiteContent } from "@/lib/site-content";

export const revalidate = 300;

export function generateMetadata(): Metadata {
  const { personal, seo } = getSiteContent();
  return {
    title: "Resume — Mohamed Anas Fikhi",
    description: `Resume of ${personal.name}, ${personal.title}.`,
    alternates: { canonical: `${seo.url}/resume` },
    openGraph: { url: `${seo.url}/resume`, title: `Resume — ${personal.name}`, description: `Resume of ${personal.name}, ${personal.title}.` },
  };
}

export default function ResumePage() {
  const { personal, links, capabilities, stackGroups, experience, copy } = getSiteContent();
  const projects = getProjects(getSiteContent());

  return (
    <main id="main" className="mx-auto max-w-[920px] px-5 py-10 md:px-10 md:py-16 print:max-w-none print:p-0">
      <div className="no-print mb-10 flex items-center justify-between">
        <Link href="/" className="text-sm text-muted hover:text-ink">← {copy.brand.name}</Link>
        <PrintButton />
      </div>

      <header className="border-b border-line pb-9">
        <p className="label text-forest">{copy.resume.eyebrow}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-.055em] md:text-6xl">{personal.name}</h1>
        <p className="mt-3 text-xl">{personal.title}</p>
        <p className="mt-5 max-w-3xl leading-7 text-muted">{personal.bio}</p>
        <address className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm not-italic">
          <span>{personal.location}</span>
          <a href={links.email} className="underline underline-offset-2">{personal.email}</a>
          <a href={links.github} className="underline underline-offset-2">GitHub</a>
          <a href={links.linkedin} className="underline underline-offset-2">LinkedIn</a>
          <span>{personal.workMode}</span>
        </address>
      </header>

      <ResumeSection title={copy.resume.sectionExperience}>
        {experience.map((item) => (
          <article key={item.id} className="mb-8 break-inside-avoid">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-xl font-semibold">{item.role}, {item.company}</h3>
              <p className="font-mono text-xs text-muted">{item.period} / {item.type}</p>
            </div>
            <p className="mt-3 leading-7 text-muted">{item.scope}</p>
            <p className="mt-2 text-sm">{item.stack.join(" · ")}</p>
          </article>
        ))}
      </ResumeSection>

      <ResumeSection title={copy.resume.sectionProjects}>
        {projects.map((project) => (
          <article key={project.slug} className="mb-6 break-inside-avoid">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold">
                <Link href={`/work/${project.slug}`} className="underline underline-offset-4">{project.name}</Link>
              </h3>
              <p className="text-sm text-forest">{project.signal}</p>
            </div>
            <p className="mt-2 leading-6 text-muted">{project.summary}</p>
            <p className="mt-2 text-sm">{project.stack.join(" · ")}</p>
          </article>
        ))}
      </ResumeSection>

      <ResumeSection title={copy.resume.sectionCapabilities}>
        <div className="grid gap-6 sm:grid-cols-2">
          {capabilities.map((item) => (
            <article key={item.slug} className="break-inside-avoid">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{item.summary}</p>
              <p className="mt-2 text-sm">{item.outcomes.slice(0, 4).join(" · ")}</p>
            </article>
          ))}
        </div>
      </ResumeSection>

      <ResumeSection title={copy.resume.sectionStack}>
        <div className="grid gap-4 sm:grid-cols-2">
          {stackGroups.map((group) => (
            <p key={group.label} className="text-sm">
              <strong>{group.label}:</strong> {group.items.join(", ")}
            </p>
          ))}
        </div>
      </ResumeSection>

      <footer className="mt-8 flex flex-wrap justify-between gap-3 border-t border-line pt-5 text-xs text-muted">
        <span>{personal.name} / {personal.handle}</span>
        <Link href="/contact" className="no-print underline underline-offset-2 hover:text-ink">{copy.nav.primaryCta}</Link>
      </footer>
    </main>
  );
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  const id = `${title.toLowerCase().replace(/ /g, "-")}-heading`;
  return (
    <section className="border-b border-line py-9 last:border-0" aria-labelledby={id}>
      <h2 id={id} className="label mb-7 text-forest">{title}</h2>
      {children}
    </section>
  );
}
