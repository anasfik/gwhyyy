"use client";

import Link from "next/link";
import { mailSections } from "./mail-client";

export default function MailTabs({ active }: { active: string }) {
  return <nav className="ws-mail-tabs" aria-label="Email sections">{mailSections.map(section => <Link key={section.key} href={section.href} aria-current={active === section.key ? "page" : undefined}>{section.label}</Link>)}</nav>;
}
