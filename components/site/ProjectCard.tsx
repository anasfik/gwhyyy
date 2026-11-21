import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/config/site";

export default function ProjectCard({ project, index, priority = false }: { project: Project; index: number; priority?: boolean }) {
  const image = project.media?.[0];
  return (
    <article className="group relative border-t border-line">
      <Link href={`/work/${project.slug}`} className="grid gap-5 py-5 md:grid-cols-[1fr_1fr] md:gap-10 md:py-7">
        <div className="relative aspect-[16/9] overflow-hidden border border-line bg-panel">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={priority}
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.015]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-panel p-6">
              <span className="label text-muted">{project.name}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-6 md:py-2">
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="label text-muted">{String(index).padStart(2, "0")} / {project.category}</p>
              <p className="label text-forest">{project.status}</p>
            </div>
            <h3 className="mt-5 text-3xl font-semibold tracking-[-.05em] md:text-4xl">{project.name}</h3>
            <p className="mt-4 max-w-lg text-pretty leading-7 text-muted">{project.summary}</p>
            <p className="mt-5 flex flex-wrap gap-x-6 gap-y-1 border-t border-line pt-3 text-xs text-muted">
              <span><span className="label">Role</span> {project.role}</span>
              <span><span className="label">Period</span> {project.period}</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-forest">{project.signal}</p>
            <p className="link-arrow mt-3 inline-flex items-center gap-2 text-sm font-medium">
              Read case study <span aria-hidden="true">→</span>
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}
