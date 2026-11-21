import { notFound } from "next/navigation";
import ContentManager from "@/components/dashboard/ContentManager";
export default async function ContentSection({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (section !== "copy" && section !== "services" && section !== "experience" && section !== "faq") notFound();
  return <ContentManager initialTab={section} />;
}
