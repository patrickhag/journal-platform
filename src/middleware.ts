import NextAuth from 'next-auth';
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from './routes';
import { NextResponse } from 'next/server';
import { authOptions } from './auth';
import { redirectUserBasedOnRole } from './lib/utils';

const { auth } = NextAuth(authOptions);

export default auth((req) => {
  const { nextUrl } = req;
  const { pathname } = nextUrl;
  const isLoggedIn = !!req.auth;

  const headers = new Headers(req.headers);
  headers.set('x-pathname', pathname);

  const userRole = req.auth?.user?.role;

  const isApiAuthRoute = apiAuthPrefix.some((prefix) => {
    const dynamicRoute = prefix.replace(/\[.*?\]/g, '[^/]+');
    const regex = new RegExp(`^${dynamicRoute}$`);
    return regex.test(pathname);
  });

  // Handle API routes first
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  const isAuthRoute = authRoutes.includes(pathname);

  const isPublicRoute =
    publicRoutes.some((route) => {
      const dynamicRoute = route.replace(/:\w+/g, '[^/]+');
      const regex = new RegExp(`^${dynamicRoute}(?:/.*)?$`);
      return regex.test(pathname);
    }) ||
    [
      '/manuals',
      '/editorial-board',
      '/forgot-password',
      '/articles/issues',
      '/collections',
      '/search-articles',
      '/contact-us',
    ].some((prefix) => pathname.startsWith(prefix));

  // Handle Role redirection when session is active
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(
        new URL(redirectUserBasedOnRole(userRole as string), nextUrl)
      );
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL('/login', nextUrl.origin);
    loginUrl.searchParams.set('from', nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next({ request: { headers } });
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
