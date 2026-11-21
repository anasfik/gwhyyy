import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ background: "#11140f", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#b7f56a", fontSize: "104px", fontWeight: 700, fontFamily: "sans-serif", letterSpacing: "-0.06em" }}>G</div>
      </div>
    ),
    { ...size },
  );
}
