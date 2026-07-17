/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/jarvis-ai',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;