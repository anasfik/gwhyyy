import { ImageResponse } from "next/og";
import siteConfig from "@/config/site.json";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function getVisibleProjects() {
  return siteConfig.projects.filter((p) => p.visible).sort((a, b) => a.order - b.order);
}

export function generateStaticParams() {
  return getVisibleProjects().map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = getVisibleProjects().find((p) => p.id === params.slug);
  if (!project) return {};
  return { title: `${project.title} — ${project.category}` };
}

export default function OGImage({ params }: { params: { slug: string } }) {
  const project = getVisibleProjects().find((p) => p.id === params.slug);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          background: "#000000",
          width: "100%",
          height: "100%",
          justifyContent: "space-between",
          padding: "80px 80px 64px",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "4px",
            height: "100%",
            background: "#1f1f1f",
          }}
        />

        {/* Top label */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", zIndex: 1 }}>
          <div
            style={{
              color: "#5d5f5f",
              fontSize: "12px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            [ {project?.category ?? "PROJECT"} · GWHYYY.COM ]
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            zIndex: 1,
            flex: 1,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#ffffff",
              fontSize: "72px",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            {project?.title ?? "Project"}
          </div>
          <div
            style={{
              display: "flex",
              color: "#848484",
              fontSize: "22px",
              fontWeight: 400,
              lineHeight: 1.45,
              maxWidth: "860px",
            }}
          >
            {project?.description ?? ""}
          </div>
          {/* Tags */}
          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            {(project?.tags ?? []).slice(0, 5).map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  border: "1px solid #333",
                  color: "#848484",
                  fontSize: "12px",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "6px 14px",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            zIndex: 1,
            borderTop: "1px solid #1f1f1f",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", color: "#5d5f5f", fontSize: "14px" }}>
            {siteConfig.personal.name}
          </div>
          <div
            style={{
              display: "flex",
              color: "#333",
              fontSize: "18px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            GWHYYY.COM
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
