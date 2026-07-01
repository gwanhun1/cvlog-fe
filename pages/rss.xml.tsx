import { GetServerSideProps } from 'next';
import axios from 'axios';

const BASE_URL = 'https://logme.cloud';
const FEED_TITLE = 'LOGME';
const FEED_DESCRIPTION = '개발자를 위한 마크다운 블로그 — LOGME의 최신 글';

// sitemap과 동일하게 마지막 성공분을 메모리에 캐시 (백엔드 cold/장애 시 빈 피드 방지)
let cachedPosts: any[] | null = null;
let cachedAt = 0;
const CACHE_TTL = 1000 * 60 * 60; // 1시간

async function fetchWithRetry(url: string, retries = 2, timeout = 8000) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await axios.get(url, { timeout });
    } catch (e: any) {
      console.error(`[RSS] Fetch attempt ${i + 1} failed: ${url}`, e.message);
      if (i === retries) throw e;
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

// 마크다운/HTML을 가벼운 정규식으로 벗겨 요약용 평문을 만든다 (외부 호출 0)
function toExcerpt(content?: string | null, max = 200): string {
  if (!content) return '';
  const plain = content
    .replace(/```[\s\S]*?```/g, ' ') // 코드블록 제거
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // 이미지
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 링크 → 텍스트
    .replace(/<[^>]+>/g, ' ') // HTML 태그
    .replace(/[#>*_`~-]/g, ' ') // 마크다운 기호
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > max ? plain.slice(0, max) + '…' : plain;
}

function generateRss(posts: any[]): string {
  const lastBuildDate = new Date().toUTCString();
  const items = posts
    .map(({ id, title, content, description, created_at, updated_at }) => {
      const link = `${BASE_URL}/article/content/${id}`;
      const pubDate = new Date(updated_at || created_at || Date.now()).toUTCString();
      const excerpt = toExcerpt(description || content);
      return `
    <item>
      <title>${escapeXml(title || '(제목 없음)')}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${excerpt}]]></description>
    </item>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${BASE_URL}</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>ko-KR</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;
}

function extractPosts(response: any): { posts: any[]; maxPage: number } {
  const posts = response?.data?.data?.posts || response?.data?.data || [];
  const maxPage = response?.data?.data?.maxPage || 1;
  return { posts: Array.isArray(posts) ? posts : [], maxPage };
}

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

  return allPosts
    .filter(p => p && p.id && p.public_status === true)
    .sort(
      (a, b) =>
        new Date(b.updated_at || b.created_at).getTime() -
        new Date(a.updated_at || a.created_at).getTime(),
    )
    .slice(0, 50); // 최신 50개
}

function Rss() {}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const API_URL =
    process.env.API_SERVER_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'http://158.179.174.170:8000';

  let posts: any[];

  if (cachedPosts && Date.now() - cachedAt < CACHE_TTL) {
    posts = cachedPosts;
  } else {
    try {
      posts = await fetchAllPosts(API_URL);
      if (posts.length > 0) {
        cachedPosts = posts;
        cachedAt = Date.now();
      } else if (cachedPosts) {
        posts = cachedPosts;
      }
    } catch (error) {
      console.error('[RSS] generation error, using cache if available', error);
      posts = cachedPosts ?? [];
    }
  }

  const rss = generateRss(posts);
  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=604800',
  );
  res.statusCode = 200;
  res.write(rss);
  res.end();

  return { props: {} };
};

export default Rss;
