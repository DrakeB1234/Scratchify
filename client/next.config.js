/** @type {import('next').NextConfig} */
module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })

    return config;
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