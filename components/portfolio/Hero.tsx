import Link from "next/link";
import { getSiteContent } from "@/lib/site-content";

export default function Hero() {
  const { personal, availability, links, metrics, copy } = getSiteContent();
  return (
    <>
      <section className="relative min-h-[calc(100dvh-72px)] overflow-hidden border-b border-line" aria-labelledby="hero-title">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="shell relative grid min-h-[calc(100dvh-72px)] content-center gap-12 py-16 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <div className="enter">
            <p className="label mb-6 flex items-center gap-3 text-muted"><span className="h-px w-8 bg-signal" />{personal.name} / {personal.handle}</p>
            <h1 id="hero-title" className="max-w-[13ch] text-balance text-[clamp(3.4rem,8vw,7.6rem)] font-semibold leading-[.88] tracking-[-.075em]">
              {copy.hero.titleLead} <span className="text-signal">{copy.hero.titleAccent}</span> {copy.hero.titleTail}
            </h1>
            <p className="mt-8 max-w-xl text-pretty text-lg leading-7 text-muted md:text-xl">{personal.headline} {copy.hero.subline}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="#contact" className="bg-signal px-7 py-4 text-center text-sm font-semibold uppercase tracking-[.1em] text-ink transition-colors hover:bg-paper active:translate-y-px">{copy.hero.ctaPrimary}</Link>
              <a href={links.calendly} target="_blank" rel="noopener noreferrer" data-track="calendly_click" className="border border-line px-7 py-4 text-center text-sm font-semibold uppercase tracking-[.1em] transition-colors hover:border-paper hover:bg-raised">{copy.hero.ctaSecondary}</a>
              <Link href="#work" className="link-arrow px-4 py-4 text-center text-sm text-muted hover:text-paper">{copy.hero.ctaTertiary} <span className="inline-block">↓</span></Link>
            </div>
          </div>

          <aside className="enter enter-delay self-end border border-line bg-panel/90 p-5 md:p-7" aria-label={copy.hero.asideLabel}>
            <div className="flex items-center justify-between border-b border-line pb-4">
              <span className="label text-muted">{copy.hero.asideLabel}</span><span className="label text-signal">{copy.hero.asideBadge}</span>
            </div>
            <div className="my-8 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
              <div className="border border-line bg-ink p-4"><span className="label text-muted">{copy.hero.inputLabel}</span><strong className="mt-2 block text-sm">{copy.hero.inputValue}</strong></div>
              <span className="font-mono text-signal" aria-hidden="true">→</span>
              <div className="border border-signal/40 bg-signal/5 p-4"><span className="label text-signal">{copy.hero.outputLabel}</span><strong className="mt-2 block text-sm">{copy.hero.outputValue}</strong></div>
            </div>
            <ol className="grid grid-cols-3 gap-px bg-line text-center">
              {copy.hero.steps.map((item, index) => <li key={item} className="bg-panel px-2 py-4"><span className="label block text-muted">0{index + 1}</span><span className="mt-1 block text-xs">{item}</span></li>)}
            </ol>
            <div className="label mt-6 flex flex-wrap justify-between gap-3 text-muted"><span className="flex items-center gap-2"><i className="status-dot h-1.5 w-1.5 rounded-full bg-signal" />{availability.label}</span><span>{personal.location}</span></div>
          </aside>
        </div>
      </section>

      <section className="border-b border-line" aria-label="Verified proof">
        <div className="shell grid grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="border-line px-4 py-7 even:border-l lg:border-l lg:first:border-l-0 md:px-6">
              <strong className="block font-mono text-2xl tracking-[-.04em] text-paper md:text-3xl">{metric.value}</strong>
              <span className="mt-2 block text-xs leading-5 text-muted">{metric.label}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
