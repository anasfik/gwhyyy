import siteConfig from "@/config/site.json";

// llms.txt — machine-readable site summary for AI assistants and aggregators.
// Spec: https://llmstxt.org
export function GET() {
  const visible = siteConfig.projects
    .filter((p) => p.visible)
    .sort((a, b) => a.order - b.order);

  const body = `# ${siteConfig.personal.name} (GWHYYY)

> ${siteConfig.seo.description}

${siteConfig.personal.name} is a Flutter developer and AI systems engineer based in ${siteConfig.personal.location}, available for contract work worldwide. Contact: ${siteConfig.personal.email} or book a call at ${siteConfig.links.calendly}.

## Services

${siteConfig.services.map((s) => `- **${s.title}**: ${s.description}`).join("\n")}

## Projects

${visible
  .map(
    (p) =>
      `- [${p.title}](${siteConfig.seo.url}/projects/${p.id}): ${p.description}`
  )
  .join("\n")}

## Pages

- [Home](${siteConfig.seo.url}): Full profile, experience, services, FAQ, contact form
- [Projects](${siteConfig.seo.url}/projects): All selected work with case studies
- [Hire Me](${siteConfig.seo.url}/hire): Pricing, engagement models, and FAQ

## Availability

${siteConfig.availability.available ? `Available: ${siteConfig.availability.label}. Response time under 24 hours via the contact form.` : "Currently unavailable for new projects."}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
