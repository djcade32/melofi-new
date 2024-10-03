/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { isServer }) {
    // Extend the default Next.js Webpack config
    config.module.rules.push({
      test: /\.(mp4|webm)$/, // Handle video files
      use: {
        loader: "file-loader",
        options: {
          name: "[name].[hash].[ext]",
          publicPath: `/_next/static/videos/`,
          outputPath: `${isServer ? "../" : ""}static/videos/`, // Output path for videos
        },
      },
    });

    return config;
  },
};

export default nextConfig;
