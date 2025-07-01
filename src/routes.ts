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
  '/api/auth/forgot-password',
];
export const DEFAULT_LOGIN_REDIRECT = '/submissions';
