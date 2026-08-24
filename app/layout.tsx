import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import siteConfig from "@/config/site.json";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
  preload: true,
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
  preload: false,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

// ─── Viewport ─────────────────────────────────────────────────────────────────
export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.seo.url),

  title: {
    default: siteConfig.seo.title,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.seo.description,
  keywords: siteConfig.seo.keywords,

  applicationName: "GWHYYY Portfolio",
  authors: [{ name: siteConfig.personal.name, url: siteConfig.seo.url }],
  creator: siteConfig.personal.name,
  publisher: siteConfig.personal.name,
  category: "technology",
  classification: "Business/Freelance/Technology",
  referrer: "origin-when-cross-origin",

  // Open Graph ─────────────────────────────────────────────────────────────────
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: siteConfig.seo.url,
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    siteName: `${siteConfig.personal.name} — GWHYYY`,
    firstName: "Mohamed Anas",
    lastName: "Fikhi",
    username: "gwhyyy",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${siteConfig.personal.name} — Flutter & AI Engineer for Hire`,
        type: "image/png",
      },
    ],
  },

  // Twitter / X ────────────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: ["/opengraph-image"],
    creator: siteConfig.seo.twitterHandle,
  },

  // Robots ─────────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Canonical & alternates ─────────────────────────────────────────────────────
  alternates: {
    canonical: siteConfig.seo.url,
    languages: {
      "en": siteConfig.seo.url,
    },
  },

  // Identity verification (rel="me") ───────────────────────────────────────────
  // These establish that gwhyyy.com is owned by the same person as these profiles
  // Used by search engines and the Fediverse for identity confirmation

  // Verification ───────────────────────────────────────────────────────────────
  // Add your Google Search Console verification token here when you have it:
  // verification: {
  //   google: "your-google-site-verification-token",
  // },

  // Other meta tags ────────────────────────────────────────────────────────────
  other: {
    // Geographic / local SEO
    "geo.region": "MA-05",
    "geo.placename": "Casablanca, Morocco",
    "geo.position": "33.5731;-7.5898",
    "ICBM": "33.5731, -7.5898",

    // Content classification
    "rating": "general",
    "language": "English",
    "revisit-after": "7 days",
    "target": "all",

    // Identity / profile signals
    "profile:first_name": "Mohamed Anas",
    "profile:last_name": "Fikhi",
    "profile:username": "gwhyyy",

    // Availability signal (clients who find this via Google see it in rich results)
    "availability": siteConfig.availability.available ? "available" : "unavailable",
  },
};

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────
const BASE = siteConfig.seo.url;

function toIsoMonth(value: string) {
  const [month, year] = value.trim().split("/");
  return year && month ? `${year}-${month.padStart(2, "0")}` : value.trim();
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    // ── Person ──────────────────────────────────────────────────────────────
    {
      "@type": "Person",
      "@id": `${BASE}/#person`,
      name: siteConfig.personal.name,
      alternateName: ["GWHYYY", "Anas Fikhi", "anasfik"],
      url: BASE,
      email: siteConfig.personal.email,
      telephone: siteConfig.personal.phone,
      image: {
        "@type": "ImageObject",
        "@id": `${BASE}/#personImage`,
        url: `${BASE}/opengraph-image`,
        width: 1200,
        height: 630,
        caption: `${siteConfig.personal.name} — Flutter & AI Engineer`,
      },
      description:
        "Flutter developer and AI systems engineer based in Casablanca, Morocco. Available for hire. Specializing in production LLM pipelines, RAG architectures, Flutter mobile apps, and developer SDKs.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Casablanca",
        addressRegion: "Casablanca-Settat",
        addressCountry: "MA",
      },
      sameAs: [
        siteConfig.links.github,
        siteConfig.links.linkedin,
        `mailto:${siteConfig.personal.email}`,
      ],
      jobTitle: "Software Engineer — Flutter & AI Systems",
      hasOccupation: {
        "@type": "Occupation",
        name: "Software Engineer",
        description:
          "Builds Flutter mobile applications, custom AI/LLM systems, and developer SDKs for clients worldwide.",
        occupationLocation: {
          "@type": "City",
          name: "Casablanca",
          containedInPlace: { "@type": "Country", name: "Morocco" },
        },
        skills:
          "Flutter, Dart, AI Systems, LLM Integration, RAG Architecture, Node.js, SDK Development, REST APIs",
      },
      knowsAbout: [
        "Flutter",
        "Dart",
        "Mobile App Development",
        "Artificial Intelligence",
        "Large Language Models",
        "RAG Architecture",
        "SDK Development",
        "Node.js",
        "Nostr Protocol",
        "Open Source",
        "API Design",
        "Linux",
        "VPS Deployment",
      ],
      alumniOf: siteConfig.experience.map((experience) => ({
        "@type": "Organization",
        name: experience.company,
        url: experience.url,
      })),
    },

    // ── Professional Service ─────────────────────────────────────────────────
    {
      "@type": "ProfessionalService",
      "@id": `${BASE}/#service`,
      name: "GWHYYY — Flutter & AI Engineering Services",
      url: BASE,
      description:
        "Professional Flutter app development, custom AI systems, LLM integration, and SDK engineering services. Available for contract and freelance work worldwide.",
      provider: { "@id": `${BASE}/#person` },
      areaServed: {
        "@type": "AdministrativeArea",
        name: "Worldwide",
      },
      serviceType: [
        "Flutter App Development",
        "AI Systems Engineering",
        "LLM Integration",
        "RAG Architecture",
        "SDK Development",
        "Mobile App Development",
      ],
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: BASE,
        servicePhone: siteConfig.personal.phone,
        servicePostalAddress: {
          "@type": "PostalAddress",
          addressLocality: "Casablanca",
          addressCountry: "MA",
        },
      },
    },

    // ── WebSite ──────────────────────────────────────────────────────────────
    {
      "@type": "WebSite",
      "@id": `${BASE}/#website`,
      url: BASE,
      name: `${siteConfig.personal.name} — GWHYYY`,
      description: siteConfig.seo.description,
      author: { "@id": `${BASE}/#person` },
      inLanguage: "en",
      copyrightYear: new Date().getFullYear(),
      copyrightHolder: { "@id": `${BASE}/#person` },
    },

    // ── WebPage ──────────────────────────────────────────────────────────────
    {
      "@type": "ProfilePage",
      "@id": `${BASE}/#webpage`,
      url: BASE,
      name: "Mohamed Anas Fikhi — Flutter Developer & AI Engineer for Hire",
      isPartOf: { "@id": `${BASE}/#website` },
      about: { "@id": `${BASE}/#person` },
      mainEntity: { "@id": `${BASE}/#person` },
      description: siteConfig.seo.description,
      inLanguage: "en",
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: BASE,
          },
        ],
      },
    },

    // ── Services ItemList ────────────────────────────────────────────────────
    {
      "@type": "ItemList",
      "@id": `${BASE}/#services`,
      name: "Services Offered",
      description: `Technical services provided by ${siteConfig.personal.name}`,
      numberOfItems: siteConfig.services.length,
      itemListElement: siteConfig.services.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Service",
          name: s.title,
          description: s.description,
          provider: { "@id": `${BASE}/#person` },
          serviceType: s.title,
        },
      })),
    },

    // ── Projects ItemList ────────────────────────────────────────────────────
    {
      "@type": "ItemList",
      "@id": `${BASE}/#projects`,
      name: "Selected Projects",
      description: `Open source and commercial projects by ${siteConfig.personal.name}`,
      numberOfItems: siteConfig.projects.filter((p) => p.visible).length,
      itemListElement: siteConfig.projects
        .filter((p) => p.visible)
        .sort((a, b) => a.order - b.order)
        .map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "SoftwareApplication",
            name: p.title,
            url: p.url,
            description: p.description,
            applicationCategory: "DeveloperApplication",
            author: { "@id": `${BASE}/#person` },
            keywords: p.tags.join(", "),
          },
        })),
    },

    // ── Work Experience ──────────────────────────────────────────────────────
    {
      "@type": "ItemList",
      "@id": `${BASE}/#experience`,
      name: "Work Experience",
      itemListElement: siteConfig.experience.map((e, i) => {
        const [startDate, endDate] = e.period.split("–");

        return {
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "OrganizationRole",
            roleName: e.role,
            startDate: toIsoMonth(startDate),
            endDate: endDate ? toIsoMonth(endDate) : undefined,
            worksFor: {
              "@type": "Organization",
              name: e.company,
              url: e.url,
            },
            description: e.impact,
          },
        };
      }),
    },
  ],
};

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} ${inter.variable}`}
    >
      <head>
        {/* Material Symbols icon font */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/google-font-display */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />

        {/* Preconnect to external domains for performance */}
        <link rel="dns-prefetch" href="https://calendly.com" />
        <link rel="dns-prefetch" href="https://github.com" />
        <link rel="dns-prefetch" href="https://linkedin.com" />

        {/* Identity / rel=me for profile verification */}
        <link rel="me" href={siteConfig.links.github} />
        <link rel="me" href={siteConfig.links.linkedin} />
        <link rel="me" href={`mailto:${siteConfig.personal.email}`} />

        {/* Machine-readable representations of the public professional profile */}
        <link rel="alternate" type="text/markdown" href="/llms.md" title="AI-readable professional profile" />
        <link rel="alternate" type="application/json" href="/profile.json" title="Structured professional profile" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-[family-name:var(--font-inter)] text-on-background bg-surface antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-on-primary focus:px-4 focus:py-2 font-[family-name:var(--font-ibm-plex-sans)] text-[12px] uppercase tracking-[0.1em]"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
