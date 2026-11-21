"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import { workspaceNavigation } from "@/lib/dashboard";

export default function Sidebar() {
  const path = usePathname();
  const mobile = useRef<HTMLDialogElement>(null);
  useEffect(() => { mobile.current?.close(); }, [path]);
  const contents = <>
    <div className="ws-brand"><Link href="/dashboard">gwhyyy<span>Workspace</span></Link></div>
    <nav aria-label="Workspace navigation">{workspaceNavigation.map(group => <div className="ws-nav-group" key={group.label}>
      <p>{group.label}</p>{group.items.map(item => <Link key={item.href} href={item.href} data-content-navigation={group.label === "Website" ? "" : undefined} aria-current={path === item.href ? "page" : undefined}>{item.label}</Link>)}
    </div>)}</nav>
    <div className="ws-sidebar-bottom"><a href="/" target="_blank" rel="noopener noreferrer">View public site <span aria-hidden="true">↗</span></a><button onClick={() => signOut({ callbackUrl: "/login" })}>Sign out</button></div>
  </>;
  return <><aside className="ws-sidebar">{contents}</aside><div className="ws-mobilebar"><strong>gwhyyy</strong><button className="ws-button" onClick={() => mobile.current?.showModal()}>Navigation</button></div>
    <dialog ref={mobile} className="ws-mobile-nav" aria-label="Workspace navigation"><button className="ws-button ws-mobile-close" onClick={() => mobile.current?.close()} autoFocus>Close navigation</button>{contents}</dialog>
  </>;
}
