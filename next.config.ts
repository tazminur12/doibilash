import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Limit worker threads to prevent "OS can't spawn worker thread: Resource temporarily unavailable (os error 11)"
    // on shared hosting / container build servers like Hostinger
    cpus: 4,
  },
};

export default nextConfig;
