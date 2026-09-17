/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, crypto: false };
    config.externals.push('serialport');
    return config;
  }
};

export default nextConfig;
