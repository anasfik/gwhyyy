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
};

export type Capability = {
  title: string;
  summary: string;
  outcomes: string[];
};

const siteConfig = {
  seo: {
    url: "https://gwhyyy.com",
    title: "Mohamed Anas Fikhi — AI Product & Automation Engineer",
    titleTemplate: "%s | GWHYYY",
    description:
      "Mohamed Anas Fikhi (GWHYYY) builds AI-powered products, workflow automations, APIs, SDKs, mobile applications, and production software from Casablanca, Morocco.",
    keywords: [
      "Mohamed Anas Fikhi",
      "GWHYYY",
      "AI Product Engineer",
      "AI Automation Engineer",
      "AI Engineer Morocco",
      "Remote AI Engineer",
      "Software Engineer Morocco",
      "AI integration",
      "automation engineer",
      "SDK engineer",
      "Flutter engineer",
      "Dart OpenAI",
    ],
    twitterHandle: "@gwhyyy",
  },
  personal: {
    name: "Mohamed Anas Fikhi",
    handle: "GWHYYY",
    title: "AI Product & Automation Engineer",
    headline: "I turn manual workflows into reliable software.",
    summary:
      "AI products, automations, APIs, SDKs, mobile applications, and production systems, designed and shipped end to end.",
    bio:
      "Software engineer with a foundation in product delivery, backend systems, open-source SDKs, mobile engineering, protocols, and infrastructure. I use AI where it makes software more capable, with deterministic systems around model behavior.",
    email: "work@gwhyyy.com",
    phone: "+212760386573",
    location: "Casablanca, Morocco",
    workMode: "Remote worldwide",
  },
  availability: {
    available: true,
    label: "Available for selected projects",
    engagement:
      "Remote contract engineering, product development, AI integration, automation, consulting, and selected longer-term opportunities.",
  },
  links: {
    github: "https://github.com/anasfik",
    linkedin: "https://linkedin.com/in/mohamed-anas-fikhi",
    calendly: "https://calendly.com/ffikhi-aanas/30min",
    email: "mailto:work@gwhyyy.com",
  },
  metrics: [
    { value: "666+", label: "GitHub stars on Dart OpenAI" },
    { value: "5K+", label: "Reqistry Play Store downloads" },
    { value: "02", label: "Verified production engagements" },
    { value: "Remote", label: "Casablanca, Morocco" },
  ],
  projects: [
    {
      slug: "dart-openai",
      name: "Dart OpenAI",
      category: "AI Infrastructure / Open Source SDK",
      summary:
        "A type-safe OpenAI API client that gives Dart and Flutter teams a production-ready integration surface.",
      problem:
        "Dart and Flutter developers needed a maintained, typed way to integrate OpenAI APIs without rebuilding transport, streaming, and response models in every product.",
      approach:
        "Designed a developer-first Dart package around typed API models, streaming responses, tool calling, media endpoints, embeddings, files, fine-tuning, and moderation.",
      ownership: [
        "Created and maintain the library",
        "Designed the public API and typed models",
        "Implemented API coverage, streaming, and package documentation",
      ],
      results: [
        "666+ GitHub stars",
        "Published on pub.dev",
        "Used across the Dart and Flutter ecosystem",
      ],
      stack: ["Dart", "Flutter", "OpenAI API", "SDK Design", "Open Source"],
      link: "https://github.com/anasfik/openai",
      signal: "666+ GitHub stars",
      featured: true,
      order: 1,
      architecture: ["Product", "Typed Dart SDK", "OpenAI API"],
    },
    {
      slug: "nostr-mind",
      name: "NostrMind",
      category: "AI Automation / Event-Driven System",
      summary:
        "A configurable Nostr monitoring worker that classifies live events with an LLM and can send targeted DM alerts.",
      problem:
        "Monitoring decentralized event streams requires continuous filtering, interpretation, and notification that is costly to perform manually.",
      approach:
        "Built a config-driven worker that listens to Nostr relays, applies explicit rules, requests model classification, and routes matching events to optional alerts.",
      ownership: [
        "Designed the monitoring and classification flow",
        "Implemented configurable rules and alert routing",
        "Built the TypeScript and Node.js worker",
      ],
      results: [
        "Config-driven monitoring without code changes",
        "LLM classification over live Nostr events",
        "Optional real-time DM alerts",
      ],
      stack: ["TypeScript", "Node.js", "LLM API", "Nostr", "Event Processing"],
      link: "https://github.com/anasfik/NostrMind",
      signal: "Public source code",
      featured: true,
      order: 2,
      architecture: ["Nostr Relays", "Rule Engine", "LLM Classifier", "DM Alerts"],
    },
    {
      slug: "gathr",
      name: "Gathr",
      category: "Production Product Engineering",
      summary:
        "A shipped social product connecting polished cross-platform UX with decentralized Nostr events and backend services.",
      problem:
        "Gathr needed a production mobile client that could make decentralized protocol behavior understandable and reliable for everyday users.",
      approach:
        "Built the Flutter client and event-driven state layer, then connected Nostr data, Node.js services, Firebase, and deployment infrastructure.",
      ownership: [
        "Built and shipped the Flutter application",
        "Designed event-driven application state",
        "Managed backend services and cloud infrastructure",
      ],
      results: [
        "Released for iOS and Android",
        "Production Nostr and Node.js integration",
        "Backend and infrastructure operated end to end",
      ],
      stack: ["Flutter", "Dart", "Nostr", "Node.js", "Firebase", "Linux"],
      link: "https://gathr.gives",
      signal: "Shipped production application",
      featured: true,
      order: 3,
      architecture: ["Flutter Client", "Nostr Relays", "Node.js Services", "Firebase"],
    },
    {
      slug: "rollee-sdk",
      name: "Rollee Connect SDK",
      category: "Fintech / SDK Engineering",
      summary:
        "A Flutter SDK that turns employment-data connectivity into a clean integration surface for third-party applications.",
      problem:
        "Rollee needed a Flutter integration layer for sensitive employment data that external product teams could adopt without learning internal API complexity.",
      approach:
        "Designed and delivered the SDK as the sole Flutter engineer, with a small public API, typed data flow, integration documentation, and production handoff.",
      ownership: [
        "Sole engineer for the Flutter SDK",
        "Designed the public integration API",
        "Delivered implementation and developer documentation",
      ],
      results: [
        "Production SDK delivered end to end",
        "Third-party integration surface",
        "Developer-first API and documentation",
      ],
      stack: ["Flutter", "Dart", "REST APIs", "SDK Design", "Fintech"],
      link: "https://www.getrollee.com",
      signal: "Sole SDK ownership",
      featured: true,
      order: 4,
      architecture: ["Host Application", "Rollee Flutter SDK", "Rollee API"],
    },
    {
      slug: "dart-nostr",
      name: "Dart Nostr",
      category: "Protocol Engineering / Open Source",
      summary:
        "A Dart library for building typed Nostr clients with relay connections, subscriptions, signing, and broad NIP support.",
      problem:
        "The Dart ecosystem lacked a reliable protocol layer for teams building Flutter applications on Nostr.",
      approach:
        "Implemented reusable protocol primitives for relay communication, events, subscriptions, signing, and more than 25 documented NIPs.",
      ownership: [
        "Created and maintain the package",
        "Implemented protocol and relay primitives",
        "Designed typed interfaces for application developers",
      ],
      results: [
        "50+ GitHub stars",
        "25+ documented NIPs",
        "Reusable foundation for Dart and Flutter Nostr clients",
      ],
      stack: ["Dart", "Nostr", "WebSockets", "Protocol Design", "Open Source"],
      link: "https://github.com/anasfik/nostr",
      signal: "50+ GitHub stars",
      featured: true,
      order: 5,
      architecture: ["Flutter App", "Dart Nostr", "WebSocket Relays"],
    },
    {
      slug: "public-apis",
      name: "Reqistry",
      category: "Mobile Product / Developer Tools",
      summary:
        "A published mobile product for finding, filtering, and saving public APIs from a developer-focused catalog.",
      problem:
        "API discovery directories are difficult to browse on mobile when developers need a quick reference away from a desktop.",
      approach:
        "Built a focused Flutter product around search, category filters, saved APIs, and fast access to developer resources.",
      ownership: [
        "Designed and built the application independently",
        "Implemented search, filtering, and favorites",
        "Published and maintain the Play Store release",
      ],
      results: [
        "5K+ Google Play downloads",
        "Published production mobile application",
        "Searchable and filterable API catalog",
      ],
      stack: ["Flutter", "Dart", "Mobile", "Developer Tools"],
      link: "https://play.google.com/store/apps/details?id=com.gwhyyy.publicApis",
      signal: "5K+ Play Store downloads",
      featured: true,
      order: 6,
      architecture: ["Flutter App", "API Catalog", "Search & Saved Items"],
    },
  ] satisfies Project[],
  capabilities: [
    {
      title: "AI products & agents",
      summary:
        "Add model intelligence to real products with explicit tool boundaries and software that handles uncertainty.",
      outcomes: ["Tool-using agents", "Structured extraction", "Intelligent search", "Human approval flows"],
    },
    {
      title: "Automation & integrations",
      summary:
        "Connect fragmented tools and replace repetitive handoffs with observable, event-driven workflows.",
      outcomes: ["API integrations", "Webhooks and jobs", "Internal tools", "Data processing"],
    },
    {
      title: "Product & backend engineering",
      summary:
        "Take software from first architecture through APIs, application logic, data flow, and production operation.",
      outcomes: ["Backend services", "Production applications", "Authentication", "Realtime systems"],
    },
    {
      title: "SDKs & developer tools",
      summary:
        "Turn complex services and protocols into typed, documented interfaces other engineers can trust.",
      outcomes: ["SDK architecture", "API design", "Packages and libraries", "Protocol implementations"],
    },
    {
      title: "Infrastructure & delivery",
      summary:
        "Package, deploy, and operate software with practical infrastructure suited to the product and team.",
      outcomes: ["Docker", "Linux and VPS", "CI/CD", "Monitoring and deployment"],
    },
    {
      title: "Mobile product engineering",
      summary:
        "Build cross-platform products where mobile delivery is the right interface, backed by strong application architecture.",
      outcomes: ["Flutter and Dart", "iOS and Android", "Performance", "Event-driven state"],
    },
  ] satisfies Capability[],
  stackGroups: [
    { label: "AI systems", items: ["LLM APIs", "Tool calling", "Structured outputs", "Agents", "RAG", "Embeddings"] },
    { label: "Application", items: ["TypeScript", "JavaScript", "Node.js", "Dart", "Flutter"] },
    { label: "Data & services", items: ["Firebase", "REST APIs", "Webhooks", "Background jobs"] },
    { label: "Infrastructure", items: ["Docker", "Linux", "VPS deployment", "CI/CD"] },
    { label: "Protocols", items: ["WebSockets", "Nostr", "SDK design", "Event-driven systems"] },
  ],
  aiReliability: [
    "Structured outputs and validation",
    "Bounded tools and permissions",
    "Retries and failure handling",
    "Human approval where risk demands it",
    "Observable latency and cost",
    "Deterministic software around model behavior",
  ],
  process: [
    { step: "01", title: "Understand", description: "Map the real process, constraints, risks, and useful success criteria." },
    { step: "02", title: "Architect", description: "Choose the smallest reliable system and define integration boundaries." },
    { step: "03", title: "Build", description: "Ship the smallest production slice that proves value." },
    { step: "04", title: "Verify", description: "Test failure cases, security, observability, and AI behavior." },
    { step: "05", title: "Deploy", description: "Release with monitoring, safeguards, and a clear operating path." },
    { step: "06", title: "Iterate", description: "Use real behavior to improve what creates measurable value." },
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
        "Owned delivery of the Rollee Connect Flutter SDK, including its public integration API and developer-facing implementation.",
      stack: ["Flutter", "Dart", "REST APIs", "SDK Design"],
      link: "https://www.getrollee.com",
    },
  ],
  faq: [
    {
      question: "What kind of work is a good fit?",
      answer:
        "AI product features, workflow automation, API integrations, backend and full-stack product work, SDKs, developer tools, infrastructure-adjacent delivery, and selected Flutter engagements.",
    },
    {
      question: "Do you work with existing products and codebases?",
      answer:
        "Yes. I can audit an existing system, map constraints, improve architecture, add integrations, or own a focused product slice without forcing a rewrite.",
    },
    {
      question: "How do engagements start?",
      answer:
        "Usually with a short brief and call. From there I define scope, risks, ownership, and the smallest production milestone worth shipping.",
    },
    {
      question: "Do you only build AI products?",
      answer:
        "No. AI is one layer in a broader software engineering toolkit. Many useful systems need solid APIs, data flow, product engineering, or automation without model involvement.",
    },
    {
      question: "Where do you work from?",
      answer:
        "Casablanca, Morocco. I work remotely with teams and clients worldwide.",
    },
  ],
  budgetOptions: ["Under $5,000", "$5,000 – $15,000", "$15,000 – $50,000", "$50,000+", "Not sure yet"],
  copy: {
    brand: { name: "GWHYYY", signature: "MAF / 2026", domain: "gwhyyy.com" },
    nav: {
      links: [
        { label: "Work", href: "/#work" },
        { label: "Services", href: "/#services" },
        { label: "Experience", href: "/#experience" },
        { label: "Stack", href: "/#stack" },
        { label: "Resume", href: "/resume" },
      ],
      availableLabel: "Available",
      primaryCta: "Start a project",
      secondaryCta: "Schedule a call",
    },
    hero: {
      titleLead: "AI Product",
      titleAccent: "&",
      titleTail: "Automation Engineer",
      subline: "From AI integrations to APIs, SDKs, mobile products, and infrastructure.",
      ctaPrimary: "Start a project",
      ctaSecondary: "Schedule a call",
      ctaTertiary: "View work",
      asideLabel: "SYSTEM / SCOPE",
      asideBadge: "END TO END",
      inputLabel: "Input",
      inputValue: "Business problem",
      outputLabel: "Output",
      outputValue: "Running system",
      steps: ["Architect", "Build", "Operate"],
    },
    work: { eyebrow: "Selected work", heading: "Systems shipped across AI, products, SDKs, protocols, and mobile.", body: "Range without dilution. Each project shows a different part of the same job: understand complexity, build a usable interface around it, and own delivery.", allLink: "All project details" },
    services: { heading: "What I build", body: "Production software first. AI, mobile, infrastructure, and automation applied where each creates leverage." },
    stack: { eyebrow: "Production AI", heading: "Nondeterministic models. Deterministic guardrails.", body: "Useful AI systems need more than prompts. Reliability comes from boundaries, validation, failure handling, permissions, and observable behavior.", toolsHeading: "Tools grouped by what they enable." },
    process: { eyebrow: "Operating model", heading: "From unclear problem to operated system.", body: "Architecture earns its complexity. Build the smallest useful slice, verify failure modes, then grow from evidence." },
    experience: { heading: "Professional experience" },
    openSource: { eyebrow: "Open source / Developer ecosystem", heading: "Infrastructure other engineers choose to build on." },
    faq: { eyebrow: "Before we start", heading: "Direct answers." },
    contact: {
      eyebrow: "Project intake",
      heading: "Have a workflow or product worth improving?",
      body: "Send context, not a polished specification. I will identify the shortest useful next step.",
      emailLabel: "EMAIL",
      callLabel: "CALL",
      fitLabel: "FIT",
      fitValue: "Project-based and contract engagements",
      successHeading: "Brief received.",
      successBody: "I will review the context and reply by email. For a time-sensitive project, schedule a call directly.",
      againLabel: "Send another brief",
      submitLabel: "Send brief",
      sendingLabel: "Sending brief…",
      fieldName: "Name",
      fieldEmail: "Work email",
      fieldCompany: "Company / project",
      fieldObjective: "What are you trying to build or automate?",
      fieldSituation: "Current situation / problem",
      fieldBudget: "Budget range",
      fieldTimeline: "Optional timeline",
      budgetEmpty: "Not specified",
    },
    footer: { blurb: "AI products, automation, and production software built end to end.", navigateHeading: "Navigate", connectHeading: "Connect", linkProjects: "Projects", linkResume: "Resume", linkServices: "Services", linkContact: "Start a project", linkEmail: "Email", linkSchedule: "Schedule call" },
    projectsIndex: { eyebrow: "Work index", heading: "Built across product layers, not inside one narrow lane.", body: "AI and automation, production applications, SDKs, open-source protocols, backend services, infrastructure, and mobile delivery." },
    project: { backLabel: "← Work index", contextLabel: "01 / Context", contextHeading: "Problem", architectureLabel: "02 / Architecture", architectureHeading: "Approach", ownershipLabel: "03 / Ownership", ownershipHeading: "What I owned", resultsLabel: "04 / Results", resultsHeading: "Verified outcomes", technologyLabel: "05 / Technology", openCta: "Open project", nextPrefix: "Next project", nodePrefix: "NODE" },
    hire: {
      eyebrow: "Selected engagements",
      heading: "Bring the hard software problem.",
      body: "I can map it, architect the smallest reliable system, build it, connect it, deploy it, and help operate it.",
      modes: [
        { title: "Product build", body: "Own a focused product or system from architecture through deployment." },
        { title: "Integration & automation", body: "Connect tools, APIs, data, and AI into a reliable operating workflow." },
        { title: "Engineering contract", body: "Join an existing team for a defined product, backend, SDK, or infrastructure scope." },
        { title: "Technical consulting", body: "Audit architecture, de-risk a build, or turn an unclear problem into an executable plan." },
      ],
    },
    resume: { eyebrow: "GWHYYY / Resume", sectionExperience: "Experience", sectionProjects: "Selected projects", sectionCapabilities: "Capabilities", sectionStack: "Technical stack" },
    notFound: { label: "HTTP / 404", heading: "Route not found.", body: "Requested path does not map to a deployed resource. Project index and homepage remain online.", homeCta: "Return home", projectsCta: "View projects" },
    structured: { serviceName: "GWHYYY Product & Systems Engineering", areaServed: "Worldwide", geoRegion: "MA-05", alternateNames: ["Anas Fikhi", "anasfik"], firstName: "Mohamed Anas", lastName: "Fikhi", username: "gwhyyy", siteName: "GWHYYY", language: "en" },
    social: { footerLine: "PRODUCTS / AGENTS / AUTOMATION / APIs / SDKS", caseStudyLabel: "GWHYYY / CASE STUDY", portfolioLabel: "GWHYYY / PORTFOLIO" },
  },
} as const;

type Mutable<T> = T extends string ? string : T extends number ? number : T extends boolean ? boolean : T extends ReadonlyArray<infer U> ? Mutable<U>[] : T extends object ? { -readonly [K in keyof T]: Mutable<T[K]> } : T;

export type SiteConfig = Mutable<typeof siteConfig>;

export const defaultSiteContent = siteConfig as unknown as SiteConfig;

export const projects = [...siteConfig.projects].sort((a, b) => a.order - b.order);

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export default siteConfig;
