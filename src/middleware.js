import { NextResponse } from 'next/server';

export function middleware(request) {
  // Check if the route is an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // For admin routes, we'll handle authentication client-side
    // since we need to check localStorage
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};