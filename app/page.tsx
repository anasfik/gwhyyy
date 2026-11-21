import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/layout/SiteShell";
import ProjectCard from "@/components/site/ProjectCard";
import Monogram from "@/components/site/Monogram";
import { getProjects, getSiteContent } from "@/lib/site-content";

export const revalidate = 300;

export function generateMetadata(): Metadata {
  const { seo, personal, copy } = getSiteContent();
  return {
    alternates: { canonical: seo.url },
    openGraph: {
      url: seo.url,
      title: seo.title,
      description: seo.description,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${personal.name} — ${personal.title}` }],
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description, images: ["/opengraph-image"] },
    other: { "gwhyyy:homepage": copy.brand.signature },
  };
}

export default function HomePage() {
  const content = getSiteContent();
  const { personal, availability, metrics, problems, process, capabilities, faq, copy, links } = content;
  const projects = getProjects(content);
  const flagship = projects[0];
  const rest = projects.slice(1);
  const flagshipImage = flagship.media?.[0];
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section className="border-b border-line" aria-labelledby="hero-title">
        <div className="shell grid gap-10 py-12 md:py-16 lg:grid-cols-[1.15fr_.85fr] lg:items-start lg:gap-14 lg:py-16">
          <div className="enter">
            <p className="label flex items-center gap-3 text-muted">
              <span className="h-px w-8 bg-forest" aria-hidden="true" />
              {copy.hero.eyebrow}
            </p>
            <h1 id="hero-title" className="display mt-6 max-w-[24ch] text-[clamp(2.5rem,4.4vw,3.6rem)] font-semibold">
              {copy.hero.title}
            </h1>
            <p className="prose-measure mt-7 max-w-[38ch] text-pretty text-lg leading-8 text-muted md:text-xl">{copy.hero.subline}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/contact" className="inline-flex min-h-12 items-center justify-center bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-forest active:translate-y-px">
                {copy.hero.ctaPrimary}
              </Link>
              <Link href="/work" className="link-arrow inline-flex min-h-12 items-center justify-center gap-2 px-2 text-sm font-medium sm:px-5">
                {copy.hero.ctaSecondary} <span aria-hidden="true">→</span>
              </Link>
            </div>
            <p className="mt-8 text-sm text-muted">
              <span className="inline-flex items-center gap-2">
                <i className="h-1.5 w-1.5 rounded-full bg-forest" aria-hidden="true" />
                {availability.label}
              </span>
              <span className="mx-3 text-line">/</span>
              {personal.location}
            </p>
          </div>

          <div className="enter enter-delay">
            <figure className="border border-line bg-white p-2 md:p-3">
              <div className="relative aspect-[1440/950] overflow-hidden border border-line bg-panel">
                {flagshipImage && (
                  <Image
                    src={flagshipImage.src}
                    alt={flagshipImage.alt}
                    fill
                    priority
                    sizes="(min-width: 1024px) 46vw, 100vw"
                    className="object-cover object-top"
                  />
                )}
              </div>
              <figcaption className="flex flex-wrap items-baseline justify-between gap-2 px-1 pb-1 pt-3 text-sm">
                <span>
                  <strong className="font-medium">{flagship.name}</strong>
                  <span className="text-muted"> — {flagship.category}</span>
                </span>
                <Link href={`/work/${flagship.slug}`} className="link-underline text-xs text-forest">
                  Read the case study
                </Link>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section aria-label="Verified public metrics" className="border-b border-line bg-panel">
        <div className="shell grid grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <div key={metric.label} className={`py-6 md:py-8 ${index % 2 === 1 ? "border-l border-line pl-4" : "pr-4"} lg:border-l lg:px-6 lg:first:border-l-0 lg:first:pl-0`}>
              <strong className="block font-mono text-2xl tracking-[-.04em] md:text-3xl">{metric.value}</strong>
              <span className="mt-2 block text-xs leading-5 text-muted">{metric.label}</span>
              {metric.source && <span className="mt-1 block text-[11px] leading-4 text-muted">{metric.source}</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="section border-b border-line" id="services" aria-labelledby="services-title">
        <div className="shell">
          <div className="max-w-3xl">
            <h2 id="services-title" className="display text-4xl font-semibold md:text-6xl">{copy.services.heading}</h2>
            <p className="mt-5 max-w-2xl leading-7 text-muted">{copy.services.body}</p>
          </div>
          <div className="mt-12 grid gap-x-8 md:grid-cols-12">
            {capabilities.map((service, index) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                data-track={`service_cta:${service.slug}`}
                className={`group border-t border-line py-6 transition-colors hover:border-forest md:py-7 ${
                  index === 0 ? "md:col-span-12 md:grid md:grid-cols-[1fr_1fr] md:items-start md:gap-10" : "md:col-span-4"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="label text-muted">0{index + 1}</span>
                    <span className="text-forest transition-transform group-hover:translate-x-1" aria-hidden="true">↗</span>
                  </div>
                  <h3 className={`mt-5 font-medium tracking-[-.04em] ${index === 0 ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"}`}>{service.title}</h3>
                  <p className="mt-3 max-w-md text-sm leading-6 text-muted">{service.summary}</p>
                </div>
                {index === 0 ? (
                  <ul className="mt-5 grid gap-2 text-sm md:mt-1 md:border-l md:border-line md:pl-8">
                    {service.outcomes.slice(0, 4).map((outcome) => (
                      <li key={outcome} className="flex gap-2.5">
                        <span className="text-forest" aria-hidden="true">→</span>
                        {outcome}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-5 text-xs leading-5 text-muted">{service.outcomes.slice(0, 3).join(" · ")}</p>
                )}
              </Link>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted">
            Every service links to a detailed explanation and a preselected inquiry.{" "}
            <Link href="/services" className="link-underline">Compare all services</Link>.
          </p>
        </div>
      </section>

      <section className="section border-b border-line" id="work" aria-labelledby="work-title">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 id="work-title" className="display text-4xl font-semibold md:text-6xl">{copy.work.heading}</h2>
              <p className="mt-5 max-w-xl leading-7 text-muted">{copy.work.body}</p>
            </div>
            <Link href="/work" className="link-arrow inline-flex items-center gap-2 border-b border-ink pb-1 text-sm font-medium">
              {copy.work.allLink} <span aria-hidden="true">→</span>
            </Link>
          </div>

          <article className="mt-12 grid gap-8 border-t border-line pt-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <Link href={`/work/${flagship.slug}`} className="group relative block aspect-[16/10] overflow-hidden border border-line bg-panel">
              {flagshipImage && (
                <Image
                  src={flagshipImage.src}
                  alt={flagshipImage.alt}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.015]"
                />
              )}
            </Link>
            <div>
              <p className="label text-muted">{flagship.category} / {flagship.status}</p>
              <h3 className="mt-4 text-4xl font-semibold tracking-[-.055em] md:text-6xl">
                <Link href={`/work/${flagship.slug}`} className="hover:text-forest">{flagship.name}</Link>
              </h3>
              <p className="mt-5 max-w-lg leading-7 text-muted">{flagship.summary}</p>
              <ul className="mt-7 space-y-2 border-t border-line pt-5 text-sm">
                {flagship.results?.slice(0, 3).map((result) => (
                  <li key={result} className="flex gap-3">
                    <span className="text-forest" aria-hidden="true">→</span>
                    {result}
                  </li>
                ))}
              </ul>
              <Link href={`/work/${flagship.slug}`} className="link-arrow mt-7 inline-flex items-center gap-2 text-sm font-medium">
                Read the Reqistry case study <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>

          <div className="mt-4">
            {rest.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index + 2} />
            ))}
          </div>
        </div>
      </section>

      <section className="section border-b border-line bg-panel" aria-labelledby="problems-title">
        <div className="shell grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h2 id="problems-title" className="display text-4xl font-semibold md:text-5xl">Does this sound familiar?</h2>
            <p className="mt-5 max-w-md leading-7 text-muted">
              You do not need a polished specification to start. Describe the problem in your own words.
            </p>
            <Link href="/contact" className="mt-7 inline-flex min-h-12 items-center bg-ink px-6 text-sm font-medium text-paper hover:bg-forest">
              Discuss your project
            </Link>
          </div>
          <ul className="border-t border-line">
            {problems.map((problem, index) => (
              <li key={problem} className="flex items-baseline gap-5 border-b border-line py-6">
                <span className="label text-muted">{String(index + 1).padStart(2, "0")}</span>
                <p className="text-xl leading-8 tracking-[-.02em] md:text-2xl">“{problem}”</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section border-b border-line" aria-labelledby="process-title">
        <div className="shell">
          <div className="max-w-2xl">
            <h2 id="process-title" className="display text-4xl font-semibold md:text-5xl">How working together looks</h2>
            <p className="mt-5 leading-7 text-muted">Four steps, no theatre. Scope and proposal are agreed before implementation starts.</p>
          </div>
          <ol className="mt-12 grid gap-8 border-t border-line pt-8 md:grid-cols-4 md:gap-6">
            {process.map((step) => (
              <li key={step.step} className="border-l border-line pl-5 md:border-l-0 md:border-t md:pl-0 md:pt-5">
                <span className="label text-forest">{step.step}</span>
                <h3 className="mt-4 text-xl font-medium tracking-[-.03em]">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section border-b border-line" aria-labelledby="about-title">
        <div className="shell grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-start lg:gap-16">
          <div className="flex items-start gap-5">
            <Monogram compact />
            <div>
              <p className="label text-muted">{personal.name}</p>
              <h2 id="about-title" className="mt-3 text-3xl font-semibold tracking-[-.05em] md:text-5xl">{copy.about.heading}</h2>
            </div>
          </div>
          <div>
            <p className="max-w-2xl text-lg leading-8 text-muted">{personal.bio}</p>
            <div className="mt-8 flex flex-wrap gap-4 text-sm font-medium">
              <Link href="/about" className="link-arrow inline-flex items-center gap-2 border-b border-ink pb-1">
                More about me <span aria-hidden="true">→</span>
              </Link>
              <Link href="/resume" className="link-arrow inline-flex items-center gap-2 border-b border-ink pb-1">
                Resume <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section border-b border-line bg-panel" aria-labelledby="faq-title">
        <div className="shell grid gap-12 lg:grid-cols-[.55fr_1fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h2 id="faq-title" className="display text-4xl font-semibold md:text-5xl">Questions before we start</h2>
            <p className="mt-5 max-w-sm leading-7 text-muted">
              Still unsure? Send the question with your inquiry. A short answer is better than a sales call.
            </p>
          </div>
          <div className="border-t border-line">
            {faq.map((item) => (
              <details key={item.question} className="group border-b border-line py-5">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium">
                  <span>{item.question}</span>
                  <span className="font-mono text-forest transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="max-w-2xl pb-2 pt-3 leading-7 text-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-signal" aria-labelledby="cta-title">
        <div className="shell grid gap-8 py-14 md:py-20 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <div>
            <p className="label text-ink/70">{availability.label}</p>
            <h2 id="cta-title" className="display mt-4 max-w-[16ch] text-4xl font-semibold md:text-6xl">Have a project worth discussing?</h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-sm text-sm leading-6 text-ink/75">
              Describe what you need. I will reply by email with questions or a suggested next step.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact" className="inline-flex min-h-12 items-center bg-ink px-6 text-sm font-medium text-paper hover:bg-forest">
                Discuss your project
              </Link>
              <a href={links.email} className="inline-flex min-h-12 items-center border border-ink/30 px-6 text-sm font-medium hover:bg-ink hover:text-paper">
                Email directly
              </a>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
