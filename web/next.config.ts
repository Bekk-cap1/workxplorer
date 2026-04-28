import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },

  experimental: {
    optimizePackageImports: [],
  },

  allowedDevOrigins: ["localhost", "127.0.0.1", "192.168.*", "10.*"],
};

export default nextConfig;
