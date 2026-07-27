import siteConfig from "@/config/site.json";

type Project = (typeof siteConfig.projects)[number];

function ProjectCard({ project, offset }: { project: Project; offset?: boolean }) {
  return (
    <div className={`group flex flex-col cursor-pointer ${offset ? "md:mt-24" : ""}`}>
      {/* Image */}
      <a href={project.url} target="_blank" rel="noopener noreferrer" className="block">
        <div className="border border-outline-variant aspect-[4/3] overflow-hidden bg-surface-container mb-6 relative">
          <div className="w-full h-full flex items-center justify-center bg-surface-container-high transition-colors group-hover:bg-surface-container-highest">
            <span className="material-symbols-outlined text-[48px] text-outline">
              open_in_new
            </span>
          </div>
        </div>
      </a>

      {/* Content */}
      <div className="font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.05em] text-secondary mb-2">
        {project.category}
      </div>
      <h3 className="font-[family-name:var(--font-ibm-plex-sans)] text-[24px] font-medium leading-[1.4] mb-3 group-hover:underline underline-offset-4 transition-all">
        <a href={project.url} target="_blank" rel="noopener noreferrer">
          {project.title}
        </a>
      </h3>
      <p className="font-[family-name:var(--font-inter)] text-[16px] leading-[1.6] text-secondary mb-6">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 border border-outline-variant font-[family-name:var(--font-ibm-plex-sans)] text-[10px] uppercase tracking-[0.05em]"
          >
            {tag}
          </span>
        ))}
      </div>
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
          <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[14px] text-secondary hidden md:block">
            01 // {String(visible.length).padStart(2, "0")}
          </span>
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
