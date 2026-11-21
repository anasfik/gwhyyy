export type ProjectMedia = {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
};

export type ProjectSection = {
  title: string;
  body: string[];
  bullets?: string[];
};

export type Project = {
  slug: string;
  name: string;
  category: string;
  summary: string;
  problem: string;
  approach: string;
  ownership: string[];
  results: string[];
  stack: string[];
  link: string;
  signal?: string;
  featured: boolean;
  order: number;
  architecture: string[];
  role?: string;
  period?: string;
  status?: string;
  services?: string[];
  media?: ProjectMedia[];
  sections?: ProjectSection[];
};

export type Service = {
  slug: string;
  title: string;
  summary: string;
  detail: string[];
  outcomes: string[];
  examples: string[];
  fit: string[];
  relatedProjects: string[];
};

export type Capability = Service;

export type Metric = {
  value: string;
  label: string;
  source?: string;
};

const siteConfig = {
  schemaVersion: 4,
  seo: {
    url: "https://gwhyyy.com",
    title: "Mohamed Anas Fikhi — Software Engineer & Product Builder",
    titleTemplate: "%s | GWHYYY",
    description:
      "Independent software engineer and product builder helping startups and businesses ship SaaS, mobile apps, integrations, AI features, and production software.",
    keywords: [
      "Mohamed Anas Fikhi",
      "GWHYYY",
      "independent software engineer",
      "product builder",
      "AI integration engineer",
      "API integration freelancer",
      "Flutter developer",
      "SDK engineer",
      "backend engineer",
      "automation engineer",
      "remote software engineer Morocco",
    ],
    twitterHandle: "@gwhyyy",
  },
  personal: {
    name: "Mohamed Anas Fikhi",
    handle: "GWHYYY",
    title: "Independent Software Engineer & Product Builder",
    headline: "I build software. From complex integrations to complete products.",
    summary:
      "I help startups and businesses turn ideas, technical challenges, and unfinished products into reliable, production-ready software.",
    bio:
      "I am an independent software engineer and product builder based in Casablanca. I help startups and businesses turn ideas, technical challenges, and unfinished products into reliable, production-ready software. My work spans product engineering, integrations, AI features, and existing products, with Flutter, Dart, backend systems, APIs, and developer tooling as specializations.",
    email: "work@gwhyyy.com",
    phone: "+212760386573",
    location: "Casablanca, Morocco",
    workMode: "Working remotely worldwide",
  },
  availability: {
    available: true,
    label: "Available for selected projects",
    engagement:
      "Remote contract work: product builds, integrations, AI features, backend systems, SDKs, Flutter development, and focused improvements to existing products.",
  },
  links: {
    github: "https://github.com/anasfik",
    linkedin: "https://linkedin.com/in/mohamed-anas-fikhi",
    calendly: "https://calendly.com/ffikhi-aanas/30min",
    email: "mailto:work@gwhyyy.com",
  },
  metrics: [
    { value: "3,090", label: "APIs tracked by Reqistry", source: "reqistry.dev, 28 Oct 2026" },
    { value: "664", label: "GitHub stars on Dart OpenAI", source: "GitHub, 28 Oct 2026" },
    { value: "18k", label: "Downloads shown on pub.dev", source: "pub.dev, 28 Oct 2026" },
    { value: "5K+", label: "Reqistry Android downloads", source: "Google Play, 28 Oct 2026" },
  ],
  projects: [
    {
      slug: "reqistry",
      name: "Reqistry",
      category: "API intelligence platform",
      summary:
        "A platform for discovering, comparing, monitoring, and connecting APIs and MCP tools, for engineers and AI agents.",
      problem:
        "API decisions are usually made from stale directory listings. Teams get no reliable signal on health, authentication, pricing, CORS, documentation, or change history. AI agents have the same problem at machine speed.",
      approach:
        "Built the product as a catalog plus an evidence layer. Automated probes and metadata collection feed trust scores and change events; the web app, mobile app, API, and MCP server read the same data.",
      ownership: [
        "Product design and feature definition",
        "Next.js web platform: catalog, search, compare, changelog, submissions",
        "Fastify API, PostgreSQL schema, Redis caching, and authentication",
        "BullMQ worker: health probes, metadata, trust scores, alerts, backups",
        "MCP server with 16 tools for API discovery and production-safety checks",
        "Operator dashboard and production release engineering",
      ],
      results: [
        "3,090 APIs across 72 categories tracked on 28 October 2026",
        "5K+ Google Play downloads, 4.6 rating from 66 reviews",
        "16 MCP tools served over streamable HTTP",
        "8 weighted trust factors with explicit unknown state",
        "45 Prisma models and 48 backend test files",
      ],
      stack: ["TypeScript", "Fastify", "Next.js", "PostgreSQL", "Prisma", "Redis", "BullMQ", "MCP", "Flutter"],
      link: "https://reqistry.dev",
      signal: "3,090 APIs tracked / 5K+ Android downloads",
      featured: true,
      order: 1,
      role: "Product owner and engineer",
      period: "Ongoing",
      status: "Live",
      services: ["product-engineering", "integrations-infrastructure", "ai-engineering"],
      architecture: ["Web", "API", "Worker", "PostgreSQL", "MCP", "Android"],
      media: [
        {
          src: "/work/reqistry-web.webp",
          alt: "Reqistry homepage showing catalog search, category filters, and live counts of 3,090 APIs and 72 categories",
          caption: "reqistry.dev: one catalog for humans and agents.",
          width: 1440,
          height: 950,
        },
        {
          src: "/work/reqistry-compare.webp",
          alt: "Reqistry compare page for evaluating APIs side by side",
          caption: "Comparison is backed by the same probe and trust data as the API.",
          width: 1440,
          height: 950,
        },
        {
          src: "/work/reqistry-api.webp",
          alt: "Reqistry API detail page showing pricing, authentication, CORS, and health signals",
          caption: "Each API profile exposes evidence rather than a single opaque score.",
          width: 1440,
          height: 950,
        },
        {
          src: "/work/reqistry-app.webp",
          alt: "Reqistry Android app promotional image from Google Play showing discovery, project, and search screens",
          caption: "The Android client is published on Google Play.",
          width: 1080,
          height: 2341,
        },
      ],
      sections: [
        {
          title: "The problem",
          body: [
            "API directories answer one question: what exists. They rarely answer the questions that decide whether software ships: Is it alive? Is the authentication model clear? Is CORS supported? Is the pricing current? Did anything change since last month?",
            "Reqistry treats those as first-class data. The product is designed to help a developer, a team, or an AI agent choose an API with evidence and understand when that evidence changes.",
          ],
        },
        {
          title: "What the product does",
          body: [
            "The catalog is searchable and categorized. Each profile combines catalog facts with live platform observations, and every surface reads from the same backend.",
          ],
          bullets: [
            "Search and filter 3,090 APIs across 72 categories",
            "Compare 2 to 8 APIs on pricing, auth, CORS, rate limits, health, and trust",
            "Trust scores built from eight weighted factors, with confidence and unknown signals exposed",
            "Change feed for health, pricing, documentation, and trust events",
            "Projects, saved APIs, watchlists, and daily digests in the Android client",
            "MCP server for agents to search, compare, assess safety, fetch snippets, and submit APIs",
          ],
        },
        {
          title: "How the system works",
          body: [
            "A Fastify API serves the web app and the legacy mobile contract. PostgreSQL is the source of truth; Redis handles caching and queues. A BullMQ worker performs the slow, continuous work: probing endpoints, refreshing metadata, recomputing trust, creating change events, and sending notifications.",
            "The MCP server is a separate service over the same API. It is stateless per request, supports agent keys, and returns the same catalog evidence a human sees. That shared contract is what keeps the product coherent across web, mobile, and agents.",
          ],
          bullets: [
            "Hourly health probes with consecutive-failure tracking and 24h/7d/30d uptime",
            "Non-probative targets are marked unknown instead of falsely alive",
            "Six-hourly metadata and trust refresh",
            "Change events drive the changelog, mobile notifications, and admin alerts",
            "Rate limiting, API keys, sessions, audit logs, and request logs on the API",
          ],
        },
        {
          title: "Engineering decisions",
          body: [
            "The most important product decision was to make uncertainty visible. A trust score with missing factors should not look the same as a verified score. The scoring model excludes unknown factors, computes confidence from the known weight, and reports which factors are missing.",
            "The second decision was to keep one evidence pipeline. Web, Android, and MCP do not maintain separate truth. They read the same API data, so a health event or pricing change appears everywhere it matters.",
          ],
          bullets: [
            "Evidence and freshness over a single opaque ranking",
            "Eight factors: uptime, response time, docs quality, auth clarity, CORS, pricing clarity, freshness, OpenAPI availability",
            "Stateless MCP transport with read tools open and consequential tools authenticated",
            "Safe fetch with SSRF protection for metadata collection",
            "Backups every 12 hours and an operator audit trail",
          ],
        },
        {
          title: "Android and distribution",
          body: [
            "The Android client is published under Gwhyyy on Google Play. The public listing documents discovery, trust signals, comparison, watchlists, projects, submissions, and agent-key connection. The store reports 5K+ downloads and a 4.6 rating from 66 reviews at the time of this audit.",
            "This case study focuses on the web, API, worker, and MCP surfaces that were reviewed directly from source. Client implementation details are not published because the Android source was not available for this review.",
          ],
        },
        {
          title: "Verified results",
          body: [
            "The numbers below are public or reproducible from the source tree. They are dated because catalog counts and store metrics move.",
          ],
          bullets: [
            "3,090 APIs and 72 categories on reqistry.dev, 28 October 2026",
            "5K+ downloads and 4.6/66 reviews on Google Play, 28 October 2026",
            "16 MCP tools, 45 Prisma models, 48 test files, 115 commits in the reviewed repository",
            "API, PostgreSQL, and Redis healthy at api.reqistry.dev/health, 28 October 2026",
            "Docs canonical/robots cleanup remains an open follow-up; it is not claimed as fixed",
          ],
        },
      ],
    },
    {
      slug: "flutterguard",
      name: "FlutterGuard",
      category: "Production Android security app",
      summary:
        "An offline Android app that audits a released Flutter app or APK on the device, reporting the libraries, endpoints, exposed strings and package policy it ships.",
      problem:
        "A Flutter release keeps most of its surface in lib/<abi>/libapp.so and flutter_assets, not in classes.dex. A DEX-shaped scan can return a clean report while the APK still carries a staging host or a bundled key. The signed artifact users install is the thing worth inspecting, not only the repository.",
      approach:
        "Built an Android app that reads the selected package without executing it, ties every finding to its source file or attribute, masks secret-like values by default and keeps reports in private app storage. The app declares no INTERNET permission.",
      ownership: [
        "Product scope, security boundaries and finding model",
        "Android app in Kotlin and Jetpack Compose",
        "APK, manifest, libapp.so, asset and signing inspection",
        "Evidence grades, secret masking and JSON/Markdown reporting",
        "Signed release, website, privacy documentation and agent skill",
      ],
      results: [
        "v0.3.4 APK published on GitHub, 2 November 2026",
        "MIT licensed; Android 8.0+; no INTERNET permission",
        "33 GitHub stars and 0 open issues on 3 November 2026",
        "38 Kotlin test files in the public repository",
        "Google Play listing submitted and in review; GitHub APK is public",
      ],
      stack: ["Kotlin", "Jetpack Compose", "Material 3", "Android", "APK inspection", "Static analysis"],
      link: "https://flutterguard.dev",
      signal: "v0.3.4 shipped / offline by design",
      featured: true,
      order: 2,
      role: "Product owner and Android engineer",
      period: "2026",
      status: "Published",
      services: ["product-engineering"],
      architecture: ["Installed app / APK", "Manifest + libapp.so + assets", "Evidence model", "Grades and reports", "On-device storage"],
      media: [
        {
          src: "/work/flutterguard-hero-site.webp",
          alt: "FlutterGuard landing page with the headline Security audit any released Flutter app, beside a phone showing evidence-backed findings",
          caption: "flutterguard.dev: inspect the release, keep the evidence on the phone.",
          width: 1440,
          height: 950,
        },
        {
          src: "/work/flutterguard-report.webp",
          alt: "FlutterGuard report grade and findings screens showing severity counts, APK fingerprint and evidence-backed checks",
          caption: "Each grade is a triage label backed by visible findings and provenance.",
          width: 1440,
          height: 950,
        },
        {
          src: "/work/flutterguard-inventory.webp",
          alt: "FlutterGuard installed-app inventory and scan settings screens",
          caption: "Discovery and controls: installed Flutter apps, scan history and secret reveal.",
          width: 1440,
          height: 950,
        },
        {
          src: "/work/flutterguard-evidence.webp",
          alt: "FlutterGuard endpoints, routes and privacy screens",
          caption: "Endpoints and route candidates are grouped as leads; reports stay local until exported.",
          width: 1440,
          height: 950,
        },
      ],
      sections: [
        {
          title: "The problem",
          body: [
            "Flutter moves application logic out of classes.dex and into lib/<abi>/libapp.so. Tools that only read Java can miss endpoints, bundled configuration and secret-like strings that still ship in the APK.",
            "Most mobile security tooling also assumes a workstation. The common post-build question is narrower: what does this release expose? Standing up a container, database and browser is more work than that first pass deserves.",
          ],
        },
        {
          title: "What the app does",
          body: [
            "FlutterGuard lists installed Flutter apps or opens a single APK. It reads the package without running it and groups the result into artifact facts, library and SDK markers, endpoints and routes, exposed strings, package policy and signing evidence.",
          ],
          bullets: [
            "Installed-app inventory or a single APK; no root, PC or account",
            "Manifest, libapp.so, flutter_assets, classes.dex, NOTICES.Z and signing material",
            "Package facts, permissions, exported components, backup and cleartext policy",
            "Endpoints, route-like strings and SDK markers with source evidence",
            "Secret-like values masked until deliberately revealed",
            "On-device reports as JSON or Markdown; history stays in private storage",
          ],
        },
        {
          title: "How the inspection works",
          body: [
            "A Kotlin and Compose UI drives a local scan pipeline. The APK is opened as a container, the binary manifest and policy files are parsed, native libraries and assets are read as data, and each finding keeps the file or attribute that produced it.",
            "Scans run one at a time with visible progress. The app declares no INTERNET permission, so there is no upload path and no cloud lookup. A report leaves the device only when the user exports it.",
          ],
          bullets: [
            "APK container, ABI and asset inventory",
            "Binary manifest and package-policy parsing",
            "String and symbol extraction from libapp.so, with confidence",
            "Route candidates and endpoints grouped as leads, not a navigation graph",
            "Explicit export; uninstalling removes stored reports and history",
            "APKs only; AABs must be converted with bundletool first",
          ],
        },
        {
          title: "Engineering decisions",
          body: [
            "Offline operation is enforced by the permission model, not a settings toggle. The manifest has no INTERNET permission, so the privacy claim is checkable against the artifact.",
            "The product avoids turning static evidence into a verdict. Grades are triage labels, findings keep their provenance, and the interface says a match is a lead that needs verification. Secret-like values stay masked by default.",
          ],
          bullets: [
            "No INTERNET permission; no analytics, crash reporting or upload path",
            "Static evidence only: no runtime hooking or traffic interception",
            "A/C/F grades as triage, not a security certification",
            "Masked secrets with deliberate reveal",
            "Signed release builds; Android 8.0+",
            "Private report storage with explicit JSON/Markdown export",
          ],
        },
        {
          title: "Release and distribution",
          body: [
            "v0.3.4 was published on GitHub on 2 November 2026 as a 1.4 MB APK. The project is MIT licensed and the public repository carries 38 Kotlin test files. The Google Play listing was submitted and remains in review; the GitHub APK is the public install.",
            "Recent builds use a new signing key, so upgrading from an older GitHub APK requires exporting reports, uninstalling and installing the new build. The release notes state that trade-off rather than hiding it.",
          ],
        },
        {
          title: "Verified results",
          body: [
            "The project is public and the claims below are dated. Store availability and repository metrics move.",
          ],
          bullets: [
            "v0.3.4 APK, 1.4 MB, published 2 November 2026",
            "MIT license; Android 8.0+; no INTERNET permission in the manifest",
            "33 GitHub stars, 1 fork and 0 open issues on 3 November 2026",
            "38 Kotlin test files in the public repository",
            "Google Play listing still in review on 3 November 2026; the public URL returned 404",
            "Limits: static inspection only; no iOS, AAB, runtime hooking or traffic interception",
          ],
        },
      ],
    },
    {
      slug: "dart-openai",
      name: "Dart OpenAI",
      category: "Open-source SDK",
      summary:
        "A typed Dart and Flutter client for the OpenAI API and compatible providers, covering every major API surface.",
      problem:
        "Dart and Flutter teams needed a maintained, typed way to use OpenAI APIs without rebuilding transport, streaming, response models, and provider compatibility in every product.",
      approach:
        "Designed a developer-first package with typed clients for Responses, Chat, Realtime, Videos, Batch, fine-tuning, vector stores, evals, and administration, plus multiple clients for OpenAI-compatible providers.",
      ownership: [
        "Created and maintain the package",
        "Designed the public API and typed models",
        "Implemented streaming, tool calling, and multi-provider support",
        "Wrote installation, quickstart, and API documentation",
      ],
      results: [
        "664 GitHub stars and 231 forks on 28 October 2026",
        "576 pub.dev likes and 160/160 pub points",
        "18k downloads shown on pub.dev",
        "v8.0.0 with full API coverage",
      ],
      stack: ["Dart", "Flutter", "OpenAI API", "SDK design", "Open source"],
      link: "https://pub.dev/packages/dart_openai",
      signal: "664 GitHub stars / 18k pub downloads",
      featured: true,
      order: 3,
      role: "Creator and maintainer",
      period: "Ongoing",
      status: "Published",
      services: ["integrations-infrastructure", "ai-engineering"],
      architecture: ["Dart client", "Typed models", "Streaming", "OpenAI / compatible APIs"],
      media: [
        {
          src: "/work/dart-openai.webp",
          alt: "pub.dev page for dart_openai version 8.0.0 showing 576 likes, 160 pub points, and 18k downloads",
          caption: "dart_openai on pub.dev, October 2026.",
          width: 1440,
          height: 950,
        },
      ],
      sections: [
        {
          title: "The problem",
          body: [
            "OpenAI's API changes quickly. A Flutter product that hand-rolls HTTP calls, streaming, JSON models, retries, and provider quirks pays that cost again every time the API moves.",
            "Dart OpenAI gives teams one typed client they can keep across products, including Azure and OpenAI-compatible endpoints such as DeepSeek, LM Studio, and Ollama.",
          ],
        },
        {
          title: "What I built",
          body: [
            "The package covers the API surfaces a production application actually uses, and keeps the public API small enough to learn in one sitting.",
          ],
          bullets: [
            "Responses, Chat Completions, Realtime, Videos, Batch, fine-tuning, vector stores, evals, and administration",
            "Streaming responses and tool calling",
            "Multiple isolated clients with independent configuration",
            "Compatible-provider support without global state",
            "Documentation, examples, and a versioned pub.dev release",
          ],
        },
        {
          title: "Engineering decisions",
          body: [
            "The central design choice is typed access over a generic request wrapper. Callers get models and methods that match the API, while transport, headers, streaming, and error handling stay inside the package.",
            "Multiple clients matter for teams running production and staging accounts, or combining OpenAI with an Azure resource and a local model. Global mutable configuration makes that unsafe, so every client owns its configuration.",
          ],
        },
        {
          title: "Adoption",
          body: [
            "Adoption is public and verifiable on GitHub and pub.dev. The pub.dev page showed 576 likes, 160/160 points, and 18k downloads on 28 October 2026; GitHub showed 664 stars and 231 forks. The package is MIT licensed.",
            "The project is a long-running maintenance commitment, not a one-off sample: releases track API changes and the issue tracker stays open.",
          ],
        },
      ],
    },
    {
      slug: "gathr",
      name: "Gathr",
      category: "Production mobile product",
      summary:
        "A shipped social product for community fundraising and impact, built with Flutter and an event-driven backend.",
      problem:
        "Gathr needed a production mobile client that could make decentralized event data understandable and reliable for everyday users, alongside the backend services that support it.",
      approach:
        "Built the Flutter application and its event-driven state layer, connected Nostr data, Node.js services, Firebase, and deployment infrastructure, and supported the product through production release.",
      ownership: [
        "Built and shipped the Flutter application",
        "Designed event-driven application state",
        "Connected Nostr data and Node.js services",
        "Managed Firebase and Linux deployment infrastructure",
      ],
      results: [
        "Live on Google Play and TestFlight via gathr.gives",
        "Production Flutter client for iOS and Android",
        "Nostr, Node.js, and Firebase integration in production",
      ],
      stack: ["Flutter", "Dart", "Nostr", "Node.js", "Firebase", "Linux"],
      link: "https://gathr.gives",
      signal: "Live iOS + Android product",
      featured: true,
      order: 4,
      role: "Software engineer / Flutter developer",
      period: "Dec 2023 – Sep 2025",
      status: "Live",
      services: ["product-engineering", "existing-product-development"],
      architecture: ["Flutter client", "Event state", "Node.js services", "Nostr relays", "Firebase"],
      media: [
        {
          src: "/work/gathr.webp",
          alt: "Gathr homepage showing community fundraising screens on iOS and Android",
          caption: "gathr.gives, October 2026.",
          width: 1440,
          height: 950,
        },
      ],
      sections: [
        {
          title: "The product",
          body: [
            "Gathr is a social product for connecting people with causes, communities, and fundraising. The public site distributes the app on the App Store and Google Play.",
            "The engineering problem was not a static feed. Events arrive continuously, state has to stay coherent, and the client has to remain usable when the network or a relay misbehaves.",
          ],
        },
        {
          title: "What I built",
          body: [
            "I worked on the production Flutter client and the surrounding delivery work. The public product and the role are verifiable; internal architecture and customer data are not published here.",
          ],
          bullets: [
            "Flutter application delivered for iOS and Android",
            "Event-driven state for decentralized data",
            "Node.js service integration",
            "Firebase and Linux infrastructure operation",
            "Production release support",
          ],
        },
        {
          title: "Engineering decisions",
          body: [
            "The client treats remote events as the source of change, not as a one-time fetch. That makes the interface react to new activity without forcing a full refresh, but it also means connection failures and duplicate events have to be handled explicitly.",
            "The work sat across client, services, and infrastructure. Keeping those boundaries clear was more valuable than introducing another abstraction layer.",
          ],
        },
        {
          title: "Scope and confidentiality",
          body: [
            "Gathr is employer work. This page describes the public product and my stated responsibilities. It does not publish proprietary implementation details, internal metrics, customer information, or code owned by Gathr.",
          ],
        },
      ],
    },
    {
      slug: "rollee-connect",
      name: "Rollee Connect SDK",
      category: "Fintech SDK",
      summary:
        "A Flutter SDK that gives product teams a typed integration surface for Rollee's employment and income data.",
      problem:
        "Rollee needed a Flutter integration layer that external product teams could adopt without learning internal API complexity or mishandling sensitive employment data.",
      approach:
        "Designed and delivered the SDK around a small public API, typed data flow, an explicit authentication/session path, integration documentation, and a production handoff.",
      ownership: [
        "Flutter SDK engineering during the 2023 engagement",
        "Public integration API design",
        "Typed data flow and error handling",
        "Developer documentation and integration examples",
      ],
      results: [
        "Rollee Connect Flutter SDK published on pub.dev (v2.0.1)",
        "Typed integration surface for host applications",
        "Documented authentication and data flow",
      ],
      stack: ["Flutter", "Dart", "REST APIs", "SDK design", "Fintech"],
      link: "https://pub.dev/packages/getrollee_flutter_sdk",
      signal: "Published Flutter SDK",
      featured: true,
      order: 5,
      role: "Flutter SDK engineer",
      period: "2023",
      status: "Published",
      services: ["integrations-infrastructure", "product-engineering"],
      architecture: ["Host app", "Rollee SDK", "Auth/session", "Rollee API"],
      media: [
        {
          src: "/work/rollee.webp",
          alt: "Rollee website showing employment, income, and scoring data product",
          caption: "Rollee's public product surface, October 2026.",
          width: 1440,
          height: 950,
        },
      ],
      sections: [
        {
          title: "The problem",
          body: [
            "Employment and income verification is sensitive, multi-step, and easy to integrate badly. A host application needs a clear session model, typed results, and predictable failure states without coupling its codebase to Rollee's internal API.",
            "The SDK is the boundary between those concerns.",
          ],
        },
        {
          title: "What I built",
          body: [
            "I worked on the Flutter SDK during the 2023 engagement. The package is public on pub.dev, currently at v2.0.1; later versions may include work by the Rollee team.",
          ],
          bullets: [
            "Flutter package with a small public integration API",
            "Typed request and response models",
            "Authentication and session flow",
            "Error states a host app can present",
            "Integration documentation and examples",
          ],
        },
        {
          title: "Engineering decisions",
          body: [
            "The SDK hides transport and internal endpoint shape while keeping the data typed for the host app. The public surface is intentionally narrow: initialize, authenticate, request, and handle a typed result.",
            "For fintech integrations, the failure path matters as much as the happy path. Network errors, expired sessions, and incomplete profiles need distinct, safe outcomes rather than a generic exception.",
          ],
        },
        {
          title: "Scope and confidentiality",
          body: [
            "This page describes the public package and my stated engagement. It does not disclose Rollee's internal API, customer data, security implementation, or proprietary business logic. The public package and the company site are the supporting evidence.",
          ],
        },
      ],
    },
    {
      slug: "dart-nostr",
      name: "Dart Nostr",
      category: "Protocol engineering",
      summary:
        "A pure-Dart Nostr SDK covering relay transport, event signing, typed subscriptions, encryption, zaps, and media.",
      problem:
        "Dart and Flutter developers lacked a complete typed protocol layer for building Nostr clients, forcing every product to rebuild relay handling, signing, and NIP support.",
      approach:
        "Implemented relay transport, event signing, typed subscription streams, NIP-44 encryption, NIP-42 authentication, reconnect behavior, and pluggable signing behind one package.",
      ownership: [
        "Created and maintain the package",
        "Implemented relay and subscription primitives",
        "Implemented signing, encryption, and NIP coverage",
        "Designed typed interfaces for application developers",
      ],
      results: [
        "51 GitHub stars and 18 forks on 28 October 2026",
        "25+ NIPs implemented and documented",
        "v11.0.0 published on pub.dev",
        "NIP-44 v2 passes the official test vectors",
      ],
      stack: ["Dart", "Nostr", "WebSockets", "Cryptography", "Protocol design"],
      link: "https://pub.dev/packages/nostr",
      signal: "51 GitHub stars / 25+ NIPs",
      featured: true,
      order: 6,
      role: "Creator and maintainer",
      period: "Ongoing",
      status: "Published",
      services: ["integrations-infrastructure", "existing-product-development"],
      architecture: ["Flutter app", "Typed SDK", "Relay pool", "Nostr relays"],
      media: [
        {
          src: "/work/dart-nostr.webp",
          alt: "pub.dev page for the nostr package showing version 11.0.0 and protocol capabilities",
          caption: "dart_nostr on pub.dev, October 2026.",
          width: 1440,
          height: 950,
        },
      ],
      sections: [
        {
          title: "The problem",
          body: [
            "Nostr is a protocol, not a product. A client needs relay management, event signing, subscription streams, encryption, authentication, reconnection, and careful handling of malformed or duplicate events. Rebuilding that in every Flutter app is expensive and easy to get subtly wrong.",
            "Dart Nostr provides the shared protocol layer.",
          ],
        },
        {
          title: "What I built",
          body: [
            "The package is a complete Dart client surface, not a thin wrapper around one relay.",
          ],
          bullets: [
            "Relay connections with reconnect backoff and fail-fast behavior",
            "Event creation, signing, and verification",
            "Typed subscription streams",
            "NIP-44 v2 encryption and NIP-49 key handling",
            "NIP-42 authentication, zaps, media uploads, and identity tooling",
            "Pluggable signers for local keys and external signer flows",
          ],
        },
        {
          title: "Engineering decisions",
          body: [
            "Crypto interoperability is not a place for best-effort implementation. NIP-44 v2 is checked against the official test vectors, and NIP-49 decrypts the reference payload. That gives client developers a trustworthy base instead of a package that works only against one relay.",
            "Errors are returned as typed results rather than thrown unpredictably. In a protocol client, callers need to distinguish a dead relay from a rejected event from invalid input without parsing exception strings.",
          ],
        },
        {
          title: "Adoption",
          body: [
            "The package is public on pub.dev (v11.0.0) and GitHub. On 28 October 2026 GitHub showed 51 stars and 18 forks; the README documents 25+ NIPs and the public package page describes the protocol surface.",
            "It is maintained as an open-source package with a documented API, not a product-specific internal library.",
          ],
        },
      ],
    },
  ] satisfies Project[],
  capabilities: [
    {
      slug: "product-engineering",
      title: "Product engineering",
      summary:
        "SaaS, web and mobile applications, MVPs, and product features, built end to end and prepared for production.",
      detail: [
        "I build products from the data model up: backend APIs, application logic, authentication, permissions, background jobs, and the web or mobile interface that uses them. I work in Flutter and Dart when mobile is the right surface, and in TypeScript and Next.js when the product lives on the web.",
        "The goal is a product that can be used, deployed, and extended. Architecture earns its complexity; everything else gets the smallest reliable implementation.",
      ],
      outcomes: [
        "SaaS and web applications",
        "Flutter applications for iOS and Android",
        "MVPs and new product builds",
        "Product features and user flows",
        "Authentication, permissions, and data",
        "Deployment and production handover",
      ],
      examples: [
        "Build an MVP from requirements to a working release",
        "Add a substantial feature to an existing product",
        "Take a prototype to a deployable production build",
        "Build a cross-platform Flutter client for an existing API",
      ],
      fit: [
        "You have a product idea that needs a senior engineer to build it.",
        "You need web and mobile surfaces that share one backend.",
        "You want one person to own the product from architecture to release.",
      ],
      relatedProjects: ["reqistry", "flutterguard", "gathr"],
    },
    {
      slug: "integrations-infrastructure",
      title: "Integrations & infrastructure",
      summary:
        "APIs, SDKs, backend services, MCP, realtime systems, and automation that make products connect and keep running.",
      detail: [
        "Most products are a network of services, not a single application. I build the interfaces between them: typed API clients, SDKs, webhooks, synchronization jobs, realtime channels, and the backend services that hold the integration together.",
        "I also design developer-facing surfaces such as SDKs and MCP servers, where the public contract has to be small, typed, documented, and predictable across failure states.",
      ],
      outcomes: [
        "Backend APIs and service design",
        "Dart and Flutter SDKs, typed API clients",
        "Third-party API integration and synchronization",
        "Webhooks, queues, and background processing",
        "MCP servers and agent-facing APIs",
        "Realtime systems and developer tooling",
      ],
      examples: [
        "Connect a product to several external APIs reliably",
        "Publish an SDK for an existing service",
        "Repair an integration that silently drops records",
        "Build an MCP server that exposes a catalog to agents",
      ],
      fit: [
        "Other teams need to integrate with your product.",
        "Data is moving between systems by hand or failing silently.",
        "You need a developer-facing API or SDK that is safe to adopt.",
      ],
      relatedProjects: ["reqistry", "dart-openai", "rollee-connect", "dart-nostr"],
    },
    {
      slug: "ai-engineering",
      title: "AI engineering",
      summary:
        "LLM integrations, AI product features, agents, and the infrastructure that keeps model behaviour reliable.",
      detail: [
        "AI is useful when it is part of a system, not a demo. I integrate language models into products with explicit boundaries: structured outputs, validated tool calls, retries, permissions, observability, and a clear path when the model is wrong.",
        "That includes document processing, retrieval and search, classification, assistant-style interfaces, and tool-using agents that need to touch real data safely.",
      ],
      outcomes: [
        "LLM API integration and provider abstraction",
        "AI product features inside existing applications",
        "Tool-using agents with bounded permissions",
        "Structured extraction and document workflows",
        "Retrieval and intelligent search",
        "Observable latency, cost, and failure behaviour",
      ],
      examples: [
        "Add an assistant to an existing SaaS product",
        "Extract structured data from documents reliably",
        "Connect a model to internal tools with guardrails",
        "Replace a manual review queue with a model-assisted one",
      ],
      fit: [
        "You have a product problem that a model can plausibly help with.",
        "You need the feature to fail safely, not just demo well.",
        "You want the AI layer and its surrounding software owned by one engineer.",
      ],
      relatedProjects: ["reqistry", "dart-openai"],
    },
    {
      slug: "existing-product-development",
      title: "Existing product development",
      summary:
        "Debugging, modernization, new features, and ongoing engineering for products that are already in use.",
      detail: [
        "Not every engagement starts with a blank page. A lot of useful work is making an existing system behave: finding the real cause of a bug, modernizing a fragile layer, improving performance, or adding a feature without destabilizing the rest of the product.",
        "I work inside the codebase and conventions that already exist. A rewrite is a last resort, not a default.",
      ],
      outcomes: [
        "Bug diagnosis and repair",
        "Feature development in an existing codebase",
        "Legacy modernization and refactoring",
        "Reliability and error-handling improvements",
        "Performance work",
        "Ongoing maintenance and deployment support",
      ],
      examples: [
        "Track down a production bug that is hard to reproduce",
        "Modernize an aging backend or mobile codebase",
        "Add a feature to an unfamiliar product",
        "Stabilize a flaky integration or background job",
      ],
      fit: [
        "Something in the product is failing or slowing the team down.",
        "You need a careful engineer to work inside an existing system.",
        "You want the smallest change that actually fixes the problem.",
      ],
      relatedProjects: ["reqistry", "dart-nostr"],
    },
  ] satisfies Service[],
  stackGroups: [
    { label: "Languages", items: ["TypeScript", "JavaScript", "Dart", "SQL"] },
    { label: "AI", items: ["LLM APIs", "Tool calling", "Structured outputs", "Retrieval", "Embeddings"] },
    { label: "Application", items: ["Node.js", "Fastify", "Next.js", "React", "Flutter"] },
    { label: "Data", items: ["PostgreSQL", "Prisma", "SQLite", "Redis", "Firebase"] },
    { label: "Delivery", items: ["Docker", "Linux", "VPS deployment", "CI/CD", "Monitoring"] },
    { label: "Protocols", items: ["REST", "WebSockets", "MCP", "Nostr", "SDK design"] },
  ],
  aiReliability: [
    "Structured outputs and validation",
    "Bounded tools and permissions",
    "Retries and explicit failure paths",
    "Human approval where risk demands it",
    "Observable latency and cost",
    "Deterministic software around model behaviour",
  ],
  process: [
    {
      step: "01",
      title: "Discuss",
      description: "Understand the problem, the constraints, and what a useful outcome looks like.",
    },
    {
      step: "02",
      title: "Scope",
      description: "Agree on deliverables, milestones, and a written proposal. Every project is quoted individually.",
    },
    {
      step: "03",
      title: "Build",
      description: "Implement in small increments with testing, clear communication, and working software along the way.",
    },
    {
      step: "04",
      title: "Deliver",
      description: "Hand over the running system, documentation, and a clear path to operate or continue it.",
    },
  ],
  experience: [
    {
      id: "gathr",
      company: "Gathr",
      role: "Software Engineer / Flutter Developer",
      period: "12/2023 – 09/2025",
      type: "Remote",
      scope:
        "Built and shipped the production mobile application, designed event-driven state, and managed backend services and cloud infrastructure.",
      stack: ["Flutter", "Nostr", "Node.js", "Firebase", "Linux", "Git"],
      link: "https://gathr.gives",
    },
    {
      id: "rollee",
      company: "Rollee",
      role: "Flutter SDK Engineer",
      period: "07/2023 – 08/2023",
      type: "Remote",
      scope:
        "Worked on delivery of the Rollee Connect Flutter SDK, including its public integration API and developer-facing documentation.",
      stack: ["Flutter", "Dart", "REST APIs", "SDK design"],
      link: "https://pub.dev/packages/getrollee_flutter_sdk",
    },
  ],
  problems: [
    "I need to connect several APIs to my product.",
    "We want to add an AI feature to our SaaS.",
    "Our Flutter application needs improvements.",
    "We need an internal dashboard.",
    "An existing integration keeps failing.",
    "We need someone to build a developer SDK.",
    "We have an unfinished software product.",
  ],
  faq: [
    {
      question: "Can you work on existing codebases?",
      answer:
        "Yes. I can audit an existing system, find the cause of a bug, improve architecture, add integrations, or own a focused feature without forcing a rewrite.",
    },
    {
      question: "Can I hire you for one feature or a small task?",
      answer:
        "Yes. Small, well-defined tasks are welcome: a broken integration, a single feature, an SDK addition, or a focused review. The scope and proposal are agreed before work starts.",
    },
    {
      question: "Can you build an application from scratch?",
      answer:
        "Yes. I can take a product from requirements and architecture through implementation, integration, and delivery. I also work with existing teams and codebases.",
    },
    {
      question: "Do you work remotely?",
      answer:
        "Yes. I am based in Casablanca, Morocco, and work remotely with clients and teams worldwide. Communication and overlap are agreed per project.",
    },
    {
      question: "How do you quote projects?",
      answer:
        "Every project is scoped individually. After reviewing your requirements, I will discuss the approach, deliverables, and proposal with you.",
    },
    {
      question: "What happens after I submit an inquiry?",
      answer:
        "I review the requirements and reply by email, usually to ask a few clarifying questions or suggest a short call. If the project is not a fit, I will say so directly.",
    },
    {
      question: "Do you provide maintenance?",
      answer:
        "Yes, when it is part of the agreed scope. That can include bug fixes, dependency updates, monitoring, or continued feature work after delivery.",
    },
  ],
  serviceOptions: [
    { slug: "product-engineering", label: "Product Engineering" },
    { slug: "integrations-infrastructure", label: "Integrations & Infrastructure" },
    { slug: "ai-engineering", label: "AI Engineering" },
    { slug: "existing-product-development", label: "Existing Product Development" },
    { slug: "other", label: "Other / not sure" },
  ],
  projectStages: [
    { slug: "new-idea", label: "New idea" },
    { slug: "existing-product", label: "Existing product" },
    { slug: "existing-system-problem", label: "Existing system with a problem" },
    { slug: "not-sure", label: "Not sure" },
  ],
  contactMethods: ["Email", "Video call", "Either"],
  copy: {
    brand: { name: "GWHYYY", signature: "Independent software engineer & product builder" },
    nav: {
      links: [
        { label: "Services", href: "/services" },
        { label: "Work", href: "/work" },
        { label: "About", href: "/about" },
      ],
      availableLabel: "Available",
      primaryCta: "Reach out",
      secondaryCta: "View work",
    },
    hero: {
      eyebrow: "Independent software engineer & product builder / Casablanca, working worldwide",
      title: "AI-supercharged engineer who actually ships.",
      subline:
        "Quality work, built efficiently and shipped fast.",
      ctaPrimary: "Reach out",
      ctaSecondary: "Explore my work",
      proofLabel: "Shipped and operated by me",
    },
    work: {
      heading: "What I made and work(ed) at",
      body: "My own products, open-source work, and teams I’ve been part of.",
      allLink: "All work",
    },
    services: {
      heading: "Ready to work with you.",
      body: "",
    },
    contact: {
      eyebrow: "Start a conversation",
      heading: "Tell me what you are trying to build.",
      body: "A short description is enough. I will review it and reply with questions or a suggested next step. Every project is scoped and quoted individually.",
      successHeading: "Inquiry received.",
      successBody:
        "Your message is saved. I will review it and reply by email. If you need to add context, send another message or email work@gwhyyy.com.",
      againLabel: "Send another inquiry",
      submitLabel: "Send inquiry",
      sendingLabel: "Sending…",
      errorMessage: "The inquiry could not be sent. Your text has been kept. Try again, or email work@gwhyyy.com.",
      fieldName: "Full name",
      fieldEmail: "Email address",
      fieldService: "Service needed",
      fieldStage: "Project stage",
      fieldDescription: "Project description",
      fieldCompany: "Company or project name",
      fieldWebsite: "Company website",
      fieldTimeframe: "Desired start timeframe",
      fieldContactMethod: "Preferred contact method",
      fieldExtra: "Anything else?",
      optional: "Optional",
      privacyNote:
        "I use this information only to respond to your inquiry. No names, emails, or project descriptions are sent to analytics. See the privacy notice.",
    },
    footer: {
      blurb:
        "Independent software engineer and product builder. I help startups and businesses ship reliable, production-ready software.",
      navigateHeading: "Navigate",
      connectHeading: "Connect",
      linkServices: "Services",
      linkWork: "Work",
      linkAbout: "About",
      linkResume: "Resume",
      linkContact: "Reach out",
      linkPrivacy: "Privacy",
      linkEmail: "Email",
      linkSchedule: "Schedule a call",
    },
    project: {
      backLabel: "All work",
      contextHeading: "The problem",
      nextPrefix: "Next project",
      openCta: "Visit project",
      relatedHeading: "Related services",
      ctaHeading: "Have a similar problem?",
      ctaBody: "Describe what you are working on. I will tell you whether I can help and what a sensible first step looks like.",
      metaRole: "Role",
      metaPeriod: "Period",
      metaStatus: "Status",
      metaStack: "Stack",
      evidenceLabel: "Verified evidence",
      mediaLabel: "Product views",
    },
    servicesPage: {
      heading: "Services",
      body: "Hire one engineer for the whole problem: the integration, the backend, the client, and the handover. Or bring me in for a focused piece.",
      ctaHeading: "Not sure which service fits?",
      ctaBody: "Choose “Other / not sure” in the inquiry form and describe the problem. I will suggest the right scope.",
    },
    about: {
      heading: "An engineer who builds products.",
      body: "I am Mohamed Anas Fikhi. I work directly with the people who own the problem, from the first conversation through delivery.",
      principlesHeading: "How I work",
      principles: [
        {
          title: "Evidence before adjectives",
          body: "Claims should point to something: a running product, a public package, a repository, a metric with a date.",
        },
        {
          title: "Small systems, owned end to end",
          body: "Architecture earns its complexity. I prefer the smallest system that solves the problem and can be operated after handover.",
        },
        {
          title: "Direct communication",
          body: "Clear scope, honest trade-offs, and early bad news. You should always know what is working, what is not, and what happens next.",
        },
      ],
      ctaHeading: "Work with me directly.",
      ctaBody: "No account managers, no handoff to a junior team. The person you speak to is the person building the software.",
    },
    workPage: {
      heading: "Work",
      body: "Products, SDKs, and protocol libraries. Each case study states what was built, what I owned, and what can be verified.",
    },
    contactPage: {
      heading: "Reach out",
      body: "Tell me what you need. The more concrete the problem, the easier it is to suggest a useful next step.",
      asideHeading: "What happens next",
      asideSteps: [
        "I read the inquiry and check whether it is a fit.",
        "I reply by email with questions or a suggested call.",
        "If we continue, I write a scope and proposal with deliverables and milestones.",
      ],
      emailHeading: "Prefer email?",
      emailBody: "Send the same details directly to work@gwhyyy.com.",
      availabilityHeading: "Availability",
    },
    privacy: {
      heading: "Privacy notice",
      body: "This notice explains what this website collects and why. It covers the website, not the separate Sandouk application.",
    },
    notFound: {
      label: "404",
      heading: "That page does not exist.",
      body: "The link may be old or mistyped. The work index and the rest of the site are still here.",
      homeCta: "Return home",
      workCta: "View work",
    },
    structured: {
      serviceName: "GWHYYY — independent software engineering and product development",
      areaServed: "Worldwide",
      geoRegion: "MA-05",
      alternateNames: ["Anas Fikhi", "anasfik"],
      firstName: "Mohamed Anas",
      lastName: "Fikhi",
      username: "gwhyyy",
      siteName: "GWHYYY",
      language: "en",
    },
    social: {
      footerLine: "PRODUCT ENGINEERING / INTEGRATIONS / AI / EXISTING PRODUCTS",
      caseStudyLabel: "GWHYYY / CASE STUDY",
      portfolioLabel: "GWHYYY / INDEPENDENT SOFTWARE ENGINEER",
    },
    resume: {
      eyebrow: "GWHYYY / Resume",
      sectionExperience: "Experience",
      sectionProjects: "Selected projects",
      sectionCapabilities: "Services",
      sectionStack: "Technical stack",
    },
  },
} as const;

type Mutable<T> = T extends string
  ? string
  : T extends number
  ? number
  : T extends boolean
  ? boolean
  : T extends ReadonlyArray<infer U>
  ? Mutable<U>[]
  : T extends object
  ? { -readonly [K in keyof T]: Mutable<T[K]> }
  : T;

type LiteralSiteConfig = Mutable<typeof siteConfig>;

// Array fields use their declared domain shape, not the literal objects of the
// current defaults, so the dashboard can add/edit entries without casting.
export type SiteConfig = Omit<LiteralSiteConfig, "projects" | "capabilities" | "metrics" | "serviceOptions" | "projectStages"> & {
  projects: Project[];
  capabilities: Service[];
  metrics: Metric[];
  serviceOptions: { slug: string; label: string }[];
  projectStages: { slug: string; label: string }[];
};

export const defaultSiteContent = siteConfig as unknown as SiteConfig;

export const projects = [...siteConfig.projects].sort((a, b) => a.order - b.order);

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getService(slug: string) {
  return siteConfig.capabilities.find((service) => service.slug === slug);
}

export default siteConfig;
