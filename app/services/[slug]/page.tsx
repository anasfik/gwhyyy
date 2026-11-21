import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteShell from "@/components/layout/SiteShell";
import { getProjects, getSiteContent } from "@/lib/site-content";

const SERVICE_SEO: Record<string, { title: string; h1: string; intro: string; inputs: string; output: string; done: string }> = {
  "product-engineering": {
    title: "Flutter App and SaaS Product Development",
    h1: "Flutter and web product development",
    intro: "Start with one releasable flow, not a full product plan.",
    inputs: "Requirements, prototype, or the current product and its biggest gap.",
    output: "A scoped first release with acceptance checks, dependencies, and a delivery sequence.",
    done: "The flow works in staging, the checks pass, and the handover is documented.",
  },
  "integrations-infrastructure": {
    title: "API Integration and Flutter SDK Development",
    h1: "API integrations and Flutter SDKs",
    intro: "Start with one integration or SDK surface that is blocking the product.",
    inputs: "API documentation, current stack, and the exact flow that must work.",
    output: "One integration covering authentication, data mapping, failure handling, tests, and docs.",
    done: "The end-to-end flow passes, retries are safe, and the integration can be maintained without me.",
  },
  "ai-engineering": {
    title: "AI Integration for Existing Apps",
    h1: "Add AI features to an existing product",
    intro: "Start with one workflow and representative examples, not a platform rewrite.",
    inputs: "One workflow, sample inputs and outputs, and the decisions that must stay human.",
    output: "A working feature with an evaluation set, human approval where needed, and a failure path.",
    done: "Output quality clears the agreed threshold and failures degrade safely.",
  },
  "existing-product-development": {
    title: "Flutter App Maintenance and Bug Fixes",
    h1: "Fix and extend an existing Flutter app",
    intro: "Start with the symptom and a reproducible case, not a rewrite.",
    inputs: "Symptoms, affected release, reproduction steps, and any crash or store reports.",
    output: "A diagnosis and the smallest fix that addresses the cause, with a regression test.",
    done: "The reproduction passes, related flows still work, and the release note is clear.",
  },
};

