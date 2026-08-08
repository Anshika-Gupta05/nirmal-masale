import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // We removed output: 'export' so your app can be fully dynamic!
  reactStrictMode: true,
  images: {
    unoptimized: true, // Keep this if you are using local images without an image server
  }
};

export default nextConfig;