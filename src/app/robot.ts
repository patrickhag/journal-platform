import { MetadataRoute } from 'next';

export default function robot(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/'],
      disallow: [
        '/api',
        '/ ',
        '/dashboard',
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
      ],
    },
    sitemap: `${process.env.NEXT_PUBLIC_URL}/sitemap.xml`,
  };
}
