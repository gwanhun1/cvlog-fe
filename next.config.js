/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@uiw/react-md-editor', '@uiw/react-markdown-preview'],
  distDir: '.next',
  images: {
    remotePatterns: [
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
    return [
      // 정식 도메인 통일: 구 도메인/www 접속은 logme.cloud로 301 리다이렉트.
      // (Vercel 프리뷰 *.vercel.app은 정확히 logme-io.vercel.app만 매칭되어 영향 없음)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'logme-io.vercel.app' }],
        destination: 'https://logme.cloud/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.logme.cloud' }],
        destination: 'https://logme.cloud/:path*',
        permanent: true,
      },
    ];
  },
  // 비공개/삭제된 게시물 접근 시 /article/content/[pid] (로그인 전용)에서
  // 404가 아닌 리디렉션 오류가 발생하지 않도록 rewrites 없이 깔끔하게 처리
  async headers() {
    return [
      {
        // 기본: 모든 페이지 색인 허용
        source: '/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'index, follow' },
        ],
      },
      {
        // 수정/작성 페이지 색인 차단
        source: '/article/modify/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      {
        source: '/article/new',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      {
        // 인증 페이지 색인 차단
        source: '/join',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      {
        source: '/login',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      {
        source: '/mypage',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
