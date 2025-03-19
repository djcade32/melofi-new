/** @type {import('next').NextConfig} */
export default {
  webpack(config) {
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
    IS_CYPRESS: process.env.IS_CYPRESS, // Server-side only
    NEXT_PUBLIC_IS_CYPRESS: process.env.IS_CYPRESS, // Expose to client as well if needed
    FIREBASE_AUTH_EMULATOR_HOST: "localhost:9099",
  },
  eslint: {
    ignoreDuringBuilds: true, // Allows production builds to complete even if there are ESLint errors.
  },
  experimental: {
    optimizeCss: true,
  },
};
