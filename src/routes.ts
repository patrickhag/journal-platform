export const publicRoutes = [
  '/',
  '/articles/article/:id',
  '/manuals/',
  '/articles/issues/',
  '/collections/:slug',
  '/forgot-password',
  '/error',
  '/invitation/:articleId',
];

export const authRoutes = [
  '/login',
  '/register',
  '/auth-error',
  '/forgot-password',
];

export const apiAuthPrefix = [
  '/api/auth',
  '/api/manuals',
  '/api/volumes/published',
  '/api/auth/reset-password',
  '/api/auth/reset-password',
  '/api/auth/session',
  '/api/metrics',
  '/api/metrics/[slug]',
  '/api/articles/published/[slug]',
  '/api/auth/user',
  '/api/collections',
  '/api/articles/searched-articles',
  '/api/articles/published-articles',
  '/api/ads/home',
  '/api/oai',
];

export const DEFAULT_LOGIN_REDIRECT = '/submissions';
