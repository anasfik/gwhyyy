import type { Metadata } from "next";
import Link from "next/link";
import PrintButton from "@/components/portfolio/PrintButton";
import { getProjects, getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  const { personal, seo } = getSiteContent();
  return { title: `Resume — ${personal.title}`, description: `Resume of ${personal.name}, ${personal.title}.`, alternates: { canonical: `${seo.url}/resume` } };
}

export default function ResumePage() {
  const { personal, links, capabilities, stackGroups, experience, copy } = getSiteContent();
  const text = copy.resume;
  const projects = getProjects(getSiteContent());
  return <main id="main" className="mx-auto max-w-[920px] bg-ink px-5 py-10 md:px-10 md:py-16 print:max-w-none print:bg-white print:p-0">
    <div className="no-print mb-10 flex items-center justify-between"><Link href="/" className="text-sm text-muted hover:text-paper">← {copy.brand.name}</Link><PrintButton /></div>
    <header className="border-b border-line pb-9"><p className="label text-signal">{text.eyebrow}</p><h1 className="mt-4 text-4xl font-semibold tracking-[-.055em] md:text-6xl">{personal.name}</h1><p className="mt-3 text-xl">{personal.title}</p><p className="mt-5 max-w-3xl leading-7 text-muted">{personal.bio}</p><address className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm not-italic"><span>{personal.location}</span><a href={links.email}>{personal.email}</a><a href={links.github}>GitHub</a><a href={links.linkedin}>LinkedIn</a></address></header>
    <ResumeSection title={text.sectionExperience}>{experience.map((item) => <article key={item.id} className="mb-8 break-inside-avoid"><div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="text-xl font-semibold">{item.role}, {item.company}</h3><p className="font-mono text-xs text-muted">{item.period} / {item.type}</p></div><p className="mt-3 leading-7 text-muted">{item.scope}</p><p className="mt-2 text-sm">{item.stack.join(" · ")}</p></article>)}</ResumeSection>
    <ResumeSection title={text.sectionProjects}>{projects.map((project) => <article key={project.slug} className="mb-6 break-inside-avoid"><div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="text-lg font-semibold"><a href={project.link}>{project.name}</a></h3><p className="text-sm text-signal">{project.signal}</p></div><p className="mt-2 leading-6 text-muted">{project.summary}</p><p className="mt-2 text-sm">{project.stack.join(" · ")}</p></article>)}</ResumeSection>
    <ResumeSection title={text.sectionCapabilities}><div className="grid gap-6 sm:grid-cols-2">{capabilities.map((item) => <article key={item.title} className="break-inside-avoid"><h3 className="font-semibold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted">{item.summary}</p><p className="mt-2 text-sm">{item.outcomes.join(" · ")}</p></article>)}</div></ResumeSection>
    <ResumeSection title={text.sectionStack}><div className="grid gap-4 sm:grid-cols-2">{stackGroups.map((group) => <p key={group.label} className="text-sm"><strong>{group.label}:</strong> {group.items.join(", ")}</p>)}</div></ResumeSection>
  </main>;
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) { return <section className="border-b border-line py-9 last:border-0" aria-labelledby={`${title.toLowerCase().replace(/ /g, "-")}-heading`}><h2 id={`${title.toLowerCase().replace(/ /g, "-")}-heading`} className="label mb-7 text-signal">{title}</h2>{children}</section>; }
