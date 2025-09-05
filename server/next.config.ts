import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  eslint: {
    // ✅ Ignore ESLint errors during production builds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
