export const publicRoutes = [
  '/',
  '/articles/article/:id',
  '/manuals/',
  '/collections/:slug',
  '/forgot-password',
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
];
export const DEFAULT_LOGIN_REDIRECT = '/submissions';
