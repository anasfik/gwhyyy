import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/layout/SiteShell";
import ContactForm from "@/components/site/ContactForm";
import { getProjects, getSiteContent } from "@/lib/site-content";

export const revalidate = 300;

export function generateMetadata(): Metadata {
  const { seo, copy } = getSiteContent();
  const url = `${seo.url}/contact`;
  return {
    title: "Discuss Your Project",
    description: copy.contactPage.body,
    alternates: { canonical: url },
    openGraph: { url, title: `Contact — ${copy.brand.name}`, description: copy.contactPage.body, images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
  };
}

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string; from?: string }> }) {
  const { service, from } = await searchParams;
  const content = getSiteContent();
  const { personal, availability, copy, links, seo, serviceOptions, projectStages, contactMethods } = content;
  const projects = getProjects(content);
  const sourceProject = from ? projects.find((project) => project.slug === from) : undefined;
  const defaultService = serviceOptions.some((option) => option.slug === service) ? service : "";
  const url = `${seo.url}/contact`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `${url}#page`,
        url,
        name: `Contact — ${personal.name}`,
        description: copy.contactPage.body,
        mainEntity: { "@id": `${seo.url}/#person` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: seo.url },
          { "@type": "ListItem", position: 2, name: "Contact", item: url },
        ],
      },
    ],
  };

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="border-b border-line">
        <div className="shell py-10 md:py-14">
          <p className="label text-muted">{copy.contact.eyebrow}</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <h1 className="display max-w-[16ch] text-[clamp(2.8rem,6vw,5rem)] font-semibold">{copy.contact.heading}</h1>
            <p className="max-w-xl leading-7 text-muted">{copy.contactPage.body}</p>
          </div>
        </div>
      </header>

      <div className="shell grid gap-12 py-10 md:py-14 lg:grid-cols-[1fr_360px] lg:gap-16">
        <section aria-labelledby="inquiry-title">
          <h2 id="inquiry-title" className="sr-only">Project inquiry</h2>
          <ContactForm
            copy={copy.contact}
            email={personal.email}
            services={serviceOptions}
            stages={projectStages}
            contactMethods={contactMethods}
            defaultService={defaultService}
            source={sourceProject?.slug}
            sourceName={sourceProject?.name}
          />
        </section>

        <aside className="space-y-8 lg:border-l lg:border-line lg:pl-8">
          <div>
            <h2 className="text-xl font-medium tracking-[-.03em]">{copy.contactPage.asideHeading}</h2>
            <ol className="mt-4 border-t border-line">
              {copy.contactPage.asideSteps.map((step, index) => (
                <li key={step} className="flex gap-4 border-b border-line py-4 text-sm leading-6">
                  <span className="label text-forest">0{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="label text-muted">{copy.contactPage.availabilityHeading}</h2>
            <p className="mt-3 text-sm leading-6">{availability.label}. {availability.engagement}</p>
          </div>

          <div>
            <h2 className="label text-muted">{copy.contactPage.emailHeading}</h2>
            <p className="mt-3 text-sm leading-6 text-muted">{copy.contactPage.emailBody}</p>
            <a href={links.email} className="mt-2 inline-block text-sm font-medium underline underline-offset-4">{personal.email}</a>
            {personal.phone && (
              <a href={`tel:${personal.phone}`} className="mt-2 block text-sm font-medium underline underline-offset-4">{personal.phone}</a>
            )}
            <a href={links.calendly} target="_blank" rel="noopener noreferrer" className="mt-3 block text-sm text-muted underline underline-offset-4 hover:text-ink">Or schedule a 30-minute call ↗</a>
          </div>

          <div className="border-t border-line pt-5">
            <p className="text-xs leading-5 text-muted">
              Your inquiry is stored so I can reply and manage the conversation. It is not sold or shared for marketing. See the <Link href="/privacy" className="underline underline-offset-2 hover:text-ink">privacy notice</Link>.
            </p>
          </div>
        </aside>
      </div>
    </SiteShell>
  );
}
