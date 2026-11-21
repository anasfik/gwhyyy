import Link from "next/link";
import { getSiteContent } from "@/lib/site-content";

export default function Footer() {
  const { personal, links, copy } = getSiteContent();

  return (
    <footer className="border-t border-line bg-panel">
      <div className="shell flex flex-col justify-between gap-4 py-8 text-sm md:flex-row md:items-center">
        <span className="text-muted">© {new Date().getFullYear()} {personal.name}</span>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6">
          <a href={links.email} className="inline-flex min-h-11 items-center hover:text-forest">Email</a>
          {personal.phone && <a href={`tel:${personal.phone}`} className="inline-flex min-h-11 items-center hover:text-forest">{personal.phone}</a>}
          <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center hover:text-forest">LinkedIn <span aria-hidden="true">↗</span></a>
          <Link href="/privacy" className="inline-flex min-h-11 items-center hover:text-forest">{copy.footer.linkPrivacy}</Link>
        </nav>
      </div>
    </footer>
  );
}
