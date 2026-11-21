import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/layout/SiteShell";
import Monogram from "@/components/site/Monogram";
import { getProjects, getSiteContent } from "@/lib/site-content";

export const revalidate = 300;

export function generateMetadata(): Metadata {
  const { seo, personal, copy } = getSiteContent();
  const url = `${seo.url}/about`;
  return {
    title: `About ${personal.name}`,
    description: copy.about.body,
    alternates: { canonical: url },
    openGraph: { url, title: `About ${personal.name}`, description: copy.about.body, images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
  };
}

export default function AboutPage() {
  const content = getSiteContent();
  const { personal, availability, copy, experience, stackGroups, links, seo } = content;
  const projects = getProjects(content);
  const openSource = projects.filter((project) => ["flutterguard", "dart-openai", "dart-nostr"].includes(project.slug));
  const url = `${seo.url}/about`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${url}#page`,
    url,
    name: `About ${personal.name}`,
    description: copy.about.body,
    mainEntity: { "@id": `${seo.url}/#person` },
    isPartOf: { "@id": `${seo.url}/#website` },
  };

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="border-b border-line">
        <div className="shell grid gap-10 py-12 md:py-16 lg:grid-cols-[.7fr_1fr] lg:items-start">
          <div>
            <Monogram />
            <p className="mt-6 max-w-[17rem] text-sm leading-6 text-muted">{personal.location}. {availability.label}.</p>
          </div>
          <div>
            <p className="label text-muted">{personal.name} / {personal.handle}</p>
            <h1 className="display mt-4 max-w-[15ch] text-[clamp(2.8rem,6vw,5rem)] font-semibold">{copy.about.heading}</h1>
            <p className="prose-measure mt-6 text-lg leading-8 text-muted">{copy.about.body}</p>
            <p className="prose-measure mt-4 leading-7 text-muted">{personal.bio}</p>
          </div>
        </div>
      </header>

      <section className="border-b border-line" aria-labelledby="principles-title">
        <div className="shell py-10 md:py-14">
          <h2 id="principles-title" className="text-2xl font-semibold tracking-[-.045em] md:text-3xl">{copy.about.principlesHeading}</h2>
          <div className="mt-8 grid gap-8 border-t border-line pt-8 md:grid-cols-3">
            {copy.about.principles.map((principle, index) => (
              <div key={principle.title}>
                <span className="label text-forest">0{index + 1}</span>
                <h3 className="mt-4 text-xl font-medium tracking-[-.03em]">{principle.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{principle.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line" aria-labelledby="experience-title">
        <div className="shell py-10 md:py-14">
          <h2 id="experience-title" className="text-2xl font-semibold tracking-[-.045em] md:text-3xl">{copy.resume.sectionExperience}</h2>
          <div className="mt-8 border-t border-line">
            {experience.map((item) => (
              <article key={item.id} className="grid gap-5 border-b border-line py-7 md:grid-cols-[.8fr_1fr] md:gap-12">
                <div>
                  <h3 className="text-xl font-medium">{item.company}</h3>
                  <p className="mt-1 text-sm text-muted">{item.role}</p>
                  <p className="label mt-4 text-muted">{item.period} / {item.type}</p>
                </div>
                <div>
                  <p className="leading-7 text-muted">{item.scope}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {item.stack.map((tech) => (
                      <li key={tech} className="border border-line px-2.5 py-1 font-mono text-[11px] text-muted">{tech}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-5 text-sm text-muted">
            Full history and printable version: <Link href="/resume" className="link-underline text-ink">resume</Link>.
          </p>
        </div>
      </section>

      <section className="border-b border-line bg-panel" aria-labelledby="oss-title">
        <div className="shell py-10 md:py-14">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <h2 id="oss-title" className="text-2xl font-semibold tracking-[-.045em] md:text-3xl">Open source</h2>
            <a href={links.github} target="_blank" rel="noopener noreferrer" className="link-arrow text-sm font-medium">GitHub <span aria-hidden="true">↗</span></a>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {openSource.map((project) => (
              <Link key={project.slug} href={`/work/${project.slug}`} className="group border-t border-line pt-5">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-2xl font-medium tracking-[-.04em]">{project.name}</h3>
                  <span className="text-forest transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">{project.summary}</p>
                <p className="mt-4 text-xs text-forest">{project.signal}</p>
              </Link>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-sm leading-6 text-muted">
            I also built and operate <Link href="/work/reqistry" className="link-underline text-ink">Reqistry</Link>, an API intelligence platform used on the web and on Android.
          </p>
        </div>
      </section>

      <section className="border-b border-line" aria-labelledby="stack-title">
        <div className="shell grid gap-8 py-10 md:py-14 lg:grid-cols-[.45fr_1fr] lg:gap-16">
          <h2 id="stack-title" className="text-2xl font-semibold tracking-[-.045em] md:text-3xl">{copy.resume.sectionStack}</h2>
          <div className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
            {stackGroups.map((group) => (
              <div key={group.label} className="border-t border-line pt-3">
                <h3 className="label text-muted">{group.label}</h3>
                <p className="mt-2 text-sm leading-6">{group.items.join(", ")}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-signal">
        <div className="shell flex flex-col gap-6 py-12 md:flex-row md:items-end md:justify-between md:py-16">
          <div>
            <h2 className="display max-w-[16ch] text-3xl font-semibold md:text-5xl">{copy.about.ctaHeading}</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-ink/75">{copy.about.ctaBody}</p>
          </div>
            <Link href="/contact" className="inline-flex min-h-12 shrink-0 items-center bg-ink px-6 text-sm font-medium text-paper hover:bg-forest">{copy.nav.primaryCta}</Link>
        </div>
      </section>
    </SiteShell>
  );
}
