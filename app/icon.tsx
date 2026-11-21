import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ background: "#11140f", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#b7f56a", fontSize: "20px", fontWeight: 700, fontFamily: "sans-serif", letterSpacing: "-0.06em" }}>G</div>
      </div>
    ),
    { ...size },
  );
}
