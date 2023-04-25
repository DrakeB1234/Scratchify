/** @type {import('next').NextConfig} */

module.exports = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    },
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wsgtwhbvwnftxaqiogud.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/recipe-images/public/**',
      },
    ],
  },
}
