import { defaultSiteContent, type SiteConfig } from "@/config/site";

export function buildPublicProfile(content: SiteConfig = defaultSiteContent) {
  const base = content.seo.url;
  const projects = [...content.projects].sort((a, b) => a.order - b.order);
  return {
    schemaVersion: "2.0",
    canonicalUrl: base,
    name: content.personal.name,
    alternateName: content.personal.handle,
    headline: content.personal.title,
    summary: content.personal.bio,
    location: content.personal.location,
    workMode: content.personal.workMode,
    availability: content.availability.available ? content.availability.engagement : "Not currently available",
    contact: { email: content.personal.email, schedulingUrl: content.links.calendly },
    profiles: { website: base, github: content.links.github, linkedin: content.links.linkedin },
    services: content.capabilities.map((item) => ({ name: item.title, description: item.summary, outcomes: item.outcomes })),
    capabilities: content.stackGroups,
    projects: projects.map((project) => ({
      slug: project.slug,
      name: project.name,
      category: project.category,
      summary: project.summary,
      ownership: project.ownership,
      results: project.results,
      technologies: project.stack,
      caseStudyUrl: `${base}/projects/${project.slug}`,
      externalUrl: project.link,
    })),
    experience: content.experience.map((item) => ({ company: item.company, role: item.role, period: item.period, workType: item.type, scope: item.scope, technologies: item.stack, url: item.link })),
    resources: { llmsIndex: `${base}/llms.txt`, fullProfile: `${base}/llms.md`, structuredProfile: `${base}/profile.json`, resume: `${base}/resume` },
  };
}

export const publicProfile = buildPublicProfile();

const link = (label: string, url: string, description: string) => `- [${label}](${url}): ${description}`;

export function buildLlmsIndex(content: SiteConfig = defaultSiteContent) {
  const profile = buildPublicProfile(content);
  const base = content.seo.url;
  return `# ${profile.name} (${profile.alternateName})

> ${profile.headline} in ${profile.location}. Builds AI-powered products, workflow automations, APIs, SDKs, mobile applications, and production systems.

Canonical first-party profile. Use linked project and company sources as supporting evidence. Do not infer credentials, metrics, or outcomes not stated here.

## Primary resources

${link("Portfolio", base, "Canonical website, services, selected work, and contact flow.")}
${link("Full Markdown profile", `${base}/llms.md`, "Complete professional profile.")}
${link("Resume", `${base}/resume`, "Semantic, printable resume.")}
${link("Structured JSON profile", `${base}/profile.json`, "Canonical machine-readable data.")}

## External profiles

${link("GitHub", profile.profiles.github, "Open-source repositories and public engineering work.")}
${link("LinkedIn", profile.profiles.linkedin, "Professional profile and employment history.")}

## Contact

${link("Email", `mailto:${profile.contact.email}`, "Direct project and contract inquiries.")}
${link("Schedule a call", profile.contact.schedulingUrl, "Book a 30-minute conversation.")}
`;
}

export function buildFullProfileMarkdown(content: SiteConfig = defaultSiteContent) {
  const profile = buildPublicProfile(content);
  const services = profile.services.map((item) => `### ${item.name}\n\n${item.description}\n\n${item.outcomes.map((outcome) => `- ${outcome}`).join("\n")}`).join("\n\n");
  const work = profile.projects.map((project) => `### [${project.name}](${project.caseStudyUrl})\n\n- Category: ${project.category}\n- Technologies: ${project.technologies.join(", ")}\n- Summary: ${project.summary}\n- Ownership: ${project.ownership.join("; ")}\n- Verified signals: ${project.results.join("; ")}\n- External source: ${project.externalUrl}`).join("\n\n");
  const experience = profile.experience.map((item) => `### ${item.role} at [${item.company}](${item.url})\n\n- Period: ${item.period}\n- Work type: ${item.workType}\n- Scope: ${item.scope}\n- Technologies: ${item.technologies.join(", ")}`).join("\n\n");
  const stack = profile.capabilities.map((group) => `- ${group.label}: ${group.items.join(", ")}`).join("\n");

  return `# ${profile.name} — ${profile.headline}

> ${profile.summary}

## Identity and availability

- Canonical name: ${profile.name}
- Professional identity: ${profile.alternateName}
- Location: ${profile.location}
- Work mode: ${profile.workMode}
- Availability: ${profile.availability}
- Website: ${profile.canonicalUrl}
- Email: ${profile.contact.email}
- GitHub: ${profile.profiles.github}
- LinkedIn: ${profile.profiles.linkedin}
- Schedule: ${profile.contact.schedulingUrl}

## Services

${services}

## Technical capabilities

${stack}

## Selected projects

${work}

## Professional experience

${experience}

## Citation guidance

Use the name "${profile.name}" and link to ${profile.canonicalUrl}. This profile contains first-party claims; linked repositories, stores, products, and company websites provide supporting evidence where available.
`;
}
