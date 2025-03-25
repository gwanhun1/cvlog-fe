import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// 백엔드 API URL을 하드코딩합니다
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.logme.shop';

const generateSitemap = (posts: any[]) => {
  // 프론트엔드 URL을 하드코딩합니다
  const baseUrl = 'https://logme.shop';
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/article</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  ${posts
    .filter(post => post.public_status) // 공개 상태인 게시물만 포함
    .map((post) => {
      return `
  <url>
    <loc>${baseUrl}/article/content/${post.id}</loc>
    <lastmod>${new Date(post.updated_at || post.created_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    })
    .join('')}
</urlset>`;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 공개 상태인 게시물만 가져오기
    const { data } = await axios.get(`${API_URL}/post/posts/public`);
    
    const sitemap = generateSitemap(data);
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    
    // Send the sitemap XML
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
}
