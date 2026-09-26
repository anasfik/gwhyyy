import Link from "next/link";
import type { Project } from "@/config/site";
import ProjectVisual from "./ProjectVisual";

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="group relative grid border-t border-line pt-5 md:grid-cols-[80px_1fr_1.1fr] md:gap-8">
      <span className="label mb-4 text-muted md:mb-0">0{index + 1}</span>
      <div className="flex flex-col pb-8 md:pr-6">
        <p className="label text-signal">{project.category}</p>
        <h3 className="mt-4 text-3xl font-medium tracking-[-.045em] md:text-4xl"><Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0">{project.name}</Link></h3>
        <p className="mt-5 max-w-md text-pretty text-base leading-7 text-muted">{project.summary}</p>
        <dl className="mt-auto grid gap-4 pt-8 text-sm sm:grid-cols-2">
          <div><dt className="label text-muted">Ownership</dt><dd className="mt-2">{project.ownership[0]}</dd></div>
          <div><dt className="label text-muted">Proof</dt><dd className="mt-2 text-signal">{project.signal}</dd></div>
        </dl>
        <span className="link-arrow mt-8 text-sm font-medium">View case study <span className="inline-block text-signal">→</span></span>
      </div>
      <div className="relative min-h-[300px] overflow-hidden border border-line transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:border-muted">
        <ProjectVisual project={project} compact />
      </div>
    </article>
  );
}
