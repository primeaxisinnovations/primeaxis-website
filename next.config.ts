import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Wildcard covering any other Unsplash subdomain beyond the
        // canonical images.unsplash.com host already listed above.
        protocol: "https",
        hostname: "*.unsplash.com",
      },
      {
        // Vercel Blob's public storage domain — every store gets its own
        // subdomain of this form, so a wildcard is required, not the
        // specific store hostname (which isn't known until the Blob store
        // is created in the dashboard).
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
