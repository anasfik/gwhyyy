"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import { ConfirmationProvider } from "./WorkspaceUI";
import { workspaceNavigation } from "@/lib/dashboard";
import { ContentDraftProvider } from "./ContentDraft";

export default function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const saved = localStorage.getItem("gwhyyy-workspace-theme");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(saved === "dark" ? "dark" : "light");
  }, []);
  const current = workspaceNavigation.flatMap(group => group.items).sort((a, b) => b.href.length - a.href.length).find(item => path === item.href || path.startsWith(`${item.href}/`));
  return <div className="workspace" data-theme={theme}><ConfirmationProvider><ContentDraftProvider>
    <Sidebar />
    <div className="ws-body">
      <div className="ws-topbar"><span>GWHYYY <span aria-hidden="true">/</span> <strong>{current?.label ?? "Workspace"}</strong></span><button className="ws-button ws-quiet" onClick={() => { const next = theme === "light" ? "dark" : "light"; setTheme(next); localStorage.setItem("gwhyyy-workspace-theme", next); }} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}>{theme === "light" ? "Dark theme" : "Light theme"}</button></div>
      <main id="main" tabIndex={-1}>{children}</main>
    </div>
  </ContentDraftProvider></ConfirmationProvider></div>;
}
