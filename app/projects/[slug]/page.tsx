import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import PageTracker from "@/components/portfolio/PageTracker";
import ProjectVisual from "@/components/portfolio/ProjectVisual";
import siteConfig from "@/config/site.json";

function getVisibleProjects() {
  return siteConfig.projects.filter((p) => p.visible).sort((a, b) => a.order - b.order);
}

export function generateStaticParams() {
  return getVisibleProjects().map((p) => ({ slug: p.id }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = getVisibleProjects().find((p) => p.id === params.slug);
  if (!project) return {};

  const url = `${siteConfig.seo.url}/projects/${project.id}`;
  return {
    title: `${project.title} — ${project.category}`,
    description: project.description,
    keywords: project.tags,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: `${project.title} — ${siteConfig.personal.name}`,
      description: project.description,
    },
  };
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = getVisibleProjects().find((p) => p.id === params.slug);
  if (!project) notFound();

  const all = getVisibleProjects();
  const idx = all.findIndex((p) => p.id === project.id);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.description,
    url: project.url,
    applicationCategory: "DeveloperApplication",
    author: {
      "@type": "Person",
      name: siteConfig.personal.name,
      url: siteConfig.seo.url,
    },
    keywords: project.tags.join(", "),
  };

  return (
    <>
      <PageTracker />
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main id="main" className="pt-20">
        <article className="max-w-[1200px] mx-auto px-6 md:px-[64px] py-[96px]">
          <Link
            href="/projects"
            className="font-[family-name:var(--font-ibm-plex-mono)] text-[12px] uppercase tracking-[0.15em] text-secondary hover:text-primary transition-colors inline-flex items-center gap-2 mb-12"
          >
            <span aria-hidden="true">←</span> All Projects
          </Link>

          <div className="text-[12px] uppercase tracking-[0.05em] text-secondary mb-3 font-[family-name:var(--font-ibm-plex-sans)]">
            {project.category}
          </div>
          <h1 className="text-[40px] md:text-[64px] font-semibold leading-[1.1] tracking-[-0.02em] mb-8 font-[family-name:var(--font-ibm-plex-sans)]">
            {project.title}
          </h1>
          <p className="text-[18px] leading-[1.7] text-secondary max-w-3xl mb-12 font-[family-name:var(--font-inter)]">
            {project.description}
          </p>

          {/* Hero image */}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              data-track={`project-open:${project.id}`}
              className="block border border-outline-variant aspect-[16/9] overflow-hidden bg-surface-container mb-12 hover:opacity-95 transition-opacity"
            >
              <ProjectVisual project={project} />
            </a>
          )}

          {/* Case study: Challenge → Built → Results */}
          {(project.challenge || project.outcome || project.results) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {project.challenge && (
                <div>
                  <h3 className="font-[family-name:var(--font-ibm-plex-mono)] text-[11px] uppercase tracking-[0.15em] text-secondary mb-3">
                    01 / Challenge
                  </h3>
                  <p className="font-[family-name:var(--font-inter)] text-[16px] leading-[1.7] text-on-surface">
                    {project.challenge}
                  </p>
                </div>
              )}
              {project.outcome && (
                <div>
                  <h3 className="font-[family-name:var(--font-ibm-plex-mono)] text-[11px] uppercase tracking-[0.15em] text-secondary mb-3">
                    02 / What I Built
                  </h3>
                  <p className="font-[family-name:var(--font-inter)] text-[16px] leading-[1.7] text-on-surface">
                    {project.outcome}
                  </p>
                </div>
              )}
              {project.results && project.results.length > 0 && (
                <div>
                  <h3 className="font-[family-name:var(--font-ibm-plex-mono)] text-[11px] uppercase tracking-[0.15em] text-secondary mb-3">
                    03 / Results
                  </h3>
                  <ul className="space-y-2">
                    {project.results.map((r) => (
                      <li key={r} className="font-[family-name:var(--font-inter)] text-[15px] leading-[1.6] text-on-surface flex gap-2">
                        <span className="text-primary flex-shrink-0 mt-1">→</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map((tag) => (
              <span key={tag} className="px-4 py-2 border border-outline-variant text-[11px] uppercase tracking-[0.05em] font-[family-name:var(--font-ibm-plex-sans)]">
                {tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              data-track={`project-open:${project.id}`}
              className="inline-block bg-primary text-on-primary font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.15em] px-8 py-5 hover:opacity-90 transition-opacity"
            >
              Open Project →
            </a>
          )}

          {/* Prev / Next */}
          <nav className="mt-24 pt-8 border-t border-outline-variant flex justify-between gap-6" aria-label="Project navigation">
            {prev ? (
              <Link href={`/projects/${prev.id}`} className="group flex flex-col gap-1 min-w-0">
                <span className="text-[10px] uppercase tracking-[0.15em] text-secondary font-[family-name:var(--font-ibm-plex-mono)]">← PREV</span>
                <span className="text-[18px] font-medium group-hover:underline underline-offset-4 truncate">{prev.title}</span>
              </Link>
            ) : <span />}
            {next && (
              <Link href={`/projects/${next.id}`} className="group flex flex-col gap-1 items-end text-right min-w-0">
                <span className="text-[10px] uppercase tracking-[0.15em] text-secondary font-[family-name:var(--font-ibm-plex-mono)]">NEXT →</span>
                <span className="text-[18px] font-medium group-hover:underline underline-offset-4 truncate">{next.title}</span>
              </Link>
            )}
          </nav>
        </article>
      </main>
      <Footer />
    </>
  );
}
