import type { Project } from "@/config/site";

export default function ProjectVisual({ project, compact = false }: { project: Project; compact?: boolean }) {
  return (
    <div className="relative flex h-full min-h-[240px] flex-col overflow-hidden bg-panel p-5 md:p-7" aria-hidden="true">
      <div className="absolute inset-0 opacity-30 hero-grid" />
      <div className="relative flex items-center justify-between border-b border-line pb-4">
        <span className="label text-muted">{project.slug}.sys</span>
        <span className="label text-signal">RUNNING</span>
      </div>
      <div className={`relative flex flex-1 items-center ${compact ? "py-8" : "py-10 md:py-14"}`}>
        <div className="grid w-full items-center gap-2" style={{ gridTemplateColumns: `repeat(${project.architecture.length}, minmax(0, 1fr))` }}>
          {project.architecture.map((node, index) => (
            <div key={node} className="relative">
              <div className={`border p-3 text-center ${index === project.architecture.length - 1 ? "border-signal/50 bg-signal/5" : "border-line bg-ink/90"}`}>
                <span className="label block text-muted">N{String(index + 1).padStart(2, "0")}</span>
                <span className="mt-2 block text-[10px] leading-4 text-paper md:text-xs">{node}</span>
              </div>
              {index < project.architecture.length - 1 && <span className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 bg-panel px-0.5 font-mono text-xs text-signal">→</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="relative flex items-end justify-between gap-4 border-t border-line pt-4">
        <strong className="text-xl tracking-[-.04em] md:text-2xl">{project.name}</strong>
        <span className="label text-right text-muted">{project.category.split(" / ")[0]}</span>
      </div>
    </div>
  );
}
