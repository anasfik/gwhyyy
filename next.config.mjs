/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: ["better-sqlite3"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
