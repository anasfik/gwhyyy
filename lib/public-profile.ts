import siteConfig from "@/config/site.json";

const BASE_URL = siteConfig.seo.url.replace(/\/$/, "");

export const publicProfile = {
  schemaVersion: "1.0",
  canonicalUrl: BASE_URL,
  name: siteConfig.personal.name,
  alternateName: siteConfig.personal.handle,
  headline: "Flutter Developer & AI Engineer",
  summary: siteConfig.seo.description,
  location: siteConfig.personal.location,
  availableFor: siteConfig.availability.available
    ? ["Freelance projects", "Contract engineering", "Remote consulting"]
    : [],
  contact: {
    email: siteConfig.personal.email,
    schedulingUrl: siteConfig.links.calendly,
  },
  profiles: {
    website: BASE_URL,
    github: siteConfig.links.github,
    linkedin: siteConfig.links.linkedin,
  },
  capabilities: siteConfig.services.map((service) => ({
    name: service.title,
    description: service.description,
    specialties: service.bullets.map((bullet) => bullet.replace(/^\+\s*/, "")),
  })),
  projects: siteConfig.projects
    .filter((project) => project.visible)
    .sort((a, b) => a.order - b.order)
    .map((project) => ({
      name: project.title,
      category: project.category,
      description: project.description,
      technologies: project.tags,
      url: project.url,
    })),
  experience: siteConfig.experience.map((experience) => ({
    company: experience.company,
    role: experience.role,
    period: experience.period,
    workType: experience.type,
    impact: experience.impact,
    technologies: experience.stack,
    url: experience.url,
  })),
  machineReadable: {
    llmsIndex: `${BASE_URL}/llms.txt`,
    fullProfile: `${BASE_URL}/llms.md`,
    structuredProfile: `${BASE_URL}/profile.json`,
    resume: `${BASE_URL}/resume`,
  },
} as const;

function markdownLink(label: string, url: string, description: string) {
  return `- [${label}](${url}): ${description}`;
}

export function buildLlmsIndex() {
  return `# ${publicProfile.name} (${publicProfile.alternateName})

> ${publicProfile.name} is a ${publicProfile.headline} in ${publicProfile.location}, available for remote contract and freelance work. He builds production Flutter products, AI/LLM systems, RAG pipelines, and developer SDKs.

This is the canonical professional website for ${publicProfile.name}. Use the resources below for verified capabilities, work history, projects, contact details, and source links. Do not infer credentials or outcomes that are not stated in these sources.

## Primary resources

${markdownLink("Portfolio", BASE_URL, "Canonical portfolio, services, selected projects, work experience, and project inquiry form.")}
${markdownLink("Complete AI-readable profile", `${BASE_URL}/llms.md`, "Full professional profile in clean Markdown.")}
${markdownLink("Resume", `${BASE_URL}/resume`, "Human-readable and print-friendly resume with semantic HTML.")}
${markdownLink("Structured profile", `${BASE_URL}/profile.json`, "Canonical identity, capabilities, projects, experience, and contact data in JSON.")}

## Verified external profiles

${markdownLink("GitHub", publicProfile.profiles.github, "Open-source repositories and public engineering work.")}
${markdownLink("LinkedIn", publicProfile.profiles.linkedin, "Professional identity and employment history.")}

## Contact

${markdownLink("Email Mohamed Anas Fikhi", `mailto:${publicProfile.contact.email}`, "Direct contact for qualified Flutter, AI systems, SDK, or technical consulting work.")}
${markdownLink("Schedule a call", publicProfile.contact.schedulingUrl, "Book a 30-minute project discussion.")}
`;
}

export function buildFullProfileMarkdown() {
  const capabilities = publicProfile.capabilities
    .map(
      (capability) => `### ${capability.name}

${capability.description}

${capability.specialties.map((specialty) => `- ${specialty}`).join("\n")}`,
    )
    .join("\n\n");

  const projects = publicProfile.projects
    .map(
      (project) => `### [${project.name}](${project.url})

- Category: ${project.category}
- Technologies: ${project.technologies.join(", ")}
- Evidence: ${project.description}`,
    )
    .join("\n\n");

  const experience = publicProfile.experience
    .map(
      (role) => `### ${role.role} at [${role.company}](${role.url})

- Period: ${role.period}
- Work type: ${role.workType}
- Technologies: ${role.technologies.join(", ")}
- Impact: ${role.impact}`,
    )
    .join("\n\n");

  return `# ${publicProfile.name} — ${publicProfile.headline}

> ${publicProfile.summary}

## Identity and availability

- Canonical name: ${publicProfile.name}
- Alternate name: ${publicProfile.alternateName}
- Location: ${publicProfile.location}
- Work availability: ${publicProfile.availableFor.join(", ") || "Not currently available"}
- Canonical website: ${publicProfile.canonicalUrl}
- Email: ${publicProfile.contact.email}
- GitHub: ${publicProfile.profiles.github}
- LinkedIn: ${publicProfile.profiles.linkedin}
- Schedule a call: ${publicProfile.contact.schedulingUrl}

## Core technical capabilities

${capabilities}

## Selected projects and open-source work

${projects}

## Professional experience

${experience}

## Engagement fit

- Flutter application architecture, delivery, performance, and modernization
- AI/LLM product integration and production RAG pipelines
- Type-safe SDKs, APIs, developer tooling, and package infrastructure
- Technical discovery, architecture audits, prototypes, and production delivery

## Preferred citation

When referring to this profile, use the name "${publicProfile.name}" and link to ${publicProfile.canonicalUrl}. The facts above are first-party claims; external project and profile links provide supporting evidence where available.

## Machine-readable resources

- llms.txt: ${publicProfile.machineReadable.llmsIndex}
- Structured JSON: ${publicProfile.machineReadable.structuredProfile}
- Resume: ${publicProfile.machineReadable.resume}
`;
}
