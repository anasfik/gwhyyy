import type { Metadata } from "next";
import SiteShell from "@/components/layout/SiteShell";
import ProjectCard from "@/components/site/ProjectCard";
import { getProjects, getSiteContent } from "@/lib/site-content";

export const revalidate = 300;

export function generateMetadata(): Metadata {
  const { seo, copy, personal } = getSiteContent();
  const url = `${seo.url}/work`;
  return {
    title: "Software Engineering Case Studies",
    description: copy.workPage.body,
    alternates: { canonical: url },
    openGraph: { url, title: `Work — ${personal.name}`, description: copy.workPage.body, images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
  };
}

export default function WorkPage() {
  const content = getSiteContent();
  const projects = getProjects(content);
  const { seo, copy, personal } = content;
  const url = `${seo.url}/work`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#page`,
        url,
        name: `Work — ${personal.name}`,
        description: copy.workPage.body,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: projects.length,
          itemListElement: projects.map((project, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: project.name,
            url: `${url}/${project.slug}`,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: seo.url },
          { "@type": "ListItem", position: 2, name: "Work", item: url },
        ],
      },
    ],
  };

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="border-b border-line">
        <div className="shell grid gap-8 py-12 md:py-16 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <div>
            <p className="label text-muted">Work / {String(projects.length).padStart(2, "0")}</p>
            <h1 className="display mt-5 text-[clamp(3rem,7vw,5.5rem)] font-semibold">{copy.workPage.heading}</h1>
          </div>
          <p className="max-w-xl text-lg leading-8 text-muted">{copy.workPage.body}</p>
        </div>
      </header>
      <section className="shell py-6 md:py-10">
        {projects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index + 1} priority={index === 0} />
        ))}
      </section>
      <section className="bg-signal">
        <div className="shell flex flex-col gap-6 py-12 md:flex-row md:items-center md:justify-between md:py-14">
          <p className="max-w-xl text-lg font-medium tracking-[-.03em]">Have a product, integration, or SDK that needs to ship?</p>
          <a href="/contact" className="inline-flex min-h-12 shrink-0 items-center bg-ink px-6 text-sm font-medium text-paper hover:bg-forest">Discuss your project</a>
        </div>
      </section>
    </SiteShell>
  );
}
