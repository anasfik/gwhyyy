import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import PageTracker from "@/components/portfolio/PageTracker";
import ProjectVisual from "@/components/portfolio/ProjectVisual";
import { getProjects, getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams() { return getProjects(getSiteContent()).map((project) => ({ slug: project.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { seo } = getSiteContent();
  const project = getProjects(getSiteContent()).find((item) => item.slug === slug);
  if (!project) return {};
  const url = `${seo.url}/projects/${project.slug}`;
  return { title: `${project.name} — ${project.category}`, description: project.summary, keywords: [...project.stack], alternates: { canonical: url }, openGraph: { url, title: `${project.name} — GWHYYY`, description: project.summary, images: [`/projects/${project.slug}/opengraph-image`] }, twitter: { card: "summary_large_image", title: `${project.name} — GWHYYY`, description: project.summary, images: [`/projects/${project.slug}/opengraph-image`] } };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { seo, links, availability, copy } = getSiteContent();
  const text = copy.project;
  const projects = getProjects(getSiteContent());
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const index = projects.findIndex((item) => item.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  const jsonLd = { "@context": "https://schema.org", "@type": "SoftwareSourceCode", name: project.name, description: project.summary, url: `${seo.url}/projects/${project.slug}`, codeRepository: project.link, author: { "@id": `${seo.url}/#person` }, programmingLanguage: [...project.stack] };

  return <><PageTracker /><Nav copy={copy.nav} brand={copy.brand} calendly={links.calendly} availabilityLabel={availability.label} /><main id="main" className="pt-[72px]"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><article>
    <header className="section border-b border-line"><div className="shell"><Link href="/projects" className="label text-muted hover:text-paper">{text.backLabel}</Link><div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-end"><div><p className="label text-signal">{project.category}</p><h1 className="mt-5 text-5xl font-semibold tracking-[-.065em] md:text-8xl">{project.name}</h1><p className="mt-7 max-w-2xl text-xl leading-8 text-muted">{project.summary}</p></div><dl className="grid grid-cols-2 gap-px bg-line border border-line"><div className="bg-panel p-5"><dt className="label text-muted">Role</dt><dd className="mt-3 text-sm">{project.ownership[0]}</dd></div><div className="bg-panel p-5"><dt className="label text-muted">Signal</dt><dd className="mt-3 text-sm text-signal">{project.signal}</dd></div></dl></div><a href={project.link} target="_blank" rel="noopener noreferrer" data-track={`project_external:${project.slug}`} className="mt-10 inline-flex bg-signal px-6 py-4 text-sm font-semibold uppercase tracking-[.1em] text-ink">{text.openCta} ↗</a></div></header>
    <section className="border-b border-line"><div className="shell py-8 md:py-14"><div className="aspect-[16/10] overflow-hidden border border-line md:aspect-[16/7]"><ProjectVisual project={project} /></div></div></section>
    <section className="section border-b border-line"><div className="shell grid gap-14 lg:grid-cols-[.55fr_1fr]"><div><p className="label text-signal">{text.contextLabel}</p><h2 className="mt-5 text-4xl font-semibold tracking-[-.05em]">{text.contextHeading}</h2></div><p className="max-w-2xl text-pretty text-xl leading-9">{project.problem}</p></div></section>
    <section className="section border-b border-line bg-panel"><div className="shell grid gap-14 lg:grid-cols-[.55fr_1fr]"><div><p className="label text-signal">{text.architectureLabel}</p><h2 className="mt-5 text-4xl font-semibold tracking-[-.05em]">{text.architectureHeading}</h2></div><div><p className="max-w-2xl text-lg leading-8 text-muted">{project.approach}</p><div className="mt-10 grid gap-2 sm:grid-cols-2">{project.architecture.map((node, i) => <div key={node} className="border border-line bg-ink p-5"><span className="label text-muted">{text.nodePrefix} / 0{i + 1}</span><strong className="mt-4 block">{node}</strong></div>)}</div></div></div></section>
    <section className="section border-b border-line"><div className="shell grid gap-14 lg:grid-cols-2"><div><p className="label text-signal">{text.ownershipLabel}</p><h2 className="mt-5 text-4xl font-semibold tracking-[-.05em]">{text.ownershipHeading}</h2><ul className="mt-8 border-t border-line">{project.ownership.map((item) => <li key={item} className="border-b border-line py-4 text-muted">{item}</li>)}</ul></div><div><p className="label text-signal">{text.resultsLabel}</p><h2 className="mt-5 text-4xl font-semibold tracking-[-.05em]">{text.resultsHeading}</h2><ul className="mt-8 border-t border-line">{project.results.map((item) => <li key={item} className="flex gap-3 border-b border-line py-4"><span className="text-signal">→</span>{item}</li>)}</ul></div></div></section>
    <section className="section border-b border-line bg-panel"><div className="shell"><p className="label text-signal">{text.technologyLabel}</p><ul className="mt-8 flex flex-wrap gap-3">{project.stack.map((item) => <li key={item} className="border border-line bg-ink px-4 py-3 font-mono text-xs text-muted">{item}</li>)}</ul></div></section>
    <nav className="section" aria-label="Project navigation"><div className="shell"><p className="label text-muted">{text.nextPrefix} / 0{(index + 1) % projects.length + 1}</p><Link href={`/projects/${next.slug}`} className="link-arrow mt-5 flex items-end justify-between border-b border-line pb-8 text-4xl font-semibold tracking-[-.05em] hover:border-signal hover:text-signal md:text-7xl"><span>{next.name}</span><span className="inline-block text-2xl">→</span></Link></div></nav>
  </article></main><Footer /></>;
}
