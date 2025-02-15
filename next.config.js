const nextConfig = {
  reactStrictMode: false,
  distDir: '.next',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**/**',
      },
    ],
    domains: [
      'cvlog-bucket.s3.amazonaws.com',
      'avatars.githubusercontent.com',
      'user-images.githubusercontent.com',
      'logme-bucket.s3.amazonaws.com',
      'res.cloudinary.com',
    ],
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

module.exports = nextConfig;
