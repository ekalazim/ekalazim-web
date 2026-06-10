import { siteConfig } from "@/config/site";
import { ImageResponse } from "next/og";

export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default site OG image. `next/og` renders via Satori, which does not
 * support CSS variables or Tailwind classes — values below are inline
 * literals mirroring the brand tokens in `src/styles/globals.css`
 * (`--bg-base`, `--brand-primary`, `--text-primary`, `--text-secondary`).
 */
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#FFFBF5",
        padding: "80px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "120px",
          height: "8px",
          backgroundColor: "#FF5C39",
          borderRadius: "9999px",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 64, fontWeight: 700, color: "#1A1614" }}>{siteConfig.author}</div>
        <div style={{ marginTop: 16, fontSize: 32, color: "#6B5D4F" }}>{siteConfig.role}</div>
      </div>
    </div>,
    { ...size },
  );
}
