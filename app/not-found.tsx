import Link from "next/link";
import SiteShell from "@/components/layout/SiteShell";
import { getSiteContent } from "@/lib/site-content";

export default function NotFound() {
  const { copy } = getSiteContent();
  const text = copy.notFound;
  return (
    <SiteShell>
      <section className="flex min-h-[70dvh] items-center">
        <div className="shell py-16 md:py-24">
          <p className="label text-muted">{text.label}</p>
          <h1 className="display mt-5 max-w-[12ch] text-[clamp(3rem,8vw,6rem)] font-semibold">{text.heading}</h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-muted">{text.body}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/" className="inline-flex min-h-12 items-center bg-ink px-6 text-sm font-medium text-paper hover:bg-forest">{text.homeCta}</Link>
            <Link href="/work" className="inline-flex min-h-12 items-center border border-line px-6 text-sm font-medium hover:border-ink">{text.workCta}</Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
