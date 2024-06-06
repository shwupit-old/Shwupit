/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

// const runtimeCaching = require('next-pwa/cache');
// const withPWA = require('next-pwa')({
//   disable: process.env.NODE_ENV === 'development',
//   dest: 'public',
//   runtimeCaching,
// });

module.exports = {
  reactStrictMode: true,
  i18n,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
  ...(process.env.APPLICATION_MODE === 'production' && {
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  }),
};