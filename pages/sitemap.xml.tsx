import { GetServerSideProps } from 'next';
import axios from 'axios';

const BASE_URL = 'https://logme-io.vercel.app';

// 마지막으로 성공한 게시물 목록을 메모리에 캐시 (백엔드 장애 시 fallback로 글이
// 통째로 사라지는 사고 방지 — 구글이 빈 sitemap을 받지 않도록)
let cachedPosts: any[] | null = null;
let cachedAt = 0;
const CACHE_TTL = 1000 * 60 * 60; // 1시간

// 재시도 로직이 포함된 API 호출
async function fetchWithRetry(url: string, retries = 2, timeout = 8000) {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await axios.get(url, { timeout });
      return response;
    } catch (e: any) {
      console.error(`[Sitemap] Fetch attempt ${i + 1} failed: ${url}`, e.message);
      if (i === retries) throw e;
      // 재시도 전 1초 대기
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateSiteMap(posts: any[]) {
  const today = new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
  <url>
    <loc>${BASE_URL}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/article</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${BASE_URL}/resume</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  ${posts
    .map(({ id, updated_at, created_at, title, thumbnail }) => {
      const lastmod = new Date(updated_at || created_at).toISOString();
      const imageBlock = thumbnail
        ? `
    <image:image>
      <image:loc>${escapeXml(thumbnail)}</image:loc>
      <image:title>${escapeXml(title || '')}</image:title>
    </image:image>`
        : '';
      return `
  <url>
    <loc>${BASE_URL}/article/content/${id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${imageBlock}
  </url>`;
    })
    .join('')}
</urlset>`;
}

function SiteMap() {}

function extractPosts(response: any): { posts: any[]; maxPage: number } {
  const posts = response?.data?.data?.posts || response?.data?.data || [];
  const maxPage = response?.data?.data?.maxPage || 1;
  return { posts: Array.isArray(posts) ? posts : [], maxPage };
}

// 모든 공개 게시물 수집: 1페이지로 maxPage를 알아낸 뒤 나머지를 병렬 호출
// (기존 순차 호출의 ~8초 지연 → 사실상 1~2 라운드로 단축)
async function fetchAllPosts(API_URL: string): Promise<any[]> {
  const first = await fetchWithRetry(`${API_URL}/posts/public/page/1`);
  const { posts: firstPosts, maxPage } = extractPosts(first);
  const allPosts = [...firstPosts];

  const lastPage = Math.min(maxPage, 200);
  if (lastPage > 1) {
    const rest = await Promise.all(
      Array.from({ length: lastPage - 1 }, (_, i) =>
        fetchWithRetry(`${API_URL}/posts/public/page/${i + 2}`)
          .then(extractPosts)
          .catch(() => ({ posts: [] as any[], maxPage: 1 })),
      ),
    );
    rest.forEach(r => allPosts.push(...r.posts));
  }

  return allPosts.filter(p => p && p.id && p.public_status === true);
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const API_URL =
    process.env.API_SERVER_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'http://158.179.174.170:8000';

  let posts: any[];

  // 1) 신선한 캐시가 있으면 백엔드 호출 없이 즉시 사용
  if (cachedPosts && Date.now() - cachedAt < CACHE_TTL) {
    posts = cachedPosts;
  } else {
    try {
      posts = await fetchAllPosts(API_URL);
      // 성공 시에만 캐시 갱신 (빈 결과는 캐시하지 않음)
      if (posts.length > 0) {
        cachedPosts = posts;
        cachedAt = Date.now();
      } else if (cachedPosts) {
        posts = cachedPosts; // 빈 응답이면 마지막 성공분 유지
      }
    } catch (error) {
      console.error('[Sitemap] generation error, using cache if available', error);
      // 백엔드 장애 시: 마지막 성공분이 있으면 그걸 사용 (글이 사라지지 않게)
      posts = cachedPosts ?? [];
    }
  }

  console.log(`[Sitemap] Total ${posts.length} posts in sitemap`);

  const sitemap = generateSiteMap(posts);
  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  // CDN에 하루 캐시 + 일주일간 stale-while-revalidate.
  // 트래픽이 적어 서버가 자주 cold가 되더라도, 구글봇은 백엔드(최대 9초)를
  // 기다리지 않고 항상 캐시된 sitemap을 즉시 받는다. 갱신은 백그라운드에서 처리.
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=604800',
  );
  res.statusCode = 200;
  res.write(sitemap);
  res.end();

  return { props: {} };
};

export default SiteMap;
