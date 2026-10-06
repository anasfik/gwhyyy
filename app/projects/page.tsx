import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/portfolio/ContactForm";
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
    openGraph: { url: `${seo.url}/projects`, title: `Projects — ${personal.name}`, description: copy.projectsIndex.body, images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
  };
}

export default function ProjectsPage() {
  const { links, availability, copy, seo, personal } = getSiteContent();
  const projects = getProjects(getSiteContent());
  const projectsUrl = `${seo.url}/projects`;
  const projectsJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${projectsUrl}#webpage`,
        url: projectsUrl,
        name: `Projects — ${personal.name}`,
        description: copy.projectsIndex.body,
        isPartOf: { "@id": `${seo.url}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: seo.url },
          { "@type": "ListItem", position: 2, name: "Projects", item: projectsUrl },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${projectsUrl}#collection`,
        url: projectsUrl,
        name: `Projects — ${personal.name}`,
        description: copy.projectsIndex.body,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: projects.length,
          itemListElement: projects.map((project, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: project.name,
            url: `${seo.url}/projects/${project.slug}`,
          })),
        },
      },
    ],
  };
  return <><PageTracker /><Nav copy={copy.nav} brand={copy.brand} calendly={links.calendly} availabilityLabel={availability.label} /><main id="main" className="pt-[72px]"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsJsonLd) }} /><header className="section border-b border-line"><div className="shell"><p className="label mb-5 text-signal">{copy.projectsIndex.eyebrow} / {String(projects.length).padStart(2, "0")}</p><h1 className="max-w-5xl text-balance text-5xl font-semibold leading-[.95] tracking-[-.065em] md:text-8xl">{copy.projectsIndex.heading}</h1><p className="mt-8 max-w-2xl text-lg leading-8 text-muted">{copy.projectsIndex.body}</p></div></header><section className="section"><div className="shell space-y-20 md:space-y-28">{projects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div></section></main><Footer /></>;
}
