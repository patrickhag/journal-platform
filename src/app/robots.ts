import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/'],
      disallow: [
        '/api/*',
        '/ ',
        '/dashboard/',
        '/login/',
        '/register/',
        '/forgot-password/',
        '/author/*',
        '/search-articles',
        '/reviewer/*',
        '/staff-editor/*',
        '/associate-editor/*',
        '/editor/*',
      ],
    },
    sitemap: `${process.env.NEXT_PUBLIC_URL}/sitemap.xml`,
  };
}
