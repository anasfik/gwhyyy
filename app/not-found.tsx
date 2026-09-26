import Link from "next/link";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import { getSiteContent } from "@/lib/site-content";

export default function NotFound() {
  const { links, availability, copy } = getSiteContent();
  const text = copy.notFound;
  return <><Nav copy={copy.nav} brand={copy.brand} calendly={links.calendly} availabilityLabel={availability.label} /><main id="main" className="flex min-h-[calc(100dvh-72px)] items-center pt-[72px]"><div className="shell py-20"><p className="label text-signal">{text.label}</p><h1 className="mt-6 max-w-4xl text-6xl font-semibold leading-[.9] tracking-[-.07em] md:text-9xl">{text.heading}</h1><p className="mt-8 max-w-lg text-lg leading-8 text-muted">{text.body}</p><div className="mt-10 flex flex-wrap gap-3"><Link href="/" className="bg-signal px-6 py-4 text-sm font-semibold uppercase tracking-wider text-ink">{text.homeCta}</Link><Link href="/projects" className="border border-line px-6 py-4 text-sm uppercase tracking-wider">{text.projectsCta}</Link></div></div></main><Footer /></>;
}
