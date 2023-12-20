/** @type {import('next').NextConfig} */

const setupCheck = require("./src/lib/utils/setupCheck.ts");

setupCheck();
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

module.exports = nextConfig;
