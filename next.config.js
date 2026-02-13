/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: '.next',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**/**',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '**.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'googleusercontent.com',
        pathname: '/**',
      },
    ],
    domains: [
      'github.com',
      'avatars.githubusercontent.com',
      'cvlog-bucket.s3.amazonaws.com',
      'user-images.githubusercontent.com',
      'logme-bucket.s3.amazonaws.com',
      'res.cloudinary.com',
      'cdn.pixabay.com',
      'googleusercontent.com',
    ],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  async redirects() {
    return [];
  },
  // 비공개/삭제된 게시물 접근 시 /article/content/[pid] (로그인 전용)에서
  // 404가 아닌 리디렉션 오류가 발생하지 않도록 rewrites 없이 깔끔하게 처리
  async headers() {
    return [
      {
        // 모든 페이지에 X-Robots-Tag 헤더 추가 (기본: 색인 허용)
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow',
          },
        ],
      },
      {
        // 로그인 전용 페이지는 색인 차단
        source: '/article/content/:pid(\\d+)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
      {
        // 수정/작성 페이지 색인 차단
        source: '/article/modify/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
      {
        source: '/article/new/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
