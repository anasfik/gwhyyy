import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import PageTracker from "@/components/portfolio/PageTracker";
import ProjectVisual from "@/components/portfolio/ProjectVisual";
import siteConfig from "@/config/site.json";

export const metadata: Metadata = {
  title: "Projects",
  description: `Selected Flutter apps, AI systems, and developer SDKs by ${siteConfig.personal.name} — open source libraries and production client work.`,
  alternates: { canonical: `${siteConfig.seo.url}/projects` },
  openGraph: {
    url: `${siteConfig.seo.url}/projects`,
    title: `Projects — ${siteConfig.personal.name} (GWHYYY)`,
    description: "Flutter apps, AI systems, RAG pipelines, and developer SDKs.",
  },
};

export default function ProjectsPage() {
  const visible = siteConfig.projects
    .filter((p) => p.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      <PageTracker />
      <Nav />
      <main id="main" className="pt-20">
        <section className="max-w-[1200px] mx-auto px-6 md:px-[64px] py-[96px]">
          <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[14px] text-secondary mb-6 block tracking-tight">
            [ SELECTED WORK ]
          </span>
          <h1 className="font-[family-name:var(--font-ibm-plex-sans)] text-[40px] md:text-[64px] font-semibold leading-[1.1] tracking-[-0.02em] mb-8">
            Projects &amp; Shipments
          </h1>
          <p className="text-[18px] leading-[1.6] text-secondary max-w-2xl mb-16">
            Production mobile products, open-source SDKs used by thousands of developers, and applied AI systems.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-20">
            {visible.map((project, i) => (
              <article key={project.id} className={`group flex flex-col ${i % 2 === 1 ? "md:mt-24" : ""}`}>
                <a href={`/projects/${project.id}`} className="block border border-outline-variant aspect-[4/3] overflow-hidden bg-surface-container mb-6">
                  <ProjectVisual project={project} />
                </a>
                <div className="text-[12px] uppercase tracking-[0.05em] text-secondary mb-2 font-[family-name:var(--font-ibm-plex-sans)]">
                  {project.category}
                </div>
                <h2 className="text-[24px] font-medium leading-[1.4] mb-3 group-hover:underline underline-offset-4 font-[family-name:var(--font-ibm-plex-sans)]">
                  <a href={`/projects/${project.id}`}>{project.title}</a>
                </h2>
                <p className="text-[16px] leading-[1.6] text-secondary mb-6 font-[family-name:var(--font-inter)] line-clamp-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 border border-outline-variant text-[10px] uppercase tracking-[0.05em] font-[family-name:var(--font-ibm-plex-sans)]">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
