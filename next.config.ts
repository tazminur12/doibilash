import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    // Limit worker threads to prevent "OS can't spawn worker thread: Resource temporarily unavailable (os error 11)"
    // on shared hosting / container build servers like Hostinger
    cpus: 4,
  },
};

export default nextConfig;
