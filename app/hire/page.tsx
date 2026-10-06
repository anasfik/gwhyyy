import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/portfolio/ContactForm";
import PageTracker from "@/components/portfolio/PageTracker";
import ProcessSteps from "@/components/portfolio/ProcessSteps";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  const { personal, seo, copy } = getSiteContent();
  return {
    title: "Start a Project",
    description: `Work with ${personal.name} on AI products, automation, integrations, SDKs, backend systems, and production software.`,
    alternates: { canonical: `${seo.url}/hire` },
    openGraph: { url: `${seo.url}/hire`, title: `Start a Project — ${copy.brand.name}`, description: copy.hire.body, images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
  };
}

export default function HirePage() {
  const { links, availability, copy, budgetOptions, personal, seo, process } = getSiteContent();
  const hireUrl = `${seo.url}/hire`;
  const hireJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${hireUrl}#webpage`,
        url: hireUrl,
        name: `Start a Project — ${copy.brand.name}`,
        description: copy.hire.body,
        isPartOf: { "@id": `${seo.url}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: seo.url },
          { "@type": "ListItem", position: 2, name: "Start a Project", item: hireUrl },
        ],
      },
      {
        "@type": "Service",
        "@id": `${hireUrl}#service`,
        name: `AI product and automation engineering — ${personal.name}`,
        description: copy.hire.body,
        provider: { "@id": `${seo.url}/#person` },
        areaServed: copy.structured.areaServed,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Engagement models",
          itemListElement: copy.hire.modes.map((mode) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: mode.title, description: mode.body },
          })),
        },
      },
    ],
  };
  const hireFaq = [
    { q: "Which engagements do you take?", a: `${copy.hire.modes.map((mode) => mode.title).join(" · ")}. Details for each model are listed above.` },
    { q: "How does an engagement run?", a: `${process.map((step) => step.title).join(" → ")}. Every engagement follows the same operating model below.` },
    { q: "What budgets do projects fit?", a: `The brief form offers these bands: ${budgetOptions.join(", ")}.` },
    { q: "Where are you based, and how do we meet?", a: `Based in ${personal.location} — ${personal.workMode}. Intro calls run through the scheduling link next to the brief form.` },
  ];
  return <><PageTracker /><Nav copy={copy.nav} brand={copy.brand} calendly={links.calendly} availabilityLabel={availability.label} /><main id="main" className="pt-[72px]"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hireJsonLd) }} /><header className="section border-b border-line"><div className="shell"><p className="label mb-5 text-signal">{copy.hire.eyebrow}</p><h1 className="max-w-5xl text-balance text-5xl font-semibold leading-[.95] tracking-[-.065em] md:text-8xl">{copy.hire.heading}</h1><p className="mt-8 max-w-2xl text-xl leading-8 text-muted">{copy.hire.body}</p><div className="mt-10 flex flex-col gap-3 sm:flex-row"><a href="#contact" className="bg-signal px-6 py-4 text-center text-sm font-semibold uppercase tracking-[.1em] text-ink">{copy.nav.primaryCta}</a><a href={links.calendly} target="_blank" rel="noopener noreferrer" className="border border-line px-6 py-4 text-center text-sm uppercase tracking-[.1em]">{copy.footer.linkSchedule}</a></div></div></header><section className="section border-b border-line bg-panel"><div className="shell grid gap-px bg-line md:grid-cols-2">{copy.hire.modes.map((mode, index) => <article key={mode.title} className="bg-ink p-7 md:p-10"><span className="label text-signal">0{index + 1}</span><h2 className="mt-8 text-3xl font-medium tracking-[-.04em]">{mode.title}</h2><p className="mt-4 max-w-lg leading-7 text-muted">{mode.body}</p></article>)}</div></section><ProcessSteps /><section className="section border-b border-line" aria-labelledby="hire-faq"><div className="shell grid gap-14 lg:grid-cols-[.4fr_1fr]"><div><p className="label text-signal">FAQ</p><h2 id="hire-faq" className="mt-5 text-4xl font-semibold tracking-[-.05em]">Before you send the brief</h2></div><div>{hireFaq.map((item) => <details key={item.q} className="border-b border-line py-5"><summary className="cursor-pointer text-lg font-medium">{item.q}</summary><p className="mt-3 max-w-2xl leading-7 text-muted">{item.a}</p></details>)}</div></div></section><ContactForm budgetOptions={[...budgetOptions]} email={personal.email} calendly={links.calendly} copy={copy.contact} /></main><Footer /></>;
}
