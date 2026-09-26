import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<main id="main" className="min-h-dvh bg-surface" />}>{children}</Suspense>;
}
