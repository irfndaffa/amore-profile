import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  experimental: {
    serverActions: {
      // Videos are capped at 3MB, but base64-encoding a file for the
      // Server Action payload inflates its size by ~33%, plus encoding
      // overhead. Give enough headroom above the 1MB default so uploads
      // don't get rejected before reaching our own size validation.
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
