import { fetchSitemapPosts, generateSiteMap } from 'server/sitemap';

// Cache the complete XML in Next's persistent ISR cache, not process memory.
// A failed regeneration throws, so the last successful document stays available.
export const revalidate = 300;
export const dynamic = 'force-static';

export async function GET() {
  const posts = await fetchSitemapPosts();
  return new Response(generateSiteMap(posts), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
