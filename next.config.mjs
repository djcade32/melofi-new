import nextPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /preload\.mjs$/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
          plugins: ["@babel/plugin-transform-modules-commonjs"],
        },
      },
    });

    config.module.rules.push({
      test: /\.(mp4|webm|mp3|wav)$/,
      type: "asset/resource",
      generator: {
        filename: "static/[name].[hash][ext]",
      },
    });

    return config;
  },
  env: {
    IS_CYPRESS: process.env.IS_CYPRESS,
    NEXT_PUBLIC_IS_CYPRESS: process.env.IS_CYPRESS,
    FIREBASE_AUTH_EMULATOR_HOST: "localhost:9099",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverComponentsExternalPackages: ["cypress", "cypress-real-events"],
  },
};

const withPWA = nextPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  mode: "production",
  maximumFileSizeToCacheInBytes: 100 * 1024 * 1024, // ✅ 100MB limit to cache large files like MP3
  clientsClaim: true,
  skipWaiting: true,
  register: true,
  buildExcludes: [/app-build-manifest\.json$/],
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  runtimeCaching: [
    {
      urlPattern: /^\/_next\/image\?url=([^&]+)/,
      handler: "CacheFirst",
      options: {
        cacheName: "next-image-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        },
      },
    },
    {
      urlPattern: /^\/_next\/static\/.*\.(mp3|wav|ogg)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "next-static-audio",
        expiration: {
          maxEntries: 100,
        },
      },
    },
  ],
});

export default withPWA(nextConfig);
