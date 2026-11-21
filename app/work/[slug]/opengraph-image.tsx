import { ImageResponse } from "next/og";
import { getProjects, getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjects(getSiteContent()).find((item) => item.slug === slug);
  return { title: project ? `${project.name} — ${project.category}` : "GWHYYY project" };
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = getSiteContent();
  const project = getProjects(content).find((item) => item.slug === slug);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#11140f", color: "#f3f4ee", padding: "64px 72px", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, letterSpacing: ".13em", textTransform: "uppercase", color: "#acb4a9" }}>
          <span>{content.copy.social.caseStudyLabel}</span>
          <span style={{ color: "#b7f56a" }}>{project?.category ?? "WORK"}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 82, lineHeight: 1, letterSpacing: "-.055em", fontWeight: 700 }}>{project?.name ?? "Work"}</div>
          <div style={{ display: "flex", maxWidth: 900, marginTop: 24, fontSize: 23, lineHeight: 1.45, color: "#acb4a9" }}>{project?.summary ?? ""}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #2a302b", paddingTop: 20, fontSize: 16, color: "#acb4a9" }}>
          <span>{project?.signal ?? "SELECTED WORK"}</span>
          <span>{content.personal.name}</span>
        </div>
      </div>
    ),
    size,
  );
}
