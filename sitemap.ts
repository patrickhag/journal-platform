import { useGetPublishedArticles } from '@/hooks/useArticles';

export default function sitemap() {
  const { data: publishedArticlesData } = useGetPublishedArticles();

  const publishedArticles = publishedArticlesData?.map((publishedArticle) => {
    return {
      url: `${process.env.NEXT_PUBLIC_URL}/articles/article/${publishedArticle.slug}`,
      lastModified: publishedArticle.publishedAt,
    };
  });

  return [
    {
      url:
        process.env.NEXT_PUBLIC_URL ||
        'https://journal-platform-delta.vercel.app/',
      lastModified: new Date(),
    },
    ...(publishedArticles || []),
  ];
}
