import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/layout/SiteShell";
import { getSiteContent } from "@/lib/site-content";

export const revalidate = 300;

export function generateMetadata(): Metadata {
  const { seo, copy } = getSiteContent();
  const url = `${seo.url}/services`;
  return {
    title: "Software Engineering Services",
    description: copy.servicesPage.body,
    alternates: { canonical: url },
    openGraph: { url, title: `Services — ${copy.brand.name}`, description: copy.servicesPage.body, images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
  };
}

export default function ServicesPage() {
  const { capabilities, copy, seo, personal } = getSiteContent();
  const url = `${seo.url}/services`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#page`,
        url,
        name: `Services — ${personal.name}`,
        description: copy.servicesPage.body,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: capabilities.length,
          itemListElement: capabilities.map((service, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: { "@type": "Service", name: service.title, description: service.summary, url: `${url}/${service.slug}` },
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: seo.url },
          { "@type": "ListItem", position: 2, name: "Services", item: url },
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
            <p className="label text-muted">Services / {String(capabilities.length).padStart(2, "0")}</p>
            <h1 className="display mt-5 max-w-[15ch] text-[clamp(3rem,7vw,5.5rem)] font-semibold">{copy.servicesPage.heading}</h1>
          </div>
          <p className="max-w-xl text-lg leading-8 text-muted">{copy.servicesPage.body}</p>
        </div>
      </header>

      <div className="shell">
        {capabilities.map((service, index) => (
          <section key={service.slug} className="grid gap-7 border-b border-line py-10 md:py-14 lg:grid-cols-[.35fr_1fr] lg:gap-14" aria-labelledby={`${service.slug}-title`}>
            <div>
              <span className="label text-muted">{String(index + 1).padStart(2, "0")}</span>
              <p className="mt-4 text-sm leading-6 text-muted">{service.fit[0]}</p>
            </div>
            <div>
              <h2 id={`${service.slug}-title`} className="text-3xl font-semibold tracking-[-.05em] md:text-4xl">
                <Link href={`/services/${service.slug}`} className="hover:text-forest">{service.title}</Link>
              </h2>
              <p className="prose-measure mt-4 leading-7 text-muted">{service.summary}</p>
              <ul className="mt-6 grid gap-2 text-sm sm:grid-cols-2">
                {service.outcomes.slice(0, 4).map((outcome) => (
                  <li key={outcome} className="flex gap-2.5">
                    <span className="text-forest" aria-hidden="true">→</span>
                    {outcome}
                  </li>
                ))}
              </ul>
              <Link href={`/services/${service.slug}`} data-track={`service_cta:${service.slug}`} className="link-arrow mt-7 inline-flex items-center gap-2 border-b border-ink pb-1 text-sm font-medium">
                Explore this service <span aria-hidden="true">→</span>
              </Link>
            </div>
          </section>
        ))}
      </div>

      <section className="bg-signal">
        <div className="shell flex flex-col gap-7 py-12 md:flex-row md:items-end md:justify-between md:py-16">
          <div>
            <h2 className="display max-w-[18ch] text-3xl font-semibold md:text-5xl">{copy.servicesPage.ctaHeading}</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-ink/75">{copy.servicesPage.ctaBody}</p>
          </div>
          <Link href="/contact?service=other" className="inline-flex min-h-12 shrink-0 items-center bg-ink px-6 text-sm font-medium text-paper hover:bg-forest">
            {copy.nav.primaryCta}
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
