import axios from 'axios';
import { getServerApiBaseUrl } from 'utils/apiUrl';

const BASE_URL = 'https://logme.cloud';
const GENERATION_TIMEOUT_MS = 8000;

type SitemapPost = {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  thumbnail?: string;
};

export async function fetchSitemapPosts(): Promise<SitemapPost[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GENERATION_TIMEOUT_MS);
  try {
    // One small query: never download all article bodies to discover their URLs.
    // Deploy the backend endpoint before this frontend; a failed build leaves
    // the currently deployed sitemap intact.
    const response = await axios.get(`${getServerApiBaseUrl()}/posts/public/sitemap`, {
      signal: controller.signal,
      timeout: GENERATION_TIMEOUT_MS,
    });
    const posts = response.data?.data?.posts;
    if (response.data?.success === false || !Array.isArray(posts) || posts.length > 50000) {
      throw new Error('Invalid sitemap response');
    }
    const seen = new Set<number>();
    return posts.map((post: any) => {
      if (!Number.isSafeInteger(post?.id) || post.id < 1 || post.public_status !== true ||
          typeof post.title !== 'string' || typeof post.created_at !== 'string' ||
          typeof post.updated_at !== 'string' || seen.has(post.id)) {
        throw new Error('Invalid sitemap article');
      }
      seen.add(post.id);
      return {
        id: post.id,
        title: post.title,
        created_at: post.created_at,
        updated_at: post.updated_at,
        thumbnail: typeof post.thumbnail === 'string' ? post.thumbnail : undefined,
      };
    });
  } finally {
    clearTimeout(timer);
    controller.abort();
  }
}

export function generateSiteMap(
  posts: Awaited<ReturnType<typeof fetchSitemapPosts>>,
) {
  const urls = [BASE_URL, `${BASE_URL}/article`, `${BASE_URL}/resume`].map(
    url => `  <url><loc>${url}</loc></url>`,
  );
  for (const post of posts) {
    const modified = new Date(post.updated_at || post.created_at);
    // Unknown dates must not become today's date or break the complete document.
    const lastmod = Number.isNaN(modified.getTime())
      ? ''
      : `<lastmod>${modified.toISOString()}</lastmod>`;
    const image = post.thumbnail
      ? `<image:image><image:loc>${escapeXml(post.thumbnail)}</image:loc><image:title>${escapeXml(post.title)}</image:title></image:image>`
      : '';
    urls.push(
      `  <url><loc>${BASE_URL}/article/content/${post.id}</loc>${lastmod}${image}</url>`,
    );
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.join('\n')}\n</urlset>`;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
