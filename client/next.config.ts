import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
  },
  eslint: {
    // This will stop Vercel from failing on ESLint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
