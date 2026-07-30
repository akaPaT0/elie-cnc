import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const pathname = request.nextUrl.pathname;

  // Only protect /admin routes (except /admin/login)
  if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
    return supabaseResponse;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase environment variables are missing, allow fallback access during development
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. If user is not authenticated, redirect to /admin/login
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  // 2. If ADMIN_EMAILS is set in .env.local, enforce admin email authorization
  const adminEmailsEnv = process.env.ADMIN_EMAILS;
  if (adminEmailsEnv) {
    const allowedAdminEmails = adminEmailsEnv.split(',').map((e) => e.trim().toLowerCase());
    const userEmail = user.email?.toLowerCase() || '';

    if (!allowedAdminEmails.includes(userEmail)) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('error', 'Unauthorized: Your email address is not an authorized administrator.');
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/admin/:path*'],
};
