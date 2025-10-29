
import { createBrowserClient } from '@supabase/ssr'
import { createServerClient as createSupabaseServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

/**
 * Creates a Supabase client for use in client-side components ('use client').
 * This client is aware of the user's session and can be used for fetching data
 * and performing actions on behalf of the user.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Creates a Supabase client for use in server-side logic (Server Components,
 * Server Actions, and Route Handlers). It reads and writes cookies to manage
 * the user's session across server requests.
 * @param cookieStore The cookie store from `next/headers`.
 */
export function createServerClient(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
            (cookieStore as any).set({ name, value, ...options })
          } catch (error) {}
        },
        remove(name: string, options: CookieOptions) {
          try {
             // The `delete` method was called from a Server Component.
             // This can be ignored if you have middleware refreshing user sessions.
            (cookieStore as any).set({ name, value: '', ...options })
          } catch (error) {}
        },
      },
    }
  )
}

/**
 * Creates a Supabase client with the service_role key.
 * This client bypasses all Row Level Security (RLS) policies and should
 * be used with extreme caution. It is intended for server-side operations
 * that require elevated privileges, such as administrative tasks or seed scripts.
 *
 * NEVER expose this client or its key to the browser.
 */
export function createServiceRoleClient() {
    return createSupabaseClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false } }
    )
}
