/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.logme.shop',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    additionalSitemaps: ['https://www.logme.shop/server-sitemap.xml'],
  },
  exclude: ['/admin/*'],
  changefreq: 'daily',
  priority: 0.7,
};
