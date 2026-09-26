import { ImageResponse } from "next/og";
import { getProjects, getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export function generateStaticParams() { return getProjects(getSiteContent()).map((project) => ({ slug: project.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjects(getSiteContent()).find((item) => item.slug === slug);
  return { title: project ? `${project.name} — ${project.category}` : "GWHYYY Project" };
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { personal, copy } = getSiteContent();
  const project = getProjects(getSiteContent()).find((item) => item.slug === slug);
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0a0c0b", color: "#f2f4ef", padding: "64px 72px", fontFamily: "sans-serif", position: "relative" }}>
    <div style={{ position: "absolute", inset: 0, display: "flex", backgroundImage: "linear-gradient(rgba(183,245,106,.06) 1px, transparent 1px),linear-gradient(90deg,rgba(183,245,106,.06) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, letterSpacing: ".12em", textTransform: "uppercase", color: "#9ca59d" }}><span>{copy.social.caseStudyLabel}</span><span style={{ color: "#b7f56a" }}>{project?.category ?? "PROJECT"}</span></div>
    <div style={{ display: "flex", flexDirection: "column" }}><div style={{ display: "flex", fontSize: 86, lineHeight: 1, letterSpacing: "-.055em", fontWeight: 700 }}>{project?.name ?? "Project"}</div><div style={{ display: "flex", maxWidth: 900, marginTop: 26, fontSize: 24, lineHeight: 1.45, color: "#9ca59d" }}>{project?.summary ?? ""}</div></div>
    <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #2a302b", paddingTop: 22, fontSize: 18, color: "#9ca59d" }}><span>{project?.signal ?? "SELECTED WORK"}</span><span>{personal.name}</span></div>
  </div>, size);
}
