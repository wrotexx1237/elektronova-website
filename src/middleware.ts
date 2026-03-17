import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import {NextRequest, NextResponse} from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);
  
  // Add custom header with the current pathname
  response.headers.set('x-pathname', request.nextUrl.pathname);
  
  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(sq|en)/:path*']
};
