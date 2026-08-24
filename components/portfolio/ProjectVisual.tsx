import siteConfig from "@/config/site.json";

type Project = (typeof siteConfig.projects)[number];

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// Deterministic monogram visual per project — no image assets needed.
export default function ProjectVisual({ project }: { project: Project }) {
  const h = hash(project.id);
  const hue = h % 360;
  const initials = project.title
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  return (
    <div
      className="w-full h-full flex items-center justify-center relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 18% 92%), hsl(${(hue + 40) % 360} 22% 84%))`,
      }}
      aria-hidden="true"
    >
      <span
        className="font-[family-name:var(--font-ibm-plex-mono)] font-bold text-[72px] md:text-[96px] tracking-[-0.05em] select-none"
        style={{ color: `hsl(${hue} 25% 30%)` }}
      >
        {initials}
      </span>
      <span className="absolute bottom-4 right-4 font-[family-name:var(--font-ibm-plex-mono)] text-[10px] uppercase tracking-[0.15em] text-secondary">
        {project.category}
      </span>
    </div>
  );
}
