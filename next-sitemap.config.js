const axios = require('axios');

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.logme.shop',
  generateRobotsTxt: false, // public/robots.txt 직접 관리
  exclude: [
    '/api/*',
    '/join',
    '/login',
    '/mypage',
    '/article/modify/*',
    '/article/new',
    '/article/new/*',
    '/github',
    '/github/*',
  ],
  generateIndexSitemap: false,
  changefreq: 'daily',
  priority: 0.7,
  outDir: 'public',
  // 빌드 후 생성된 정적 페이지에 대한 추가 sitemap 항목 생성
  additionalPaths: async config => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL ||
        'https://port-0-cvlog-be-m708xf650a274e01.sel4.cloudtype.app';

      // 여러 페이지의 공개 게시물 수집 (최대 50페이지)
      const allPosts = [];
      for (let page = 1; page <= 50; page++) {
        try {
          const response = await axios.get(
            `${API_URL}/posts/public/page/${page}`,
            {
              headers: { 'Cache-Control': 'no-cache' },
              timeout: 15000, // 타임아웃 약간 증가
            }
          );

          const responseData = response.data;
          const posts =
            responseData?.data?.posts ||
            responseData?.data ||
            responseData?.posts ||
            [];

          if (!Array.isArray(posts) || posts.length === 0) {
            console.log(`[Sitemap] Page ${page}: no posts, stopping`);
            break;
          }

          allPosts.push(...posts);
          console.log(`[Sitemap] Page ${page}: ${posts.length} posts collected`);

          // maxPage 확인하여 불필요한 요청 방지
          const maxPage = responseData?.data?.maxPage || 1;
          if (page >= maxPage) break;
        } catch (pageError) {
          console.log(`[Sitemap] Page ${page} error:`, pageError.message);
          // 백엔드가 잠시 다운된 경우를 대비해 한 번은 더 시도하거나 종료
          break;
        }
      }

      console.log(
        `[Sitemap] Total ${allPosts.length} public posts for sitemap`
      );

      return allPosts
        .filter(post => post && post.id)
        .map(post => ({
          loc: `/article/content/all/${post.id}`,
          changefreq: 'weekly',
          priority: 0.8,
          lastmod: new Date(
            post.updated_at || post.created_at || Date.now()
          ).toISOString(),
        }));
    } catch (error) {
      console.error('[Sitemap] Error:', error.message);
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
