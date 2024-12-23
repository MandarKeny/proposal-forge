import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Always allow access to protected routes
  return res;
}

export const config = {
  matcher: [
    '/credentials',
    '/inputproposal',
    '/result',
    '/api/auth/callback'
  ]
};