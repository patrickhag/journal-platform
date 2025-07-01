export const publicRoutes = [
  '/',
  '/articles/article/:id',
  '/manuals/',
  '/collections/:slug',
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
];
export const DEFAULT_LOGIN_REDIRECT = '/submissions';
