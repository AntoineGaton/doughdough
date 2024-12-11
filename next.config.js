/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    domains: [
      'storage.googleapis.com',
      'firebasestorage.googleapis.com'
    ]
  },
};

module.exports = nextConfig;
