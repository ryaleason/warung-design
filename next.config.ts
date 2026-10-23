import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/qris-gopay-placeholder.png',
        destination: '/qris.jpeg',
      },
      {
        source: '/qris-placeholder.svg',
        destination: '/qris.jpeg',
      },
    ];
  },
};

export default nextConfig;
