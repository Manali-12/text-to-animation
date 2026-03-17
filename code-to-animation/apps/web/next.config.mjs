/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@code-to-animation/animation-core",
  ],
  experimental: {
    serverComponentsExternalPackages: [
      "@code-to-animation/renderer",
      "@remotion/bundler",
      "@remotion/renderer",
      "@remotion/compositor-darwin-arm64",
      "remotion",
    ],
  },
};

export default nextConfig;
