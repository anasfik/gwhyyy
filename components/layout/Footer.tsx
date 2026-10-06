import Link from "next/link";
import { getSiteContent } from "@/lib/site-content";

export default function Footer() {
  const { personal, links, copy } = getSiteContent();
  const deployDate = new Date().toISOString().slice(0, 10).replaceAll("-", ".");

  return (
    <footer className="border-t border-line bg-panel py-12">
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="text-3xl font-semibold tracking-[-.05em]">{copy.brand.name}</p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-muted">{personal.name}. {copy.footer.blurb}</p>
          </div>
          <div className="grid content-start gap-3 text-sm">
            <p className="label mb-2 text-muted">{copy.footer.navigateHeading}</p>
            <Link href="/projects">{copy.footer.linkProjects}</Link><Link href="/resume">{copy.footer.linkResume}</Link><Link href="/#services">{copy.footer.linkServices}</Link><Link href="/#contact">{copy.footer.linkContact}</Link><Link href="/privacy/sandouk">Privacy</Link>
          </div>
          <div className="grid content-start gap-3 text-sm">
            <p className="label mb-2 text-muted">{copy.footer.connectHeading}</p>
            <a href={links.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href={links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={links.email}>{copy.footer.linkEmail}</a>
            <a href={links.calendly} target="_blank" rel="noopener noreferrer">{copy.footer.linkSchedule}</a>
          </div>
        </div>
        <div className="label mt-12 flex flex-col justify-between gap-3 border-t border-line pt-6 text-muted sm:flex-row">
          <span>© {new Date().getFullYear()} {personal.name}</span>
          <span>{personal.location} / {personal.workMode}</span>
          <span>LAST_DEPLOY: {deployDate}</span>
        </div>
      </div>
    </footer>
  );
}
