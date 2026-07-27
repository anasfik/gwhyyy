import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mohamed Anas Fikhi — Flutter & AI Engineer for Hire";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#000000",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 80px 64px",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Top label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            zIndex: 1,
          }}
        >
          <div
            style={{
              color: "#5d5f5f",
              fontSize: "12px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            [ PORTFOLIO · GWHYYY.COM ]
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
              color: "#ffffff",
              fontSize: "76px",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            Mohamed Anas Fikhi
          </div>

          <div
            style={{
              color: "#848484",
              fontSize: "26px",
              fontWeight: 400,
              lineHeight: 1.45,
              maxWidth: "860px",
            }}
          >
            I build production AI systems and high&#8209;performance Flutter products.
          </div>

          {/* Skill chips */}
          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            {["Flutter", "AI / LLM", "RAG", "SDK Engineering", "Dart"].map((tag) => (
              <div
                key={tag}
                style={{
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
          <div style={{ display: "flex", gap: "40px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div
                style={{
                  color: "#333",
                  fontSize: "10px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                Location
              </div>
              <div style={{ color: "#5d5f5f", fontSize: "14px" }}>
                Casablanca, Morocco · Remote
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div
                style={{
                  color: "#333",
                  fontSize: "10px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                Contact
              </div>
              <div style={{ color: "#5d5f5f", fontSize: "14px" }}>work@gwhyyy.com</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div
                style={{
                  color: "#333",
                  fontSize: "10px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                Status
              </div>
              <div
                style={{
                  color: "#4ade80",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#4ade80",
                  }}
                />
                Available for Projects
              </div>
            </div>
          </div>
          <div
            style={{
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
