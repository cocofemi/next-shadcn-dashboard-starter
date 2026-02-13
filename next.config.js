/** @type {import('next').NextConfig} */

const env = process.env.NEXT_PUBLIC_ENV; // "production" | "staging" | "local"

const API_DESTINATION =
  env === 'production'
    ? 'https://server.mehchant.com/mehchant/v1/:path*'
    : env === 'staging'
      ? 'https://mehchant-backend.onrender.com/mehchant/v1/:path*'
      : 'http://localhost:9000/mehchant/v1/:path*';
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'res.cloudinary.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'shippo-static.s3.amazonaws.com',
        port: ''
      }
    ]
  },
  transpilePackages: ['geist'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: API_DESTINATION
      }
    ];
  }
};

module.exports = nextConfig;