export const revalidate = 300;

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { capabilities, seo, copy } = getSiteContent();
  const service = capabilities.find((item) => item.slug === slug);
  if (!service) return {};
  const pageSeo = SERVICE_SEO[service.slug];
  const url = `${seo.url}/services/${service.slug}`;
  return {
    title: pageSeo?.title ?? `${service.title} services`,
    description: service.summary,
    alternates: { canonical: url },
    openGraph: { url, title: `${service.title} — ${copy.brand.name}`, description: service.summary, images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title: `${service.title} — ${copy.brand.name}`, description: service.summary, images: ["/opengraph-image"] },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = getSiteContent();
  const { capabilities, copy, seo, personal } = content;
  const service = capabilities.find((item) => item.slug === slug);
  if (!service) notFound();
  const pageSeo = SERVICE_SEO[service.slug];

  const projects = getProjects(content).filter((project) => service.relatedProjects.includes(project.slug));
  const url = `${seo.url}/services/${service.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: service.title,
        description: service.summary,
        url,
        provider: { "@id": `${seo.url}/#person` },
        areaServed: copy.structured.areaServed,
        serviceType: service.title,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: seo.url },
          { "@type": "ListItem", position: 2, name: "Services", item: `${seo.url}/services` },
          { "@type": "ListItem", position: 3, name: service.title, item: url },
        ],
      },
    ],
  };

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="border-b border-line">
        <div className="shell py-10 md:py-14">
          <nav aria-label="Breadcrumb" className="label text-muted">
            <Link href="/services" className="hover:text-ink">Services</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-ink">{service.title}</span>
          </nav>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
            <div>
              <h1 className="display max-w-[18ch] text-[clamp(2.6rem,6vw,5rem)] font-semibold">{pageSeo?.h1 ?? service.title}</h1>
              <p className="prose-measure mt-6 text-lg leading-8 text-muted">{service.summary}</p>
            </div>
            <div className="border-t border-line pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <p className="text-sm leading-6 text-muted">Start with this service selected, or describe the problem and I will suggest the right scope.</p>
              <Link href={`/contact?service=${service.slug}`} data-track={`service_inquiry:${service.slug}`} className="mt-5 inline-flex min-h-12 items-center bg-ink px-6 text-sm font-medium text-paper hover:bg-forest">
                Discuss your project
              </Link>
              <p className="mt-5 text-xs text-muted">Direct: <a href={`mailto:${personal.email}`} className="underline underline-offset-2 hover:text-ink">{personal.email}</a></p>
            </div>
          </div>
        </div>
      </header>

      <div className="shell grid gap-12 py-12 md:py-16 lg:grid-cols-[.45fr_1fr] lg:gap-16">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="label text-muted">Good fit if</p>
          <ul className="mt-4 border-t border-line">
            {service.fit.map((item) => (
              <li key={item} className="border-b border-line py-4 text-sm leading-6">{item}</li>
            ))}
          </ul>
          <p className="label mt-8 text-muted">Related work</p>
          <ul className="mt-4 grid gap-2 text-sm">
            {projects.map((project) => (
              <li key={project.slug}>
                <Link href={`/work/${project.slug}`} className="flex items-baseline justify-between gap-3 border-b border-line py-3 hover:text-forest">
                  {project.name}
                  <span aria-hidden="true">↗</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div>
          <div className="space-y-5">
            {service.detail.map((paragraph) => (
              <p key={paragraph} className="prose-measure text-lg leading-8">{paragraph}</p>
            ))}
          </div>

          {pageSeo && (
            <section className="mt-12 border-t border-line pt-8" aria-labelledby="start-title">
              <h2 id="start-title" className="text-2xl font-semibold tracking-[-.04em]">How we start</h2>
              <p className="prose-measure mt-4 text-lg leading-8">{pageSeo.intro}</p>
              <dl className="mt-6 grid gap-5 border-t border-line pt-5 sm:grid-cols-3">
                <div><dt className="label text-muted">You send</dt><dd className="mt-2 text-sm leading-6">{pageSeo.inputs}</dd></div>
                <div><dt className="label text-muted">First output</dt><dd className="mt-2 text-sm leading-6">{pageSeo.output}</dd></div>
                <div><dt className="label text-muted">Done when</dt><dd className="mt-2 text-sm leading-6">{pageSeo.done}</dd></div>
              </dl>
            </section>
          )}

          <section className="mt-12" aria-labelledby="includes-title">
            <h2 id="includes-title" className="text-2xl font-semibold tracking-[-.04em]">What this can include</h2>
            <ul className="mt-5 grid gap-x-8 gap-y-3 border-t border-line pt-5 sm:grid-cols-2">
              {service.outcomes.map((outcome) => (
                <li key={outcome} className="flex gap-3 text-sm leading-6">
                  <span className="text-forest" aria-hidden="true">→</span>
                  {outcome}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-12" aria-labelledby="examples-title">
            <h2 id="examples-title" className="text-2xl font-semibold tracking-[-.04em]">Example engagements</h2>
            <ul className="mt-5 border-t border-line">
              {service.examples.map((example) => (
                <li key={example} className="border-b border-line py-4 leading-7">{example}</li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-5 text-muted">Examples describe the shape of the work, not past client engagements.</p>
          </section>

          {projects.length > 0 && (
            <section className="mt-12" aria-labelledby="related-title">
              <h2 id="related-title" className="text-2xl font-semibold tracking-[-.04em]">Related case studies</h2>
              <div className="mt-5 grid gap-6 sm:grid-cols-2">
                {projects.map((project) => {
                  const image = project.media?.[0];
                  return (
                    <Link key={project.slug} href={`/work/${project.slug}`} className="group border-t border-line pt-4">
                      {image && (
                        <div className="relative aspect-[16/10] overflow-hidden border border-line bg-panel">
                          <Image src={image.src} alt={image.alt} fill sizes="(min-width: 640px) 30vw, 100vw" className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.015]" />
                        </div>
                      )}
                      <div className="mt-4 flex items-baseline justify-between gap-3">
                        <h3 className="text-lg font-medium">{project.name}</h3>
                        <span className="text-forest transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted">{project.signal}</p>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          <section className="mt-12 border border-line bg-panel p-6 md:p-8">
            <h2 className="text-2xl font-semibold tracking-[-.04em]">{copy.servicesPage.ctaHeading}</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted">This service is already selected in the form. Describe the problem; you can change the selection if another category fits better.</p>
            <Link href={`/contact?service=${service.slug}`} className="mt-6 inline-flex min-h-12 items-center bg-ink px-6 text-sm font-medium text-paper hover:bg-forest">
              Describe your project
            </Link>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
