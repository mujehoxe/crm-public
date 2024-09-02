/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "65.20.87.36",
        port: "", // Leave empty if no specific port is needed
        pathname: "/**", // Matches all paths
      },
    ],
  },
};

module.exports = nextConfig;
