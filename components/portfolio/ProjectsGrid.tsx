import Link from "next/link";
import ProjectVisual from "@/components/portfolio/ProjectVisual";
import siteConfig from "@/config/site.json";

type Project = (typeof siteConfig.projects)[number];

function ProjectCard({ project, offset }: { project: Project; offset?: boolean }) {
  return (
    <div className={`group flex flex-col ${offset ? "md:mt-24" : ""}`}>
      {/* Visual */}
      <Link href={`/projects/${project.id}`} className="block border border-outline-variant aspect-[4/3] overflow-hidden bg-surface-container mb-6">
        <ProjectVisual project={project} />
      </Link>

      {/* Content */}
      <div className="font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.05em] text-secondary mb-2">
        {project.category}
      </div>
      <h3 className="font-[family-name:var(--font-ibm-plex-sans)] text-[24px] font-medium leading-[1.4] mb-3 group-hover:underline underline-offset-4 transition-all">
        <Link href={`/projects/${project.id}`}>
          {project.title}
        </Link>
      </h3>
      <p className="font-[family-name:var(--font-inter)] text-[16px] leading-[1.6] text-secondary mb-6 line-clamp-3">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 border border-outline-variant font-[family-name:var(--font-ibm-plex-sans)] text-[10px] uppercase tracking-[0.05em]"
          >
            {tag}
          </span>
        ))}
      </div>
      {project.results && project.results.length > 0 && (
        <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[12px] text-primary leading-[1.5]">
          → {project.results[0]}
        </p>
      )}
    </div>
  );
}

export default function ProjectsGrid() {
  const visible = siteConfig.projects
    .filter((p) => p.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <section className="border-t border-outline-variant" id="work">
      <div className="max-w-[1200px] mx-auto px-6 md:px-[64px] py-[128px]">
        <div className="flex justify-between items-end mb-16">
          <h2 className="font-[family-name:var(--font-ibm-plex-sans)] text-[32px] md:text-[48px] font-semibold leading-[1.2] tracking-[-0.01em]">
            Selected Projects
          </h2>
          <a
            href="/projects"
            className="font-[family-name:var(--font-ibm-plex-mono)] text-[14px] text-secondary hidden md:block hover:text-primary transition-colors"
          >
            ALL PROJECTS ({String(visible.length).padStart(2, "0")}) →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-20">
          {visible.map((project, i) => (
            <ProjectCard key={project.id} project={project} offset={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
