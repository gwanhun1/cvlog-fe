import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// 백엔드 API URL 설정
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.logme.shop';

// 사이트맵 빌드 날짜 기록(디버깅 용도)
const BUILD_DATE = new Date().toISOString();

const generateSitemap = (posts: any[]) => {
  // 프론트엔드 URL 설정
  const baseUrl = 'https://logme.shop';
  const currentDate = new Date().toISOString();
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
       xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
       xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <!-- 메인 페이지 -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- 전체보기 페이지 - 중요 -->
  <url>
    <loc>${baseUrl}/article</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="ko" href="${baseUrl}/article" />
  </url>
  
  ${posts
    // 공개 상태인 게시물만 포함 (중요! - 백엔드에서 제공한 데이터를 다시 한번 필터링)
    .filter(post => post && post.public_status === true && post.id) 
    .map((post) => {
      // URL 경로 생성 - 명시적으로 전체보기(all) 카테고리에 표시
      const postUrl = `${baseUrl}/article/content/all/${post.id}`;
      const lastModDate = new Date(post.updated_at || post.created_at).toISOString();
      
      // 게시물 제목과 내용에서 특수 문자 처리 (XML 이스케이프)
      const safeTitle = post.title ? escapeXml(post.title) : '';
      const safeSummary = post.summary ? escapeXml(post.summary) : safeTitle;
      
      // 게시물에 대표 이미지가 있는 경우 이미지 정보도 추가 
      const hasImage = post.thumbnail_image_url || post.image_url || false;
      const imageUrl = post.thumbnail_image_url || post.image_url || `${baseUrl}/assets/NavLogo.svg`;
      
      const imageBlock = hasImage ? `
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${safeTitle}</image:title>
      <image:caption>${safeSummary}</image:caption>
    </image:image>` : '';
      
      // 게시물이 특별히 중요하면 우선순위 높게 설정 ("React 훅 안에서 setInterval setTimeout" 같은 게시물)
      const isImportantPost = safeTitle.includes('React 훅') || 
                              safeTitle.includes('setInterval') || 
                              post.is_featured;
      const priority = isImportantPost ? '0.9' : '0.8';
      
      return `
  <!-- ${safeTitle} - ID: ${post.id} -->
  <url>
    <loc>${postUrl}</loc>
    <lastmod>${lastModDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="ko" href="${postUrl}" />${imageBlock}
  </url>`;
    })
    .join('')}
</urlset>`;
};

// XML 특수 문자 이스케이프 함수
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log(`[Sitemap] Building sitemap at ${BUILD_DATE}`);
    
    // 공개 상태인 게시물만 가져오기 (public_status가 true인 게시물만 요청)
    const response = await axios.get(`${API_URL}/post/posts/public`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    const data = response.data;
    
    if (!data || !Array.isArray(data)) {
      console.error('[Sitemap] Invalid data format received from API');
      return res.status(500).json({ error: '데이터 형식이 올바르지 않습니다.' });
    }
    
    // 로그를 통해 공개 게시물 수 확인
    console.log(`[Sitemap] Found ${data.length} public posts to include in sitemap`);
    
    // 필터링 후 공개 게시물만 선택
    const publicPosts = data.filter(post => post.public_status === true);
    console.log(`[Sitemap] After filtering, including ${publicPosts.length} public posts`);
    
    // 게시물 ID 로깅 (디버깅용)
    console.log('[Sitemap] Post IDs included:', publicPosts.map(post => post.id).join(', '));
    
    // 사이트맵 생성
    const sitemap = generateSitemap(publicPosts);
    
    // 적절한 헤더 설정
    res.setHeader('Content-Type', 'application/xml');
    // 캐시 수명 줄이기 (더 자주 업데이트)
    res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=3600');
    
    // 사이트맵 XML 응답
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('[Sitemap] 사이트맵 생성 중 오류 발생:', error);
    res.status(500).json({ error: '사이트맵을 생성하는 데 실패했습니다.' });
  }
}
