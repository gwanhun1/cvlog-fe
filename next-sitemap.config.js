const axios = require('axios');

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://logme.shop',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      'https://logme.shop/sitemap.xml',
      'https://logme.shop/server-sitemap.xml',
    ],
  },
  exclude: ['/api/*', '/join', '/login', '/mypage', '/article/modify/*'],
  generateIndexSitemap: false,
  changefreq: 'daily',
  priority: 0.7,
  outDir: 'public',
  // 빌드 후 생성된 정적 페이지에 대한 추가 sitemap 항목 생성
  additionalPaths: async config => {
    try {
      // 백엔드 API URL 설정
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL ||
        'https://port-0-cvlog-be-m708xf650a274e01.sel4.cloudtype.app';

      // 공개 상태인 게시물만 가져오기
      const response = await axios.get(`${API_URL}/post/posts/public`, {
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });

      const data = response.data;
      if (!data || !Array.isArray(data)) {
        console.error('[Sitemap] Invalid data format received from API');
        return [];
      }

      // 필터링 후 공개 게시물만 선택
      const publicPosts = data.filter(
        post => post && post.public_status === true && post.id
      );
      console.log(
        `[Sitemap] Including ${publicPosts.length} public posts in sitemap`
      );

      // 각 게시물에 대한 URL 생성
      return publicPosts.map(post => {
        const lastModDate = new Date(
          post.updated_at || post.created_at
        ).toISOString();

        // 게시물이 특별히 중요하면 우선순위 높게 설정
        const isImportantPost =
          post.title &&
          (post.title.includes('React 훅') ||
            post.title.includes('setInterval') ||
            post.is_featured);
        const priority = isImportantPost ? 0.9 : 0.8;

        return {
          loc: `/article/content/all/${post.id}`,
          changefreq: 'weekly',
          priority,
          lastmod: lastModDate,
          alternateRefs: [
            {
              href: `https://logme.shop/article/content/all/${post.id}`,
              hreflang: 'ko',
            },
          ],
        };
      });
    } catch (error) {
      console.error('[Sitemap] Error generating dynamic paths:', error);
      return [];
    }
  },
  transform: async (config, path) => {
    // 특별한 페이지에 대한 우선순위 설정
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      };
    }
    if (path.startsWith('/article')) {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      };
    }
    return {
      loc: path,
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    };
  },
};
