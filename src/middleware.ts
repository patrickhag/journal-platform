import NextAuth from 'next-auth';
import { authOptions } from './auth';
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from './routes';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authOptions);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const pathname = nextUrl.pathname;

  // Check if this is an API auth route
  const isApiAuthRoute = apiAuthPrefix.some((prefix) =>
    pathname.startsWith(prefix)
  );

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
    ['/manuals', '/editorial-board', '/forgot-password'].some((prefix) =>
      pathname.startsWith(prefix)
    );

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
