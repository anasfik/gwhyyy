import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import PageTracker from "@/components/portfolio/PageTracker";
import ProjectCard from "@/components/portfolio/ProjectCard";
import { getProjects, getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  const { personal, seo, copy } = getSiteContent();
  return {
    title: "Projects",
    description: `${copy.projectsIndex.body} Work by ${personal.name}.`,
    alternates: { canonical: `${seo.url}/projects` },
    openGraph: { url: `${seo.url}/projects`, title: `Projects — ${personal.name}`, description: copy.projectsIndex.body },
  };
}

export default function ProjectsPage() {
  const { links, availability, copy } = getSiteContent();
  const projects = getProjects(getSiteContent());
  return <><PageTracker /><Nav copy={copy.nav} brand={copy.brand} calendly={links.calendly} availabilityLabel={availability.label} /><main id="main" className="pt-[72px]"><header className="section border-b border-line"><div className="shell"><p className="label mb-5 text-signal">{copy.projectsIndex.eyebrow} / {String(projects.length).padStart(2, "0")}</p><h1 className="max-w-5xl text-balance text-5xl font-semibold leading-[.95] tracking-[-.065em] md:text-8xl">{copy.projectsIndex.heading}</h1><p className="mt-8 max-w-2xl text-lg leading-8 text-muted">{copy.projectsIndex.body}</p></div></header><section className="section"><div className="shell space-y-20 md:space-y-28">{projects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div></section></main><Footer /></>;
}
