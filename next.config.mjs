/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /**
   * Avoid experimental.optimizePackageImports for @chakra-ui/react in dev — it can make
   * Fast Refresh fall back to full reloads and stale module state with Chakra + Emotion.
   */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.bankfab.com",
        pathname: "/**",
      },
    ],
  },
  /**
   * When the OS runs out of file watchers (EMFILE), native watching breaks and edits never
   * trigger HMR. Polling avoids that at a small CPU cost. Set NEXT_WEBPACK_POLL=0 to use
   * native watchers only, or NEXT_WEBPACK_POLL=2000 to tune interval (ms).
   */
  webpack: (config, { dev }) => {
    if (dev && process.env.NEXT_WEBPACK_POLL !== "0") {
      const poll = Number(process.env.NEXT_WEBPACK_POLL);
      config.watchOptions = {
        ...config.watchOptions,
        poll: Number.isFinite(poll) && poll > 0 ? poll : 1500,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
