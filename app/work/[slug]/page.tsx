import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteShell from "@/components/layout/SiteShell";
import { getProjects, getSiteContent } from "@/lib/site-content";

export const revalidate = 300;

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const content = getSiteContent();
  const project = getProjects(content).find((item) => item.slug === slug);
  if (!project) return {};
  const url = `${content.seo.url}/work/${project.slug}`;
  return {
    title: `${project.name} — ${project.category}`,
    description: project.summary,
    keywords: [...project.stack],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `${project.name} — ${content.copy.brand.name}`,
      description: project.summary,
      images: [{ url: `/work/${project.slug}/opengraph-image`, width: 1200, height: 630, alt: project.name }],
    },
    twitter: { card: "summary_large_image", title: `${project.name} — ${content.copy.brand.name}`, description: project.summary, images: [`/work/${project.slug}/opengraph-image`] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = getSiteContent();
  const { seo, copy, personal, capabilities } = content;
  const projects = getProjects(content);
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  const index = projects.findIndex((item) => item.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  const text = copy.project;
  const hero = project.media?.[0];
  const gallery = project.media?.slice(1) ?? [];
  const related = capabilities.filter((service) => project.services?.includes(service.slug));
  const primaryContact = related[0]?.slug ?? "other";
  const url = `${seo.url}/work/${project.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareSourceCode",
        name: project.name,
        description: project.summary,
        url,
        image: `${url}/opengraph-image`,
        author: { "@id": `${seo.url}/#person` },
        keywords: [...project.stack],
        creativeWorkStatus: project.status,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: seo.url },
          { "@type": "ListItem", position: 2, name: "Work", item: `${seo.url}/work` },
          { "@type": "ListItem", position: 3, name: project.name, item: url },
        ],
      },
    ],
  };

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article>
        <header className="border-b border-line">
          <div className="shell py-10 md:py-14">
            <Link href="/work" className="label text-muted hover:text-ink">← {text.backLabel}</Link>
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
              <div>
                <p className="label text-forest">{project.category} / {project.status}</p>
                <h1 className="display mt-4 max-w-[14ch] text-[clamp(3rem,7vw,5.8rem)] font-semibold">{project.name}</h1>
                <p className="prose-measure mt-6 text-lg leading-8 text-muted">{project.summary}</p>
              </div>
              <div>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-5 text-sm">
                  <div>
                    <dt className="label text-muted">{text.metaRole}</dt>
                    <dd className="mt-1.5">{project.role}</dd>
                  </div>
                  <div>
                    <dt className="label text-muted">{text.metaPeriod}</dt>
                    <dd className="mt-1.5">{project.period}</dd>
                  </div>
                  <div>
                    <dt className="label text-muted">{text.metaStatus}</dt>
                    <dd className="mt-1.5">{project.status}</dd>
                  </div>
                  <div>
                    <dt className="label text-muted">{text.metaStack}</dt>
                    <dd className="mt-1.5 leading-6">{project.stack.slice(0, 4).join(", ")}</dd>
                  </div>
                </dl>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={project.link} target="_blank" rel="noopener noreferrer" data-track={`project_external:${project.slug}`} className="inline-flex min-h-12 items-center bg-ink px-6 text-sm font-medium text-paper hover:bg-forest">
                    {text.openCta} ↗
                  </a>
                  <Link href={`/contact?service=${primaryContact}&from=${project.slug}`} data-track={`project_inquiry:${project.slug}`} className="inline-flex min-h-12 items-center border border-ink px-6 text-sm font-medium hover:bg-panel">
                    Discuss similar work
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </header>

        {hero && (
          <div className="border-b border-line bg-panel">
            <div className="shell py-6 md:py-9">
              <figure>
                <div className="relative aspect-[1440/950] overflow-hidden border border-line bg-raised">
                  <Image src={hero.src} alt={hero.alt} fill priority sizes="(min-width: 1280px) 1240px, 100vw" className="object-cover object-top" />
                </div>
                {hero.caption && <figcaption className="mt-3 text-xs text-muted">{hero.caption}</figcaption>}
              </figure>
            </div>
          </div>
        )}

        <section aria-label={text.evidenceLabel} className="border-b border-line">
          <div className="shell grid gap-6 py-8 md:grid-cols-3 md:py-10">
            {project.results.slice(0, 3).map((result) => (
              <p key={result} className="flex gap-3 border-t border-line pt-4 text-sm leading-6 first:border-t-0 first:pt-0 md:border-l md:border-t-0 md:pl-5 md:pt-0 md:first:border-l-0 md:first:pl-0">
                <span className="text-forest" aria-hidden="true">✓</span>
                {result}
              </p>
            ))}
          </div>
        </section>

        {project.sections?.map((section, sectionIndex) => (
          <div key={section.title}>
            <section className={`border-b border-line ${sectionIndex % 2 === 1 ? "bg-panel" : ""}`} aria-labelledby={`section-${sectionIndex}`}>
              <div className="shell grid gap-7 py-10 md:py-14 lg:grid-cols-[.34fr_1fr] lg:gap-14">
                <h2 id={`section-${sectionIndex}`} className="text-2xl font-semibold tracking-[-.045em] md:text-3xl">{section.title}</h2>
                <div>
                  <div className="space-y-4">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="prose-measure text-lg leading-8">{paragraph}</p>
                    ))}
                  </div>
                  {section.bullets && (
                    <ul className="mt-6 grid gap-x-8 gap-y-3 border-t border-line pt-5 sm:grid-cols-2">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3 text-sm leading-6">
                          <span className="text-forest" aria-hidden="true">→</span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </section>

            {sectionIndex === 1 && gallery.length > 0 && (
              <section className="border-b border-line" aria-label={text.mediaLabel}>
                <div className="shell grid gap-6 py-8 md:grid-cols-2 md:py-12">
                  {gallery.map((media) => (
                    <figure key={media.src} className={gallery.length === 3 ? "md:first:col-span-2" : ""}>
                      <div className={`relative overflow-hidden border border-line bg-raised ${gallery.length === 3 ? "aspect-[1440/950]" : "aspect-[1440/950]"}`}>
                        <Image src={media.src} alt={media.alt} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover object-top" />
                      </div>
                      {media.caption && <figcaption className="mt-2 text-xs text-muted">{media.caption}</figcaption>}
                    </figure>
                  ))}
                </div>
              </section>
            )}
          </div>
        ))}

        <section className="border-b border-line" aria-labelledby="ownership-title">
          <div className="shell grid gap-10 py-10 md:py-14 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 id="ownership-title" className="text-2xl font-semibold tracking-[-.045em] md:text-3xl">What I owned</h2>
              <ul className="mt-5 border-t border-line">
                {project.ownership.map((item) => (
                  <li key={item} className="border-b border-line py-4 text-sm leading-6">{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-[-.045em] md:text-3xl">{text.evidenceLabel}</h2>
              <ul className="mt-5 border-t border-line">
                {project.results.map((item) => (
                  <li key={item} className="flex gap-3 border-b border-line py-4 text-sm leading-6">
                    <span className="text-forest" aria-hidden="true">→</span>
                    {item}
                  </li>
                ))}
              </ul>
              <ul className="mt-6 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <li key={item} className="border border-line px-3 py-1.5 font-mono text-[11px] text-muted">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="border-b border-line bg-panel" aria-label={text.relatedHeading}>
            <div className="shell grid gap-6 py-10 md:grid-cols-[.34fr_1fr] md:py-12">
              <h2 className="text-2xl font-semibold tracking-[-.045em]">{text.relatedHeading}</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {related.map((service) => (
                  <Link key={service.slug} href={`/services/${service.slug}`} className="flex items-baseline justify-between gap-3 border-b border-line py-3 text-sm hover:text-forest">
                    {service.title}
                    <span aria-hidden="true">↗</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="bg-signal" aria-labelledby="project-cta">
          <div className="shell grid gap-7 py-12 md:py-16 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <div>
              <p className="label text-ink/70">{personal.name} / {personal.location}</p>
              <h2 id="project-cta" className="display mt-4 max-w-[18ch] text-3xl font-semibold md:text-5xl">{text.ctaHeading}</h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-ink/75">{text.ctaBody}</p>
            </div>
            <div className="lg:justify-self-end">
              <Link href={`/contact?service=${primaryContact}&from=${project.slug}`} className="inline-flex min-h-12 items-center bg-ink px-6 text-sm font-medium text-paper hover:bg-forest">
                Discuss a similar project
              </Link>
            </div>
          </div>
        </section>

        <nav className="border-b border-line" aria-label="Project navigation">
          <div className="shell py-10 md:py-12">
            <p className="label text-muted">{text.nextPrefix} / 0{((index + 1) % projects.length) + 1}</p>
            <Link href={`/work/${next.slug}`} className="link-arrow mt-4 flex items-end justify-between gap-6 border-b border-line pb-5 text-3xl font-semibold tracking-[-.05em] hover:border-forest hover:text-forest md:text-6xl">
              <span>{next.name}</span>
              <span className="text-xl" aria-hidden="true">→</span>
            </Link>
          </div>
        </nav>
      </article>
    </SiteShell>
  );
}
