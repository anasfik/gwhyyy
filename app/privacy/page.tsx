import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/layout/SiteShell";
import { getSiteContent } from "@/lib/site-content";

export const revalidate = 300;

export function generateMetadata(): Metadata {
  const { seo, copy } = getSiteContent();
  const url = `${seo.url}/privacy`;
  return {
    title: "Privacy notice",
    description: copy.privacy.body,
    alternates: { canonical: url },
    openGraph: { url, title: `Privacy — ${copy.brand.name}`, description: copy.privacy.body },
    robots: { index: true, follow: true },
  };
}

export default function PrivacyPage() {
  const { personal, copy } = getSiteContent();

  return (
    <SiteShell>
      <header className="border-b border-line">
        <div className="shell py-10 md:py-14">
          <p className="label text-muted">Last updated 28 October 2026</p>
          <h1 className="display mt-4 text-[clamp(2.8rem,6vw,4.5rem)] font-semibold">{copy.privacy.heading}</h1>
          <p className="prose-measure mt-5 text-lg leading-8 text-muted">{copy.privacy.body}</p>
        </div>
      </header>

      <article className="shell grid gap-10 py-10 md:py-14 lg:grid-cols-[.35fr_1fr] lg:gap-16">
        <nav aria-label="Privacy contents" className="hidden lg:block">
          <p className="label text-muted">Contents</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="#inquiry" className="hover:text-forest">Inquiry data</a></li>
            <li><a href="#analytics" className="hover:text-forest">Analytics</a></li>
            <li><a href="#email" className="hover:text-forest">Email delivery</a></li>
            <li><a href="#retention" className="hover:text-forest">Retention and deletion</a></li>
            <li><a href="#rights" className="hover:text-forest">Your rights</a></li>
            <li><a href="#sandouk" className="hover:text-forest">Sandouk app</a></li>
          </ul>
        </nav>

        <div className="prose-measure space-y-10">
          <section id="inquiry" aria-labelledby="inquiry-title">
            <h2 id="inquiry-title" className="text-2xl font-semibold tracking-[-.04em]">Inquiry data</h2>
            <p className="mt-4 leading-7 text-muted">
              When you submit the inquiry form, I collect your name, email address, selected service, project stage, and project description. You may optionally provide a company or project name, company website, desired start timeframe, preferred contact method, and additional context.
            </p>
            <p className="mt-4 leading-7 text-muted">
              I also record the submission time, the referring page, a randomly generated submission identifier, and a truncated hash of your IP address for rate limiting and duplicate prevention. I do not store the raw IP address with the inquiry.
            </p>
            <p className="mt-4 leading-7 text-muted">
              This information is used only to review and respond to your inquiry and to manage the resulting conversation. The legal basis is my legitimate interest in responding to a business inquiry you initiated.
            </p>
          </section>

          <section id="analytics" aria-labelledby="analytics-title">
            <h2 id="analytics-title" className="text-2xl font-semibold tracking-[-.04em]">Analytics</h2>
            <p className="mt-4 leading-7 text-muted">
              The site records first-party page views and non-sensitive events such as CTA clicks, service page views, inquiry starts, and confirmed inquiry writes. These records do not include names, email addresses, company names, or project descriptions.
            </p>
            <p className="mt-4 leading-7 text-muted">
              If your browser sends Do Not Track, client-side event tracking is skipped. The public site does not set advertising or analytics cookies. The admin login uses a session cookie and is not part of the public analytics stream.
            </p>
          </section>

          <section id="email" aria-labelledby="email-title">
            <h2 id="email-title" className="text-2xl font-semibold tracking-[-.04em]">Email delivery</h2>
            <p className="mt-4 leading-7 text-muted">
              If email notification is configured, the inquiry is sent through a transactional email provider (Resend) to my work inbox. The provider processes the message content for delivery. If it is not configured, the inquiry remains stored in the site database and is visible only in the admin dashboard.
            </p>
            <p className="mt-4 leading-7 text-muted">
              Scheduling links point to Calendly. Calendly receives data only if you choose to open the link and use its booking flow.
            </p>
          </section>

          <section id="retention" aria-labelledby="retention-title">
            <h2 id="retention-title" className="text-2xl font-semibold tracking-[-.04em]">Retention and deletion</h2>
            <p className="mt-4 leading-7 text-muted">
              Inquiries are kept while they are useful for the conversation and any resulting work, then deleted or archived. Page-view and event records are kept for aggregate reporting and pruned from the dashboard’s reporting window. You can ask me to delete an inquiry at any time.
            </p>
          </section>

          <section id="rights" aria-labelledby="rights-title">
            <h2 id="rights-title" className="text-2xl font-semibold tracking-[-.04em]">Your rights</h2>
            <p className="mt-4 leading-7 text-muted">
              You can ask what inquiry data I hold about you, request a correction, or request deletion. Email <a href={`mailto:${personal.email}`} className="underline underline-offset-2 hover:text-ink">{personal.email}</a> with enough information to identify the inquiry. I will respond within a reasonable period.
            </p>
            <p className="mt-4 leading-7 text-muted">
              If you believe the data is being handled unlawfully, you may contact the relevant data protection authority. I do not sell personal data or share it for advertising.
            </p>
          </section>

          <section id="sandouk" aria-labelledby="sandouk-title">
            <h2 id="sandouk-title" className="text-2xl font-semibold tracking-[-.04em]">Sandouk app</h2>
            <p className="mt-4 leading-7 text-muted">
              The Sandouk mobile application is a separate product with its own privacy policy. It is not covered by this notice. The Sandouk policy is available at <Link href="/privacy/sandouk" className="underline underline-offset-2 hover:text-ink">/privacy/sandouk</Link>.
            </p>
          </section>

          <section aria-labelledby="contact-title">
            <h2 id="contact-title" className="text-2xl font-semibold tracking-[-.04em]">Contact</h2>
            <p className="mt-4 leading-7 text-muted">
              {personal.name}, {personal.location}. Email: <a href={`mailto:${personal.email}`} className="underline underline-offset-2 hover:text-ink">{personal.email}</a>.
            </p>
          </section>
        </div>
      </article>
    </SiteShell>
  );
}
