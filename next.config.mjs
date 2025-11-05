/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    domains: ['drive.google.com'],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
