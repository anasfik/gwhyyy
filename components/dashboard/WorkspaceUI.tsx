"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";

type Confirmation = { title: string; description: string; action?: string; danger?: boolean; input?: string };
const DraftContext = createContext<{ values: Map<string, unknown>; dirty: Map<string, boolean>; listeners: Set<() => void> } | null>(null);
const ConfirmationContext = createContext<(options: Confirmation) => Promise<string | boolean>>(() => Promise.resolve(false));
export function ConfirmationProvider({ children }: { children: React.ReactNode }) {
  const [drafts] = useState(() => ({ values: new Map<string, unknown>(), dirty: new Map<string, boolean>(), listeners: new Set<() => void>() }));
  const dialog = useRef<HTMLDialogElement>(null);
  const resolve = useRef<((value: string | boolean) => void) | null>(null);
  const [options, setOptions] = useState<Confirmation | null>(null);
  const [value, setValue] = useState("");
  const confirm = useCallback((next: Confirmation) => new Promise<string | boolean>(done => {
    if (resolve.current) { done(false); return; }
    resolve.current = done; setValue(""); setOptions(next);
  }), []);
  const finish = (result: string | boolean) => { dialog.current?.close(); resolve.current?.(result); resolve.current = null; setOptions(null); };
  useEffect(() => { if (options && !dialog.current?.open) dialog.current?.showModal(); }, [options]);
  useEffect(() => {
    const unload = (event: BeforeUnloadEvent) => { if ([...drafts.dirty.values()].some(Boolean)) event.preventDefault(); };
    window.addEventListener("beforeunload", unload);
    return () => window.removeEventListener("beforeunload", unload);
  }, [drafts]);
  return <DraftContext.Provider value={drafts}><ConfirmationContext.Provider value={confirm}>{children}
    <dialog ref={dialog} className="ws-dialog" aria-labelledby="confirm-title" onCancel={event => { event.preventDefault(); finish(false); }}>
      <form onSubmit={event => { event.preventDefault(); finish(options?.input ? value : true); }}>
        <h2 id="confirm-title">{options?.title}</h2><p>{options?.description}</p>
        {options?.input && <label className="ws-field">{options.input}<input required value={value} onChange={e => setValue(e.target.value)} /></label>}
        <div className="ws-actions"><button type="button" autoFocus className="ws-button" onClick={() => finish(false)}>Cancel</button><button className={options?.danger ? "ws-button ws-danger" : "ws-button ws-primary"}>{options?.action ?? "Confirm"}</button></div>
      </form>
    </dialog>
  </ConfirmationContext.Provider></DraftContext.Provider>;
}
export const useConfirmation = () => useContext(ConfirmationContext);

export function useRetainedState<T>(key: string, initial: T) {
  const drafts = useContext(DraftContext);
  const fallback = useRef(initial);
  const read = useCallback(() => drafts?.values.has(key) ? drafts.values.get(key) as T : fallback.current, [drafts, key]);
  const subscribe = useCallback((listener: () => void) => {
    drafts?.listeners.add(listener);
    return () => { drafts?.listeners.delete(listener); };
  }, [drafts]);
  const value = useSyncExternalStore(subscribe, read, () => fallback.current);
  // Mutations may complete after their route unmounts; keep their result in the workspace.
  const setValue = useCallback((update: React.SetStateAction<T>) => {
    drafts?.values.set(key, typeof update === "function" ? (update as (current: T) => T)(read()) : update);
    drafts?.listeners.forEach(listener => listener());
  }, [drafts, key, read]);
  return [value, setValue] as const;
}

export function useUnsavedChanges(dirty: boolean, preserveContentNavigation = false, scope = "content") {
  const confirm = useConfirmation();
  const drafts = useContext(DraftContext);
  useEffect(() => { drafts?.dirty.set(scope, dirty); }, [drafts, scope, dirty]);
  useEffect(() => {
    if (!dirty) return;
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      const anchor = (event.target as HTMLElement).closest("a");
      if (!anchor || anchor.target === "_blank" || (preserveContentNavigation && anchor.hasAttribute("data-content-navigation")) || anchor.hasAttribute("download") || anchor.getAttribute("href")?.startsWith("#") || anchor.href === location.href || event.ctrlKey || event.metaKey) return;
      event.preventDefault(); event.stopPropagation();
      void confirm({ title: "Leave unsaved changes?", description: "Stay here to save your edits. Discard and leave clears all unpublished workspace edits.", action: "Discard and leave", danger: true }).then(ok => { if (ok) { drafts?.dirty.clear(); location.assign(anchor.href); } });
    };
    document.addEventListener("click", click, true);
    return () => document.removeEventListener("click", click, true);
  }, [dirty, confirm, preserveContentNavigation, drafts]);
}

export function DetailDialog({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useLayoutEffect(() => {
    const dialog = ref.current;
    const trigger = document.activeElement;
    dialog?.showModal();
    return () => { dialog?.close(); if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus(); };
  }, []);
  return <dialog ref={ref} className="ws-detail" aria-label={title} onCancel={event => { event.preventDefault(); onClose(); }}>
    <div className="ws-detail-top"><span>{title}</span><button className="ws-button" onClick={onClose}>Close</button></div>{children}
  </dialog>;
}

export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return <div className="ws-empty"><h2>{title}</h2>{children}</div>;
}
