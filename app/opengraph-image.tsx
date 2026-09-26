import { ImageResponse } from "next/og";
import { getSiteContent } from "@/lib/site-content";

export const alt = "GWHYYY — AI Product & Automation Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const { personal, availability, copy } = getSiteContent();
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0a0c0b", color: "#f2f4ef", padding: "64px 72px", fontFamily: "sans-serif", position: "relative" }}>
    <div style={{ position: "absolute", inset: 0, display: "flex", backgroundImage: "linear-gradient(rgba(183,245,106,.07) 1px, transparent 1px),linear-gradient(90deg,rgba(183,245,106,.07) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, letterSpacing: ".12em", textTransform: "uppercase", color: "#9ca59d" }}><span>{copy.social.portfolioLabel}</span><span style={{ color: "#b7f56a" }}>{availability.available ? "AVAILABLE" : "PORTFOLIO"}</span></div>
    <div style={{ display: "flex", flexDirection: "column" }}><div style={{ display: "flex", fontSize: 30, color: "#9ca59d", marginBottom: 20 }}>{personal.name}</div><div style={{ display: "flex", maxWidth: 1000, fontSize: 82, lineHeight: .95, letterSpacing: "-.055em", fontWeight: 700 }}>{personal.title}</div></div>
    <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #2a302b", paddingTop: 22, fontSize: 18, color: "#9ca59d" }}><span>{copy.social.footerLine}</span><span>{personal.location}</span></div>
  </div>, size);
}
