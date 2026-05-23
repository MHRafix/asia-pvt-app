import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedRoutes = ['/admin'];
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute) {
    const token = request.cookies.get('authToken')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Token verification happens client-side in the admin page component
    // This middleware just ensures the token exists
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
