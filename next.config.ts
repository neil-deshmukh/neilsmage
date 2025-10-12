import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  webpack: (config, { isServer }) => {
    // Check if the cache is enabled and disable it
    if (config.cache && config.cache.type === "filesystem") {
      console.log(
        'Disabling webpack filesystem cache to suppress "big string" warnings.'
      );
      config.cache = false; // Disable caching entirely
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pswufecieqhziwugdrkf.supabase.co",
        port: "",
        pathname: "/storage/**"
      },
    ],
  },
};

export default nextConfig;
