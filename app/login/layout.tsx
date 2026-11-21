import type { Metadata } from "next";
import { Suspense } from "react";
import localFont from "next/font/local";
import "../dashboard/workspace.css";
const manrope = localFont({ src: "../fonts/Manrope.ttf", variable: "--font-workspace", display: "swap" });

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <div className={manrope.variable}><div className="workspace"><Suspense fallback={<main id="main" className="ws-login" aria-label="Loading sign in" />}>{children}</Suspense></div></div>;
}
