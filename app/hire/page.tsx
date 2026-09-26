import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/portfolio/ContactForm";
import PageTracker from "@/components/portfolio/PageTracker";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  const { personal, seo, copy } = getSiteContent();
  return {
    title: "Start a Project",
    description: `Work with ${personal.name} on AI products, automation, integrations, SDKs, backend systems, and production software.`,
    alternates: { canonical: `${seo.url}/hire` },
    openGraph: { url: `${seo.url}/hire`, title: `Start a Project — ${copy.brand.name}`, description: copy.hire.body },
  };
}

export default function HirePage() {
  const { links, availability, copy, budgetOptions, personal } = getSiteContent();
  return <><PageTracker /><Nav copy={copy.nav} brand={copy.brand} calendly={links.calendly} availabilityLabel={availability.label} /><main id="main" className="pt-[72px]"><header className="section border-b border-line"><div className="shell"><p className="label mb-5 text-signal">{copy.hire.eyebrow}</p><h1 className="max-w-5xl text-balance text-5xl font-semibold leading-[.95] tracking-[-.065em] md:text-8xl">{copy.hire.heading}</h1><p className="mt-8 max-w-2xl text-xl leading-8 text-muted">{copy.hire.body}</p></div></header><section className="section border-b border-line bg-panel"><div className="shell grid gap-px bg-line md:grid-cols-2">{copy.hire.modes.map((mode, index) => <article key={mode.title} className="bg-ink p-7 md:p-10"><span className="label text-signal">0{index + 1}</span><h2 className="mt-8 text-3xl font-medium tracking-[-.04em]">{mode.title}</h2><p className="mt-4 max-w-lg leading-7 text-muted">{mode.body}</p></article>)}</div></section><ContactForm budgetOptions={[...budgetOptions]} email={personal.email} calendly={links.calendly} copy={copy.contact} /></main><Footer /></>;
}
