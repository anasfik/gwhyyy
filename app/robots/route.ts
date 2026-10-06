import { getSiteContentRecord } from "@/lib/site-content";

export const dynamic = "force-dynamic";

// Owner policy (2026-10-06): Content-Signal ai-train=yes — AI training is
// explicitly allowed and declared per crawler group alongside crawl rules.
// Custom directives (Content-Signal) are not expressible via MetadataRoute.Robots,
// so this route renders robots.txt directly.
function renderRobots(siteUrl: string): string {
  const rules = [
    "Allow: /",
    "Disallow: /dashboard/",
    "Disallow: /login",
    "Disallow: /api/",
    "Content-Signal: search=yes, ai-input=yes, ai-train=yes",
  ];
  return [
    "User-agent: *",
    ...rules,
    "",
    "User-agent: [OAI-SearchBot, ChatGPT-User, GPTBot, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, CCBot, Google-Extended, Applebot-Extended]",
    ...rules,
    "",
    `Sitemap: ${siteUrl}/sitemap.xml`,
    "",
  ].join("\n");
}

export async function GET(): Promise<Response> {
  const { content } = getSiteContentRecord();
  return new Response(renderRobots(content.seo.url), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
