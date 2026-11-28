import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  serverExternalPackages: [
    '@nestjs/core',
    '@nestjs/common',
    'reflect-metadata',
    'bcryptjs',
  ],
};

export default nextConfig;
