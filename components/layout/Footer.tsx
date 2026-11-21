import Link from "next/link";
import { getSiteContent } from "@/lib/site-content";

export default function Footer() {
  const { personal, links, copy } = getSiteContent();

  return (
    <footer className="border-t border-line bg-panel">
      <div className="shell py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="text-4xl font-semibold tracking-[-.06em]">{copy.brand.name}</p>
            <p className="mt-5 max-w-sm text-sm leading-6 text-muted">{copy.footer.blurb}</p>
            <p className="label mt-8 flex items-center gap-2 text-muted">
              <i className="h-1.5 w-1.5 rounded-full bg-forest" aria-hidden="true" />
              {personal.location} / {personal.workMode}
            </p>
          </div>
          <div className="grid content-start gap-3 text-sm">
            <p className="label mb-2 text-muted">{copy.footer.navigateHeading}</p>
            <Link href="/services" className="hover:text-forest">{copy.footer.linkServices}</Link>
            <Link href="/work" className="hover:text-forest">{copy.footer.linkWork}</Link>
            <Link href="/about" className="hover:text-forest">{copy.footer.linkAbout}</Link>
            <Link href="/resume" className="hover:text-forest">{copy.footer.linkResume}</Link>
            <Link href="/contact" className="hover:text-forest">{copy.footer.linkContact}</Link>
            <Link href="/privacy" className="hover:text-forest">{copy.footer.linkPrivacy}</Link>
          </div>
          <div className="grid content-start gap-3 text-sm">
            <p className="label mb-2 text-muted">{copy.footer.connectHeading}</p>
            <a href={links.github} target="_blank" rel="noopener noreferrer" className="hover:text-forest">GitHub</a>
            <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-forest">LinkedIn</a>
            <a href={links.email} className="hover:text-forest">{copy.footer.linkEmail}</a>
            {personal.phone && <a href={`tel:${personal.phone}`} className="hover:text-forest">{personal.phone}</a>}
            <a href={links.calendly} target="_blank" rel="noopener noreferrer" className="hover:text-forest">{copy.footer.linkSchedule}</a>
          </div>
        </div>
        <div className="label mt-14 flex flex-col justify-between gap-3 border-t border-line pt-6 text-muted sm:flex-row">
          <span>© {new Date().getFullYear()} {personal.name}</span>
          <span>Built and maintained by {personal.handle}</span>
        </div>
      </div>
    </footer>
  );
}
