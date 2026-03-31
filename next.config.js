// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/landingChair",
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: "/landingChair",
  },
};

module.exports = nextConfig;
