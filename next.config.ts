// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "zycruit.lon1.digitaloceanspaces.com"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "zycruit.lon1.digitaloceanspaces.com",
        pathname: "/**",
      }
    ]
  }
};

module.exports = nextConfig;
