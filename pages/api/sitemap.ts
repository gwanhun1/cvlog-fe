import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// 백엔드 API URL 설정
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.logme.shop';

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
    .filter(post => post.public_status) // 공개 상태인 게시물만 포함 (중요!)
    .map((post) => {
      // URL 경로 생성 - 전체보기(all) 카테고리에 표시
      const postUrl = `${baseUrl}/article/content/all/${post.id}`;
      const lastModDate = new Date(post.updated_at || post.created_at).toISOString();
      
      // 게시물에 대표 이미지가 있는 경우 이미지 정보도 추가
      const hasImage = post.thumbnail_image_url || false;
      const imageBlock = hasImage ? `
    <image:image>
      <image:loc>${post.thumbnail_image_url}</image:loc>
      <image:title>${post.title}</image:title>
      <image:caption>${post.summary || post.title}</image:caption>
    </image:image>` : '';
      
      return `
  <!-- ${post.title} -->
  <url>
    <loc>${postUrl}</loc>
    <lastmod>${lastModDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="ko" href="${postUrl}" />${imageBlock}
  </url>`;
    })
    .join('')}
</urlset>`;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 공개 상태인 게시물만 가져오기 (public_status가 true인 게시물만 요청)
    const { data } = await axios.get(`${API_URL}/post/posts/public`);
    
    if (!data || !Array.isArray(data)) {
      console.error('Invalid data format received from API');
      return res.status(500).json({ error: '데이터 형식이 올바르지 않습니다.' });
    }
    
    // 사이트맵 생성 - 이 함수 내에서 public_status가 true인 게시물만 필터링됨
    const sitemap = generateSitemap(data);
    
    // 적절한 헤더 설정
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    
    // 사이트맵 XML 응답
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('사이트맵 생성 중 오류 발생:', error);
    res.status(500).json({ error: '사이트맵을 생성하는 데 실패했습니다.' });
  }
}
