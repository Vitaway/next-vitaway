/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_URL || "https://www.vitaway.org",
  generateRobotsTxt: false, // We have our custom robots.txt
  generateIndexSitemap: true,
  exclude: [
    '/admin/*',
    '/api/*',
    '/*.env',
    '/checkout/success',
    '/checkout/cancel',
  ],
  additionalPaths: async (config) => {
    const result = [];

    // Add high-priority static pages
    const staticPages = [
      { url: '/', changefreq: 'weekly', priority: 1.0 },
      { url: '/about-us', changefreq: 'monthly', priority: 0.9 },
      { url: '/contacts', changefreq: 'monthly', priority: 0.9 },
      { url: '/blogs', changefreq: 'daily', priority: 0.8 },
      { url: '/shop', changefreq: 'weekly', priority: 0.8 },
      { url: '/pricing', changefreq: 'monthly', priority: 0.7 },
      { url: '/our-team', changefreq: 'monthly', priority: 0.6 },
      { url: '/programs/food-groups', changefreq: 'monthly', priority: 0.6 },
      { url: '/programs/life-stages', changefreq: 'monthly', priority: 0.6 },
      { url: '/faqs', changefreq: 'monthly', priority: 0.5 },
    ];

    staticPages.forEach((page) => {
      result.push({
        loc: page.url,
        changefreq: page.changefreq,
        priority: page.priority,
        lastmod: new Date().toISOString(),
      });
    });

    return result;
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/.env', '/_next/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      'https://www.vitaway.org/sitemap-blogs.xml',
      'https://www.vitaway.org/sitemap-products.xml',
    ],
  },
  transform: async (config, path) => {
    // Custom transform for different page types
    const defaultValues = {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };

    // Customize based on path
    if (path === '/') {
      return {
        ...defaultValues,
        priority: 1.0,
        changefreq: 'weekly',
      };
    }

    if (path.startsWith('/blogs/')) {
      return {
        ...defaultValues,
        priority: 0.7,
        changefreq: 'monthly',
      };
    }

    if (path.startsWith('/shop/')) {
      return {
        ...defaultValues,
        priority: 0.6,
        changefreq: 'weekly',
      };
    }

    if (path.startsWith('/our-team/')) {
      return {
        ...defaultValues,
        priority: 0.5,
        changefreq: 'monthly',
      };
    }

    return defaultValues;
  },
};
