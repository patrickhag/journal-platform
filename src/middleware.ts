import NextAuth from 'next-auth';
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from './routes';
import { NextResponse } from 'next/server';
import { authOptions } from './auth';

const { auth } = NextAuth(authOptions);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const pathname = nextUrl.pathname;

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
    ].some((prefix) => pathname.startsWith(prefix));

  // Handle auth routes
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL('/login', nextUrl.origin);
    loginUrl.searchParams.set('from', nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
