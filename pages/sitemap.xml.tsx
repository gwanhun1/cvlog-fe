import { GetServerSideProps } from 'next';
import axios from 'axios';

const BASE_URL = 'https://logme-io.vercel.app';

// 재시도 로직이 포함된 API 호출
async function fetchWithRetry(url: string, retries = 2, timeout = 15000) {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await axios.get(url, {
        timeout,
        headers: { 'Cache-Control': 'no-cache' },
      });
      return response;
    } catch (e: any) {
      console.error(`[Sitemap] Fetch attempt ${i + 1} failed: ${url}`, e.message);
      if (i === retries) throw e;
      // 재시도 전 1초 대기
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

function generateSiteMap(posts: any[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/article</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${BASE_URL}/resume</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  ${posts
    .map(
      ({ id, updated_at, created_at }) => `
  <url>
    <loc>${BASE_URL}/article/content/all/${id}</loc>
    <lastmod>${new Date(updated_at || created_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
    )
    .join('')}
</urlset>`;
}

function SiteMap() {}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL ||
      'https://port-0-cvlog-be-m708xf650a274e01.sel4.cloudtype.app';

    // 모든 공개 게시물 가져오기 — 최대 200페이지까지 순회, 재시도 포함
    const allPosts: any[] = [];
    let currentPage = 1;
    let maxPage = 1;

    do {
      try {
        const response = await fetchWithRetry(
          `${API_URL}/posts/public/page/${currentPage}`,
        );
        const posts =
          response?.data?.data?.posts || response?.data?.data || [];
        if (!Array.isArray(posts) || posts.length === 0) break;
        allPosts.push(...posts);
        maxPage = response?.data?.data?.maxPage || 1;
        currentPage++;
      } catch (e) {
        console.error(
          `[Sitemap] Page ${currentPage} failed after retries, stopping`,
        );
        break;
      }
    } while (currentPage <= maxPage && currentPage <= 200);

    console.log(`[Sitemap] Total ${allPosts.length} posts collected`);

    const sitemap = generateSiteMap(
      allPosts.filter(p => p && p.id && p.public_status !== false),
    );

    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=600',
    );
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error('Sitemap generation error:', error);
    // 에러 시에도 최소한의 sitemap 반환 (정적 페이지만)
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${BASE_URL}</loc><priority>1.0</priority></url>
  <url><loc>${BASE_URL}/article</loc><priority>0.9</priority></url>
</urlset>`;
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.statusCode = 200;
    res.write(fallback);
    res.end();
  }

  return { props: {} };
};

export default SiteMap;
