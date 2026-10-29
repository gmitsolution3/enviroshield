import type { NextConfig } from "next";
import { urlRedirects } from "./config/redirects";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },

  async redirects() {
    return urlRedirects
      .filter((rule) => rule.status === "active")
      .map(({ source, destination, permanent }) => ({
        source,
        destination,
        permanent,
      }));
  },
};

export default nextConfig;
