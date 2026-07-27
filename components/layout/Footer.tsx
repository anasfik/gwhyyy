import siteConfig from "@/config/site.json";

export default function Footer() {
  const year = new Date().getFullYear();
  const deployDate = new Date().toISOString().slice(0, 10).replace(/-/g, ".");

  return (
    <footer className="border-t border-outline-variant py-16 bg-surface">
      <div className="max-w-[1200px] mx-auto px-6 md:px-[64px]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="font-[family-name:var(--font-ibm-plex-sans)] text-[24px] font-bold tracking-[-0.03em] text-primary">
              GWHYYY
            </div>
            <p className="font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.05em] text-secondary">
              © {year} MOHAMED ANAS FIKHI. ALL RIGHTS RESERVED.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 md:flex gap-10 md:gap-16">
            <div className="flex flex-col gap-3">
              <span className="font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.05em] text-secondary">
                Connect
              </span>
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.05em] hover:text-primary transition-colors"
              >
                GitHub
              </a>
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.05em] hover:text-primary transition-colors"
              >
                LinkedIn
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.05em] text-secondary">
                Direct
              </span>
              <a
                href={siteConfig.links.email}
                className="font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.05em] hover:text-primary transition-colors"
              >
                Email
              </a>
              <a
                href={siteConfig.links.calendly}
                target="_blank"
                rel="noopener noreferrer"
                className="font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.05em] hover:text-primary transition-colors"
              >
                Schedule a Call
              </a>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-16 pt-8 border-t border-outline-variant flex flex-col md:flex-row justify-between text-secondary font-[family-name:var(--font-ibm-plex-mono)] text-[10px] uppercase tracking-widest gap-2">
          <div>CASABLANCA, MOROCCO</div>
          <div>LAST_DEPLOY: {deployDate}</div>
        </div>
      </div>
    </footer>
  );
}
