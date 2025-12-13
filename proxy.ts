import { NextRequest, NextResponse } from 'next/server'
import { protectedPaths } from '@/lib/protectedPaths';
import { getToken } from 'next-auth/jwt';

export const config = {
  matcher: [
    '/playground/:path*',
    '/history/:path*',
    '/results/:path*',
    '/portfolio-results/:path*',
    '/login',
    '/',
  ],
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for API routes and static files
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Try to get the session token cookie directly
  const sessionCookie = request.cookies.get('next-auth.session-token')?.value ||
                       request.cookies.get('__Secure-next-auth.session-token')?.value ||
                       request.cookies.get('authjs.session-token')?.value ||
                       request.cookies.get('__Secure-authjs.session-token')?.value
  
  // Get token using NextAuth's getToken
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Use the most reliable source of data
  const hasValidSession = sessionCookie || token

  const response = NextResponse.next({
    headers: {
      'Cache-Control': 'no-store, must-revalidate',
    }
  })

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path))

  // If accessing protected route without authentication, redirect to login
  if (isProtected && !hasValidSession) {
    const loginUrl = new URL('/login', request.url)
    // Add the current path as callback URL so user returns here after login
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If accessing login page while authenticated, redirect to playground
  if (pathname === '/login') {
    if(hasValidSession){
      return NextResponse.redirect(new URL('/playground', request.url))
    }
  }

  // If accessing root while authenticated, redirect to playground
  // if (pathname === '/' && hasValidSession) {
    // return NextResponse.redirect(new URL('/playground', request.url))
  // }

  return response
}