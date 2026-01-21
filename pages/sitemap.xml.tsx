import { GetServerSideProps } from 'next';
import axios from 'axios';

const EXTERNAL_DATA_URL = 'https://logme.shop/article/content/all';
const BASE_URL = 'https://logme.shop';

function generateSiteMap(posts: any[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- 고정된 정적 페이지들 -->
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
     
     <!-- 동적으로 백엔드에서 가져온 게시글들 -->
     ${posts
       .map(({ id, updated_at, created_at }) => {
         return `
       <url>
           <loc>${`${EXTERNAL_DATA_URL}/${id}`}</loc>
           <lastmod>${new Date(updated_at || created_at).toISOString()}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.8</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps에서 처리하므로 실제 컴포넌트는 아무것도 렌더링하지 않습니다.
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL ||
      'https://port-0-cvlog-be-m708xf650a274e01.sel4.cloudtype.app';

    // 모든 공개 게시물 가져오기 (필요시 여러 페이지를 순회하도록 확장 가능)
    // 여기서는 최신글 위주로 가져오거나 전체를 가져오도록 구성합니다.
    const allPosts: any[] = [];

    // 단순화를 위해 1~5페이지 정도를 수집 (약 40~50개 게시물)
    for (let page = 1; page <= 5; page++) {
      try {
        const response = await axios.get(
          `${API_URL}/posts/public/page/${page}`,
          { timeout: 5000 },
        );
        const posts = response.data?.data?.posts || response.data?.data || [];
        if (!Array.isArray(posts) || posts.length === 0) break;
        allPosts.push(...posts);
        const maxPage = response.data?.data?.maxPage || 1;
        if (page >= maxPage) break;
      } catch (e) {
        console.error(`Error fetching sitemap page ${page}:`, e);
        break;
      }
    }

    // XML 생성
    const sitemap = generateSiteMap(allPosts.filter(p => p && p.id));

    res.setHeader('Content-Type', 'text/xml');
    // 브라우저 및 검색 엔진 캐싱 설정 (1시간 정도 캐싱 권장)
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=59',
    );
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.statusCode = 500;
    res.end();
  }

  return {
    props: {},
  };
};

export default SiteMap;
