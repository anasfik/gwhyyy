"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import { ConfirmationProvider } from "./WorkspaceUI";
import { workspaceNavigation } from "@/lib/dashboard";
import { ContentDraftProvider } from "./ContentDraft";

export default function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const current = workspaceNavigation.flatMap(group => group.items).sort((a, b) => b.href.length - a.href.length).find(item => path === item.href || path.startsWith(`${item.href}/`));
  return <div className="workspace"><ConfirmationProvider><ContentDraftProvider>
    <Sidebar />
    <div className="ws-body">
      <div className="ws-topbar"><span>GWHYYY <span aria-hidden="true">/</span> <strong>{current?.label ?? "Workspace"}</strong></span></div>
      <main id="main" tabIndex={-1}>{children}</main>
    </div>
  </ContentDraftProvider></ConfirmationProvider></div>;
}
