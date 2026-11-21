"use client";
import { createContext, useContext, useState } from "react";
import type { SiteConfig } from "@/config/site";
import { useUnsavedChanges } from "./WorkspaceUI";
export type LoadedContent = { content: SiteConfig; version: number; updatedAt: string; revisions: { id: number; version: number; created_at: string }[]; warnings?: { weakAdminPassword: boolean } };
type DraftState = { loaded: LoadedContent | null; draft: SiteConfig | null };
const Context = createContext<{ state: DraftState; setState: React.Dispatch<React.SetStateAction<DraftState>>; saving: boolean; setSaving: React.Dispatch<React.SetStateAction<boolean>> } | null>(null);
export function ContentDraftProvider({ children }: { children: React.ReactNode }) {
  const [state,setState] = useState<DraftState>({ loaded: null, draft: null });
  const [saving,setSaving] = useState(false);
  useUnsavedChanges(Boolean(state.loaded && state.draft && JSON.stringify(state.loaded.content) !== JSON.stringify(state.draft)), true);
  return <Context.Provider value={{ state,setState,saving,setSaving }}>{children}</Context.Provider>;
}
export function useContentDraft() { const value = useContext(Context); if (!value) throw new Error("Content draft provider missing"); return value; }
