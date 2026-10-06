import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getSiteContent } from "@/lib/site-content";

const geist = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0a0c0b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export function generateMetadata(): Metadata {
  const siteConfig = getSiteContent();
  const { seo, personal, availability, copy } = siteConfig;
  return {
    metadataBase: new URL(seo.url),
    title: { default: seo.title, template: seo.titleTemplate },
    description: seo.description,
    keywords: [...seo.keywords],
    applicationName: copy.brand.name,
    authors: [{ name: personal.name, url: seo.url }],
    creator: personal.name,
    publisher: personal.name,
    referrer: "origin-when-cross-origin",
    alternates: { canonical: seo.url, languages: { [copy.structured.language]: seo.url, "x-default": seo.url } },
    openGraph: {
      type: "profile",
      locale: "en_US",
      url: seo.url,
      title: seo.title,
      description: seo.description,
      siteName: copy.structured.siteName,
      firstName: copy.structured.firstName,
      lastName: copy.structured.lastName,
      username: copy.structured.username,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${personal.name}, ${personal.title}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: ["/opengraph-image"],
      creator: seo.twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    other: {
      "geo.region": copy.structured.geoRegion,
      "geo.placename": personal.location,
      availability: availability.available ? "available" : "unavailable",
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { seo, personal, links, stackGroups, capabilities, copy } = getSiteContent();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${seo.url}/#person`,
        name: personal.name,
        alternateName: [personal.handle, ...copy.structured.alternateNames],
        url: seo.url,
        image: `${seo.url}/opengraph-image`,
        email: personal.email,
        telephone: personal.phone,
        jobTitle: personal.title,
        description: personal.bio,
        address: { "@type": "PostalAddress", addressLocality: personal.location, addressCountry: copy.structured.geoRegion.split("-")[0] },
        sameAs: [links.github, links.linkedin],
        knowsAbout: stackGroups.flatMap((group) => group.items),
      },
      {
        "@type": "WebSite",
        "@id": `${seo.url}/#website`,
        url: seo.url,
        name: copy.structured.siteName,
        description: seo.description,
        author: { "@id": `${seo.url}/#person` },
        inLanguage: copy.structured.language,
      },
      {
        "@type": "ProfilePage",
        "@id": `${seo.url}/#webpage`,
        url: seo.url,
        name: seo.title,
        isPartOf: { "@id": `${seo.url}/#website` },
        mainEntity: { "@id": `${seo.url}/#person` },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${seo.url}/#service`,
        name: copy.structured.serviceName,
        url: seo.url,
        provider: { "@id": `${seo.url}/#person` },
        areaServed: copy.structured.areaServed,
        serviceType: capabilities.map((capability) => capability.title),
      },
    ],
  };

  return (
    <html lang={copy.structured.language} className={`${geist.variable} ${geistMono.variable}`}>
      <head>
        <link rel="dns-prefetch" href="https://calendly.com" />
        <link rel="me" href={links.github} />
        <link rel="me" href={links.linkedin} />
        <link rel="me" href={links.email} />
        <link rel="alternate" type="text/markdown" href="/llms.md" title="AI-readable professional profile" />
        <link rel="alternate" type="application/json" href="/profile.json" title="Structured professional profile" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:bg-signal focus:px-4 focus:py-3 focus:text-ink">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
