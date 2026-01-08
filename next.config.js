/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for maximum performance
  // Remove this if you need server-side features
  // output: 'export',
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.nascar.com',
      },
    ],
  },
  
  // Improve performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'date-fns'],
  },
};

module.exports = nextConfig;
