import { ImageResponse } from "next/og";
import { getSiteContent } from "@/lib/site-content";

export const alt = "GWHYYY — independent software engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const { personal, availability, copy } = getSiteContent();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#f3f4ee", color: "#11140f", padding: "64px 72px", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, letterSpacing: ".13em", textTransform: "uppercase", color: "#596157" }}>
          <span>{copy.social.portfolioLabel}</span>
          <span style={{ color: "#1d4a2a" }}>{availability.available ? "AVAILABLE" : "PORTFOLIO"}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 25, color: "#596157", marginBottom: 16 }}>{personal.name}</div>
          <div style={{ display: "flex", maxWidth: 1010, fontSize: 58, lineHeight: 1.02, letterSpacing: "-.055em", fontWeight: 700 }}>{copy.hero.title}</div>
          <div style={{ display: "flex", maxWidth: 900, marginTop: 26, fontSize: 23, lineHeight: 1.45, color: "#596157" }}>{copy.hero.subline}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #d5d9ce", paddingTop: 20, fontSize: 16, color: "#596157" }}>
          <span>{copy.social.footerLine}</span>
          <span>{personal.location}</span>
        </div>
      </div>
    ),
    size,
  );
}
