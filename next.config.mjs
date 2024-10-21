/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { isServer }) {
    // Extend the default Next.js Webpack config for video files
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

    // Extend the config for audio files
    config.module.rules.push({
      test: /\.(mp3|wav)$/, // Handle audio files (mp3, wav, etc.)
      use: {
        loader: "file-loader",
        options: {
          name: "[name].[hash].[ext]", // File naming pattern for audio
          publicPath: `/_next/static/audio/`, // Public path for audio files
          outputPath: `${isServer ? "../" : ""}static/audio/`, // Output path for audio files
        },
      },
    });

    return config;
  },
};

export default nextConfig;
