/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    domains: ['encrypted-tbn0.gstatic.com', 'p16.resso.me', 'jornalibia.com.br', 'akamai.sscdn.co', 'uploadthing.com',],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pzoi8xkbm9.ufs.sh",
        pathname: "/f/*",
      },
    ],
  },
  experimental: {
    esmExternals: false,
    swcPlugins: [
      [
        'next-superjson-plugin',
        {
          excluded: [],
        },
      ],
    ],
  },
};
export default config;
