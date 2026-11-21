/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  agentRules: false,
  turbopack: { root: process.cwd() },
  serverExternalPackages: ["better-sqlite3"],
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' https://api.resend.com; font-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
      ],
    }];
  },
  async redirects() {
    return [
      // Previous portfolio URLs -> durable routes. Specific slugs first, then the
      // generic project prefix for any remaining links.
      { source: "/projects/public-apis", destination: "/work/reqistry", permanent: true },
      { source: "/projects/rollee-sdk", destination: "/work/rollee-connect", permanent: true },
      { source: "/projects/dart-openai", destination: "/work/dart-openai", permanent: true },
      { source: "/projects/gathr", destination: "/work/gathr", permanent: true },
      { source: "/projects/dart-nostr", destination: "/work/dart-nostr", permanent: true },
      { source: "/projects", destination: "/work", permanent: true },
      { source: "/hire", destination: "/contact", permanent: true },
    ];
  },
  async rewrites() {
    return [
      // Clean URL for static privacy page: /privacy/sandouk -> /privacy/sandouk.html
      // Any file placed under public/ is served at /*; this rewrite hides the .html extension.
      { source: "/privacy/sandouk", destination: "/privacy/sandouk.html" },
      { source: "/privacy/flutterguard", destination: "/privacy/flutterguard.html" },
      { source: "/privacy/flutterguard/security", destination: "/privacy/flutterguard-security.html" },
      { source: "/robots.txt", destination: "/robots" },
    ];
  },
};

export default nextConfig;
