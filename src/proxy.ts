import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED = ['/dashboard', '/tasks', '/team'];
const AUTH_PAGES = ['/login', '/forgot-password'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('auth-session')?.value;

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthPage && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/tasks/:path*', '/team/:path*', '/login', '/forgot-password'],
};
