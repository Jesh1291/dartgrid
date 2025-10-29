import { createServerClient } from '@/lib/supabase'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // The cookie store is a read-only object in middleware.
  // We can create a mutable object to temporarily store cookie changes.
  const cookieStore = request.cookies.getAll();
  const mutableCookies: { [key: string]: any } = {};
  cookieStore.forEach(cookie => mutableCookies[cookie.name] = cookie);

  const supabase = createServerClient({
    get(name: string) {
      return request.cookies.get(name)?.value
    },
    set(name: string, value: string, options: any) {
      // Store the changes to be applied to the response later
      response.cookies.set({ name, value, ...options });
    },
    remove(name: string, options: any) {
      // Store the changes to be applied to the response later
      response.cookies.set({ name, value: '', ...options });
    },
  } as any);


  // Refresh session if expired - required for Server Components
  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
