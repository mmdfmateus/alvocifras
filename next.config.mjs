/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "p16.resso.me",
      },
      {
        protocol: "https",
        hostname: "jornalibia.com.br",
      },
      {
        protocol: "https",
        hostname: "akamai.sscdn.co",
      },
      {
        protocol: "https",
        hostname: "uploadthing.com",
      },
      {
        protocol: "https",
        hostname: "pzoi8xkbm9.ufs.sh",
        pathname: "/f/*",
      },
    ],
  },
};
export default config;
