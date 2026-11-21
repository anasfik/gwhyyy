import type { SiteConfig } from "../config/site";

// Refresh only the shipped wording; keep dashboard edits and the stored document intact.
export function refreshPublicCopy(content: SiteConfig): SiteConfig {
  const updated: Record<string, string> = {
    "I build software. From complex integrations to complete products.": "AI-supercharged engineer who actually ships.",
    "I help startups and businesses turn ideas, technical challenges, and unfinished products into reliable, production-ready software.": "Quality work, built efficiently and shipped fast.",
    "Discuss your project": "Reach out",
    "What I can build for you": "Ready to work with you.",
    "Selected work": "What I made and work(ed) at",
    "Five products that show the range: a live API intelligence platform, a widely used open-source SDK, a production mobile product, a fintech SDK, and a protocol library.": "My own products, open-source work, and teams I’ve been part of.",
  };
  const replace = (value: string) => updated[value] ?? value;
  const { copy } = content;
  return {
    ...content,
    copy: {
      ...copy,
      hero: { ...copy.hero, title: replace(copy.hero.title), subline: replace(copy.hero.subline), ctaPrimary: replace(copy.hero.ctaPrimary) },
      nav: { ...copy.nav, primaryCta: replace(copy.nav.primaryCta) },
      footer: { ...copy.footer, linkContact: replace(copy.footer.linkContact) },
      contactPage: { ...copy.contactPage, heading: replace(copy.contactPage.heading) },
      services: { ...copy.services, heading: replace(copy.services.heading) },
      work: { ...copy.work, heading: replace(copy.work.heading), body: replace(copy.work.body) },
    },
  };
}
