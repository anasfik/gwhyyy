import ProspectsManager from "@/components/dashboard/ProspectsManager";

export const metadata = {
  title: "Outreach | GWHYYY Admin",
  robots: { index: false, follow: false },
};

export default async function ProspectsPage({ searchParams }: { searchParams: Promise<{ q?: string; due?: string }> }) {
  const { q, due } = await searchParams;
  return <ProspectsManager initialQuery={q ?? ""} initialDue={due === "1"} />;
}
